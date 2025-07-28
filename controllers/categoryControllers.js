const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

// const createCategoryController = async(req,res)=>{
//     const { name , image }=req.body;
//     if(!name || typeof(name)!=="string"){
//         return res.status(400).send({
//             success:false,
//             messege:"Name is required and must be string"
//         })
//     }
//     const slug = slugify(name,{ lower :true }) // lower :true معناها خليه كله Small letters
//     try {
//         const result = await categoryModel.createCategory(name , slug , image);
//         res.status(201).send({
//             success:true,
//             message:"category created successfully",
//             result
//         })

//     } catch (error) {
//         res.status(500).send({
//             success:false,
//             messege:"error in create category api",
//             error: error.message
//         })

//     }
// }
//طريقه تانيه باستخدام asyncHandler بدل try and catch
const createCategoryController = asyncHandler(async (req, res,next) => {
  const { name, image } = req.body;
  if (!name || typeof name !== "string") {
    return next(new apiError(`Name is required and must be string`,400))
  }
  const slug = slugify(name, { lower: true }); // lower :true معناها خليه كله Small letters

  const result = await categoryModel.createCategory(name, slug, image);
  res.status(201).json({
    success: true,
    data: result,
  });
});

const getCategoryController = asyncHandler(async (req, res,next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const categories = await categoryModel.getCategory(page, limit);
    if (!categories || categories.length == 0) {
      return next(new apiError(`No categories found`,404))
    }
    res.status(200).send({
      result: categories.length,
      page,
      data: categories,
    });
 
});

const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new apiError(`no category found for this id ${id}`, 404));
  }
  res.status(200).send({
    success: true,
    data: category,
  });
});

const updateCategoryController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, image } = req.body;
  if (!name || typeof name !== "string") {
    return next(new apiError(`name is required and must be string`, 400));
  }
  const slug = slugify(name, { lower: true });
  const category = await categoryModel.updateCategory(id, name, slug, image);
  if (!category) {
    return next(new apiError(`no category found for this id${id}`, 404));
  }
  res.status(200).send({
    success: true,
    messege: "category updated successfully",
    data: category,
  });
});

const deleteCategoryController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.deleteCategory(id);
  if (!category) {
    return next(new apiError(`no category found for this id ${id}`, 404));
  }

  res.status(200).send({
    success: true,
    message: "category deleted successfully",
  });
});



module.exports = {
  createCategoryController,
  getCategoryController,
  getCategory,
  updateCategoryController,
  deleteCategoryController,
};
