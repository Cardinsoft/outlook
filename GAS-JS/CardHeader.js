"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

//Emulate Class CardHeader for CardService service;
let CardHeader = function CardHeader() {
  (0, _classCallCheck2.default)(this, CardHeader);
  this.className = 'CardHeader';
  this.imageAltText;
  this.imageStyle;
  this.imageUrl;
  this.title;
  this.subtitle;
}; //add new methods to the class;


CardHeader.prototype.setImageAltText = function (imageAltText) {
  this.imageAltText = imageAltText;
  return this;
};

CardHeader.prototype.setImageStyle = function (imageStyle) {
  this.imageStyle = imageStyle;
  return this;
};

CardHeader.prototype.setImageUrl = function (imageUrl) {
  this.imageUrl = imageUrl;
  return this;
};

CardHeader.prototype.setTitle = function (title) {
  this.title = title;
  return this;
};

CardHeader.prototype.setSubtitle = function (subtitle) {
  this.subtitle = subtitle;
  return this;
};