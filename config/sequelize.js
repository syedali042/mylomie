const {Sequelize} = require("sequelize");

require("dotenv").config();

const {NODE_ENV} = process.env;

let config = undefined;

if(NODE_ENV === "development")
{
    config = require("./config.json").development
}
else if(NODE_ENV === "production")
{
    config = require("./config.json").production;
}
else if(NODE_ENV === "test")
{
    config = require("./config.json").test;
}



const {username,password,host,database,dialect} = config; // Get Database Configuration from config.js

module.exports = new Sequelize({username,password,host,database,dialect}); //Create and return sequelize object