const { body , param} = require("express-validator");
const validationMiddleware = require("./validatorMiddelware");
const userModel = require("../../models/userModel");

exports.registerValidator = [
    body("name")
    .notEmpty().withMessage("name is required").bail()
    .isString().withMessage("name must be a string").bail()
    .isLength({min:3,max:32}).withMessage("name must be between 3 and 32 letters"),
   body("email")
    .notEmpty().withMessage("email is required").bail()
    .isEmail().withMessage("email must be a valid email").bail()
    .custom(async(email)=>{
      const existingEmail = await userModel.findByEmail(email)
      console.log(existingEmail);
      
      if(existingEmail){   
       throw new  Error(`this email ${email} is found ,please enter different email`)
      }
      return true
    }),
   body("password") 
    .notEmpty().withMessage("password is required").bail()
    .isLength({min:6}).withMessage("password must be at least 6 character"),
   body("phone")
     .optional()
     .isMobilePhone().withMessage("invalaid phone number"), //isMobilePhone("ar-eg")
   body("address")
     .optional()
     .isString().withMessage("address must be a string")
     .isLength({min:3}).withMessage("address must be more than 3 character"),
     validationMiddleware
]


exports.loginValidator = [
  body("email")
    .notEmpty().withMessage("email is required").bail()
    .isEmail().withMessage("Enter a valid email"),
  body("password")
    .notEmpty().withMessage("password is required"),
    validationMiddleware
]

exports.updateUserValidator = [
  param("id")
    .notEmpty().withMessage("id is required").bail()
    .isInt().withMessage("id must be an integer"),
  body("name")
    .optional()
    .isString().withMessage("name must be a string").bail()
    .isLength({min:3,max:32}).withMessage("name must be between 3 and 32 letters"),
  body("email")
    .optional()
    .notEmpty().withMessage("email is required").bail()
    .isEmail().withMessage("must be a valid email"),
  body("phone")
    .optional()
    .isMobilePhone().withMessage("invalaid phone number"),
  body("address")
    .optional()
    .isString().withMessage("address must be a string")
    .isLength({min:3}).withMessage("address must be more than 3 character"),
  validationMiddleware


]