import mongoose from 'mongoose';

// Har bir foydalanuvchi uchun bitta progress hujjati.
const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    completedLessons: [
      {
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        completedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userProgressSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('UserProgress', userProgressSchema);
