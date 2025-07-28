const subcategoryModel = require("../models/subCategoryModel");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const slugify = require("slugify");

const createSubCategoryController = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const  categoryId = req.params.categoryId ||  req.body.categoryId;
  // if (!name || !categoryId) {
  //   return next(new apiError("name and categoryId are required ", 400));
  // }
  const exist = await subcategoryModel.getSubCatByName(name);
  if (exist) {
    return next(
      new apiError(`the name is exist. please enter a nother name`, 409)
    );
  }
  const existing = await subcategoryModel.getCatByID(categoryId);
  if (!existing) {
    return next(
      new apiError(`this id (${categoryId}) is not found .Enter valid id`, 404)
    );
  }
  const slug = slugify(name, { lower: true });
  const result = await subcategoryModel.createSubCategory(
    name,
    slug,
    categoryId
  );
  res.status(201).send({
    success: true,
    data: result,
  });
});

const getSubCategoriesController = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
   
  const subcategories = await subcategoryModel.getSubCategories(page, limit);
  if (!subcategories || subcategories == 0) {
    return next(new apiError(`no sub categories found`, 404));
  }
  res.status(200).json({
    result: subcategories.length,
    page,
    data: subcategories,
  });
});

const getSubCAtegoryController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subcategoryModel.getSubCategory(id);
  if (!subCategory) {
    return next(new apiError(`no category found for this id ${id}`, 404));
  }
  res.status(200).send({
    success: true,
    data: subCategory,
  });
});

const updateSubCategoryController = asyncHandler(async(req,res,next)=>{
    const { id } = req.params;
    const { name , categoryId } = req.body;
    const slug = slugify(name,{lower:true})
    const subCategory = await subcategoryModel.updateSubCategory(id,name,slug,categoryId);
    if(!subCategory){
        return next(new apiError(`No sub category found for this id ${id}`,404))
    }
    res.status(200).send({
        success:true,
        message:"sub category updated successfully",
        data:subCategory
    })
})
const deleteSubCategoryController = asyncHandler(async(req,res,next)=>{
  const { id } = req.params;
  const result = await subcategoryModel.deleteSubCategory(id);
  if(!result){
    return next(new apiError(`no category found for this id ${id}`,404))
  }
  res.status(200).send({
    success:true,
    message:"sub category deleted successfully"
  })
});

const getAllSubCatByCatIdController = asyncHandler(async(req,res,next)=>{
  const { categoryId } = req.params;
  const { name } = req.query;
  console.log(req.params);
  
  const result = await subcategoryModel.getAllSubCatByCatId(categoryId,name) ;
  if(!result){
    return next(new apiError(`No Sub Category Found For This Id ${categoryId}`,404))
  }
  res.status(200).send({
    success:true,
    data:result
  })
})
module.exports = {
  createSubCategoryController,
  getSubCategoriesController,
  getSubCAtegoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
  getAllSubCatByCatIdController,
  
};
