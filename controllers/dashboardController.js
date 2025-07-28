const dashboardModel = require("../models/dashboardModel");
const apiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

const getTotalOrdersController = asyncHandler(async(req,res,next)=>{
    const data = await dashboardModel.getTotalOrders();
    res.status(200).send({
        success:true,
        totalOrders:data.TotalOrders
    })
})


const getTotalRevenueController = asyncHandler(async(req,res,next)=>{
    const data = await dashboardModel.getTotalRevenue()
    res.status(200).send({
        success:true,
        totalRevenue:data.totalRevenue
    })
})
const getMonthlySalesController = asyncHandler(async(req,res,next)=>{
    const data = await dashboardModel.getMonthlySales()
    res.status(200).send({
        success:true,
        monthlySales:data
    })
})
const getTopSellingProductController = asyncHandler(async(req,res,next)=>{
    const data = await dashboardModel.getTopSellingProduct()
    res.status(200).send({
        success:true,
        monthlySales:data
    })
})







module.exports={
    getTotalOrdersController,
    getTotalRevenueController,
    getMonthlySalesController,
    getTopSellingProductController,

}