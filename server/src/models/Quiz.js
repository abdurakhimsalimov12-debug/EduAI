import mongoose from 'mongoose';
import { localizedString } from '../utils/i18nField.js';

const optionSchema = new mongoose.Schema(
  { ...localizedString(true) },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    prompt: localizedString(true),
    options: {
      type: [optionSchema],
      validate: [(v) => v.length >= 2, 'Kamida 2 ta variant kerak'],
    },
    // To'g'ri javob indeksi — foydalanuvchiga HECH QACHON yuborilmaydi.
    correctIndex: { type: Number, required: true, min: 0, select: false },
    explanation: localizedString(false),
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      default: null,
      index: true,
    },
    title: localizedString(true),
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    questions: {
      type: [questionSchema],
      validate: [(v) => v.length >= 1, 'Kamida 1 ta savol kerak'],
    },
  },
  { timestamps: true }
);

quizSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Quiz', quizSchema);
