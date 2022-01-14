const ejs = require("ejs");
const path = require("path");
exports.getUserActivationTemplate = (name,link)=>{

    return new Promise((resolve,reject)=>{

        if(!name || !link)
        {
            reject("Invalid name/link");
        }

        ejs.renderFile(path.join(__dirname, '/activationEmailTemplate.ejs'),
        {
            user_firstname: name,
            confirm_link: link
        })
        .then(emailTemplate => {
            
            resolve(emailTemplate);

        })
        .catch(err => {
            reject(err);
        });
        

    });
}
exports.getUserPassResetTemplate = (name,link)=>{

    return new Promise((resolve,reject)=>{

        if(!name || !link)
        {
            reject("Invalid name/link");
        }

        ejs.renderFile(path.join(__dirname, '/passResetTemplate.ejs'),
        {
            user_firstname: name,
            confirm_link: link
        })
        .then(emailTemplate => {
            
            resolve(emailTemplate);

        })
        .catch(err => {
            reject(err);
        });
        

    });
}
//Send an email on upadating password
exports.passUpdatedTemplate = (name)=>{

    return new Promise((resolve,reject)=>{

        if(!name)
        {
            reject("Invalid name/link");
        }

        ejs.renderFile(path.join(__dirname, '/passUpdatedTemplate.ejs'),
        {
            user_firstname: name
        })
        .then(emailTemplate => {
            
            resolve(emailTemplate);

        })
        .catch(err => {
            reject(err);
        });
        

    });
}


//Send an email on upadating password
exports.replyTemplate = (name, message)=>{

    return new Promise((resolve,reject)=>{

        if(!name)
        {
            reject("Invalid name/link");
        }

        ejs.renderFile(path.join(__dirname, '/replyTemplate.ejs'),
        {
            user_firstname: name,
            message:message
        })
        .then(emailTemplate => {
            
            resolve(emailTemplate);

        })
        .catch(err => {
            reject(err);
        });
        

    });
}