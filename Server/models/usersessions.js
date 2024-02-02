'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserSessions.belongsTo(models.sportSession,{
        foreignKey :'sessionId'
      })
      UserSessions.belongsTo(models.User,{
        foreignKey :'userId'
      })
    }
  }
  UserSessions.init({
    userId: DataTypes.INTEGER,
    sessionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserSessions',
  });
  return UserSessions;
};