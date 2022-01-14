let Router = require("express").Router();
const AuthCtrl = require("../controllers/auth.ctrl.js");
const {body,param} = require("express-validator");
const passport = require("passport");
let loginValidation = [body("email").notEmpty().isEmail(),body("password").notEmpty().isString()];


//Add Routes Here
Router.get("/protected", passport.authenticate('jwt', {session:false}), (req,res) =>{
    res.status(200).json({success:true, msg:"You are authorized"})
});

Router.post("/login", loginValidation  , AuthCtrl.login);

module.exports = Router;
