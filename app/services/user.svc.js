const { v4: uuidv4 } = require('uuid');
const db = require("../model/index.js");
const UserModel = db.User;
const utils = require('../../config/utils.js');
const {sendMail} = require("./email.svc.js");
const emailTemplate =require("../templates/emailtemplate.js");

exports.registerNewUser = async (user) => {
    let query = {
        where:{email:user.email}
    }
    try
    {
        const searchUser = await UserModel.findOne(query);
        if(searchUser )
        {    
            throw(
                {
                    message: "User already exist with this email",
                    code: 404
                }
            );
        }
        const saltHash = utils.genPassword(user.password);
        const salt = saltHash.salt;
        const hashpassword = saltHash.hashpassword;

        const User = {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role.toLowerCase(),
            password: hashpassword,
            salt: salt,
            profilePicture: user.profilePicture
        }
        //new user creation
        const newUser= await UserModel.create(User); 
        //Generating activation link for user email confirmation
        let activationLink = newUser.generateActivationLink();
        await newUser.save();        
        //Send Email
        // let verificationEmailTemplate = await emailTemplate.getUserActivationTemplate(newUser.name, process.env.Web_URL+"/user/verification/"+activationLink);
        // await sendMail("MyLomie Support", process.env.email_sender, newUser.email, "Account verification" ,  verificationEmailTemplate);
        
        return {status:"success", msg:"Registration successfull"};


    }
    catch(err)
    {
        throw({
            message:err.message || "Server error while creating user",
            code:err.code || 500
        });

        
    }
}
// User Verification/Activation
exports.activateUser= async (token) => {
    let query = {
        where:{activationLink: token}
    }
    try
    {
        let User = await UserModel.findOne(query);
        if(!User || User.length <= 0)
        {   
            throw(
                {
                    message: "User Not Found",
                    code: 404
                }
            );
        }
        if(User.isActive){
            throw(
                {
                    message: "Already active",
                    code: 404
                }
            );
        }
        await UserModel.update({isActive:true}, query);
        return {success:true, msg:"Account activated successfully"};
    }
    catch(err)
    {
        throw({
            message:err.message || "Server error while activating user",
            code:err.code || 500
        });
    }
}


// Getting Users list from DB
exports.getUsersList = async () => {
    
    try
    {
        let Users = await UserModel.findAll();
        return Users;
    }
    catch(err)
    {
        throw({
            message:err.message || "Server error while getting Users",
            code:err.code || 500
        })
    }
}

//Getting user by id
exports.getUserById = async (user_Id) => {
    let query = {
        where:{userId: user_Id}
    }

    try
    {
        let User = await UserModel.findOne(query);
        
        if(!User || User.length <= 0)
        {    
            throw(
                {
                    message: "User not found with id",
                    code: 404
                }
            );
        }

        return User;
    }
    catch(err)
    {
        throw({
            message:err.message || "Server error while getting User by id",
            code:err.code || 500
        });
    }
}

//Getting user and  detail by id
exports.getUserProfile = async (user_Id) => {
    let query = {
        where:{userId: user_Id}
    }

    try
    {
        let User = await UserModel.findOne(query);

        if(!User || User.length <= 0)
        {    
            throw(
                {
                    message: "User not found with id",
                    code: 404
                }
            );
        }else{

            const {userId,name,email,phoneNumber,profilePicture,role} = User;

            return {userId,name,email,phoneNumber,profilePicture,role};
        }


    }
    catch(err)
    {
        throw({
            message:err.message || "Server error while getting User by id",
            code:err.code || 500
        });
    }
}

//Update User details
exports.updateUserDetails = async (user)=>{
    const {
        userId,
        name,
        email,
        phoneNumber,
    } = user
    let query = {
        where:{userId: userId}
    }
    const details = {
        name:name,
        email:email,
        phoneNumber:phoneNumber,
    }
    try
    {
        await UserModel.update(details, query);
        let uquery = {
            where:{userId: userId}
        }
        let User = await UserModel.findOne(uquery);
        
        //If User doesnt exist
        if(!User || User.length <= 0)
        {    
            throw(
                {
                    message: "User not found with id",
                    code: 404
                }
            );
        }

        

        return User;
    }
    catch(err)
    {
        throw({
            message:err.message || "Server error while updating User",
            code:err.code || 500
        });
    }

}

//Delete User
exports.deleteUser = async (user)=>{
    const {
        userId,
    } = user
    let query = {
        where:{userId: userId}
    }
    try
    {
        if(await UserModel.destroy(query)){
            return {msg:"User Deleted Successfully"}
        }
        
    }
    catch(err)
    {
        throw({
            message:err.message || "Server error while updating User",
            code:err.code || 500
        });
    }

}