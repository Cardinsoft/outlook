"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
} //Emulate Class CardHeader for CardService service;


var CardHeader = function CardHeader() {
  _classCallCheck(this, CardHeader);

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