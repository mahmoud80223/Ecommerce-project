const { Router } = require("express");

const {  createBrandController,getBrandsController,getBrandController,updateBrandController,deleteBrandController} = require("../controllers/brandController");

const { createbrandValidator,getBrandValidator,updateBrandValidator,deleteBrandVAlidator} = require("../midlewares/validators/brandValidator");

const router = Router({mergeParams:true});

router.post("/createBrand",createbrandValidator,createBrandController);
router.get("/getBrands",getBrandsController);
router.get("/getBrand/:brandId",getBrandValidator,getBrandController);
router.put("/updateBrand/:brandId",updateBrandValidator,updateBrandController);
router.delete("/deleteBrand/:brandId",deleteBrandVAlidator,deleteBrandController);







module.exports = router;