// Tests de punta a punta de la API de bots, panel y chat público (Santiago).
// Necesitan una base de datos (usa la DATABASE_URL de server/.env) y crean y
// borran sus propios datos. Si no hay DATABASE_URL se saltean (por ejemplo en CI).
import 'dotenv/config';
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

const hasDb = Boolean(process.env.DATABASE_URL && process.env.JWT_SECRET);

describe('API de bots, panel y chat público', { skip: !hasDb && 'Sin DATABASE_URL: se saltean los tests con base' }, () => {
  let request, prisma, owner, intruder, admin, tokens, turnosTemplate;
  const run = Date.now();

  // Arma una cookie de sesión con el mismo formato que usa requireAuth.
  const cookieFor = (jwt, user) => `token=${jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;

  before(async () => {
    const [{ default: supertest }, { default: jwt }, { app }, db, engine] = await Promise.all([
      import('supertest'),
      import('jsonwebtoken'),
      import('../src/app.js'),
      import('../src/db/prisma.js'),
      import('../src/engine/index.js'),
    ]);
    request = supertest(app);
    prisma = db.prisma;
    await engine.syncBaseTemplates(prisma);
    turnosTemplate = await prisma.template.findUnique({ where: { key: 'turnos' } });

    const mk = (name, role = 'USER') =>
      prisma.user.create({ data: { email: `${name}-${run}@test.local`, name, passwordHash: 'x', role } });
    [owner, intruder, admin] = await Promise.all([mk('owner'), mk('intruder'), mk('admin', 'ADMIN')]);
    tokens = { owner: cookieFor(jwt, owner), intruder: cookieFor(jwt, intruder), admin: cookieFor(jwt, admin) };
  });

  after(async () => {
    if (!prisma) return;
    await prisma.user.deleteMany({ where: { email: { endsWith: `-${run}@test.local` } } });
    await prisma.template.deleteMany({ where: { key: `test-${run}` } });
    await prisma.$disconnect();
  });

  let botId, slug, conversationId, leadId;

  it('sin sesión → 401 con el formato de error acordado', async () => {
    const res = await request.get('/api/bots');
    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('lista las plantillas activas', async () => {
    const res = await request.get('/api/templates').set('Cookie', tokens.owner);
    assert.equal(res.status, 200);
    const keys = res.body.items.map((t) => t.key);
    for (const key of ['faq', 'turnos', 'pedidos']) assert.ok(keys.includes(key));
  });

  it('valida los datos al crear (Zod) → 400 con detalles', async () => {
    const res = await request
      .post('/api/bots')
      .set('Cookie', tokens.owner)
      .send({ templateId: turnosTemplate.id, name: 'L', config: { services: [{ name: '' }] } });
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
    const paths = res.body.error.details.map((d) => d.path);
    assert.ok(paths.includes('name'));
  });

  it('crea un borrador incompleto y dice qué falta', async () => {
    const res = await request
      .post('/api/bots')
      .set('Cookie', tokens.owner)
      .send({ templateId: turnosTemplate.id, name: 'Peluquería Lola', config: { businessName: 'Peluquería Lola' } });
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'DRAFT');
    assert.equal(res.body.canPublish, false);
    assert.match(res.body.slug, /^peluqueria-lola-[a-z2-9]{6}$/);
    botId = res.body.id;
    slug = res.body.slug;
  });

  it('no deja publicar si faltan datos → 422', async () => {
    const res = await request.post(`/api/bots/${botId}/publish`).set('Cookie', tokens.owner);
    assert.equal(res.status, 422);
    assert.equal(res.body.error.code, 'BOT_INCOMPLETE');
    assert.ok(res.body.error.details.some((f) => f.key === 'services'));
  });

  it('un bot en borrador no se ve en el chat público', async () => {
    const res = await request.get(`/api/public/bots/${slug}`);
    assert.equal(res.status, 404);
  });

  it('completa los datos y publica', async () => {
    const put = await request
      .put(`/api/bots/${botId}`)
      .set('Cookie', tokens.owner)
      .send({
        config: {
          businessName: 'Peluquería Lola',
          hours: 'martes a sábado de 9 a 19 h',
          services: [{ name: 'Corte de pelo', price: 8000 }],
          workingDays: [1, 2, 3, 4, 5, 6],
          timeSlots: ['10:00', '15:00'],
        },
      });
    assert.equal(put.status, 200);
    assert.equal(put.body.canPublish, true);

    const pub = await request.post(`/api/bots/${botId}/publish`).set('Cookie', tokens.owner);
    assert.equal(pub.status, 200);
    assert.equal(pub.body.status, 'PUBLISHED');
    assert.equal(pub.body.publicPath, `/chat/${slug}`);
  });

  it('otro usuario no puede ver, editar ni borrar el bot (ID ajeno → 404)', async () => {
    const get = await request.get(`/api/bots/${botId}`).set('Cookie', tokens.intruder);
    const put = await request.put(`/api/bots/${botId}`).set('Cookie', tokens.intruder).send({ name: 'Hackeado' });
    const del = await request.delete(`/api/bots/${botId}`).set('Cookie', tokens.intruder);
    const convs = await request.get(`/api/bots/${botId}/conversations`).set('Cookie', tokens.intruder);
    for (const res of [get, put, del, convs]) assert.equal(res.status, 404);
    const list = await request.get('/api/bots').set('Cookie', tokens.intruder);
    assert.equal(list.body.items.length, 0);
  });

  it('vista previa: usa el motor sin guardar nada', async () => {
    const start = await request.get(`/api/bots/${botId}/preview`).set('Cookie', tokens.owner);
    assert.equal(start.status, 200);
    assert.ok(start.body.options.some((o) => o.id === 'book'));
    const msg = await request.post(`/api/bots/${botId}/preview/messages`).set('Cookie', tokens.owner).send({ optionId: 'hours' });
    assert.equal(msg.status, 200);
    assert.match(msg.body.replies[0], /martes a sábado/);
    const count = await prisma.conversation.count({ where: { botId } });
    assert.equal(count, 0);
  });

  it('chat público: saludo y menú, sin datos internos', async () => {
    const res = await request.get(`/api/public/bots/${slug}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.title, 'Peluquería Lola');
    assert.equal(res.body.id, undefined);
    assert.equal(res.body.ownerId, undefined);
  });

  it('chat público: sacar un turno guarda conversación, mensajes y lead', async () => {
    const visitorId = `visitor-${run}`;
    let state = null;
    const send = async (body) => {
      const res = await request.post(`/api/public/bots/${slug}/messages`).send({ visitorId, conversationId, state, ...body });
      assert.equal(res.status, 200, JSON.stringify(res.body));
      conversationId = res.body.conversationId;
      state = res.body.state;
      return res.body;
    };

    await send({ optionId: 'book' });
    await send({ optionId: '0' });
    const dateStep = await send({ text: 'no sé' }); // texto inválido en un paso de botones
    assert.match(dateStep.replies[0], /Elegí una de las opciones/);
    await send({ optionId: dateStep.options[0].id });
    await send({ optionId: '1' });
    await send({ text: 'Ana Pérez' });
    const done = await send({ text: '11 5555 0101' });

    assert.equal(done.lead.type, 'APPOINTMENT');
    assert.equal(done.state, null);
    leadId = done.lead.id;
  });

  it('chat público: valida el largo del mensaje', async () => {
    const res = await request.post(`/api/public/bots/${slug}/messages`).send({ text: 'a'.repeat(501) });
    assert.equal(res.status, 400);
  });

  it('panel: lista conversaciones y muestra el historial completo', async () => {
    const list = await request.get(`/api/bots/${botId}/conversations`).set('Cookie', tokens.owner);
    assert.equal(list.status, 200);
    assert.equal(list.body.total, 1);
    assert.equal(list.body.items[0].contactName, 'Ana Pérez');
    assert.deepEqual(list.body.items[0].leadTypes, ['APPOINTMENT']);

    const msgs = await request.get(`/api/conversations/${conversationId}/messages`).set('Cookie', tokens.owner);
    assert.equal(msgs.status, 200);
    const contents = msgs.body.items.map((m) => `${m.sender}:${m.content}`);
    assert.match(contents[0], /^BOT:¡Hola! Soy el asistente/);
    assert.equal(contents[1], 'VISITOR:Sacar un turno');
    assert.equal(contents[2], 'BOT:¿Qué servicio querés?');
    assert.match(contents.at(-1), /^BOT:¡Listo, Ana Pérez!/);

    const other = await request.get(`/api/conversations/${conversationId}/messages`).set('Cookie', tokens.intruder);
    assert.equal(other.status, 404);
  });

  it('panel: lista turnos y cambia su estado', async () => {
    const leads = await request.get(`/api/bots/${botId}/leads?type=APPOINTMENT`).set('Cookie', tokens.owner);
    assert.equal(leads.status, 200);
    assert.equal(leads.body.items[0].status, 'PENDING');
    assert.equal(leads.body.items[0].data.service, 'Corte de pelo');

    const bad = await request.patch(`/api/leads/${leadId}`).set('Cookie', tokens.owner).send({ status: 'DELIVERED' });
    assert.equal(bad.status, 400);
    const ok = await request.patch(`/api/leads/${leadId}`).set('Cookie', tokens.owner).send({ status: 'CONFIRMED' });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.status, 'CONFIRMED');
    const intruder = await request.patch(`/api/leads/${leadId}`).set('Cookie', tokens.intruder).send({ status: 'CANCELLED' });
    assert.equal(intruder.status, 404);

    const filtered = await request.get(`/api/bots/${botId}/leads?status=CONFIRMED`).set('Cookie', tokens.owner);
    assert.equal(filtered.body.total, 1);
  });

  it('admin de plantillas: usuario común → 403, admin puede crear y no puede borrar una en uso', async () => {
    const forbidden = await request.get('/api/admin/templates').set('Cookie', tokens.owner);
    assert.equal(forbidden.status, 403);

    const list = await request.get('/api/admin/templates').set('Cookie', tokens.admin);
    assert.equal(list.status, 200);
    const turnos = list.body.items.find((t) => t.key === 'turnos');
    assert.ok(turnos.botCount >= 1);

    const inUse = await request.delete(`/api/admin/templates/${turnos.id}`).set('Cookie', tokens.admin);
    assert.equal(inUse.status, 409);

    const invalid = await request
      .post('/api/admin/templates')
      .set('Cookie', tokens.admin)
      .send({ key: `test-${run}`, name: 'Prueba', description: 'x', config: { ...turnos.config, menu: [{ id: 'x', type: 'flow', label: 'X', flow: 'noexiste' }] } });
    assert.equal(invalid.status, 400);

    const created = await request
      .post('/api/admin/templates')
      .set('Cookie', tokens.admin)
      .send({ key: `test-${run}`, name: 'Prueba', description: 'x', config: turnos.config });
    assert.equal(created.status, 201);
    const del = await request.delete(`/api/admin/templates/${created.body.id}`).set('Cookie', tokens.admin);
    assert.equal(del.status, 204);
  });

  it('el dueño borra el bot y se borra todo lo asociado', async () => {
    const del = await request.delete(`/api/bots/${botId}`).set('Cookie', tokens.owner);
    assert.equal(del.status, 204);
    assert.equal(await prisma.lead.count({ where: { botId } }), 0);
    const pub = await request.get(`/api/public/bots/${slug}`);
    assert.equal(pub.status, 404);
  });
});
