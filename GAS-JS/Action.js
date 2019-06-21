"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

//Emulate Class Action for CardService service;
let Action = function Action() {
  (0, _classCallCheck2.default)(this, Action);
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


let AuthorizationAction = function AuthorizationAction() {
  (0, _classCallCheck2.default)(this, AuthorizationAction);
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


let OpenLink =
/*#__PURE__*/
function (_Action) {
  (0, _inherits2.default)(OpenLink, _Action);

  function OpenLink() {
    var _this;

    (0, _classCallCheck2.default)(this, OpenLink);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(OpenLink).call(this));
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