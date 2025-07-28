const { Router } = require("express")

const {protect,authorize} = require("../midlewares/authMiddleware");
const { getTotalOrdersController, getTotalRevenueController, getMonthlySalesController, getTopSellingProductController } = require("../controllers/dashboardController");


const router = Router({mergeParams:true});

router.get("/totalorders",protect,authorize("admin"),getTotalOrdersController)
router.get("/totalRevene",protect,authorize("admin"),getTotalRevenueController)
router.get("/monthlysales",protect,authorize("admin"),getMonthlySalesController)
router.get("/topselling",protect,authorize("admin"),getTopSellingProductController)



module.exports=router;