const productModel = require("../models/productModel");
const subCategoryModel = require("../models/subCategoryModel");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const slugify = require("slugify");

const createProductController = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    quantity,
    sold,
    price,
    priceAfterDiscount,
    imageCover,
    categoryId,
    brandId,
    ratingAverage,
    colors,
    images,
    subcategories,
  } = req.body;
  
  const slug = slugify(title, { lower: true });
  const exist = await productModel.getProductByTitle(title);
  if (exist) {
    return next(new apiError("this title product is exist", 409));
  }
  const product = await productModel.createProduct({
    title,
    slug,
    description,
    quantity,
    sold,
    price,
    priceAfterDiscount,
    imageCover,
    categoryId,
    brandId,
    ratingAverage,
  });

  const productId = product[0].id;
  if (Array.isArray(colors)) {
    for (let color of colors) {
      await productModel.createProductColor(productId, color);
    }
  }
  if (Array.isArray(images)) {
    for (let image of images) {
      await productModel.createProductImage(productId, image);
    }
  }
  if (Array.isArray(subcategories)) {
    for (let subCategory of subcategories) {
      await productModel.createProductSubCategory(productId, subCategory);
    }
  }
  res.status(201).send({
    success: true,
    message: "product created successfully",
    productId,
  });
});

const getAllProductsController = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const { title } = req.query;
  const {minPrice , maxPrice }= req.query;
  const { ratingAverage ,sortBy,search }= req.query;

  const products = await productModel.getAllProducts(page, limit, title,minPrice,maxPrice,ratingAverage,sortBy,search);
  if (!products || products.length === 0) {
    return next(new apiError("no products found", 404));
  }
  res.status(200).send({
    result: products.length,
    page,
    data: products,
  });
});
const getProductByIdController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.getProductById(id);
  if (!product) {
    return next(new apiError(`no product found for this is ${req.id}`));
  }
  res.status(200).send({
    success: true,
    data: product,
  });
});
const updateProductController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const existingProduct = await productModel.getProductById(id);
  if (!existingProduct) {
    return next(new apiError(`no product found for this id ${id}`));
  }

  const {
    title = existingProduct.title,
    description = existingProduct.description,
    quantity = existingProduct.quantity,
    sold = existingProduct.sold,
    price = existingProduct.price,
    priceAfterDiscount = existingProduct.priceAfterDiscount,
    imageCover = existingProduct.imageCover,
    categoryId = existingProduct.categoryId,
    brandId = existingProduct.brandId,
    ratingAverage = existingProduct.ratingAverage,
    colors,
    images,
    subcategories,
  } = req.body;

  let slug;
  if (req.body.title) {
    // lw mafish title msh h3ml slug
    slug = slugify(title, { lower: true }); //عملت الشرط ده عشان مش لازم احدث العنوان ممكن احدث حاجه واحده وخلاص
  }else 
  {slug = existingProduct.slug}

  await productModel.updateProduct(
    id,
    title,
    slug,
    description,
    quantity,
    sold,
    price,
    priceAfterDiscount,
    imageCover,
    categoryId,
    brandId,
    ratingAverage
  );
  if (Array.isArray(colors)) {
    await productModel.deleteColors(id);
    for (let color of colors) {
      await productModel.createProductColor(id, color);
    }
  }
  if (Array.isArray(images)) {
    await productModel.deleteImages(id);
    for (let image of images) {
      await productModel.createProductImage(id, image);
    }
  }
  if (Array.isArray(subcategories)) {
    await productModel.deleteSubCategories(id);
    for (let sub of subcategories) {
      await productModel.createProductSubCategory(id, sub);
    }
  }
  res.status(200).json({
    success: true,
    messsage: "product updated successfully",
    productId: id,
  });
});

const deleteProductController = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    const existingProduct = await productModel.getProductById(id);
    if(!existingProduct){
        return next(new apiError(`this id ${id} not found`,404))
    }
    const result = await productModel.deleteProduct(id);
    res.status(200).send({
        success:true,
        message:`this product deleted successfully`,
        productId:id,
        result
    })
})
const updateProductQtyController = asyncHandler(async(req,res,next)=>{
  const {productId,newQuantity} = req.body;
  const product = await productModel.getProductById(productId)
  if(!product){
    return next(new apiError(`no product foun for this id ${productId}to change the quantity instead create new product`,404))
  }
  const newQtyProduct = await productModel.updateQty(productId,newQuantity)
  res.status(200).send({
    success:true,
    message:"the quantity updated successfully",
    product:newQtyProduct
  })

})
module.exports = {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  updateProductQtyController,
};
