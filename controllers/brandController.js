const brandModel = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const slugify = require("slugify");

const createBrandController = asyncHandler(async (req, res, next) => {
  const {name,image} = req.body;
  const exist = await brandModel.getBrandByName(name);
  if (exist) {
    return next(
      new apiError(`the name is exist. please enter a nother name`, 409)
    );
  }
  const slug = slugify(name, { lower: true });
  const result = await brandModel.createBrand(name,slug,image);
  res.status(201).send({
    success: true,
    data: result,
  });
});

const getBrandsController = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
   
  const brands = await brandModel.getBrands(page, limit);
  if (!brands || brands == 0) {
    return next(new apiError(`no brands found`, 404));
  }
  res.status(200).json({
    result: brands.length,
    page,
    data: brands,
  });
});

const getBrandController = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;
  const brand = await brandModel.getBrandById(brandId);
  if (!brand) {
    return next(new apiError(`no brand found for this id ${brandId}`, 404));
  }
  res.status(200).send({
    success: true,
    data: brand,
  });
});

const updateBrandController = asyncHandler(async(req,res,next)=>{
    const { brandId } = req.params;
    const { name , image } = req.body;
    const slug = slugify(name,{lower:true})
    const brand = await brandModel.updateBrand(brandId,name,slug,image);
    if(!brand){
        return next(new apiError(`No brand found for this id ${brandId}`,404))
    }
    res.status(200).send({
        success:true,
        message:"brand updated successfully",
        data:brand
    })
})
const deleteBrandController = asyncHandler(async(req,res,next)=>{
  const { brandId } = req.params;
  const result = await brandModel.deleteBrand(brandId);
  if(!result){
    return next(new apiError(`no brand found for this id ${brandId}`,404))
  }
  res.status(200).send({
    success:true,
    message:"brand deleted successfully"
  })
});

module.exports = {
  createBrandController,
  getBrandsController,
  getBrandController,
  updateBrandController,
  deleteBrandController
};
