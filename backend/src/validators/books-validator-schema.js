// validators/books-validator.js
const { body, param } = require('express-validator');

const bookCreationValidator = [
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
    .isInt({ min: 5, max: 3000 }).withMessage('Pages must be between 5 and 3000'),

  body('genres')
    .isArray({ min: 1 }).withMessage('Genres must be a non-empty array'),

  body('genres.*')
    .isString().withMessage('Each genre must be a string'),

  body('summary')
    .optional()
    .isLength({ max: 2000 }).withMessage('Summary cannot exceed 2000 characters'),

  body('isbn')
    .optional()
    .matches(/^\d{10}(\d{3})?$/)
    .withMessage('ISBN must be 10 or 13 digits'),

  body('publishedYear')
    .optional()
    .isInt({ min: 0, max: new Date().getFullYear() })
    .withMessage('Invalid published year'),


];

const bookUpdateValidator = [
  body('title')
    .optional()
    .isString()
    .isLength({ min: 3 }),

  body('author')
    .optional()
    .isString()
    .isLength({ min: 3 }),

  body('language')
    .optional()
    .isString()
    .isLength({ min: 3 }),

  body('pageNumbers')
    .optional()
    .isInt({ min: 5, max: 3000 }),

  body('genres')
    .optional()
    .isArray({ min: 1 }),

  body('genres.*')
    .optional()
    .isString(),

  body('summary')
    .optional()
    .isLength({ max: 2000 }),

  body('isbn')
    .optional()
    .matches(/^\d{10}(\d{3})?$/),

  body('publishedYear')
    .optional()
    .isInt({ min: 0, max: new Date().getFullYear() }),

  
];

const isParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

module.exports = { bookCreationValidator, bookUpdateValidator,isParamValidator
};
