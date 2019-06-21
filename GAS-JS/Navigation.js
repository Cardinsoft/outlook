"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

//Emulate class Navigation for CardService service;
let Navigation = function Navigation() {
  (0, _classCallCheck2.default)(this, Navigation);
  this.className = 'Navigation';
}; //add new methods to the class;


Navigation.prototype.popCard = function () {
  cardStack.pop();
  return this;
};

Navigation.prototype.popToNamedCard = function (cardName) {//future releases;
};

Navigation.prototype.popToRoot = function () {
  var length = cardStack.length;

  for (var i = 1; i < length; i++) {
    cardStack.pop();
  }

  return this;
};

Navigation.prototype.printJson = function () {
  return JSON.stringify(this);
};

Navigation.prototype.pushCard =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(card) {
    var builtCard;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return card;

        case 2:
          builtCard = _context.sent;
          cardStack.push(builtCard);
          return _context.abrupt("return", this);

        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

Navigation.prototype.updateCard =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(card) {
    var builtCard;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return card;

        case 2:
          builtCard = _context2.sent;
          cardStack[cardStack.length - 1] = builtCard;
          return _context2.abrupt("return", this);

        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();