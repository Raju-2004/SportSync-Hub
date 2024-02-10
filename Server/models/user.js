'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserSessions,{
        foreignKey :'userId'
      })
      User.hasMany(models.sportSession,{
        foreignKey :'userId'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin : {
      type: DataTypes.BOOLEAN,
      defaultValue: false // Set the default value to false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};