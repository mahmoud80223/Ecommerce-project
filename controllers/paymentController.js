const asyncHandler = require("express-async-handler");
const stripe = require("../db/stripe");
const orderModel = require("../models/orderModel");
const apiError = require("../utils/apiError")


const createPaymentIntent = asyncHandler(async (req, res,next) => {
  const currency="usd"
  const userId = req.user.id;

  const order = await orderModel.getPendingOrderByUserId(userId)
  if(!order){
    return next(new apiError(`no pending order found`,404))
  }
  console.log("order total price ",order.totalPrice);
  
  if(order.totalPrice <0.5){
    return next(new apiError(`total price must be at least 0.5$ to createv a payment `,400))
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.totalPrice * 100, // convert to cents
    currency,
    payment_method_types: ["card"],
    metadata: { orderId: order.id.toString() },
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});


module.exports={
    createPaymentIntent,
    

}