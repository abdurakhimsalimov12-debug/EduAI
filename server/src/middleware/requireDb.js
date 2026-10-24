import { isDbConnected } from '../config/db.js';
import ApiError from '../utils/ApiError.js';

// Ma'lumotlar bazasi ulanmagan bo'lsa, tushunarli 503 qaytaradi
// (server qulamasin, foydalanuvchi sababi bilsin).
export default function requireDb(req, res, next) {
  if (!isDbConnected()) {
    return next(
      new ApiError(
        503,
        'Ma\'lumotlar bazasi ulanmagan. MONGODB_URI ni sozlang.'
      )
    );
  }
  next();
}
