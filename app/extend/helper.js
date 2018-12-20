'use strict';

const path = require('path');
const CryptoJS = require('crypto-js');

module.exports = {
  randomString,
  md5,
  sha1,
};

function md5(text) {
  return CryptoJS.MD5(text.toString()).toString();
}

function sha1(text) {
  return CryptoJS.SHA1(text.toString()).toString();
}

function randomString(len) {
  len = len || 32;
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';  //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
　let maxPos = chars.length;
　let result = '';
　for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
　}
　return result;
}