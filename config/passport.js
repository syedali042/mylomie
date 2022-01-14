const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const utils = require('../config/utils.js');
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const pathToPrivateKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');

const db = require("../app/model/index.js");
const UserModel = db.User;

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PRIV_KEY,
  algorithms: ['RS256']
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        var userId = jwt_payload.userId;
        
        let query = {
            attributes: ['userId','isActive'],
            where:{userId: jwt_payload.sub}
        }
        // We will assign the `sub` property on the JWT to the database ID of user
        UserModel.findOne(query).then((User) => { 
            if(!User){
                return done(null, false, { message: `No record found` });
            }
            if (User) {
                let user = {...User, userId: userId}
                console.log(user)
                return done(null, user);
            } else {
                return done(null, false);
            }
            
        }).catch((err) => {
            done(null, false, { message: 'Something went wrong trying to authenticate' });
           });

    }));
}