import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

// express-validator zanjiridan keyin ishlaydigan natija tekshiruvchi.
export default function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));
  next(ApiError.badRequest('Kiritilgan ma\'lumotlar noto\'g\'ri', details));
}
