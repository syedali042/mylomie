require("dotenv").config();
let app = require("./app.js");
let logger = require("./config/winston.js");

let db = require("./app/model/index");

// let db = require("./app/model/index");



let seedDB = require("./config/seeder.js");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");



let sequelize = require("./app/model/index.js").sequelize;


// let sequelize = require("./app/models/index.js").sequelize;

//Synchronize Database

// sequelize.authenticate()
// .then(async (data)=>{

//   console.log("Connected to Sequelize Database");

//   //Sync the Database
//   await sequelize.sync({force:false});
//   console.log("Database Sync Complete");
  

//   //Seed the Database
//   await seedDB();
//   console.log("Seeding Complete")

// }).catch((err)=>{

//   console.log("Error Connecting to Sequelize Database");

  //Seed the Database
  //await seedDB();
  //console.log("Seeding Complete")

//   //Seed the Database
//   await seedDB();
//   console.log("Seeding Complete")


// }).catch((err)=>{


//Updating  console.log("Error Connecting to Sequelize Database");

//   console.log("Error Connecting to Sequelize Database");


// })

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "MyLomie API",
      description: "MyLomie API Information",
      contact: {
        name: "MyLomie Backend Developer",
      },
      servers: [`http://localhost:${process.env.PORT}`],
    },
  },
  // ['.routes/*.js']
  apis: [
    "./app/routes/user.route.js", 
    "./app/routes/auth.route.js",
    // "./app/routes/seller.route.js",
    // "./app/routes/blog.route.js",
    // "./app/routes/lawyer/lawyer-service.route.js",
    // "./app/routes/lawyer/lawyer.route.js",
    // "./app/routes/photographer/photographer.route.js",
    // "./app/routes/photographer/photographer-service.route.js",
    // "./app/routes/virtualassistant/virtualassistant.route.js"
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(process.env.PORT, () => {
  logger.info(`Server started at : http://localhost:${process.env.PORT}`);
});
