import { body } from 'express-validator';

export const submitRules = [
  body('answers').isArray({ min: 1 }).withMessage('Javoblar ro\'yxati kerak'),
  // Har bir element son yoki null (javob berilmagan) bo'lishi mumkin.
  body('answers.*').custom((v) => v === null || Number.isInteger(v)).withMessage('Javob indeksi noto\'g\'ri'),
];
