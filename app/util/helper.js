const path = require('path');
const fs = require('fs');

const { PREFIX_TYPE } = require('../constants/app');

const load = (root, files = {}) => {
  if (fs.statSync(root).isFile()) {
    let extname = path.extname(root);
    if (extname && !require.extensions[extname]) {
      files[path.basename(root)] = fs.readFileSync(root).toString();
    } else {
      console.log(root);
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
          files[path.basename(root)] = require(root);
        }
      }
    });
  }
  return files;
};

const sha1 = text => {
  return CryptoJS.SHA1(text.toString()).toString();
};

const createUid = type =>
  `${PREFIX_TYPE[type]}${(+new Date()).toString(36)}${Math.random()
    .toString(36)
    .substring(2, 15)}`;

module.exports = {
  load,
  sha1,
  createUid,
};
