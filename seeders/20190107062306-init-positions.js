module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'positions',
      [
        {
          id: 'recfPInitd1QpZ6aC',
          parentId: 'rec_tblNGUPdSs9Va4X5u',
          position: 1,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6aE',
          parentId: 'rec_tblNGUPdSs9Va4X5u',
          position: 2,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6aV',
          parentId: 'rec_tblNGUPdSs9Va4X5u',
          position: 3,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6ef',
          parentId: 'rec_tblNGUPdSs9Va4X5u',
          position: 4,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6sf',
          parentId: 'rec_tblNGUPdSs9Va4X5u',
          position: 5,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recfPInitd1QpZ6vc',
          parentId: 'rec_tblNGUPdSs9Va4X5u',
          position: 6,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recsdfFDfdfdDSD',
          parentId: 'rec_tblNGUPdSs9Va4X5u',
          position: 7,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
        {
          id: 'recwEKHeMhcDnLnfc',
          parentId: 'rec_tblNGUPdSs9Va4X5u',
          position: 8,
          createdAt: '2018-05-05T04:09:06.024Z',
          updatedAt: '2018-05-05T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('bases', null, {});
  },
};
