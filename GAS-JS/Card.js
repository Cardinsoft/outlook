"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

//Emulate Class Card for CardService service;
let Card = function Card() {
  (0, _classCallCheck2.default)(this, Card);
  this.className = 'Card';
}; //add new methods to the class;


Card.prototype.printJSON = function () {
  return JSON.stringify(this);
};