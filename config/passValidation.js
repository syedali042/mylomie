var passwordValidator = require('password-validator');
// Password schema
var passSchema = new passwordValidator();
passSchema
.is().min(8)                        // Minimum length 8
.is().max(100)                      // Maximum length 100
.has().uppercase()                  // Must have uppercase letters
.has().lowercase()                  // Must have lowercase letters
.has().digits(1)                    // Must have at least 1 digits
.has().symbols(1)                   // Must have at least 1 Special character    
.has().not().spaces();              // Should not have spaces

function validate(password){
let validatePass = passSchema.validate(password, { list: true});

    let errMessage = "Password should contain "
    if(validatePass.includes('min')){errMessage = errMessage+"minimum 8 characters";}
    if(validatePass.includes('max')){errMessage = errMessage+ ", maximum 50 characters";}
    if(validatePass.includes('uppercase')){errMessage = errMessage+ ", atleast 1 uppercase letter";}
    if(validatePass.includes('lowercase')){errMessage = errMessage+ ", atleast 1 lowercase letter";}
    if(validatePass.includes('digits')){errMessage = errMessage+ ", atleast 1 digit";}
    if(validatePass.includes('symbols')){errMessage = errMessage+ ", atleasr 1 Special character";}
    if(validatePass.includes('spaces')){errMessage = errMessage+ ", no spaces";};
    
    if(validatePass.length>0){
        return errMessage;
    }
    else{
        return "";
    }
    

}
module.exports.validate = validate;