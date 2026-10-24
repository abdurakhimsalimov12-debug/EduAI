// Status kodli xatolik — controller/service'larda throw qilish uchun.
export default class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    if (details) this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(msg = 'Noto\'g\'ri so\'rov', details) {
    return new ApiError(400, msg, details);
  }
  static unauthorized(msg = 'Avtorizatsiya talab qilinadi') {
    return new ApiError(401, msg);
  }
  static forbidden(msg = 'Ruxsat yo\'q') {
    return new ApiError(403, msg);
  }
  static notFound(msg = 'Topilmadi') {
    return new ApiError(404, msg);
  }
  static conflict(msg = 'Ziddiyat') {
    return new ApiError(409, msg);
  }
}
