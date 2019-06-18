"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate base Class Button for CardService service;
var Button = function Button() {
  _classCallCheck(this, Button);

  this.className = 'Button';
  this.action;
  this.authorizationAction;
  this.openLink;
  this.composedEmailType;
};
/**
 * Set authorization action to Button;
 * @param {AuthorizationAction} action action to set;
 * @returns {Button}
 */


Button.prototype.setAuthorizationAction = function (action) {
  this.authorizationAction = JSON.stringify(action);
  return this;
};
/**
 * Set compose action to Button;
 * @param {Action} action action to set;
 * @param {composedEmailType} composedEmailType email type to compose;
 * @returns {Button}
 */


Button.prototype.setComposeAction = function (action, composedEmailType) {
  this.action = JSON.stringify(action);
  this.composedEmailType = composedEmailType;
  return this;
};
/**
 * Set onclick action to Button;
 * @param {Action} action action to set;
 * @returns {Button}
 */


Button.prototype.setOnClickAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};
/**
 * Set OpenLink action to Button;
 * @param {Action} action action to set;
 * @returns {Button}
 */


Button.prototype.setOnClickOpenLinkAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};
/**
 * Set OpenLink to Button;
 * @param {OpenLink} openLink openLink action to set;
 * @returns {Button}
 */


Button.prototype.setOpenLink = function (openLink) {
  this.openLink = JSON.stringify(openLink);
  return this;
}; //Emulate Class TextButton extending base Class Button for CardService service;


var TextButton =
/*#__PURE__*/
function (_Button) {
  _inherits(TextButton, _Button);

  function TextButton() {
    var _this;

    _classCallCheck(this, TextButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextButton).call(this));
    _this.className = 'TextButton';
    _this.backgroundColor;
    _this.text;
    _this.disabled;
    _this.textButtonStyle = 'TEXT';
    return _this;
  }

  return TextButton;
}(Button); //chain TextButton to Button base class;


TextButton.prototype = Object.create(Button.prototype); //add new methods to the class;

TextButton.prototype.setDisabled = function (disabled) {
  this.disabled = disabled;
  return this;
};

TextButton.prototype.setText = function (text) {
  this.text = text;
  return this;
};

TextButton.prototype.setTextButtonStyle = function (textButtonStyle) {
  this.textButtonStyle = textButtonStyle;
  return this;
};

TextButton.prototype.appendToUi = function (parent) {
  //access button properties;
  var action = this.action;
  var backgroundColor = this.backgroundColor;
  var text = this.text;
  var disabled = this.disabled;
  var textButtonStyle = this.textButtonStyle;
  var openLink = this.openLink;
  var authAction = this.authorizationAction; //initiate button;

  var button = document.createElement('button');
  button.className = this.className;
  button.disabled = disabled;
  button.innerHTML = text; //access button style and class list;

  var st = button.style;
  var cl = button.classList;

  if (textButtonStyle === 'FILLED') {
    st.backgroundColor = backgroundColor;
  } else {
    cl.add('btn-text');
  }

  if (disabled) {
    cl.add('btn-disabled');
  } else {
    cl.remove('btn-disabled');
  }

  parent.append(button);

  if (!openLink && !authAction && action) {
    //set refrence;
    setAction(button, action); //add event listener to button;

    button.addEventListener('click',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return actionCallback(this);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
  } else if (openLink) {
    new fabric['Button'](button, function () {
      Office.context.ui.displayDialogAsync(JSON.parse(openLink).url);
    });
  } else {
    new fabric['Button'](button, function () {
      Office.context.ui.displayDialogAsync(JSON.parse(authAction).url);
    });
  }
}; //Emulate Class Image extending base Class Button for CardService service;


var Image =
/*#__PURE__*/
function (_Button2) {
  _inherits(Image, _Button2);

  function Image() {
    var _this2;

    _classCallCheck(this, Image);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Image).call(this));
    _this2.className = 'Image';
    _this2.altText;
    _this2.url;
    return _this2;
  }

  return Image;
}(Button); //Chain Class Image to Button base class;


Image.prototype = Object.create(Button.prototype); //add new methods to the class;

Image.prototype.setAltText = function (altText) {
  this.altText = altText;
  return this;
};

Image.prototype.setImageUrl = function (url) {
  this.url = url;
  return this;
}; //Emulate Class ImageButton extending base Class Button for CardService service;


var ImageButton =
/*#__PURE__*/
function (_Button3) {
  _inherits(ImageButton, _Button3);

  function ImageButton() {
    var _this3;

    _classCallCheck(this, ImageButton);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(ImageButton).call(this));
    _this3.altText;
    _this3.icon;
    _this3.url;
    return _this3;
  }

  return ImageButton;
}(Button); //chain ImageButton to Button base class;


ImageButton.prototype = Object.create(Button.prototype); //add new methods to the class;

ImageButton.prototype.setAltText = function (altText) {
  this.altText = altText;
  return this;
};

ImageButton.prototype.setIcon = function (icon) {
  this.icon = icon;
  return this;
};

ImageButton.prototype.setIconUrl = function (url) {
  this.url = url;
  return this;
}; //Emulate Class CardAction extending base Class Button for CardService service;


var CardAction =
/*#__PURE__*/
function (_Button4) {
  _inherits(CardAction, _Button4);

  function CardAction() {
    var _this4;

    _classCallCheck(this, CardAction);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(CardAction).call(this));
    _this4.className = 'CardAction';
    _this4.text;
    return _this4;
  }

  return CardAction;
}(Button); //chain TextButton to Button base class;


CardAction.prototype = Object.create(Button.prototype); //add new methods to the class;

CardAction.prototype.setText = function (text) {
  this.text = text;
  return this;
};