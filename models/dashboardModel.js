const sql = require("mssql");
const config = require("../db/dbconfig")


async function getTotalOrders() {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .query(`
            select count(*) as TotalOrders
            from orders
            `)
            return result.recordset[0];
    } catch (error) {
        console.log("Error in get Total orders",error);
        throw error
    }
}

async function getTotalRevenue() {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .query(`
           select sum(totalPrice) as totalRevenue
           from orders
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("Error in get Total Revenue",error);
        throw error;
    }
}

async function getMonthlySales() {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .query(`
           select   format(createdAt,'yyyy-MM')as month,
                    COUNT(*) as orderCount,
                    sum(totalPrice) as totalRevenue
                    from orders
                    group by format(createdAt,'yyyy-MM')
                    order by month desc
            `)
            return result.recordset;
    } catch (error) {
        console.log("Error in get monthly sales",error);
        throw error;
    }
}

async function getTopSellingProduct() {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .query(`
           select   oi.productId,
                    p.title,
                    sum(oi.quantity) as totalSold
                    from orderItems oi
                    join product p on oi.productId=p.id
                    group by oi.productId,p.title
                    order by totalSold desc
            `)
            return result.recordset;
    } catch (error) {
        console.log("Error in get Top selling product",error);
        throw error;
    }
}






module.exports = {
    getTotalOrders,
    getTotalRevenue,
    getMonthlySales,
    getTopSellingProduct,
}