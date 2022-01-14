const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  // console.log(password,hash,salt);
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/**
 * 
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hashpassword: genHash
    };
}


/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the Database user ID
 */
function issueJWT(user, activePersonaId) {
  const userId = user.userId;
  const _role = user.activePersona;
  const expiresIn = '1d';
  const _activeroleId = activePersonaId;
  const payload = {
    sub: userId,
    roles: _role,
    iat: Date.now(),
    activePersonaId: _activeroleId
  };
  console.log(payload.roles)

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: signedToken,
    expires: expiresIn
  }
}

/**
 * @description This function parses the req object and returns the bearer token present in the "Authorization" headers. If 
 * the token is not present then it will return null
 * @param {Request Object} req 
 * @returns Bearer Token
 * 
 */
function getBearerTokenFromReq(req)
{
  if(req && req.headers["authorization"] && req.headers["authorization"].split(" ")[0] === "Bearer")
  {
    return req.headers["authorization"].split(" ")[1];
  }
  return null;
}

/**
* 
* @param {Role that can use the endpoint} role 
* @description This middleware checks whether the user is logged in and whether the role that is present in roles payload
* matches the role required to use this endpoint. If the Role is valid , it will move to the next middleware or it will 
* return 401 unauthorized as response
* @example protect(roles.BUYER) will ensure that only user with buyer role can access this endpoint.
*/

function protect(role)
{
    return (req,res,next)=>{

    //Get Token 
    let token = getBearerTokenFromReq(req);

    if(!token)
    {
      return res.status(401).send("Invalid Authorization Token");
    }

    //Verify Token

    let decoded_token;

    try
    {
      decoded_token = jsonwebtoken.verify(token,PRIV_KEY,{algorithms:'RS256'})
      console.log(decoded_token)
    }
  
    catch(err)
    {
      return res.status(401).send("Invalid Authorization Token");
    }

    if(!decoded_token)
    {
      res.status(401).send("Invalid Authorization Token");
    }

    //Check Whether role is valid
    if(!role || decoded_token.roles.indexOf(role) === -1)
    {
       return res.status(401).send("You are not authorized to perform this operation");
    }


    //If everything is alright , attach the roles to req object
    req.roles = decoded_token.roles;

    next();
    };
}
module.exports.getBearerTokenFromReq = getBearerTokenFromReq;
module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.protect = protect;


