// Tests de "Olvidé mi contraseña" (guía de OWASP Forgot Password).
// Los que tocan la base se saltean sin DATABASE_URL (ver tests/helpers.js).
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { SKIP_WITHOUT_DB, TEST_EMAIL_SUFFIX, loadApp, sessionCookie, testEmail } from './helpers.js';

const { api, prisma } = await loadApp();

const forgot = (email) => api.post('/api/auth/forgot-password').send({ email });
const reset = (token, password) => api.post('/api/auth/reset-password').send({ token, password });
const hashToken = (token) => createHash('sha256').update(token).digest('hex');

// ---------------------------------------------------------------------------
describe('recuperar contraseña sin base de datos', () => {
  it('datos inválidos → 400 VALIDATION_ERROR (antes de tocar la base)', async () => {
    assert.equal((await forgot('no-es-un-email')).status, 400);
    const weak = await reset('x'.repeat(43), 'sololetras');
    assert.equal(weak.status, 400);
    assert.equal(weak.body.error.code, 'VALIDATION_ERROR');
  });
});

// ---------------------------------------------------------------------------
describe('recuperar contraseña con base de datos', { skip: SKIP_WITHOUT_DB }, () => {
  const password = 'vieja1234';
  let user;

  // Crea un link "a mano" con un token conocido (en la base solo va el hash).
  async function createToken({ minutesLeft = 30, usedAt = null } = {}) {
    const token = `token-de-prueba-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + minutesLeft * 60_000), usedAt },
    });
    return token;
  }

  before(async () => {
    user = await prisma.user.create({
      data: { email: testEmail('olvido'), name: 'Olvido', passwordHash: await bcrypt.hash(password, 10) },
    });
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: { endsWith: TEST_EMAIL_SUFFIX } } });
  });

  it('responde lo MISMO exista o no el email (no revela qué emails existen)', async () => {
    const existing = await forgot(user.email);
    const unknown = await forgot(testEmail('nadie'));
    assert.equal(existing.status, 200);
    assert.equal(unknown.status, 200);
    assert.deepEqual(existing.body, unknown.body);
  });

  it('el token se guarda con hash: en la base no hay ningún link usable', async () => {
    const tokens = await prisma.passwordResetToken.findMany({ where: { userId: user.id } });
    assert.equal(tokens.length, 1);
    assert.match(tokens[0].tokenHash, /^[a-f0-9]{64}$/); // SHA-256 en hexadecimal
  });

  it('link inexistente, vencido o ya usado → 400 INVALID_RESET_TOKEN', async () => {
    const tokens = ['x'.repeat(43), await createToken({ minutesLeft: -1 }), await createToken({ usedAt: new Date() })];
    for (const token of tokens) {
      const res = await reset(token, 'nueva1234');
      assert.equal(res.status, 400);
      assert.equal(res.body.error.code, 'INVALID_RESET_TOKEN');
    }
  });

  it('link válido: cambia la contraseña, cierra las sesiones viejas y no se puede reusar', async () => {
    const oldSession = sessionCookie(user);
    await new Promise((resolve) => setTimeout(resolve, 1100)); // iat del JWT está en segundos
    const token = await createToken();

    assert.equal((await reset(token, 'nueva1234')).status, 204);

    const stored = await prisma.user.findUnique({ where: { id: user.id }, omit: { passwordHash: false } });
    assert.ok(await bcrypt.compare('nueva1234', stored.passwordHash));
    assert.equal((await api.post('/api/auth/login').send({ email: user.email, password: 'nueva1234' })).status, 200);
    assert.equal((await api.post('/api/auth/login').send({ email: user.email, password })).status, 401);
    assert.equal((await api.get('/api/auth/me').set('Cookie', oldSession)).status, 401);
    assert.equal((await reset(token, 'otra12345')).status, 400);
  });
});
