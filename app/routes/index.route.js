let Router = require("express").Router();

//Add Routes Here

Router.use("/user", require("./user.route.js"));
Router.use("/auth", require("./auth.route.js"));


module.exports = Router;
