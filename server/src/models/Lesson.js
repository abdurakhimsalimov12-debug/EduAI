import mongoose from 'mongoose';
import { localizedString } from '../utils/i18nField.js';

const lessonSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    slug: { type: String, required: true, lowercase: true, trim: true },
    title: localizedString(true),
    // Asosiy tushuntirish matni (har til uchun).
    content: localizedString(false),
    // Misollar va muhim qoidalar/formulalar.
    examples: localizedString(false),
    keyPoints: localizedString(false),
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Bir fan ichida slug takrorlanmasin.
lessonSchema.index({ subject: 1, slug: 1 }, { unique: true });

lessonSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Lesson', lessonSchema);
