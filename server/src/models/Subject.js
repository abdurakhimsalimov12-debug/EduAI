import mongoose from 'mongoose';
import { localizedString } from '../utils/i18nField.js';

const subjectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: localizedString(true),
    description: localizedString(false),
    icon: { type: String, default: 'BookOpen' }, // lucide-react ikonka nomi
    color: { type: String, default: 'primary' }, // daisyUI rang kaliti
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

subjectSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Subject', subjectSchema);
