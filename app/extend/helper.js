'use strict';

const path = require('path');
const CryptoJS = require('crypto-js');

module.exports = {
  md5
};

function md5(text) {
  return CryptoJS.MD5(text.toString()).toString();
}