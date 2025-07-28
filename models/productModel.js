const config = require('../db/dbconfig')
const sql = require('mssql')

async function createProduct(productData){
    try {
        let pool = await sql.connect(config);
            const { title,slug,description,quantity,sold,price
                ,priceAfterDiscount,imageCover,categoryId,brandId,ratingAverage } = productData;
        let result = await pool
        .request()
        .input("in_title",sql.NVarChar,title)
        .input("in_slug",sql.NVarChar,slug)
        .input("in_desc",sql.NVarChar,description)
        .input("in_quantity",sql.Int,quantity)
        .input("in_sold",sql.Int,sold  ||  0)  
        .input("in_price",sql.Float,price)
        .input("in_priceAfterDiscount",sql.Float,priceAfterDiscount)
        .input("in_imageCover",sql.NVarChar,imageCover)
        .input("in_categoryId",sql.Int,categoryId)
        .input("in_brandId",sql.Int,brandId)
        .input("in_ratingAverage",sql.Float,ratingAverage)
        .query(`
            insert into product(title,slug,description,quantity,sold,price
            ,priceAfterDiscount,imageCover,categoryId,brandId,ratingAverage)
            output inserted.id
            values(@in_title,@in_slug,@in_desc,@in_quantity,@in_sold,@in_price,@in_priceAfterDiscount,@in_imageCover,@in_categoryId,@in_brandId,@in_ratingAverage)
            `)
            return result.recordset;
    } catch (error) {
        console.log('Errror in create product model',error);
        throw error; 
    }
}
async function createProductColor(productId,color){
    try {
        let pool = await sql.connect(config);
                   await pool
        .request()
        .input("in_productId",sql.Int,productId)
        .input("in_color",sql.NVarChar,color)
        .query(`
          insert into product_colors(productId,color)
          values(@in_productId,@in_color)
            `)
    } catch (error) {
        console.log("Error in create product model",error);
        throw error;
        
    }
}

async function createProductImage(productId,image) {
    try {
        let pool = await sql.connect(config);
                   await pool
        .request()
        .input("in_productId",sql.Int,productId)
        .input("in_image",sql.NVarChar,image)
        .query(`
                insert into product_images(productId,image)
                values(@in_productId,@in_image)
            `)
    } catch (error) {
        console.log("Error in create product image model",error);
        throw error
    }
    
}

async function createProductSubCategory(productId,subCategoryId){
    try {
         let pool = await sql.connect(config);
                  await pool
         .request()
         .input("in_productId",sql.Int,productId)
         .input("in_subCategoryId",sql.Int,subCategoryId)
         .query(`
             insert into product_subcategory(productId,subCategoryId)
             values(@in_productId,@in_subCategoryId)
            `)
    } catch (error) {
        console.log("Error in create product sub category model",error);
        throw error;
        
    }
}



async function getProductByTitle(title){
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_title",sql.NVarChar,title)
        .query(`
                select * from product
                where title =@in_title
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("error in get product by title",error);
        throw error;
        
    }
}

async function getAllProducts(page=1,limit=5,title,minPrice,maxPrice,ratingAverage,sortBy,search){
    try {
        const offset = (page-1)*limit;
        let pool = await sql.connect(config);
        let request = pool
        .request()
        .input("limit",sql.Int,limit)
        .input("offset",sql.Int,offset)
        
            let hasWhere = false;
            let whereClause = "";
            if(title){
                whereClause+=hasWhere ?` and p.title COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @in_title `
                                :` where p.title COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @in_title `
                request.input("in_title",sql.NVarChar,`%${title}%`)
                hasWhere=true;
            }
            if(minPrice){
                whereClause+= hasWhere ?` and price>=@in_minPrice ` : ` where price>=@in_minPrice `
                request.input("in_minPrice",sql.Float,minPrice)
                hasWhere=true;
            }
            if(maxPrice){
                whereClause+= hasWhere ? ` and price<@in_maxPrice` : ` where price<@in_maxPrice `
                request.input("in_maxPrice",sql.Float,maxPrice)
                hasWhere=true;
                       }
            if(ratingAverage){
                whereClause+= hasWhere ?` and ratingAverage<=@in_ratingAverage `
                                 :` where ratingAverage<=@in_ratingAverage `
                                 request.input("in_ratingAverage",sql.Float,ratingAverage)
                                 hasWhere=true;
                            }
            if(search){
                const searchValue = `%${search}%`;
                whereClause+= hasWhere ? ` and( p.title like @search OR p.description like @search ) `
                                 :`  where( p.title like @search OR p.description like @search ) `
                                 request.input("search",sql.NVarChar,searchValue)
                                 hasWhere = true
            }
            const countQuery = `select count(*) as totalCount from product p ${whereClause} `
            const countResult = await request.query(countQuery);
            const totalCount = countResult.recordset[0]?.totalCount || 0;
            const totalPages = Math.ceil(totalCount/limit);
            // data query
            let orderBy = "p.id"
            switch(sortBy){
                case "price-desc":
                    orderBy=" p.price desc ";
                    break;
                case "price-asc":
                    orderBy=" p.price asc ";
                    break;
                case "sold-desc":
                    orderBy=" p.sold desc ";
                    break;
                case "sold-asc":
                    orderBy="p.sold asc";
                    break;
                case "sold-desc,price-desc":
                    orderBy=" p.sold desc , p.price desc ";
                    break;
                case "sold-desc,price-asc":
                    orderBy=" p.sold desc , p.price asc ";
                    break;
                case "sold-asc,price-desc":
                    orderBy=" p.sold asc , p.price desc ";
                    break;
                case "sold-asc,price-asc":
                    orderBy=" p.sold asc , p.price asc ";
                    break;
                default:
                    orderBy="p.id"    
            }
            const dataQuery = (`
              select   
                     p.id,p.title,p.slug,p.description,p.quantity,p.sold,p.price,p.priceAfterDiscount,p.imageCover,p.ratingAverage,p.createAt,
                     b.name as BrandName,
                     c.name as CategoryName
                     from product p
                     join category c on p.categoryId=c.id
                     join Brands b on b.brandId=p.brandId
                     ${whereClause}
                     order by ${orderBy}
                     offset @offset rows fetch next @limit rows only 
            `)
            let result = await request.query(dataQuery)
            return {
                totalCount,
                totalPages,
                currentPage:page,
                data : result.recordset || [],
            }
    } catch (error) {
        console.log("Error in get all prodyct model",error);
        throw error;
        
    }
}
// async function getAllProducts(page=1,limit=5,title,minPrice,maxPrice,ratingAverage,sortBy,search){
//     try {
//         const offset = (page-1)*limit;
//         let pool = await sql.connect(config);
//         let request = pool
//         .request()
//         .input("limit",sql.Int,limit)
//         .input("offset",sql.Int,offset)
//         let query = (`
//               select   
//                      p.id,p.title,p.slug,p.description,p.quantity,p.sold,p.price,p.priceAfterDiscount,p.imageCover,p.ratingAverage,p.createAt,
//                      b.name as BrandName,
//                      c.name as CategoryName
//                      from product p
//                      join category c on p.categoryId=c.id
//                      join Brands b on b.brandId=p.brandId
//             `)
//             let hasWhere = false;
//             if(title){
//                 query+=hasWhere ?` and p.title COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @in_title `
//                                 :` where p.title COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @in_title `
//                 request.input("in_title",sql.NVarChar,`%${title}%`)
//                 hasWhere=true;
//             }
//             if(minPrice){
//                 query+= hasWhere ?` and price>=@in_minPrice ` : ` where price>=@in_minPrice `
//                 request.input("in_minPrice",sql.Float,minPrice)
//                 hasWhere=true;
//             }
//             if(maxPrice){
//                 query+= hasWhere ? ` and price<@in_maxPrice` : ` where price<@in_maxPrice `
//                 request.input("in_maxPrice",sql.Float,maxPrice)
//                 hasWhere=true;
//                        }
//             if(ratingAverage){
//                 query+= hasWhere ?` and ratingAverage<=@in_ratingAverage `
//                                  :` where ratingAverage<=@in_ratingAverage `
//                                  request.input("in_ratingAverage",sql.Float,ratingAverage)
//                                  hasWhere=true;
//                             }
//             if(search){
//                 const searchValue = `%${search}%`;
//                 query+= hasWhere ? ` and( p.title like @search OR p.description like @search ) `
//                                  :`  where( p.title like @search OR p.description like @search ) `
//                                  request.input("search",sql.NVarChar,searchValue)
//                                  hasWhere = true
//             }
//             let orderBy = "p.id"
//             switch(sortBy){
//                 case "price-desc":
//                     orderBy=" p.price desc ";
//                     break;
//                 case "price-asc":
//                     orderBy=" p.price asc ";
//                     break;
//                 case "sold-desc":
//                     orderBy=" p.sold desc ";
//                     break;
//                 case "sold-asc":
//                     orderBy="p.sold asc";
//                     break;
//                 case "sold-desc,price-desc":
//                     orderBy=" p.sold desc , p.price desc ";
//                     break;
//                 case "sold-desc,price-asc":
//                     orderBy=" p.sold desc , p.price asc ";
//                     break;
//                 case "sold-asc,price-desc":
//                     orderBy=" p.sold asc , p.price desc ";
//                     break;
//                 case "sold-asc,price-asc":
//                     orderBy=" p.sold asc , p.price asc ";
//                     break;
//                 default:
//                     orderBy="p.id"    
//             }
//             query+=` 
//             order by ${orderBy}
//             offset @offset rows fetch next @limit rows only 
//             `
//             let result = await request.query(query)
//             return result.recordset || null
//     } catch (error) {
//         console.log("Error in get all prodyct model",error);
//         throw error;
        
//     }
// }
async function getProductById(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_id",sql.Int,id)
        .query(`
            select * from product 
            
            where id=@in_id
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("error in get product by id",error);
        throw error;
        
    }
    
}
async function updateProduct(id,title,slug,description,quantity,sold,price,priceAfterDiscount,imageCover,categoryId,brandId,ratingAverage){
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_id",sql.Int,id)
        .input("in_title",sql.NVarChar,title)
        .input("in_slug",sql.NVarChar,slug)
        .input("in_description",sql.NVarChar,description)
        .input("in_quantity",sql.Int,quantity )
        .input("in_sold",sql.Int,sold)
        .input("in_price",sql.Float,price)
        .input("in_priceAfterDiscount",sql.Float,priceAfterDiscount)
        .input("in_imageCover",sql.NVarChar,imageCover)
        .input("in_categoryId",sql.Int,categoryId)
        .input("in_brandId",sql.Int,brandId)
        .input("in_ratingAverage",sql.Float,ratingAverage)
        .query(`
            update product
                set 
                title=@in_title,slug=@in_slug,description=@in_description,quantity=@in_quantity,
                sold=@in_sold,price=@in_price,priceAfterDiscount=@in_priceAfterDiscount,
                imageCover=@in_imageCover,categoryId=@in_categoryId,brandId=@in_brandId,
                ratingAverage=@in_ratingAverage,updateAt=getdate()
                output inserted.*
                where id=@in_id
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("error in update product",error);
        throw error;
    }
}
async function deleteColors(productId) {
    try {
        let pool = await sql.connect(config);
                   await pool
        .request()
        .input("productId",sql.Int,productId)
        .query(`
              delete from product_colors 
                where productId=@productId
            `)
    } catch (error) {
        console.log("Error in delete colors",error);
        throw error
    }
}
async function deleteImages(productId) {
    try {
        let pool = await sql.connect(config);
                   await pool
        .request()
        .input("productId",sql.Int,productId)
        .query(`
              delete from product_images 
                where productId=@productId
            `)
    } catch (error) {
        console.log("Error in delete images",error);
        throw error
    }
}
async function deleteSubCategories(productId) {
    try {
        let pool = await sql.connect(config);
                   await pool
        .request()
        .input("productId",sql.Int,productId)
        .query(`
              delete from product_subcategory 
                where productId=@productId
            `)
    } catch (error) {
        console.log("Error in delete sub categories",error);
        throw error
    }
}
async function deleteProduct(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_id",sql.Int,id)
        .query(`
              delete from product
              output deleted.*
               where id=@in_id
            `)
            return result.recordset;
    } catch (error) {
        console.log("Error in delete product",error);
        throw error;
        
    }
    
}

async function getProductQuantity(productId) {
    try {
        let pool = await sql.connect(config);
        let result = await pool
        .request()
        .input("in_productId",sql.Int,productId)
        .query(`
                select quantity
                from product 
                where id=@in_productId
            `)
            return result.recordset[0]
    } catch (error) {
        console.log("Errror in get product quantity",error);
        throw error;
    }
}

async function decreaseProductQuantity(productId,quantity) {
    try {
        let pool = await sql.connect(config)
        let result = await pool
        .request()
        .input("in_productId",sql.Int,productId)
        .input("in_quantity",sql.Int,quantity)
        .query(`
            update product
            set quantity = quantity - @in_quantity
            where id = @in_productId
            `)
    } catch (error) {
        console.log("Error in decrease product quantity",error);
        throw error;
    }
}
module.exports = {
    createProduct,
    createProductColor,
    createProductImage,
    createProductSubCategory,
    getProductByTitle,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteColors,
    deleteImages,
    deleteSubCategories,
    deleteProduct,
    getProductQuantity,
    decreaseProductQuantity,
    

    


}