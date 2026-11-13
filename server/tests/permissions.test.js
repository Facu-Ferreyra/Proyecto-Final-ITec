// Tests de permisos (Brandon): lo que pide el PDF para la defensa.
//   401 → sin sesión (o sesión inválida)
//   403 → sesión válida pero rol equivocado
//   404 → recurso de otro usuario (ID ajeno bloqueado, sin revelar que existe)
// Además: cabeceras de seguridad, CORS y errores sin datos internos.
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SKIP_WITHOUT_DB, TEST_EMAIL_SUFFIX, loadApp, runId, sessionCookie, testEmail, unsignedCookie } from './helpers.js';

const { api, prisma } = await loadApp();

// Rutas privadas de cada zona del contrato de la API (con IDs de mentira: el 401
// tiene que salir antes de buscar nada).
const PRIVATE_ROUTES = [
  ['get', '/api/auth/me'],
  ['get', '/api/templates'],
  ['get', '/api/bots'],
  ['post', '/api/bots'],
  ['get', '/api/bots/cualquiera'],
  ['put', '/api/bots/cualquiera'],
  ['delete', '/api/bots/cualquiera'],
  ['post', '/api/bots/cualquiera/publish'],
  ['get', '/api/bots/cualquiera/conversations'],
  ['get', '/api/bots/cualquiera/leads'],
  ['get', '/api/conversations/cualquiera/messages'],
  ['patch', '/api/leads/cualquiera'],
  ['get', '/api/admin/users'],
  ['patch', '/api/admin/users/cualquiera'],
  ['get', '/api/admin/templates'],
  ['post', '/api/admin/templates'],
];

const call = (method, url, cookie) => {
  const req = api[method](url);
  return cookie ? req.set('Cookie', cookie) : req;
};

// ---------------------------------------------------------------------------
describe('401: sin sesión o con una sesión falsa', () => {
  it('todas las rutas privadas responden 401 sin cookie', async () => {
    for (const [method, url] of PRIVATE_ROUTES) {
      const res = await call(method, url);
      assert.equal(res.status, 401, `${method.toUpperCase()} ${url} debería dar 401`);
      assert.equal(res.body.error.code, 'UNAUTHORIZED');
    }
  });

  it('token firmado con otro secreto → 401', async () => {
    const res = await call('get', '/api/bots', sessionCookie({ id: 'x', role: 'ADMIN' }, { secret: 'otro-secreto' }));
    assert.equal(res.status, 401);
  });

  it('token vencido → 401 "Tu sesión venció"', async () => {
    const res = await call('get', '/api/bots', sessionCookie({ id: 'x', role: 'USER' }, { expiresIn: -10 }));
    assert.equal(res.status, 401);
    assert.match(res.body.error.message, /venció/);
  });

  it('token sin firma (alg: none) que dice ser ADMIN → 401', async () => {
    const res = await call('get', '/api/admin/users', unsignedCookie({ sub: 'x', role: 'ADMIN' }));
    assert.equal(res.status, 401);
  });

  it('token cualquiera → 401 y el servidor borra la cookie', async () => {
    const res = await call('get', '/api/bots', 'token=no-es-un-jwt');
    assert.equal(res.status, 401);
    assert.match(res.headers['set-cookie'][0], /^token=;/);
  });
});

// ---------------------------------------------------------------------------
describe('permisos con base de datos', { skip: SKIP_WITHOUT_DB }, () => {
  let owner, intruder, admin, otherAdmin, template, bot, conversation, lead;
  const cookie = {};

  before(async () => {
    const { syncBaseTemplates } = await import('../src/engine/index.js');
    await syncBaseTemplates(prisma);
    template = await prisma.template.findUnique({ where: { key: 'turnos' } });

    const mk = (name, role = 'USER') =>
      prisma.user.create({ data: { email: testEmail(name), name, passwordHash: 'x', role } });
    [owner, intruder, admin, otherAdmin] = await Promise.all([mk('dueno'), mk('intruso'), mk('admin', 'ADMIN'), mk('admin2', 'ADMIN')]);
    for (const [key, user] of Object.entries({ owner, intruder, admin })) cookie[key] = sessionCookie(user);

    // Datos del dueño: un bot con una conversación y un turno.
    bot = await prisma.bot.create({
      data: { ownerId: owner.id, templateId: template.id, name: 'Bot del dueño', slug: `permisos-${runId}`, config: {} },
    });
    conversation = await prisma.conversation.create({ data: { botId: bot.id, visitorId: `visitante-${runId}` } });
    await prisma.message.create({ data: { conversationId: conversation.id, sender: 'VISITOR', content: 'Hola' } });
    lead = await prisma.lead.create({
      data: { botId: bot.id, conversationId: conversation.id, type: 'APPOINTMENT', contactName: 'Cliente', data: { status: 'PENDING' } },
    });
  });

  after(async () => {
    // Borra los usuarios de prueba; sus bots, conversaciones y leads se borran en cascada.
    await prisma.user.deleteMany({ where: { email: { endsWith: TEST_EMAIL_SUFFIX } } });
  });

  // ----- 401 que dependen de la base -----
  it('401: usuario desactivado → su sesión deja de valer al instante', async () => {
    const disabled = await prisma.user.create({
      data: { email: testEmail('desactivado'), name: 'Desactivado', passwordHash: 'x', isActive: false },
    });
    const res = await call('get', '/api/bots', sessionCookie(disabled));
    assert.equal(res.status, 401);
  });

  it('401: usuario borrado → su token deja de valer', async () => {
    const res = await call('get', '/api/bots', sessionCookie({ id: 'usuario-que-no-existe', role: 'ADMIN' }));
    assert.equal(res.status, 401);
  });

  // ----- 403 -----
  it('403: un USER no puede usar ninguna ruta de admin', async () => {
    const checks = [
      ['get', '/api/admin/users'],
      ['patch', `/api/admin/users/${intruder.id}`],
      ['get', '/api/admin/templates'],
      ['post', '/api/admin/templates'],
      ['delete', `/api/admin/templates/${template.id}`],
    ];
    for (const [method, url] of checks) {
      const res = await call(method, url, cookie.owner);
      assert.equal(res.status, 403, `${method.toUpperCase()} ${url} debería dar 403`);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    }
  });

  it('403: un USER no puede hacerse ADMIN a sí mismo', async () => {
    const res = await api.patch(`/api/admin/users/${intruder.id}`).set('Cookie', cookie.intruder).send({ role: 'ADMIN' });
    assert.equal(res.status, 403);
    const fromDb = await prisma.user.findUnique({ where: { id: intruder.id } });
    assert.equal(fromDb.role, 'USER');
  });

  it('el ADMIN sí entra (el 403 es por el rol, no por otra cosa)', async () => {
    const res = await call('get', '/api/admin/users', cookie.admin);
    assert.equal(res.status, 200);
    assert.ok(res.body.items.every((u) => !('passwordHash' in u)));
  });

  it('403: un ADMIN no puede quitarse su propio rol ni desactivarse', async () => {
    for (const body of [{ role: 'USER' }, { isActive: false }]) {
      const res = await api.patch(`/api/admin/users/${admin.id}`).set('Cookie', cookie.admin).send(body);
      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'CANNOT_MODIFY_SELF');
    }
    const fromDb = await prisma.user.findUnique({ where: { id: admin.id } });
    assert.equal(fromDb.role, 'ADMIN');
    assert.equal(fromDb.isActive, true);
  });

  it('el rol sale de la base: si un admin lo cambia, se aplica sin volver a loguearse', async () => {
    // El token de otherAdmin dice ADMIN; se le quita el rol en la base.
    const otherCookie = sessionCookie(otherAdmin);
    const demote = await api.patch(`/api/admin/users/${otherAdmin.id}`).set('Cookie', cookie.admin).send({ role: 'USER' });
    assert.equal(demote.status, 200);
    assert.equal((await call('get', '/api/admin/users', otherCookie)).status, 403);
  });

  // ----- 404: ID ajeno -----
  it('404: el intruso no puede ver, editar, borrar ni publicar el bot del dueño', async () => {
    const attempts = [
      api.get(`/api/bots/${bot.id}`),
      api.put(`/api/bots/${bot.id}`).send({ name: 'Hackeado' }),
      api.delete(`/api/bots/${bot.id}`),
      api.post(`/api/bots/${bot.id}/publish`),
      api.get(`/api/bots/${bot.id}/preview`),
    ];
    for (const req of attempts) {
      const res = await req.set('Cookie', cookie.intruder);
      assert.equal(res.status, 404, `${res.req.method} ${res.req.path} debería dar 404`);
      assert.equal(res.body.error.code, 'BOT_NOT_FOUND');
    }
  });

  it('404: el intruso no puede ver conversaciones, mensajes ni turnos del dueño, ni cambiarlos', async () => {
    const attempts = [
      api.get(`/api/bots/${bot.id}/conversations`),
      api.get(`/api/conversations/${conversation.id}/messages`),
      api.get(`/api/bots/${bot.id}/leads`),
      api.patch(`/api/leads/${lead.id}`).send({ status: 'CANCELLED' }),
    ];
    for (const req of attempts) {
      const res = await req.set('Cookie', cookie.intruder);
      assert.equal(res.status, 404, `${res.req.method} ${res.req.path} debería dar 404`);
    }
  });

  it('el ID ajeno responde igual que un ID que no existe (no revela que existe)', async () => {
    const foreign = await call('get', `/api/bots/${bot.id}`, cookie.intruder);
    const missing = await call('get', '/api/bots/id-que-no-existe', cookie.intruder);
    assert.equal(foreign.status, missing.status);
    assert.deepEqual(foreign.body, missing.body);
  });

  it('después de los intentos, los datos del dueño siguen intactos', async () => {
    const botNow = await prisma.bot.findUnique({ where: { id: bot.id } });
    assert.ok(botNow, 'el bot no se borró');
    assert.equal(botNow.name, 'Bot del dueño');
    assert.equal(botNow.status, 'DRAFT');
    const leadNow = await prisma.lead.findUnique({ where: { id: lead.id } });
    assert.equal(leadNow.data.status, 'PENDING');
  });

  it('el intruso no ve el bot del dueño en su lista, y el dueño sí', async () => {
    const intruderList = await call('get', '/api/bots', cookie.intruder);
    assert.ok(!intruderList.body.items.some((b) => b.id === bot.id));
    const ownerGet = await call('get', `/api/bots/${bot.id}`, cookie.owner);
    assert.equal(ownerGet.status, 200);
  });
});

// ---------------------------------------------------------------------------
describe('endurecimiento: cabeceras, CORS y errores', () => {
  it('helmet: cabeceras de seguridad y sin X-Powered-By', async () => {
    const res = await api.get('/api/no-existe');
    assert.equal(res.headers['x-powered-by'], undefined);
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.equal(res.headers['x-frame-options'], 'SAMEORIGIN');
    assert.match(res.headers['content-security-policy'], /default-src 'self'/);
    assert.match(res.headers['strict-transport-security'], /max-age=/);
  });

  it('CORS: solo el frontend (CLIENT_URL) recibe permiso, con credenciales', async () => {
    const { env } = await import('../src/config/env.js');
    const allowed = await api.options('/api/auth/login').set('Origin', env.CLIENT_URL).set('Access-Control-Request-Method', 'POST');
    assert.equal(allowed.headers['access-control-allow-origin'], env.CLIENT_URL);
    assert.equal(allowed.headers['access-control-allow-credentials'], 'true');

    const other = await api.options('/api/auth/login').set('Origin', 'https://sitio-malo.com').set('Access-Control-Request-Method', 'POST');
    assert.notEqual(other.headers['access-control-allow-origin'], 'https://sitio-malo.com');
    assert.notEqual(other.headers['access-control-allow-origin'], '*');
  });

  it('un error interno (por ejemplo, de la base) → 500 genérico, sin SQL ni detalles', async () => {
    // Se simula que la base falla con un mensaje lleno de datos internos.
    const original = Object.getOwnPropertyDescriptor(prisma, 'user');
    const originalError = console.error;
    Object.defineProperty(prisma, 'user', {
      configurable: true,
      value: {
        findUnique: async () => {
          throw Object.assign(new Error('Invalid `prisma.user.findUnique()`: SELECT "password_hash" FROM "users" -- ep-secreto.neon.tech'), { code: 'P1001' });
        },
      },
    });
    console.error = () => {}; // el errorHandler loguea el detalle en el servidor; acá no ensucia la salida
    try {
      const res = await call('get', '/api/auth/me', sessionCookie({ id: 'x', role: 'USER' }));
      assert.equal(res.status, 500);
      assert.equal(res.body.error.code, 'INTERNAL_ERROR');
      const text = JSON.stringify(res.body);
      for (const leak of ['prisma', 'SELECT', 'password_hash', 'neon', 'P1001', 'stack']) {
        assert.ok(!text.includes(leak), `la respuesta filtra "${leak}"`);
      }
    } finally {
      console.error = originalError;
      if (original) Object.defineProperty(prisma, 'user', original);
      else delete prisma.user;
    }
  });

  it('JSON roto → 400 INVALID_JSON sin el mensaje interno del parser', async () => {
    const res = await api.post('/api/auth/login').set('Content-Type', 'application/json').send('{"email": roto');
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'INVALID_JSON');
    assert.ok(!JSON.stringify(res.body).includes('Unexpected'));
  });
});

after(async () => {
  await prisma.$disconnect();
});
