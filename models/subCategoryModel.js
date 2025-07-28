const config = require("../db/dbconfig");
const sql = require("mssql");

async function createSubCategory(name, slug, categoryId) {
  try {
    let pool = await sql.connect(config);
    let subCategory = await pool
      .request()
      .input("in_name", sql.NVarChar, name)
      .input("in_slug", sql.NVarChar, slug)
      .input("in_categoryId", sql.Int, categoryId).query(`
              insert into [ecommerce].[dbo].[subcategory](name,slug,categoryId,createAt,updateAt)
               output inserted.*
              values(@in_name,@in_slug,@in_categoryId,getdate(),getdate())
            `);
    return subCategory.recordset[0];
  } catch (error) {
    console.log("error in create subcategory", error);
    throw error;
  }
}

async function getSubCatByName(name) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().input("in_name", sql.NVarChar, name)
      .query(`
    select * from subcategory where name=@in_name
    `);
    return result.recordset[0];
  } catch (error) {
    console.log("Error in get Sub category by name", error);
    throw error;
  }
}

async function getCatByID(id) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().input("in_id", sql.Int, id).query(`
      select * from category where id =@in_id
      `);
    return result.recordset[0];
  } catch (error) {
    console.log("error in get sub category by id", error);
    throw error;
  }
}
async function getSubCategory(id) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().input("id", sql.Int, id).query(`
      select * from subcategory
      where id=@id
      `);
    return result.recordset[0];
  } catch (error) {
    console.log("error in get sub category", error);
    throw error;
  }
}

async function getSubCategories(page = 1, limit = 5) {
  try {
    const offset = (page - 1) * limit;
    let pool = await sql.connect(config);
    let result = await pool
      .request()

      .input("offset", sql.Int, offset)
      .query(`
         select s.id,s.name,s.slug,s.createAt,s.updateAt,c.name  as categoryName
              from subcategory s
              join category c on s.categoryId=c.id
              order by s.id
              offset ${offset} rows fetch next ${limit} rows only     
      `);
    return result.recordset;
  } catch (error) {
    console.log("error in get all  subcategories", error);
    throw error;
  }
}

async function updateSubCategory(id, name, slug, categoryId) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("in_id", sql.Int, id)
      .input("in_name", sql.NVarChar, name)
      .input("in_slug", sql.NVarChar, slug)
      .input("in_categoryId", sql.Int, categoryId).query(`
            update subcategory
                    set name=@in_name,
                        slug=@in_slug,
                        categoryId=@in_categoryId,
                        updateAt=GETDATE()
                        output inserted.*
                    where id=@in_id
            `);
    return result.recordset[0];
  } catch (error) {
    console.log("Error in update su category", error);
    throw error;
  }
}
async function deleteSubCategory(id) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("in_id", sql.Int, id)
    .query(`
      delete from subcategory
      where id=@in_id
      `)
      if(result.rowsAffected && result.rowsAffected[0]>0){
        return {
          success:true,
          message:"sub category deleted successfully"
        }
      }
      else return null

  } catch (error) {
    console.log("Error in delete sub category",error);
    throw error;
    
  }
}
// async function getAllSubCatByCatId(categoryId) {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//     .request()
//     .input("in_CatId",sql.Int,categoryId)
//     .query(`
//         select * 
//         from subcategory
//         where categoryId=@in_CatId
//         order by id
//       `)
//       return result.recordset;

//   } catch (error) {
//     console.log("Error in getAllSubCatByCatId",error);
//     throw error
//   }
  
// }
async function getAllSubCatByCatId(categoryId,name) {
  try {
    let pool = await sql.connect(config);
    let request = pool
    .request()
    .input("in_CatId",sql.Int,categoryId);

    let query = `
        select s.id,s.name,s.slug,s.categoryId,c.name as CategoryName,s.createAt,s.updateAt
        from subcategory s
        join category c on s.categoryId=c.id
        where categoryId=@in_CatId
      `
      if(name){
        query+=`and s.name like '%'+@in_name + '%'`;
        request.input("in_name",sql.NVarChar,name)
      }
      query+=`order by id`
      let result = await request.query(query);
      return result.recordset;

  } catch (error) {
    console.log("Error in getAllSubCatByCatId",error);
    throw error
  }
  
}
module.exports = {
  createSubCategory,
  getSubCatByName,
  getCatByID,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCatByCatId,
  
};
