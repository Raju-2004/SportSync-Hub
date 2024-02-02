'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sportSessions','sportId',{
      type : Sequelize.DataTypes.INTEGER
    })
    await queryInterface.addConstraint('sportSessions',{
      fields:['sportId'],
      type : 'foreign key',
      references : {
        table :"sports",
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
    await queryInterface.removeColumn('sportSessions','sportId')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
