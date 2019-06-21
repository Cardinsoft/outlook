function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * PropertiesService constructor function;
 */
function e_PropertiesService() {
  this.className = 'PropertiesService';
  this.settings = Office.context.roamingSettings;
  this.documentProperties = null;
  this.scriptProperties = null;
  this.userProperties = null;
  this.updated = false;
}
/**
 * Access document properties;
 * @returns {Object} Properties instance;
 */


e_PropertiesService.prototype.getDocumentProperties = function () {
  const settings = this.documentProperties;
  return new Properties(settings, 'document');
};
/**
 * Access script properties;
 * @returns {Object} Properties instance;
 */


e_PropertiesService.prototype.getScriptProperties = function () {
  const settings = this.scriptProperties;
  return new Properties(settings, 'script');
};
/**
 * Access user properties;
 * @returns {Object} Properties instance;
 */


e_PropertiesService.prototype.getUserProperties = function () {
  const settings = Office.context.roamingSettings;
  return new Properties(settings, 'user');
};
/**
 * Properties class constructor function;
 */


function Properties(type) {
  this.className = 'Properties';
  this.type = type;
}
/**
 * Get property by key;
 * @param {String} key key to access property by;
 * @returns {Object|null} this property;
 */


Properties.prototype.getProperty =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(key) {
    var settings, property;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!PropertiesService.updated) {
            settings = Object.create(PropertiesService.settings); //copy settings to in-memory Object;

            PropertiesService.userProperties = settings; //set settings to in-memory Object;

            PropertiesService.updated = true; //prompt service to use in-memory Object;
          } else {
            settings = PropertiesService.userProperties; //user UP storage; TODO: different types;
          }

          _context.next = 3;
          return settings.get(key);

        case 3:
          property = _context.sent;

          if (!property) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", property);

        case 8:
          return _context.abrupt("return", null);

        case 9:
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
 * Set property by key;
 * @param {String} key key to access property by;
 * @param {String} value stringified representation of value;
 * @returns {Object} this settings;
 */


Properties.prototype.setProperty =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(key, value) {
    var settings;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!PropertiesService.updated) {
            settings = Object.create(PropertiesService.settings); //copy settings to in-memory Object;

            PropertiesService.userProperties = settings; //set settings to in-memory Object;

            PropertiesService.updated = true; //prompt service to use in-memory Object;		
          } else {
            settings = PropertiesService.userProperties; //user UP storage; TODO: different types;
          }

          _context2.next = 3;
          return settings.set(key, value);

        case 3:
          _context2.next = 5;
          return PropertiesService.settings.set(key, value);

        case 5:
          console.log(JSON.parse(PropertiesService.userProperties.get(key)));
          _context2.next = 8;
          return PropertiesService.settings.saveAsync();

        case 8:
          return _context2.abrupt("return", settings);

        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Deletes property by key;
 * @param {String} key key to access property by;
 * @returns {Object} this settings;
 */


Properties.prototype.deleteProperty =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(key) {
    var settings;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!PropertiesService.updated) {
            settings = Object.create(PropertiesService.settings); //copy settings to in-memory Object;

            PropertiesService.userProperties = settings; //set settings to in-memory Object;

            PropertiesService.updated = true; //prompt service to use in-memory Object;		
          } else {
            settings = PropertiesService.userProperties; //user UP storage; TODO: different types;
          }

          _context3.next = 3;
          return settings.remove(key);

        case 3:
          _context3.next = 5;
          return PropertiesService.settings.remove(key);

        case 5:
          console.log(JSON.parse(PropertiesService.userProperties.get(key)));
          _context3.next = 8;
          return PropertiesService.settings.saveAsync();

        case 8:
          return _context3.abrupt("return", settings);

        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Sets multiple properties;
 * @param {Array} properties list of property keys;
 * @param {Boolean} deleteAllOthers delete all others or not;
 * @returns {Object} this settings;
 */


Properties.prototype.setProperties =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(properties, deleteAllOthers) {
    var settings, key, value, type;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          //add delete others after initial release;
          settings = this.settings; //set properties;

          _context4.t0 = regeneratorRuntime.keys(properties);

        case 2:
          if ((_context4.t1 = _context4.t0()).done) {
            _context4.next = 9;
            break;
          }

          key = _context4.t1.value;
          value = properties[key];
          _context4.next = 7;
          return settings.setProperty(key, value);

        case 7:
          _context4.next = 2;
          break;

        case 9:
          //persist changes;
          this.settings = JSON.stringify(settings);
          PropertiesService.userProperties.saveAsync(); //acess storage type;

          type = this.type; //update RoamingSettings in PropertiesService and return;

          if (type === 'user') {
            PropertiesService.userProperties = JSON.stringify(settings);
          }

          return _context4.abrupt("return", settings);

        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4, this);
  }));

  return function (_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Deletes all properties from storage;
 * @returns {Object} this settings;
 */


Properties.prototype.deleteAllProperties =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee5() {
  var settings, keys, p, key, obj, props, k, prop;
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) switch (_context5.prev = _context5.next) {
      case 0:
        //initiate settings storage;
        if (!PropertiesService.updated) {
          settings = Object.create(PropertiesService.settings); //copy settings to in-memory Object;

          PropertiesService.userProperties = settings; //set settings to in-memory Object;

          PropertiesService.updated = true; //prompt service to use in-memory Object;		
        } else {
          settings = PropertiesService.userProperties; //user UP storage; TODO: different types;
        } //access configured keys;


        keys = Object.keys(settings['_settingsData$p$0']);
        console.log(keys); //delete every key found;

        _context5.t0 = regeneratorRuntime.keys(keys);

      case 4:
        if ((_context5.t1 = _context5.t0()).done) {
          _context5.next = 23;
          break;
        }

        p = _context5.t1.value;
        key = keys[p]; //access settings props;

        obj = settings.get(key); //remove every setting;

        if (!(obj !== null)) {
          _context5.next = 21;
          break;
        }

        props = Object.keys(obj);

        if (!(props.length > 0)) {
          _context5.next = 21;
          break;
        }

        _context5.t2 = regeneratorRuntime.keys(props);

      case 12:
        if ((_context5.t3 = _context5.t2()).done) {
          _context5.next = 21;
          break;
        }

        k = _context5.t3.value;
        prop = props[k];
        _context5.next = 17;
        return settings.remove(key);

      case 17:
        _context5.next = 19;
        return PropertiesService.settings.remove(key);

      case 19:
        _context5.next = 12;
        break;

      case 21:
        _context5.next = 4;
        break;

      case 23:
        _context5.next = 25;
        return PropertiesService.settings.saveAsync();

      case 25:
        return _context5.abrupt("return", settings);

      case 26:
      case "end":
        return _context5.stop();
    }
  }, _callee5);
})); //Properties.prototype.getKeys = function () {} - not needed for initial release;
//Properties.prototype.getProperties = function () {} - not needed for initial release;