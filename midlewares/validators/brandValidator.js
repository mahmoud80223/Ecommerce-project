const { body , param} = require("express-validator");
const validationMiddleware = require("./validatorMiddelware")

exports.createbrandValidator = [
    body("name")
    .notEmpty().withMessage("name is required").bail()
    .isString().withMessage("name must be a String").bail()
    .isLength({min:3,max:50}).withMessage("brand name must be between 3 and 50 letrs"),
    body("image")
    .notEmpty().withMessage("image is required").bail()
    .isString().withMessage("image must be string"),
    validationMiddleware
]
exports.getBrandValidator = [
    param("brandId")
    .notEmpty().withMessage("brand id is required").bail()
    .isInt().withMessage("in valid id , Enter an integer number"),
    validationMiddleware

]
exports.updateBrandValidator = [
    param("brandId")
    .notEmpty().withMessage("brand id is required").bail()
    .isInt().withMessage("in valid brand id , Enter an integer number"),
    body("name")
    .notEmpty().withMessage("name is required").bail()
    .isString().withMessage("name must be a string").bail()
    .isLength({min:3,max:32}).withMessage("name must be between 3 and 32 letters"),
    body("image")
    .notEmpty().withMessage("brand image is required").bail()
    .isString().withMessage('image must be an string'),
    validationMiddleware

]
exports.deleteBrandVAlidator = [
    param("brandId")
    .notEmpty().withMessage("brand id is required").bail()
    .isInt().withMessage("in valid id , Enter an integer number"),
    validationMiddleware
]



