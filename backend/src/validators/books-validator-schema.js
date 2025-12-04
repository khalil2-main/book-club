// validators/bookValidator.js
const { body } = require('express-validator');

const bookValidator = [
  body('title')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('author')
    .isString().withMessage('Author must be a string')
    .isLength({ min: 3 }).withMessage('Author must be at least 3 characters'),

  body('language')
    .optional()
    .isString()
    .isLength({ min: 3 }).withMessage('Language must be at least 3 characters'),

  body('pageNumbers')
    .optional()
    .isInt({ min: 5, max: 3000 })
    .withMessage('Page numbers must be between 5 and 3000'),

  body('genres')
    .isArray({ min: 1 }).withMessage('Genres must be a non-empty array'),
  body('genres.*')
    .isString().withMessage('Each genre must be a string'),

  body('summary')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Summary cannot exceed 2000 characters'),

  body('isbn')
    .optional()
    .matches(/^\d{10}(\d{3})?$/)
    .withMessage('ISBN must be 10 or 13 digits'),

  body('publishedYear')
    .optional()
    .isInt({ min: 0, max: new Date().getFullYear() })
    .withMessage('Invalid published year'),

  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),

  body('status')
    .optional()
    .isIn(['reading', 'completed', 'want-to-read'])
    .withMessage('Invalid status'),

  body('coverImage')
    .optional()
    .isObject().withMessage('coverImage must be an object'),
  body('coverImage.contentType')
    .optional()
    .matches(/^image\/(jpeg|jpg|png|gif|webp)$/i)
    .withMessage('Cover image must be a valid image type')
];

module.exports = bookValidator;
