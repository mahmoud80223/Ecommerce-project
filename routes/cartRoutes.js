const { Router } = require("express")

const {protect,authorize} = require("../midlewares/authMiddleware")
const {addToCart, getUserCart, removeItemFromCartController, clearUserCartController} = require("../controllers/cartController");

const router = Router({mergeParams:true});

router.post("/",protect,addToCart)
router.get("/",protect,getUserCart)
router.delete("/:productId",protect,removeItemFromCartController)
router.delete("/",protect,clearUserCartController)



module.exports=router;