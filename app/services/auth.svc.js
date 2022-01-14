const db = require("../model/index.js");
const UserModel = db.User;
const jwt = require('jwt-encode');
const secret = 'secret';
const utils = require('../../config/utils.js');

exports.login = async (email, password) => {
    let query = {
        
        where:{
            email: email
        }
    }

    try
    {
        //finding user in database
        let User = await UserModel.findOne(query);
        if(!User)
        {    
            throw(
                {
                    message: "user not found",
                    code: 404
                }
            );
        }
        if(!User.isActive){
            throw(
                {
                    message: "Please activate your account through link sent in your email",
                    code: 404
                }
            );
        }
        //checking password
        const isValid =  utils.validPassword(password, User.password, User.salt);
        
        if(isValid)
        {
            const token = jwt(User, secret);
            return {success:true, User, token: token, expiresIn: token.expires};
        }else
        {
            return {success:false, msg: "Invalid Username/Password" };
        }
        
    }
    catch(err)
    {
        throw({
            message:err.message || "Server error while getting user by email",
            code:err.code || 500
        });
    }    
}
