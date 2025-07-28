const config = require('../db/dbconfig');
const sql = require('mssql');

async function createUser(name,email,password,phone,address){
    try {
        let pool = await sql.connect(config);
        let user = await pool
        .request()
        .input("in_name",sql.NVarChar,name)
        .input("in_email",sql.NVarChar,email)
        .input("in_password",sql.NVarChar,password)
        .input("in_phone",sql.NVarChar,phone)
        .input("in_address",sql.NVarChar,address)
        .query(`
                insert into users(name,email,password,phone,address)
                output inserted.*
                 values(@in_name,@in_email,@in_password,@in_phone,@in_address)  
            `)
            return user.recordset[0]
    } catch (error) {
        console.log("Error in create user",error);
        throw error;
        
    }
}
async function findByEmail(email) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_email",sql.NVarChar,email)
        .query(`
            select * from users
            where email=@in_email
            `)
            return result.recordset[0];
    } catch (error) {
        console.log("Error in find by email",error);
        throw error;
    }
}
async function findById(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_id",sql.Int,id)
        .query(`
            select * from users
            where id=@in_id
            `)
            return result.recordset[0];
    } catch (error) {
        console.log("Error in find by id",error);
        throw error;
    }
}
async function updateUser(id,name,email,phone,address){
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_id",sql.Int,id)
        .input("in_name",sql.NVarChar,name)
        .input("in_email",sql.NVarChar,email)
        .input("in_phone",sql.NVarChar,phone)
        .input("in_address",sql.NVarChar,address)
        .query(`
            update users
                set name=@in_name,email=@in_email,phone=@in_phone,address=@in_address
                output inserted.*
                where id=12
`)
return result.recordset[0]
    } catch (error) {
        console.log("Error in update user",error);
        throw error;
    }
}


module.exports = { createUser,
                 findByEmail,
                 findById,
                 updateUser,

}