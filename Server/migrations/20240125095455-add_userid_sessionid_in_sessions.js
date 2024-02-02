'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('UserSessions',{
      fields:['userId'],
      type : 'foreign key',
      references : {
        table :"Users",
        field : 'id'
      }
    })
    await queryInterface.addConstraint('UserSessions',{
      fields:['sessionId'],
      type : 'foreign key',
      references : {
        table :"sportSessions",
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
    await queryInterface.removeConstraint('UserSessions', 'UserSessions_userId_fkey');
    await queryInterface.removeConstraint('UserSessions', 'UserSessions_sportId_fkey');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
