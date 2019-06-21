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
/**
 * Fetches user / script property value by key;
 * @param {String} key key of the property to find;
 * @param {String} type 'user' or 'script' to determine prop type to get;
 * @returns {String}
 */


function getProperty(_x, _x2) {
  return _getProperty.apply(this, arguments);
}
/**
 * Fetches an sets user / script property by key;
 * @param {String} key key of the property to find;
 * @param {String} value new value of the property;
 * @param {String} type 'user' or 'script' to determine prop type to get;
 */


function _getProperty() {
  _getProperty = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(key, type) {
    var props, value;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = type;
          _context.next = _context.t0 === 'script' ? 3 : _context.t0 === 'user' ? 5 : 7;
          break;

        case 3:
          props = PropertiesService.getScriptProperties();
          return _context.abrupt("break", 7);

        case 5:
          props = PropertiesService.getUserProperties();
          return _context.abrupt("break", 7);

        case 7:
          _context.next = 9;
          return props.getProperty(key);

        case 9:
          value = _context.sent;
          _context.prev = 10;
          value = JSON.parse(value);
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t1 = _context["catch"](10);
          return _context.abrupt("return", value);

        case 17:
          return _context.abrupt("return", value);

        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[10, 14]]);
  }));
  return _getProperty.apply(this, arguments);
}

function setProperty(_x3, _x4, _x5) {
  return _setProperty.apply(this, arguments);
}
/**
 * Deletes a user / script property by key;
 * @param {String} key key of the property to find;
 * @param {String} type 'user' or 'script' to determine prop type to get;
 */


function _setProperty() {
  _setProperty = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(key, value, type) {
    var props;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = type;
          _context2.next = _context2.t0 === 'script' ? 3 : _context2.t0 === 'user' ? 5 : 7;
          break;

        case 3:
          props = PropertiesService.getScriptProperties();
          return _context2.abrupt("break", 7);

        case 5:
          props = PropertiesService.getUserProperties();
          return _context2.abrupt("break", 7);

        case 7:
          _context2.prev = 7;
          value = JSON.stringify(value);
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t1 = _context2["catch"](7);
          _context2.next = 15;
          return props.setProperty(key, value);

        case 15:
          _context2.next = 17;
          return props.setProperty(key, value);

        case 17:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[7, 11]]);
  }));
  return _setProperty.apply(this, arguments);
}

function deleteProperty(_x6, _x7) {
  return _deleteProperty.apply(this, arguments);
}
/**
 * Deletes every user / script property set;
 * @param {String} key key of the property to find
 * @param {String} type 'user' or 'script' to determine prop type to get 
 */


function _deleteProperty() {
  _deleteProperty = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(key, type) {
    var props;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.t0 = type;
          _context3.next = _context3.t0 === 'script' ? 3 : _context3.t0 === 'user' ? 5 : 7;
          break;

        case 3:
          props = PropertiesService.getScriptProperties();
          return _context3.abrupt("break", 7);

        case 5:
          props = PropertiesService.getUserProperties();
          return _context3.abrupt("break", 7);

        case 7:
          _context3.next = 9;
          return props.deleteProperty(key);

        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _deleteProperty.apply(this, arguments);
}

function deleteAllProperties(_x8) {
  return _deleteAllProperties.apply(this, arguments);
}

function _deleteAllProperties() {
  _deleteAllProperties = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(type) {
    var props;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.t0 = type;
          _context4.next = _context4.t0 === 'script' ? 3 : _context4.t0 === 'user' ? 5 : 7;
          break;

        case 3:
          props = PropertiesService.getScriptProperties();
          return _context4.abrupt("break", 7);

        case 5:
          props = PropertiesService.getUserProperties();
          return _context4.abrupt("break", 7);

        case 7:
          _context4.next = 9;
          return props.deleteAllProperties();

        case 9:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _deleteAllProperties.apply(this, arguments);
}