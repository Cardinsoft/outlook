"use strict";

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
} //Emulate Class Action for CardService service;


var Action = function Action() {
  _classCallCheck(this, Action);

  this.className = 'Action';
  this.functionName;
  this.loadIndicator;
  this.parameters;
}; //add new methods to the class;


Action.prototype.setFunctionName = function (functionName) {
  this.functionName = functionName;
  return this;
};

Action.prototype.setLoadIndicator = function (loadIndicator) {
  this.loadIndicator = loadIndicator;
  return this;
};

Action.prototype.setParameters = function (parameters) {
  this.parameters = parameters;
  return this;
}; //Emulates class AuthorizationAction for CardService service;


var AuthorizationAction = function AuthorizationAction() {
  _classCallCheck(this, AuthorizationAction);

  this.className = 'AuthorizationAction';
  this.url;
};
/**
 * Sets authorization url to action to open;
 * @param {String} authorizationUrl url string to set;
 * @returns {Object}
 */


AuthorizationAction.prototype.setAuthorizationUrl = function (authorizationUrl) {
  this.url = authorizationUrl;
  return this;
}; //Emulate Class OpenLink extending Class Action for CardService service;


var OpenLink =
/*#__PURE__*/
function (_Action) {
  _inherits(OpenLink, _Action);

  function OpenLink() {
    var _this;

    _classCallCheck(this, OpenLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OpenLink).call(this));
    _this.className = 'OpenLink';
    _this.url;
    _this.onClose;
    _this.openAs;
    return _this;
  }

  return OpenLink;
}(Action); //add new methods to the class;


OpenLink.prototype.setUrl = function (url) {
  this.url = url;
  return this;
};

OpenLink.prototype.setOnClose = function (onClose) {
  this.onClose = onClose;
  return this;
};

OpenLink.prototype.setOpenAs = function (openAs) {
  this.openAs = openAs;
  return this;
};