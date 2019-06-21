"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

//Emulate base Class Widget for CardService service;
function Widget() {
  this.className = 'Widget';
}
/**
 * TextParagraph constructor function;
 */


function TextParagraph() {
  Widget.call(this);
  this.className = 'TextParagraph';
  this.content;
}

TextParagraph.prototype = Object.create(Widget.prototype);

TextParagraph.prototype.setText = function (text) {
  this.content = text;
  return this;
};

TextParagraph.prototype.appendToUi = function (parent) {
  //append row;
  const widget = document.createElement('div');
  widget.className = 'row ' + this.className;
  parent.append(widget); //append column;

  const wrapText = document.createElement('div');
  wrapText.className = 'column-text';
  widget.append(wrapText); //set widget text;

  const content = document.createElement('span');
  content.className = 'ms-font-m-plus';
  content.innerHTML = this.content;
  wrapText.append(content);
}; //Emulate Class ButtonSet extending base Class Widget for CardService service;


let ButtonSet =
/*#__PURE__*/
function (_Widget) {
  (0, _inherits2.default)(ButtonSet, _Widget);

  function ButtonSet() {
    var _this;

    (0, _classCallCheck2.default)(this, ButtonSet);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ButtonSet).call(this));
    _this.className = 'ButtonSet';
    _this.buttons = [];
    return _this;
  }

  return ButtonSet;
}(Widget); //add new methods to the class;


ButtonSet.prototype.addButton = function (button) {
  this.buttons.push(button);
  return this;
};

ButtonSet.prototype.appendToUi = function (parent) {
  const buttons = this.buttons;
  const length = buttons.length;
  const btnRow = document.createElement('div');
  btnRow.className = 'row ' + this.className;
  parent.append(btnRow);
  const wrapBtn = document.createElement('div');
  wrapBtn.className = 'column';
  btnRow.append(wrapBtn);
  buttons.forEach(function (button) {
    const backgroundColor = button.backgroundColor;
    const text = button.text;
    const disabled = button.disabled;
    const textButtonStyle = button.textButtonStyle;
    const action = button.action;
    const openLink = button.openLink;
    const authAction = button.authorizationAction;
    button.appendToUi(wrapBtn);
  });
};