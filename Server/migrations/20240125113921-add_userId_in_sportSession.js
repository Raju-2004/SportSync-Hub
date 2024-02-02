'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sportSessions','userId',{
      type : Sequelize.DataTypes.INTEGER
    })
    await queryInterface.addConstraint('sportSessions',{
      fields:['userId'],
      type : 'foreign key',
      references : {
        table :"Users",
        field : 'id'
      }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('sportSession', 'sportSession_userId_fkey');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
