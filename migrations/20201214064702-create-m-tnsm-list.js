'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('M_tnsm_lists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      system_name: {
        type: Sequelize.STRING
      },
      system_group: {
        type: Sequelize.STRING
      },
      author_name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      url_system: {
        type: Sequelize.STRING
      },
      img_system: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('M_tnsm_lists');
  }
};