const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const branRoutes = require("./routes/brandRoutes")
const productRoutes = require('./routes/productRoutes')
const userRoutes = require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const apiError = require("./utils/apiError");
const globalError = require("./midlewares/errorMidleware");
dotenv.config({ path: "config.env" });

//express app
const app = express();

//midleware
//midleware to parse json body
app.use(express.json());
//midleware to parse url encoded body(form data)
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

app.use("/category", categoryRoutes);
app.use("/subCategory", subCategoryRoutes);
app.use("/brand",branRoutes );
app.use("/product",productRoutes)
app.use("/user",userRoutes)
app.use("/cart",cartRoutes)
app.use("/order",orderRoutes)
app.use("/dashboard",dashboardRoutes)

//for undefined routes
app.use((req, res, next) => {
  //create error and send it to error handling midleware
  // const err = new Error(`can not find this route ${req.originalUrl}`);
  // next(err);
  next(new apiError(`can not find this route ${req.originalUrl}`, 400));
});

//Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`app running ON PORT ${PORT}`);
});

// Promise.reject(new Error("اختبار unhandled rejection"));

//handle rejection outside express
//Events==>listen==>callback(err)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting down....");
    process.exit(1);
  });
});
