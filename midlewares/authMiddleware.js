const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  //بتحقق من التوكن في الهيدر
  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith("bearer")
  ) {
    try {
      //استخراج التوكن
      token = req.headers.authorization.split(" ")[1];
      // فك التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);
      if (!user) {
        return next(new apiError(`user not found`, 404));
      }
      req.user = user; // تخزين اليوزر في الريكويست
      next();
    } catch (error) {
        return next(new apiError(`invalid or expired token`,401))
    }
  } else {
    return next(new apiError(`no token provided`, 401));
  }
});

const authorize = (...roles) =>
   asyncHandler(async(req,res,next)=>{
    //لو مفيش يوزر يعني لو نسيت تستخدم التوكن 
    if(!req.user){
      return next(new apiError(`you are not logged in`,401))
    }
    // لو الدور مش من ضمن المسموحين لهم
    if(!roles.includes(req.user.role)){
      return next(new apiError(`Access denied forr role '${req.user.role}' on this route`,403))
    }
    next(); // عدي التحقق بنجاح
}
)
module.exports = { protect ,authorize};
