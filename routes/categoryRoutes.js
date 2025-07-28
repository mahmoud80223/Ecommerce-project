const { Router } = require("express");

const { createCategoryController,getCategoryController,getCategory,updateCategoryController,deleteCategoryController} = require("../controllers/categoryControllers");

const { createCategoryValidator,updateCategoryValidator,deleteCAtegoryValidator,getCategoryValidator} = require("../midlewares/validators/categoryValidator");

const subCategoryRoutes = require('./subCategoryRoutes')
const router = Router();

router.post("/createCategory",createCategoryValidator,createCategoryController);
router.get("/getCategories",getCategoryController);
router.get("/getCategory/:id",getCategoryValidator,getCategory);
router.put("/updateCategory/:id",updateCategoryValidator,updateCategoryController);
router.delete("/deleteCategory/:id",deleteCAtegoryValidator,deleteCategoryController);

router.use("/:categoryId/subCategories",subCategoryRoutes)





module.exports = router;