const path = require('path');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const U64 = require('n64').U64;

const PID = 1;
let SEQUENCE = 0;

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

const createUid = type => {
  if (!type) {
    throw new Error('createUid failure, prefix missing');
  }
  type = type.toString();
  let djb33 = function() {
    let lwrcase = Array.from(type.toLowerCase());
    return lwrcase.reduce(function(h, v) {
      h = (h << 5) + h + v.charCodeAt(0);
      return h & 0xffffffff;
    }, 5381);
  };
  let TM20180101 = 1514764800000;
  let id = U64(Date.now() - TM20180101);
  return (
    type +
    id
      .ishln(22)
      .iorn((PID & 0xff) << 14)
      .iorn((SEQUENCE++ & 0x3ff) << 4)
      .iorn(djb33(type) & 0x0f)
      .toString(16)
  );
};

const checkKeyExists = (map, ...keys) => {
  for (let key of keys) {
    let error = new Error(`${key} is required`);
    error.status = 422;
    if (!(key in map)) throw error;
  }
  return map;
};

module.exports = {
  load,
  sha1,
  createUid,
  checkKeyExists,
};
