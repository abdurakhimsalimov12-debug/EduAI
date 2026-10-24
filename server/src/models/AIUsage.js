import mongoose from 'mongoose';

// Foydalanuvchining kunlik AI so'rovlari sonini kuzatadi (limit uchun).
const aiUsageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // YYYY-MM-DD ko'rinishidagi kun kaliti.
    day: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Bir foydalanuvchi uchun bir kunga bitta hujjat.
aiUsageSchema.index({ user: 1, day: 1 }, { unique: true });

aiUsageSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('AIUsage', aiUsageSchema);
