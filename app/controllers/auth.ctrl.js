const AuthService = require("../services/auth.svc.js");
const {validationResult} = require("express-validator");

exports.auth = async (req,res)=>{
    
}

exports.login = async (req,res)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(422).send({message:errors.array(),code:422});
    }
    email = req.body.email;
    password = req.body.password;

    try
    {
        let User = await AuthService.login(email,password);

        //User Created Successfully
        return res.status(201).send(User);
    
    }
    catch(err)
    {
        return res.status(err.code || 500).send({message:err.message || "Error logging in user" , code: err.code || 500});
    }

}

//Forgot Password
exports.forgotPassword = async (req,res)=>{}