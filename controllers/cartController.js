const cartModel = require("../models/cartModel")
const asyncHandler = require("express-async-handler")
const apiError = require("../utils/apiError")
const productModel = require("../models/productModel")

const addToCart = asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;  // هيجي من التوكن ام يعمل تسجيل دخول
    const {productId,quantity} = req.body;

    const product = await productModel.getProductById(productId)
    if(!product){
        return next(new apiError(`no product found`,404))
    }

    let cart = await cartModel.getCartByUserId(userId);
    if(!cart){
        cart = await cartModel.createCart(userId)
    }
    const existingItem = await cartModel.getCartItem(cart.id,productId)
    if(existingItem){
        const newQuantity = existingItem.quantity + quantity;
        // بتحقق من المخزون
        if(newQuantity >product.quantity){
            return next(new apiError(`Not enough stock available:${product.quantity} and requested ${newQuantity}`,400))
        }
        await cartModel.updateCartItemQuantity(existingItem.id,newQuantity)
    }else{
        if(quantity >product.quantity){
            return next(new apiError(`Not enough stock available:${product.quantity} and requested ${quantity}`,400))
        }
        
        await cartModel.addCartItem(cart.id,productId,quantity,product.price)
    }
    res.status(201).send({
        success:true,
        message:"product added to cart",
    })

})
const getUserCart = asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;
    const cart = await cartModel.getCartByUserId(userId);
    if(!cart){
        return res.status(200).send({
            message:"cart is Empty",
            cartItems:[],
            cartTotal:0
        })
    }
    const cartItems = await cartModel.getCartItemsWithDetails(cart.id);

    const cartTotal = cartItems.reduce((acc,item)=>acc+item.TotalPrice,0);
    res.status(200).json({
        cartId:cart.id,
        userId:cart.userId,
        cartItems,
        cartTotal,
    })
 
})

const removeItemFromCartController = asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;
    const {productId} =req.params;

    const cart = await cartModel.getCartByUserId(userId);
    if(!cart){
        return next(new apiError(`not found cart`,404))
    }
    const removedProduct = await cartModel.removeItemFromCart(cart.id,productId);
    res.status(200).send({
        message:"product removed from cart successfully",
        removedProduct,

    })

})

const clearUserCartController = asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;
    const cart = await cartModel.getCartByUserId(userId)
    if(!cart){
        return next(new apiError(`cart is already empty`,200))
    }
    const result = await cartModel.clearUserCart(cart.id)
    res.status(200).send({
        message:"cart cleared successfully",
        deletedItems:result
    })
})

module.exports = {
    addToCart,
    getUserCart,
    removeItemFromCartController,
    clearUserCartController,
}