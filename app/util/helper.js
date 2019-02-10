const path = require('path');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const { error, ECodes } = require('../util/error');

const load = (root, files = {}) => {
  if (fs.statSync(root).isFile()) {
    let extname = path.extname(root);
    if (extname && !require.extensions[extname]) {
      files[path.basename(root)] = fs.readFileSync(root).toString();
    } else {
      files[path.basename(root)] = require(root);
    }
  } else {
    fs.readdirSync(root).forEach(function(file) {
      let _root = path.join(root, file);
      if (fs.statSync(_root).isDirectory()) {
        load(_root, files);
      } else {
        let extname = path.extname(_root);
        if (extname && !require.extensions[extname]) {
          files[path.basename(_root)] = fs.readFileSync(_root).toString();
        } else {
          files[path.basename(_root)] = require(_root);
        }
      }
    });
  }
  return files;
};

const sha1 = text => {
  return CryptoJS.SHA1(text.toString()).toString();
};

const checkKeyExists = (map, ...keys) => {
  for (let key of keys) {
    if (!(key in map)) error(null, ECodes.REQUIRED, key);
  }
  return map;
};

module.exports = {
  load,
  sha1,
  checkKeyExists,
};
