const { Router } = require("express");

const { createSubCategoryController, getSubCategoriesController, getSubCAtegoryController, updateSubCategoryController, deleteSubCategoryController, getAllSubCatByCatIdController } = require("../controllers/subCategoryControllers");

const { createSubCategoryValidator , getSubCategoryValidator , updateSubCAtegoryValidator, deleteSubCategoryVAlidator,getSubCategoriesByCatIdValidator} = require("../midlewares/validators/subCategoryValidator");

const router = Router({mergeParams:true});

router.post("/createSubCategory",createSubCategoryValidator,createSubCategoryController);
router.get("/getSubCategories",getSubCategoriesController);
router.get("/getSubCategoy/:id",getSubCategoryValidator,getSubCAtegoryController);
router.put("/updateSubCategoy/:id",updateSubCAtegoryValidator,updateSubCategoryController);
router.delete("/deleteSubCategoy/:id",deleteSubCategoryVAlidator,deleteSubCategoryController);
// router.get("/getSubCategories/:categoryId",getSubCategoriesByCatIdValidator,getAllSubCatByCatIdController);
// nested route
router.get("/",getSubCategoriesByCatIdValidator,getAllSubCatByCatIdController);
router.post("/",createSubCategoryValidator,createSubCategoryController)






module.exports = router;