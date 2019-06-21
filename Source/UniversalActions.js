function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}
/* 
 * Opens home card as corresponding universal action callback;
 * @param {Object} e event object;
 */


function universalHome(_x) {
  return _universalHome.apply(this, arguments);
}

function _universalHome() {
  _universalHome = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(e) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return cardHome(e);

        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _universalHome.apply(this, arguments);
}

;
/**
 * Opens settings card as corresponding universal action callback;
 * @param {Object} e event object;
 */

function universalSettings(_x2) {
  return _universalSettings.apply(this, arguments);
}

function _universalSettings() {
  _universalSettings = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(e) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return cardSettings(e);

        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _universalSettings.apply(this, arguments);
}

;
/**
 * Opens advanced settings card as corresponding universal action callback;
 * @param {Object} e event object;
 */

function universalAdvanced(_x3) {
  return _universalAdvanced.apply(this, arguments);
}
/**
 * Opens help card as corresponding universal action callback;
 * @param {Object} e event object;
 */


function _universalAdvanced() {
  _universalAdvanced = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(e) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return cardAdvanced(e);

        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _universalAdvanced.apply(this, arguments);
}

function universalHelp(_x4) {
  return _universalHelp.apply(this, arguments);
}

function _universalHelp() {
  _universalHelp = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(e) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return cardHelp(e);

        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _universalHelp.apply(this, arguments);
}

;