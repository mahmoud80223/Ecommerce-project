const sql = require("mssql");
const config = require("../db/dbconfig");

async function getCartByUserId(userId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_userId",sql.Int,userId)
        .query(`
                select * from carts
                where userId=@in_userId
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("Errror in get CartByUserId",error);
        throw error
    }
}
async function createCart(userId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_userId",sql.Int,userId)
        .query(`
            insert into carts(userId)
            output inserted.*
            values(@in_userId)
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("Error in creat cart",error);
        throw error;
    }
}
// برجع منتج واحد معين 
async function getCartItem(cartId,productId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_cartId",sql.Int,cartId)
        .input("in_productId",sql.Int,productId)
        .query(`
            select * from cartitems
            where cartId=@in_cartId and productId=@in_productId
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("Error in getCartItem",error);
        throw error;
    }
}
async function addCartItem(cartId,productId,quantity,price) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_cartId",sql.Int,cartId)
        .input("in_productId",sql.Int,productId)
        .input("in_quantity",sql.Int,quantity)
        .input("in_price",sql.Decimal(10,2),price)
        .query(`
            insert into cartitems(cartId,productId,quantity,price)
            output inserted.*
            values(@in_cartId,@in_productId,@in_quantity,@in_price)
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("Error in addCartItem",error);
        throw error;
    }
}

async function updateCartItemQuantity(id,quantity) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_id",sql.Int,id)
        .input("in_quantity",sql.Int,quantity)
        .query(`
            update cartitems
                set quantity=@in_quantity
                output inserted.*
                where id=@in_id
  `)
  return result.recordset[0]
    } catch (error) {
        console.log("Error in update Cart Item Quantity",error);
        throw error;
    }
}
async function getCartByUserId(userId) {
    try {
        let pool = await sql.connect(config)
        let result = await pool
        .request()
        .input("in_userId",sql.Int,userId)
        .query(`
            select * from carts
            where userId=@in_userId
            `)
            return result.recordset[0];
    } catch (error) {
        console.log("Error in get user cart",error);
        throw error;
    }
}
async function getCartItemsWithDetails(cartId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_cartId",sql.Int,cartId)
        .query(`
              select ci.cartId,
                ci.productId,
                ci.quantity,
                p.title,p.price,
                (p.price*ci.quantity) as TotalPrice
                from cartitems ci
                join product p on ci.productId=p.id
                where ci.cartId=@in_cartId
            `)
            return result.recordset;
    } catch (error) {
        console.log("Error in get cart items with details",error);
        throw error;
    }
}


async function removeItemFromCart(cartId,productId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_cartId",sql.Int,cartId)
        .input("in_productId",sql.Int,productId)
        .query(`
               delete from cartitems
               output deleted.*
               where cartId=@in_cartId and productId=@in_productId
   `)
   return result.recordset[0]
    } catch (error) {
        console.log("Error in remove item from cart",error);
        throw error;
    }
}
async function clearUserCart(cartId){
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_cartId",sql.Int,cartId)
        .query(`
             delete from cartitems
             output deleted.*
            where cartId=@in_cartId
            `)
            return result.rowsAffected[0]
    } catch (error) {
        console.log("Error in clear User Cart",error);
        throw error;
        
    }
}
module.exports = {
    getCartByUserId,
    createCart,
    getCartItem,
    addCartItem,
    updateCartItemQuantity,
    getCartByUserId,
    getCartItemsWithDetails,
    removeItemFromCart,
    clearUserCart,
    

}