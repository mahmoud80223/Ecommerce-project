const { registerController, loginController, updateUserController} = require("../controllers/userConrtoller");
const { registerValidator,loginValidator, updateUserValidator } = require("../midlewares/validators/userValidator")
const {protect,authorize} = require("../midlewares/authMiddleware")
const {Router} = require('express');


const router = Router();


router.post("/createuser",registerValidator,registerController)
router.post("/login",loginValidator,loginController)
router.put("/updateuser/:id",protect,updateUserValidator,updateUserController)


module.exports = router;