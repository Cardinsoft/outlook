"use strict";
/**
 * Constructor function for Utilities service;
 */

function e_Utilities() {
  this.className = 'Utilities';
}
/**
 * Encodes input into base-64 String;
 * @returns {String} input;
 */


e_Utilities.prototype.base64Encode = function (input) {
  var encoded;
  encoded = btoa(input);
  return encoded;
};
/**
 * Decodes input from base-64 String;
 * @returns {String} input;
 */


e_Utilities.prototype.base64Decode = function (encoded) {
  var decoded;
  decoded = atob(encoded);
  return decoded;
};