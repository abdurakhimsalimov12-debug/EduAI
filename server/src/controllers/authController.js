import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/token.js';

function issueSession(res, user) {
  const token = signToken({ id: user._id, role: user.role });
  setAuthCookie(res, token);
  return token;
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, preferredLanguage } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw ApiError.conflict('Bu email allaqachon ro\'yxatdan o\'tgan');

  const user = await User.create({ name, email, password, preferredLanguage });
  issueSession(res, user);

  res.status(201).json({ success: true, user: user.toJSON() });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password select:false — shuning uchun aniq so'raymiz.
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Email yoki parol noto\'g\'ri');
  }

  issueSession(res, user);
  res.json({ success: true, user: user.toJSON() });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Tizimdan chiqildi' });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toJSON() });
});

// PATCH /api/auth/me — ism va interfeys tilini sozlash
export const updateMe = asyncHandler(async (req, res) => {
  const { name, preferredLanguage } = req.body;
  if (name !== undefined) req.user.name = name;
  if (preferredLanguage !== undefined) req.user.preferredLanguage = preferredLanguage;
  await req.user.save();
  res.json({ success: true, user: req.user.toJSON() });
});
