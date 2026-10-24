// Async controllerlardagi xatoliklarni avtomatik next()'ga uzatadi.
export default function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
