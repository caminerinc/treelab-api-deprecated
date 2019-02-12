module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Tables', ['baseId', 'name'], {
      type: 'unique',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Tables', 'Tables_baseId_name_uk');
  },
};
