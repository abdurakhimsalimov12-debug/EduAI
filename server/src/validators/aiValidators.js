import { body } from 'express-validator';
import { AI_LIMITS } from '../services/aiService.js';

export const chatRules = [
  body('question')
    .trim()
    .isLength({ min: 1, max: AI_LIMITS.maxQuestionLength })
    .withMessage(`Savol 1-${AI_LIMITS.maxQuestionLength} belgi bo'lsin`),
  body('lang').optional().isIn(['uz', 'ru', 'en']),
  body('history').optional().isArray({ max: AI_LIMITS.maxHistoryMessages }),
];
