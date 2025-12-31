const { body,param } = require("express-validator");

// Create user validation
const createUserValidator = [
  body("firstname")
    .isString().withMessage("firstname must be a string")
    .isLength({ min: 3 }).withMessage("firstname must be at least 3 characters")
    .notEmpty().withMessage("firstname is required"),

  body("lastname")
    .isString().withMessage("lastname must be a string")
    .isLength({ min: 3 }).withMessage("lastname must be at least 3 characters")
    .notEmpty().withMessage("lastname is required"),

  body("email")
    .isEmail().withMessage("invalid email format")
    .notEmpty().withMessage("email is required"),

  body("birthday")
    .isISO8601().withMessage("invalid date format")
    .notEmpty().withMessage("birthday is required"),

  body("password")
    .isLength({ min: 8, max: 30 }).withMessage("password must be 8–30 characters")
    .notEmpty().withMessage("password is required"),

  body("admin")
    .optional()
    .isBoolean().withMessage("admin must be a boolean"),

  body("address.location")
    .optional()
    .isString().withMessage("address.location must be a string"),

  body("address.city")
    .optional()
    .isString().withMessage("address.city must be a string"),

  body("address.country")
    .optional()
    .isString().withMessage("address.country must be a string"),
];

// Update user validation
const updateUserValidator = [
  body("firstname")
    .optional()
    .isString().withMessage("firstname must be a string")
    .isLength({ min: 3 }).withMessage("firstname must be at least 3 characters"),

  body("lastname")
    .optional()
    .isString().withMessage("lastname must be a string")
    .isLength({ min: 3 }).withMessage("lastname must be at least 3 characters"),

  body("email")
    .optional()
    .isEmail().withMessage("invalid email format"),

  body("birthday")
    .optional()
    .isISO8601().withMessage("invalid date format"),

  body("password")
    .optional()
    .isLength({ min: 8, max: 30 }).withMessage("password must be 8–30 characters"),

  body("admin")
    .optional()
    .isBoolean().withMessage("admin must be a boolean"),

  body("address.location")
    .optional()
    .isString().withMessage("address.location must be a string"),

  body("address.city")
    .optional()
    .isString().withMessage("address.city must be a string"),

  body("address.country")
    .optional()
    .isString().withMessage("address.country must be a string"),
];

// Auth validator
const authUserValidator = [
  body("email")
    .isEmail().withMessage("invalid email format")
    .notEmpty().withMessage("email is required"),

  body("password")
    .isLength({ min: 8, max: 30 }).withMessage("password must be 8–30 characters")
    .notEmpty().withMessage("password is required"),
];

const uploadProfileImageValidator = [
  body("profileImage")
    .optional()
    .matches(/^image\/(jpeg|jpg|png|gif|webp)$/i)
    .withMessage("Invalid image type"),

  body("data")
    .notEmpty().withMessage("Image buffer is required")
  ];

  const isParamValidator = [
    param('id').isMongoId().withMessage('Invalid ID format')
  ];

module.exports = {
  createUserValidator,
  updateUserValidator,
  authUserValidator,
  uploadProfileImageValidator,
  isParamValidator
};
