// Mos route topilmaganda 404 qaytaradi.
export default function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Topilmadi: ${req.method} ${req.originalUrl}`,
  });
}
