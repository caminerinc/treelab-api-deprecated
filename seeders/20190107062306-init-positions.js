module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'positions',
      [
        {
          id: 'recfPInitd1QpZ6aC',
          parentId: 'tblNGUPdSs9Va4X5u',
          position: 1,
        },
        {
          id: 'recfPInitd1QpZ6aE',
          parentId: 'tblNGUPdSs9Va4X5u',
          position: 2,
        },
        {
          id: 'recfPInitd1QpZ6aV',
          parentId: 'tblNGUPdSs9Va4X5u',
          position: 3,
        },
        {
          id: 'recfPInitd1QpZ6ef',
          parentId: 'tblNGUPdSs9Va4X5u',
          position: 4,
        },
        {
          id: 'recfPInitd1QpZ6sf',
          parentId: 'tblNGUPdSs9Va4X5u',
          position: 5,
        },
        {
          id: 'recfPInitd1QpZ6vc',
          parentId: 'tblNGUPdSs9Va4X5u',
          position: 6,
        },
        {
          id: 'recsdfFDfdfdDSD',
          parentId: 'tblNGUPdSs9Va4X5u',
          position: 7,
        },
        {
          id: 'recwEKHeMhcDnLnfc',
          parentId: 'tblNGUPdSs9Va4X5u',
          position: 8,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('bases', null, {});
  },
};
