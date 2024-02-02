'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sportSessions','cancellation_status',{
      type : Sequelize.DataTypes.BOOLEAN
    })
    await queryInterface.addColumn('sportSessions','cancellation_reason',{
      type : Sequelize.DataTypes.STRING
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sportSessions','cancellation_status',{
      type : Sequelize.DataTypes.BOOLEAN
    })
    await queryInterface.removeColumn('sportSessions','cancellation_reason',{
      type : Sequelize.DataTypes.STRING
    })
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
