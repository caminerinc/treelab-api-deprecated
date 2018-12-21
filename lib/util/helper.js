'use strict';

const path = require('path');
const fs = require("fs");

function load(root, files = {}) {
  if (fs.statSync(root).isFile()) {
    let extname = path.extname(root);
    if (extname && !require.extensions[extname]) {
      files[path.basename(root)] = (fs.readFileSync(root).toString());
    } else {
      files[path.basename(root)] = require(root);
    }
  } else {
    fs.readdirSync(root).forEach(function (file) {
      let _root = path.join(root, file);
      if (fs.statSync(_root).isDirectory()) {
        load(_root, files);
      } else {
        let extname = path.extname(_root);
        if (extname && !require.extensions[extname]) {
          files[path.basename(_root)] = (fs.readFileSync(_root).toString());
        } else {
          files[path.basename(root)] = require(root);
        }
      }
    })
  }
  return files;
}

function sha1(text) {
  return CryptoJS.SHA1(text.toString()).toString();
}

module.exports = {
  /**
   * 递归加载所有文件，如果属于node require.extensions则require，否则直接读取文件内容
   * @param {String} root - 文件或者文件夹路径
   * @returns {Object} - key为文件名（带扩展名），value为文件内容
   */
  load,

  /**
   * @param {String} text
   */
  sha1,

};