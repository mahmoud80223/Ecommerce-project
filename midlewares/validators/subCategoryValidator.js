const { body , param} = require("express-validator");
const validationMiddleware = require("./validatorMiddelware")

exports.createSubCategoryValidator = [
    body("name")
    .notEmpty().withMessage("name is required").bail()
    .isString().withMessage("name must be a String").bail()
    .isLength({min:3,max:50}).withMessage("sub category name must be between 3 and 50 letrs"),
    body("categoryId")
    .optional()
    .isInt().withMessage("categoryId fro body must be an integer"),
    param("categoryId")
    .optional()
    .isInt().withMessage("categoryId  from url must be integer number"),
    validationMiddleware
]
exports.getSubCategoryValidator = [
    param("id")
    .notEmpty().withMessage("id is required").bail()
    .isInt().withMessage("in valid id , Enter an integer number"),
    validationMiddleware

]
exports.updateSubCAtegoryValidator = [
    param("id")
    .notEmpty().withMessage("id is required").bail()
    .isInt().withMessage("in valid id , Enter an integer number"),
    body("name")
    .notEmpty().withMessage("name is required").bail()
    .isString().withMessage("name must be a string").bail()
    .isLength({min:3,max:32}).withMessage("name must be between 3 and 32 letters"),
    body("categoryId")
    .notEmpty().withMessage("category id is required").bail()
    .isInt().withMessage('category id must be an integer'),
    validationMiddleware

]
exports.deleteSubCategoryVAlidator = [
    param("id")
    .notEmpty().withMessage("id is required").bail()
    .isInt().withMessage("in valid id , Enter an integer number"),
    validationMiddleware
]

exports.getSubCategoriesByCatIdValidator= [
     param("categoryId")
    .notEmpty().withMessage("Category id is required").bail()
    .isInt().withMessage("in valid category id , Enter an integer number"),
    validationMiddleware

]

