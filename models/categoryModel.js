const config = require("../db/dbconfig");
const sql = require("mssql");

async function createCategory(name, slug, image) {
  try {
    let pool = await sql.connect(config);
    let category = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("in_slug", sql.NVarChar, slug)
      .input("in_image", sql.NVarChar, image).query(`
               insert into ecommerce.dbo.category(name,slug,image,createdAt,updatedAt)
               output inserted.*
                values(@name,@in_slug,@in_image,getdate(),getdate()) 
            `);
    return category.recordset[0];
  } catch (error) {
    console.log("error in create category", error);
    throw error;
  }
}

async function getCategory(page = 1, limit = 5) {
  //default values عشان لو اليوزر مبعتش
  try {
    const offset = (page - 1) * limit;
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("limit", sql.Int, limit)
      .input("offset", sql.Int, offset)
      .query(`
                select * from ecommerce.dbo.category
                order by id
                offset @offset rows fetch next @limit rows only
            
            `);
    return result.recordset;
  } catch (error) {
    console.log("Error in get categories");
    throw error;
  }
}

async function findById(id) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().input("in_id", sql.Int, id).query(`
             select * from category
             where id =@in_id
            `);
    return result.recordset[0];
  } catch (error) {
    console.log("Error in find by id", error);
    throw error;
  }
}
async function updateCategory(id, name, slug, image) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("in_id", sql.Int, id)
      .input("in_name", sql.NVarChar, name)
      .input("in_slug", sql.NVarChar, slug)
      .input("in_image", sql.NVarChar, image).query(`
            update category
            set name=@in_name,slug=@in_slug ,image=@in_image, updatedAt=getdate()
            output inserted.*
            where id=@in_id
            `);
    return result.recordset[0];
  } catch (error) {
    console.log("Error in update category", error);
    throw error;
  }
}
async function deleteCategory(id) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().input("in_id", sql.Int, id).query(`
            delete from category
            where id=@in_id
            `);
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return { success: true, message: "category deleted successfully" };
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error in delete category", error);
    throw error;
  }
}

module.exports = {
  createCategory,
  getCategory,
  findById,
  updateCategory,
  deleteCategory,
};
