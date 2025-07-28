const config = require("../db/dbconfig");
const sql = require("mssql");

async function createBrand(name, slug,image) {
  try {
    let pool = await sql.connect(config);
    let brand = await pool
      .request()
      .input("in_name", sql.NVarChar, name)
      .input("in_slug", sql.NVarChar, slug)
      .input("in_image", sql.NVarChar, image)
      .query(`
              insert into [ecommerce].[dbo].[brands](name,slug,image,createdAt,updatedAt)
               output inserted.*
              values(@in_name,@in_slug,@in_image,getdate(),getdate())
            `);
    return brand.recordset[0];
  } catch (error) {
    console.log("error in create brand", error);
    throw error;
  }
}

async function getBrandByName(name) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
    .request()
    .input("in_name", sql.NVarChar, name)
    .query(`
    select * from brands where name=@in_name
    `);
    return result.recordset[0];
  } catch (error) {
    console.log("Error in get brand by name", error);
    throw error;
  }
}

async function getBrandById(brandId) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
    .request()
    .input("in_brandId", sql.Int,brandId)
    .query(`
        select * 
        from brands
        where brandId =@in_brandId
      `);
    return result.recordset[0];
  } catch (error) {
    console.log("error in get brand by id", error);
    throw error;
  }
}

async function getBrands(page = 1, limit = 5) {
  try {
    const offset = (page - 1) * limit;
    let pool = await sql.connect(config);
    let result = await pool
      .request()

      .input("offset", sql.Int, offset)
      .query(`
         select * 
         from brands   
         order by brandId
         offset ${offset} rows fetch next ${limit} rows only 

      `);
    return result.recordset;
  } catch (error) {
    console.log("error in get all brands", error);
    throw error;
  }
}

async function updateBrand(brandId, name, slug, image) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("in_brandId", sql.Int,brandId)
      .input("in_name", sql.NVarChar, name)
      .input("in_slug", sql.NVarChar, slug)
      .input("in_image", sql.NVarChar, image)
      .query(`
            update brands
                    set name=@in_name,
                        slug=@in_slug,
                        image=@in_image,
                        updatedAt=GETDATE()
                        output inserted.*
                    where brandId=@in_brandId
            `);
    return result.recordset[0];
  } catch (error) {
    console.log("Error in update brand", error);
    throw error;
  }
}
async function deleteBrand(brandId) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
    .request()
    .input("in_brandId", sql.Int, brandId)
    .query(`
      delete from brands
      where brandId=@in_brandId
      `)
      if(result.rowsAffected && result.rowsAffected[0]>0){
        return {
          success:true,
          message:"brand deleted successfully"
        }
      }
      else return null

  } catch (error) {
    console.log("Error in delete brand",error);
    throw error;
    
  }
}

module.exports = {
  createBrand,
  getBrandByName,
  getBrandById,
  getBrands,
  updateBrand,
  deleteBrand,
};
