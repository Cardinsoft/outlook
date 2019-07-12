function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate base Class Button for CardService service;
let Button = function Button() {
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


let TextButton =
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
  let action = this.action;
  const backgroundColor = this.backgroundColor;
  const text = this.text;
  const disabled = this.disabled;
  const textButtonStyle = this.textButtonStyle;
  const openLink = this.openLink;
  const authAction = this.authorizationAction; //initiate button;

  const button = document.createElement('button');
  button.className = this.className;
  button.type = 'button';
  button.disabled = disabled;
  button.innerHTML = text; //access button style and class list;

  const st = button.style;
  const cl = button.classList;

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
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return actionCallback(this);

          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    })));
  } else if (openLink) {
    button.addEventListener('click', function () {
      const ol = JSON.parse(openLink);
      console.log(ol);
      Office.context.ui.displayDialogAsync(ol.url);
    });
  } else {
    button.addEventListener('click', function () {
      console.log(openLink);
      Office.context.ui.displayDialogAsync(JSON.parse(authAction).url);
    });
  }
}; //Emulate Class ImageButton extending base Class Button for CardService service;


let ImageButton =
/*#__PURE__*/
function (_Button2) {
  _inherits(ImageButton, _Button2);

  function ImageButton() {
    var _this2;

    _classCallCheck(this, ImageButton);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ImageButton).call(this));
    _this2.altText;
    _this2.icon;
    _this2.url;
    return _this2;
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


let CardAction =
/*#__PURE__*/
function (_Button3) {
  _inherits(CardAction, _Button3);

  function CardAction() {
    var _this3;

    _classCallCheck(this, CardAction);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(CardAction).call(this));
    _this3.className = 'CardAction';
    _this3.text;
    return _this3;
  }

  return CardAction;
}(Button); //chain TextButton to Button base class;


CardAction.prototype = Object.create(Button.prototype); //add new methods to the class;

CardAction.prototype.setText = function (text) {
  this.text = text;
  return this;
};