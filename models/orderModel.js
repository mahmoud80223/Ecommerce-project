const sql = require("mssql");
const config = require("../db/dbconfig")

async function createOrder(userId,totalPrice) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_userId",sql.Int,userId)
        .input("in_totalPrice",sql.Decimal(10,2),totalPrice)
        .query(`
             insert into orders(userId,totalPrice)
             output inserted.id
            values(@in_userId,@in_totalPrice)
            `)
            return result.recordset[0].id
    } catch (error) {
        console.log("Error in create order",error);
        throw error;
        
    }
}
async function insertOrderItem(orderId,productId,quantity,price) {
    try {
        let pool = await sql.connect(config)
        let result = await pool
        .request()
        .input("in_orderId",sql.Int,orderId)
        .input("in_productId",sql.Int,productId)
        .input("in_quantity",sql.Int,quantity)
        .input("in_price",sql.Decimal(10,2),price)
        .query(`
             insert into orderItems(orderId,productId,quantity,price)
            values(@in_orderId,@in_productId,@in_quantity,@in_price)
            `)
    } catch (error) {
        
    }
    
}


async function updateStatus(orderId,status) {
    try {
        let pool = await sql.connect(config)
        let result = await pool
        .request()
        .input("in_orderId",sql.Int,orderId)
        .input("in_status",sql.NVarChar(50),status)
        .query(`
            update orders
               set status=@in_status
               where id=@in_orderId
            `)
            return result.rowsAffected[0]>0
    } catch (error) {
        console.log("Error in update order status",error);
        throw error;
    }
}


async function markOrderAsPaid(orderId) {
  try {
    let pool = await sql.connect(config);
    return await pool
      .request()
      .input("in_orderId", sql.Int, orderId)
      .query(`
        UPDATE orders
        SET status = 'paid'
        WHERE id = @in_orderId
      `);
  } catch (error) {
    throw error
  }
}
async function getPendingOrderByUserId(userId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_userId",sql.Int,userId)
        .query(`
            SELECT TOP 1 * FROM orders
        where userId=@in_userId AND status='pending'
        order by createdAt DESC
            `)
            return result.recordset[0]
    } catch (error) {
        throw error
    }
    
}
module.exports={
    createOrder,
    insertOrderItem,
    updateStatus,
    markOrderAsPaid,
    getPendingOrderByUserId,
}