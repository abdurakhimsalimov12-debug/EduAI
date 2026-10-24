import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ism majburiy'],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Email majburiy'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email noto\'g\'ri'],
    },
    password: {
      type: String,
      required: [true, 'Parol majburiy'],
      minlength: 6,
      select: false, // so'rovlarda sukut bo'yicha qaytmaydi
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    preferredLanguage: {
      type: String,
      enum: ['uz', 'ru', 'en'],
      default: 'uz',
    },
  },
  { timestamps: true }
);

// Parolni saqlashdan oldin xeshlaymiz.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

// JSON'ga aylantirilганda parolni hech qachon chiqarmaymiz.
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
