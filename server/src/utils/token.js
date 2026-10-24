import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const COOKIE_NAME = 'eduai_token';

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

// Tokenni xavfsiz HttpOnly cookie sifatida o'rnatadi (localStorage emas).
export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd, // prod'da faqat HTTPS
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
    path: '/',
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    path: '/',
  });
}

export function readAuthCookie(req) {
  return req.cookies?.[COOKIE_NAME] || null;
}

export { COOKIE_NAME };
