let Router = require("express").Router();
const userCtrl = require("../controllers/user.ctrl.js");
const {body,param} = require("express-validator");
const utils= require('../../config/utils.js');

//Registration Fields Validations
let registerValidation = [body("name").notEmpty().isString(),
body("email").notEmpty().isEmail(),body("phoneNumber").notEmpty().isString(),body("password").notEmpty().isString()];

Router.post("/register", registerValidation  , userCtrl.registerNewUser);

Router.get("/verification/:activationToken", userCtrl.activateUser);

Router.post("/userlist", userCtrl.getUsersList);

Router.post("/profile", userCtrl.getUserProfile);

Router.post("/updateuserdetails", userCtrl.updateUserDetails);

Router.post("/deleteuser",  userCtrl.deleteUser);

module.exports = Router;
