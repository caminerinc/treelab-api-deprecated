module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('Tables', ['baseId', 'name'], {
        type: 'unique',
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {},
};
