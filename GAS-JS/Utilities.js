function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Sets timeout to sleep;
 * @param {Integer} ms milliseconds to wait;
 * @return {Object} resolved Promise;
 */
function sleepy(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('awoke');
      resolve(true);
    }, ms);
  });
}
/**
 * Constructor function for Utilities service;
 */


function e_Utilities() {
  this.className = 'Utilities';
}
/**
 * Sleeps for specified number of ms;
 * @param {Integer} milliseconds number of ms to wait;
 */


e_Utilities.prototype.sleep =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(milliseconds) {
    var ms, slept;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          ms = (ms <= 300000 ? ms : 300000) || 0;
          _context.next = 3;
          return sleepy(ms);

        case 3:
          slept = _context.sent;
          return _context.abrupt("return");

        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Encodes input into base-64 String;
 * @returns {String} input;
 */


e_Utilities.prototype.base64Encode = function (input) {
  let encoded;
  encoded = btoa(input);
  return encoded;
};
/**
 * Decodes input from base-64 String;
 * @returns {String} input;
 */


e_Utilities.prototype.base64Decode = function (encoded) {
  let decoded;
  decoded = atob(encoded);
  return decoded;
};