const sql= require("mssql");

const config = {
    user: "userAdmin",
    password: "123",
    server: "localhost\\SQLEXPRESS",
    database: "ecommerce",
    port: 8000,
    options: {
      //trustedConnection: true,   // trustedConnection is not a valid option for the mssql package. Instead, use integratedSecurity if you're aiming for Windows Authentication, but since you've already provided user and password, you don't need trustedConnection at all.
      trustServerCertificate: true,
      enableArithAbort: true,
      encrypt: false,  // Change to true for Azure
    },

  };
  module.exports = config;
  