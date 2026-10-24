import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    // Foydalanuvchi tanlagan variant indekslari.
    answers: [{ type: Number }],
    correctCount: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ user: 1, createdAt: -1 });

quizAttemptSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('QuizAttempt', quizAttemptSchema);
