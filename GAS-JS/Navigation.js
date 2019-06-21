"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate class Navigation for CardService service;
var Navigation = function Navigation() {
  _classCallCheck(this, Navigation);

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
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(card) {
    var builtCard;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
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
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(card) {
    var builtCard;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
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
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();