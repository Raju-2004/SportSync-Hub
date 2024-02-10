'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'isAdmin', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes made in the up function
    await queryInterface.changeColumn('Users', 'isAdmin', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: null
    });
  }
};
