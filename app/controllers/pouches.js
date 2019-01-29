const pouches = require('../queries/pouches');

module.exports = {
  getPouches() {
    return pouches.getAllPouches();
  },

  getPouch(id) {
    return pouches.getPouche(id);
  },
};
