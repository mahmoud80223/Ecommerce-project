const { body,param } = require("express-validator");
const validationMiddleware = require("./validatorMiddelware");
exports.createCategoryValidator = [
    body('name')
    .notEmpty().withMessage("Category Name is Required").bail()
    .isString().withMessage("Category Name must be a string").bail()
    .isLength({min: 3 , max:50}).withMessage("Category name must be between 3 and 50 characters"),
    body('image')
    .optional()
    .isString().withMessage("Image must be a string"),
    validationMiddleware//بدل م احطها ف الراوت حطيتها هنا

];

exports.updateCategoryValidator = [
    param('id')
    .isInt().withMessage("Invalid category ID"),
    body('name')
    .notEmpty().withMessage("Category Name is Required").bail()
    .isString().withMessage("Category Name must be a string").bail()
    .isLength({ min: 3 , max : 50}).withMessage("Category name must be between 3 and 50 character"),
    body('image')
    .optional()
    .isString().withMessage("Image must be a string"),
    validationMiddleware
];
exports.getCategoryValidator = [
    param('id')
    .isInt().withMessage("Invalid Category ID"),
    validationMiddleware
];
exports.deleteCAtegoryValidator = [
    param('id')
    .isInt()
    .withMessage("Invalid CAtegory ID"),
    validationMiddleware
]