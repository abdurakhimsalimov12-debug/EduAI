import { body } from 'express-validator';

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Ism 2-60 belgi bo\'lsin'),
  body('email').trim().isEmail().withMessage('Email noto\'g\'ri').normalizeEmail(),
  body('password').isLength({ min: 6, max: 128 }).withMessage('Parol kamida 6 belgi'),
  body('preferredLanguage').optional().isIn(['uz', 'ru', 'en']),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Email noto\'g\'ri').normalizeEmail(),
  body('password').notEmpty().withMessage('Parol majburiy'),
];

export const updateMeRules = [
  body('name').optional().trim().isLength({ min: 2, max: 60 }),
  body('preferredLanguage').optional().isIn(['uz', 'ru', 'en']),
];
