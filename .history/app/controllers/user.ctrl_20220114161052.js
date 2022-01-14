const UserService = require("../services/user.svc.js");
const {validationResult} = require("express-validator");
const passValidation= require("../../config/passValidation.js");
const jwt_decode = require("jwt-decode");
const {getBearerTokenFromReq} = require('../../config/utils.js');
const passport = require("passport");
const dotenv = require("dotenv");
const strategy = require("passport-facebook");
const FacebookStrategy = strategy.Strategy;
dotenv.config();
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(
    new FacebookStrategy(
      {
        clientID: '298119752418244',
        clientSecret: '14070d63ee9260d228a50d56103b9dea',
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["email", "name"]
      },
      function(accessToken, refreshToken, profile, done) {
        const { email, first_name, last_name } = profile._json;
        const userData = {
          email,
          firstName: first_name,
          lastName: last_name
        };
        new userModel(userData).save();
        done(null, profile);
      }
    )
);








exports.registerNewUser = async (req,res)=>{
    //Checking Validations
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send({message:errors.array(),code:422});
    }
    //checking Password validation (Should be min 8 Chars, 1 uppercase and 1 lowercase letter, 1 digit, 1 special character)
    let validateMsg = passValidation.validate(req.body.password);
    if(validateMsg.length>0){
            return  res.status(422).send({message:validateMsg,code:422});
    }
    
    try
    {
        let User = await UserService.registerNewUser({...req.body});
        return res.status(201).send(User);
    }
    catch(err)
    {
        return res.status(err.code || 500).send({
            message:err.message || "Error while creating user" ,
            code: err.code || 500
            });
    }
}

//User Verification/Activation
exports.activateUser = async(req,res)=>{
    const activationToken = req.params.activationToken;
    try{
        let User = await UserService.activateUser(activationToken);
    
        return res.status(201).send(User);

    }catch(err)
    {
        return res.status(err.code || 500).send({message:err.message || "Error while actvating user" , code: err.code || 500});
    }
}


//Getting Users list from DB
exports.getUsersList = async (req,res)=>{
    try{
        let Users = await UserService.getUsersList();
    
        return res.status(201).send(Users);

    }catch(err)
    {
        return res.status(err.code || 500).send({message:err.message || "Error while getting users list" , code: err.code || 500});
    }
}

//Getting logged in User By token auth
exports.getUserProfile = async(req,res)=>{
    let token = getBearerTokenFromReq(req);
    var decode  = jwt_decode(token)
    const user_Id = decode.userId;
    try{
        let getUser = await UserService.getUserProfile(user_Id);
        return res.status(201).send(getUser);

    }catch(err)
    {
        return res.status(err.code || 500).send({message:err.message || "Error while getting user profile by id" , code: err.code || 500});
    }
}

//Updating user Details
exports.updateUserDetails = async (req,res)=>{
    let token = getBearerTokenFromReq(req);
    var decode  = jwt_decode(token)
    const user_Id = decode.userId;
    req.body.userId = user_Id;
    try{
        let User = await UserService.updateUserDetails({...req.body});
        return res.status(201).send(User);

    }catch(err)
    {
        return res.status(err.code || 500).send({message:err.message || "Error while updating user" , code: err.code || 500});
    }
}

//Delete User
exports.deleteUser = async (req,res)=>{
    try{
        let User = await UserService.deleteUser({...req.body});
        return res.status(201).send(User);

    }catch(err)
    {
        return res.status(err.code || 500).send({message:err.message || "Error while updating user" , code: err.code || 500});
    }
}