'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'sportSessions', 
      'startTime', 
      {
        type: Sequelize.TIME
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'sportSessions',
      'startTime',
      {
        type: Sequelize.DATE
      }
    );
  }
};
