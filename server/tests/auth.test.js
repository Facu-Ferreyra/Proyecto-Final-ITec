// Tests de autenticación (Brandon): registro, login, logout, sesión actual y
// límite de intentos. Ver tests/helpers.js para los dos tipos de tests (sin base / con base).
import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SKIP_WITHOUT_DB, TEST_EMAIL_SUFFIX, loadApp, setCookieOf, testEmail } from './helpers.js';

const { api, prisma } = await loadApp();

const register = (body) => api.post('/api/auth/register').send(body);
const login = (body) => api.post('/api/auth/login').send(body);
const me = (cookie) => (cookie ? api.get('/api/auth/me').set('Cookie', cookie) : api.get('/api/auth/me'));
// "token=eyJ..." a partir del Set-Cookie de una respuesta.
const cookieFrom = (res) => setCookieOf(res)?.split(';')[0];

// ---------------------------------------------------------------------------
describe('auth sin base de datos', () => {
  it('GET /me sin cookie → 401 UNAUTHORIZED', async () => {
    const res = await me();
    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('las respuestas de auth no se guardan en caché', async () => {
    const res = await me();
    assert.equal(res.headers['cache-control'], 'no-store');
  });

  it('logout sin sesión → 204 y borra la cookie igual', async () => {
    const res = await api.post('/api/auth/logout');
    assert.equal(res.status, 204);
    assert.match(setCookieOf(res), /^token=;/);
  });

  it('registro con datos inválidos → 400 VALIDATION_ERROR (antes de tocar la base)', async () => {
    const casos = [
      [{ name: 'Ana', email: 'no-es-un-email', password: 'secreta123' }, 'email'],
      [{ name: 'Ana', email: 'ana@mail.com', password: 'corta1' }, 'password'],
      [{ name: 'Ana', email: 'ana@mail.com', password: 'sololetras' }, 'password'],
      [{ name: 'Ana', email: 'ana@mail.com', password: '12345678' }, 'password'],
      [{ name: 'Ana', email: 'ana@mail.com', password: 'a1'.repeat(37) }, 'password'], // 74 bytes > 72 de bcrypt
      [{ name: 'A', email: 'ana@mail.com', password: 'secreta123' }, 'name'],
    ];
    for (const [body, campo] of casos) {
      const res = await register(body);
      assert.equal(res.status, 400, `${JSON.stringify(body)} debería dar 400`);
      assert.equal(res.body.error.code, 'VALIDATION_ERROR');
      assert.ok(res.body.error.details.some((d) => d.path === campo), `falta el error en "${campo}"`);
    }
  });

  it('login sin contraseña → 400', async () => {
    const res = await login({ email: 'ana@mail.com' });
    assert.equal(res.status, 400);
  });
});

// ---------------------------------------------------------------------------
describe('auth con base de datos', { skip: SKIP_WITHOUT_DB }, () => {
  const email = testEmail('ana');
  const password = 'secreta123';
  let anaCookie;

  after(async () => {
    await prisma.user.deleteMany({ where: { email: { endsWith: TEST_EMAIL_SUFFIX } } });
  });

  it('registro: 201, crea USER, deja la sesión iniciada y no devuelve el hash', async () => {
    const res = await register({ name: 'Ana', email: `  ${email.toUpperCase()} `, password });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.deepEqual(Object.keys(res.body.user).sort(), ['createdAt', 'email', 'id', 'name', 'role']);
    assert.equal(res.body.user.email, email, 'el email se guarda sin espacios y en minúsculas');
    assert.equal(res.body.user.role, 'USER');

    const cookie = setCookieOf(res);
    assert.match(cookie, /^token=[^;]+/);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);
    anaCookie = cookieFrom(res);
  });

  it('registro: la contraseña se guarda como hash bcrypt, nunca en texto plano', async () => {
    // passwordHash está oculto por defecto (omit en db/prisma.js): acá se pide a propósito.
    const user = await prisma.user.findUnique({ where: { email }, omit: { passwordHash: false } });
    assert.match(user.passwordHash, /^\$2[aby]\$10\$/);
    assert.ok(!user.passwordHash.includes(password));
  });

  it('registro: un role ADMIN en el body se ignora (se crea USER)', async () => {
    const res = await register({ name: 'Colado', email: testEmail('colado'), password, role: 'ADMIN', isActive: true });
    assert.equal(res.status, 201);
    assert.equal(res.body.user.role, 'USER');
    const user = await prisma.user.findUnique({ where: { email: testEmail('colado') } });
    assert.equal(user.role, 'USER');
  });

  it('registro: email repetido (con otras mayúsculas) → 409 EMAIL_TAKEN', async () => {
    const res = await register({ name: 'Ana 2', email: email.toUpperCase(), password: 'otra12345' });
    assert.equal(res.status, 409);
    assert.equal(res.body.error.code, 'EMAIL_TAKEN');
  });

  it('GET /me con la cookie del registro → 200 { user } sin hash', async () => {
    const res = await me(anaCookie);
    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, email);
    assert.equal(res.body.user.passwordHash, undefined);
  });

  it('login correcto → 200 + cookie que sirve para /me', async () => {
    const res = await login({ email: ` ${email.toUpperCase()}`, password });
    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, email);
    assert.equal(res.body.user.passwordHash, undefined);
    assert.equal((await me(cookieFrom(res))).status, 200);
  });

  it('login: contraseña mal y email inexistente dan el MISMO 401 (no revela qué emails existen)', async () => {
    const wrongPassword = await login({ email, password: 'incorrecta1' });
    const unknownEmail = await login({ email: testEmail('nadie'), password: 'incorrecta1' });
    assert.equal(wrongPassword.status, 401);
    assert.equal(unknownEmail.status, 401);
    assert.deepEqual(wrongPassword.body, unknownEmail.body);
    assert.equal(wrongPassword.body.error.code, 'INVALID_CREDENTIALS');
    assert.equal(setCookieOf(wrongPassword), undefined, 'un login fallido no crea sesión');
  });

  it('cuenta desactivada: login correcto → 403 ACCOUNT_DISABLED y su sesión abierta deja de valer', async () => {
    await prisma.user.update({ where: { email }, data: { isActive: false } });
    try {
      const res = await login({ email, password });
      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'ACCOUNT_DISABLED');

      const wrong = await login({ email, password: 'incorrecta1' });
      assert.equal(wrong.status, 401, 'con la contraseña mal no se revela que la cuenta existe');

      assert.equal((await me(anaCookie)).status, 401);
    } finally {
      await prisma.user.update({ where: { email }, data: { isActive: true } });
    }
  });

  it('logout → 204 y la cookie se borra (vence en 1970)', async () => {
    const res = await api.post('/api/auth/logout').set('Cookie', anaCookie);
    assert.equal(res.status, 204);
    const cookie = setCookieOf(res);
    assert.match(cookie, /^token=;/);
    assert.match(cookie, /Expires=Thu, 01 Jan 1970/);
    // Mismas opciones que al crearla: si no, el navegador no la borraría.
    assert.match(cookie, /Path=\//);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);
  });
});

// ---------------------------------------------------------------------------
// Va al final: deja bloqueada la IP de los tests para el login.
describe('límite de intentos de login (fuerza bruta)', () => {
  it('después de 10 intentos fallidos → 429 TOO_MANY_REQUESTS', async () => {
    // Cuentan todos los intentos fallidos (400 o 401). Los tests anteriores ya
    // hicieron algunos, por eso se prueba hasta 11 veces y se espera el 429.
    let res;
    for (let i = 0; i < 11; i++) {
      res = await login({ email: 'ataque@mail.com' }); // sin contraseña → 400
      if (res.status === 429) break;
    }
    assert.equal(res.status, 429);
    assert.equal(res.body.error.code, 'TOO_MANY_REQUESTS');
    assert.match(res.headers.ratelimit, /r=0/);
  });

  it('una vez bloqueado, cualquier intento da 429 (ni se llega a validar)', async () => {
    const res = await login({ email: 'ataque@mail.com', password: 'cualquiera1' });
    assert.equal(res.status, 429);
  });
});

after(async () => {
  await prisma.$disconnect();
});
