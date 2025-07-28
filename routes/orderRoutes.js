const { Router } = require("express")

const {protect,authorize} = require("../midlewares/authMiddleware");
const { createOrderFromCartController, updateOrderStatusController } = require("../controllers/orderControllers");


const router = Router({mergeParams:true});

router.post("/",protect,createOrderFromCartController)
router.put("/:orderId/status",protect,authorize("admin"),updateOrderStatusController)


module.exports=router;