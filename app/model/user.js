
let crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM,
        values: [
          "customer",
          "admin",
          "super_admin"
        ],
        defaultValue: null,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      classMethods: {
        associate: (models) => {
          /** associations */
        },
      },
    }
  );
 /**
  * Generate and Setup password reset token with expiry time in database
 */
    User.prototype.generatePasswordReset = function() {
    let resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpires = Date.now() + 900000; //expires in 15 minutes
    return resetPasswordToken;
  };
  /**
   * Generate and Setup account activation token with expiry time in database
  */
  User.prototype.generateActivationLink = function()
  {
    let activationLink = crypto.randomBytes(20).toString('hex');
    this.activationLink = activationLink;

    return activationLink;
  }
  User.prototype.resetActivationToken = function()
  {
    this.activationToken = "";
  }
  return User;
};
