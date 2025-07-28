const orderModel = require("../models/orderModel")
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const apiError = require("../utils/apiError")
const asyncHandler = require("express-async-handler")



const createOrderFromCartController = asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;

    const cart = await cartModel.getCartByUserId(userId);
    if(!cart){
        return next(new apiError(`no cart found`,404))
    }

    const cartItems = await cartModel.getCartItemsWithDetails(cart.id)
    if(!cartItems){
        return next(new apiError(`cart is empty`,400))
    }
    //chech the available quantity
    for(const item of cartItems){
        const availableQty = await productModel.getProductQuantity(item.productId);
        if(item.quantity > availableQty){
            return next(new apiError(`Insuffitient stock for productId ${item.productId} : requested ${item.quantity} and availabe ${availableQty}`))
        }
    }

    const totalPrice = cartItems.reduce((acc,item)=> acc+=item.TotalPrice,0)

    //create order
    const orderId = await orderModel.createOrder(userId,totalPrice);

    //insert into cartItems
    for(let i=0;i<cartItems.length;i++){
        const item = cartItems[i]
        await orderModel.insertOrderItem(orderId,item.productId,item.quantity,item.price)

        await productModel.decreaseProductQuantity(item.productId,item.quantity)
    }
    // افراغ العربه
    await cartModel.clearUserCart(cart.id)
    
    res.status(200).send({
        message:"order created successfully",
        orderId,
        totalPrice
    })

})

const updateOrderStatusController = asyncHandler(async(req,res,next)=>{
    const {orderId} = req.params;
    const {status} = req.body;

    const validStatus = ['pending','processing','shipped','delivered','canceled']
    if(!validStatus.includes(status)){
        return next(new apiError(`Invalid status value`,400))
    }
    // خلي بالك انا برجع رقم اكبر من صفر 
    const update = await orderModel.updateStatus(orderId,status)
    if(!update){
        return next(new apiError(`order not foubd`,404))
    }

    res.status(200).send({
        success:true,
        message:"orders status updated"
    })

})
module.exports={
    createOrderFromCartController,
    updateOrderStatusController,
}