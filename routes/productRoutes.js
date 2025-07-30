const { createProductController, getAllProductsController, getProductByIdController,updateProductController, deleteProductController, updateProductQtyController } = require("../controllers/productController");
const { createProductValidator ,getProductByIdValidator,updateProductValidator } = require("../midlewares/validators/productValidator")
const {protect, authorize} = require("../midlewares/authMiddleware")
const {Router} = require('express');


const router = Router();


router.post("/createproduct",createProductValidator,createProductController);
router.get("/getallproducts",protect,getAllProductsController)
router.get("/getproduct/:id",protect,getProductByIdValidator,getProductByIdController);
router.put("/updateproduct/:id",protect,authorize("admin","user"),updateProductValidator,updateProductController);
router.delete("/deleteproduct/:id",protect,authorize("admin"),deleteProductController)
router.put("/updatequantity",protect,authorize("admin"),updateProductQtyController)

module.exports = router;