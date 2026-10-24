import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { verifyToken, readAuthCookie } from '../utils/token.js';
import User from '../models/User.js';

// Faqat tizimga kirgan foydalanuvchiga ruxsat.
export const protect = asyncHandler(async (req, res, next) => {
  // Token HttpOnly cookie'dan yoki Authorization: Bearer ... dan olinadi.
  let token = readAuthCookie(req);
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) throw ApiError.unauthorized();

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Token yaroqsiz yoki muddati tugagan');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized();

  req.user = user;
  next();
});

// Rolni backend tomonida tekshiradi — admin endpointlari uchun.
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(ApiError.forbidden('Bu amal uchun admin huquqi kerak'));
  }
  next();
};
