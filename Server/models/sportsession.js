'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sportSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      sportSession.belongsTo(models.sport,{
        foreignKey : 'sportId'
      })
      sportSession.hasMany(models.UserSessions,{
        foreignKey : 'sessionId'
      })
      sportSession.belongsTo(models.User,{
        foreignKey : 'userId'
      })
    }
  }
  sportSession.init({
    name:DataTypes.STRING,
    players: DataTypes.JSON,
    playersHave: DataTypes.INTEGER,
    playersNeeded: DataTypes.INTEGER,
    startTime: DataTypes.TIME,
    venue: DataTypes.STRING,
    date : DataTypes.DATE,
    cancellation_status :{type : DataTypes.BOOLEAN,defaultValue:false},
    cancellation_reason :{type :  DataTypes.STRING,allowNull:false}
  }, {
    sequelize,
    modelName: 'sportSession',
  });
  return sportSession;
};