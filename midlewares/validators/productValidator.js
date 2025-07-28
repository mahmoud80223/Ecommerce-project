const { body,param } = require("express-validator");
const validationMiddleware = require("./validatorMiddelware");
const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel")

exports.createProductValidator = [
    body("title")
    .notEmpty().withMessage("title is required").bail()
    .isString().withMessage("title must be a srring").bail()
    .isLength({min:3}).withMessage("title length must be more than 3 letters"),
    body("description")
    .notEmpty().withMessage("description is required").bail()
    .isString().withMessage("description must be a String").bail()
    .isLength({min:10, max:200}).withMessage("description must be betwwen 10 and 200 letters"),
    body("quantity")
    .notEmpty().withMessage("quantity is required").bail()
    .isInt().withMessage("quantity must be an integer number"),
    body("sold")
    .optional()
    .isInt().withMessage("sold must be an integer number"),
    body("price")
    .notEmpty().withMessage("price is required").bail()
    .toFloat().isFloat("price must be a vlaid number"),
    body("priceAfterDiscount")
    .optional()
    .toFloat().isFloat().withMessage("price after discount must be a valid number").bail()
    .custom((value,{req})=>{
    if(req.body.price <=value){
    throw new Error('price after discount must be lower than price')
    }
    return true;
    }),
    body("imageCover")
    .notEmpty().withMessage("image cover is required").bail()
    .isString().withMessage("image Cover must be a string"),
    body("categoryId")
    .notEmpty().withMessage("category id is required").bail()
    .isInt().withMessage("category id must be an integer").bail()
    .custom(async(categoryId)=>{
        const existingCategory = await categoryModel.findById(categoryId);
        if(!existingCategory){
            throw new Error(`no category found for this is ${categoryId}`)
        }
        return true;

    }),
    body("brandId")
    .notEmpty().withMessage("brand id is required").bail()
    .isInt().withMessage("brand id must be an integer"),
    body("ratingAverage")
    .optional()
    .toFloat().isFloat().withMessage("rating average must be valid anumber"),
    body("colors")
    .optional()
    .isArray().withMessage("colors must be an array of string").bail()
    .custom(colors => colors.every(color => typeof color==='string')).withMessage("each color must be a string"),
    body("images")
    .optional()
    .isArray().withMessage("images must be an array")
    .custom(images =>images.every(image=>typeof image==='string')).withMessage("each image must be a string"),
    body("subcategories")
    .optional()
    .isArray().withMessage("sub categories must be an array").bail()
    .custom(subs =>subs.every(id=> Number.isInteger(id))).withMessage("each sub category id must be an integer")
    //الكود ده هيمشي علي كل سب وهيرجعلي رقم ال سب اللي مش موجود
    .custom(async(subcategories)=>{
        await Promise.all(
            subcategories.map(async(subId)=>{
                const existingSubId = await subCategoryModel.getSubCategory(subId);
                if(!existingSubId){
                    throw new Error(`no sub category found for this id ${subId}`)
                }
                return true;
            })
        )
        return true;
    })
    // الكود ده لوحده كافي من غير الاول
    .custom(async(subcategories,{req})=>{
        const categoryId = req.body.categoryId;
        const existingSubCategories = await subCategoryModel.getAllSubCatByCatId(categoryId);
        if(!existingSubCategories){
            throw new Error(`no sub categories found for this category ${categoryId}`)
        }
        const validSubIdsSet = new Set(existingSubCategories.map(sub=>sub.id));
        const allValid = subcategories.every(id=>validSubIdsSet.has(id));
        if(!allValid){
            throw new Error(`some subCategories do not belong to categoryId ${categoryId}`)
        }
        return true;
    }),
    
    validationMiddleware
]

exports.getProductByIdValidator = [
    param("id")
    .notEmpty().withMessage("id is required").bail()
    .isInt().withMessage("id must be an integer"),
    validationMiddleware
]

exports.updateProductValidator = [
    param("id")
    .notEmpty().withMessage("id is required").bail()
    .isInt().withMessage("id must be an integer number"),
    body("title")
    .optional()
    .isString().withMessage("title must be string").bail()
    .isLength({min:3}).withMessage("title must be more than 3 letters"),
    body("description")
    .optional()
    .isString().withMessage("description must be string").bail()
    .isLength({min:10,max:200}).withMessage("description must be betwwen 10 and 200 lettrs"),
    body("quantity")
    .optional()
    .isInt("quantity must be an integer"),
    body("sold")
    .optional()
    .isInt().withMessage("sold must be an integer"),
    body("price")
    .optional()
    .toFloat().isFloat().withMessage("price must be a valid integer"),
    body("priceAfterDiscount")
    .optional()
    .toFloat().isFloat().withMessage("pricr after discount must be float number")
    .custom((value,{req})=>{
        if(req.body.price<value){
            throw new Error(`price after discount must be lower than price`)
        }
        return true
    }),
    body("imageCover")
    .optional()
    .isString().withMessage("image cover must be a string"),
    body("categoryId")
    .optional()
    .isInt().withMessage("category id must be an integer"),
    body("brandId")
    .optional()
    .isInt().withMessage("brand id must be an integer number"),
    body("ratingAverage")
    .optional()
    .toFloat().isFloat().withMessage("rating Average must be a valid number"),
    body("colors")
    .optional()
    .isArray().withMessage("colors must be an array")
    .custom(colors =>colors.every(color => typeof color ==='string')).withMessage("each color must be a string"),
    body("images")
    .optional()
    .isArray().withMessage("images must be an array")
    .custom(images => images.every(image => typeof image ==='string')).withMessage("each image must be an string"),
    body("subcategories")
    .optional()
    .isArray().withMessage("sub categories must be an array")
    .custom(subs => subs.every(sub => Number.isInteger(sub))).withMessage("each sub category must be an integer number"),
    validationMiddleware
]