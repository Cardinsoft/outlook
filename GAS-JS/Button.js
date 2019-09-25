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
    _this.backgroundColor = '#0078d7';
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
/**
 * Sets background color for filled TextButton;
 * @param {String} backgroundColor color HEX code;
 * @returns {TextButton} this TextButton;
 */


TextButton.prototype.setBackgroundColor = function (backgroundColor) {
  if (!backgroundColor) {
    this.backgroundColor = '#0078d7';
  } else {
    this.backgroundColor = backgroundColor;
  }

  return this;
};

TextButton.prototype.setTextButtonStyle = function (textButtonStyle) {
  this.textButtonStyle = textButtonStyle;
  return this;
};
/**
 * Utility method for appending widget to Ui;
 * @param {HtmlElement} parent element;
 * @param {Boolean} isSet is element of a ButtonSet;
 * @return {HtmlElement} this button;
 */


TextButton.prototype.appendToUi = function (parent, isSet) {
  //access button properties;
  let action = this.action;
  const backgroundColor = this.backgroundColor;
  const disabled = this.disabled;
  const textButtonStyle = this.textButtonStyle;
  const openLink = this.openLink;
  const authAction = this.authorizationAction; //create wrapper;

  const widget = document.createElement('div');

  if (isSet) {
    widget.className = 'SetElement';
  } else {
    widget.className = 'row';
  }

  parent.append(widget); //initiate button;

  const button = document.createElement('div');
  button.className = this.className;
  button.disabled = disabled; //access button style and class list;

  const st = button.style;
  const cl = button.classList;

  if (textButtonStyle === 'FILLED') {
    st.backgroundColor = backgroundColor;
    cl.add('btn-filled');
  } else {
    cl.add('btn-text');
  }

  if (disabled) {
    cl.add('btn-disabled');
  } else {
    cl.remove('btn-disabled');
  }

  widget.append(button); //process colour info;

  const text = this.text;
  const matched = text.match(/<.+?>.+?<\/.+?>|.+?(?=<)|.+/g) || [];
  const freg = /<font color="(.+?)">(.+?)<\/font>/;
  const fbld = /<b>.+?<\/b>/;
  const fund = /<u>.+?<\/u>/;
  const fitl = /<i>.+?<\/i>/;
  const fstr = /<s>.+?<\/s>/;
  matched.forEach(function (ftag) {
    let mtext = ftag.match(/<.+?>(.+?)<\/.+?>/);
    let font = ftag.match(freg) || [];
    let isB = fbld.test(ftag);
    let isU = fund.test(ftag);
    let isI = fitl.test(ftag);
    let isS = fstr.test(ftag);
    let subelem;

    switch (true) {
      case font.length > 0:
        subelem = document.createElement('span');
        subelem.style.color = font[1];
        break;

      case isB:
        subelem = document.createElement('b');
        break;

      case isU:
        subelem = document.createElement('u');
        break;

      case isI:
        subelem = document.createElement('i');
        break;

      case isS:
        subelem = document.createElement('s');
        break;

      default:
        button.insertAdjacentText('beforeend', ftag);
    }

    if (font.length > 0 || isB || isU || isI || isS) {
      subelem.innerText = mtext[1];
      button.append(subelem);
    }
  });

  if (!openLink && !authAction && action) {
    //set refrence;
    setAction(button, action); //add event listener to button;

    button.addEventListener('click',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return actionCallback(this);

          case 2:
            result = _context.sent;
            return _context.abrupt("return", handleResponse(result));

          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    })));
  } else if (openLink) {
    button.addEventListener('click', function () {
      const link = JSON.parse(openLink);
      Office.context.ui.displayDialogAsync('https://cardinsoft.github.io/outlook/redirect?endpoint=' + forceHttps(link.url), function (e) {
        console.log(e);
      });
    });
  } else {
    button.addEventListener('click', function () {
      const auth = JSON.parse(authAction);
      Office.context.ui.displayDialogAsync('https://cardinsoft.github.io/outlook/redirect?endpoint=' + forceHttps(auth.url));
    });
  }

  return widget;
}; //Emulate Class ImageButton extending base Class Button for CardService service;


let ImageButton =
/*#__PURE__*/
function (_Button2) {
  _inherits(ImageButton, _Button2);

  function ImageButton() {
    var _this2;

    _classCallCheck(this, ImageButton);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ImageButton).call(this));
    _this2.className = 'ImageButton';
    _this2.altText = '';
    _this2.icon;
    _this2.url;
    return _this2;
  }

  return ImageButton;
}(Button); //chain ImageButton to Button base class;


ImageButton.prototype = Object.create(Button.prototype);
/**
 * Sets alt text to show if icon or image is unavailable;
 * @param {String} altText text to display;
 * @returns {ImageButton} this ImageButton;
 */

ImageButton.prototype.setAltText = function (altText) {
  this.altText = altText;
  return this;
};
/**
 * Sets icon to display on button;
 * @param {String} icon icon enumerable name;
 * @returns {ImageButton} this ImageButton;
 */


ImageButton.prototype.setIcon = function (icon) {
  this.icon = icon;
  return this;
};
/**
 * Sets image to display on button;
 * @param {String} url image source URL;
 * @returns {ImageButton} this ImageButton;
 */


ImageButton.prototype.setIconUrl = function (url) {
  this.url = url;
  return this;
};
/**
 * Utility method for appending widget to Ui;
 * @param {HtmlElement} parent element;
 * @param {Boolean} isSet is element of a ButtonSet;
 * @return {HtmlElement} this button;
 */


ImageButton.prototype.appendToUi = function (parent, isSet) {
  //access button properties;
  let action = this.action;
  const openLink = this.openLink;
  const authAction = this.authorizationAction; //create wrapper;

  const widget = document.createElement('div');

  if (isSet) {
    widget.className = 'SetElement';
  } else {
    widget.className = 'row';
  }

  parent.append(widget); //initiate button;

  const button = document.createElement('img');
  button.className = this.className;
  button.alt = this.altText;
  button.title = this.altText; //set image source (enum or URL);

  if (this.url) {
    button.src = this.url;
  } else {
    button.src = this.icon;
  }

  widget.append(button);

  if (!openLink && !authAction && action) {
    //set refrence;
    setAction(button, action); //add event listener to button;

    button.addEventListener('click',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return actionCallback(this);

          case 2:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    })));
  } else if (openLink) {
    button.addEventListener('click', function () {
      const link = JSON.parse(openLink);
      Office.context.ui.displayDialogAsync('https://cardinsoft.github.io/outlook/redirect?endpoint=' + forceHttps(link.url), function (result) {
        result.value.addEventHandler(Office.EventType.DialogEventReceived, dialogCallback);
      });
    });
  } else {
    button.addEventListener('click', function () {
      const auth = JSON.parse(authAction);
      Office.context.ui.displayDialogAsync('https://cardinsoft.github.io/outlook/redirect?endpoint=' + forceHttps(auth.url), function (result) {
        result.value.addEventHandler(Office.EventType.DialogEventReceived, dialogCallback);
      });
    });
  }

  return widget;
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