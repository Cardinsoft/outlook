function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Returns an array of type config objects;
 * @param {Object=} filter filter settings;
 * @returns {Array} array of types;
 */
function getTypes(filter) {
  //create class instance to get config data;
  var close = new Close();
  var flow = new Flow();
  var lacrm = new LessAnnoyingCRM();
  var onecrm = new oneCRM();
  var pipedrive = new Pipedrive(); //set type names to function name;

  onecrm.name = oneCRM.name;
  close.name = Close.name;
  flow.name = Flow.name;
  lacrm.name = LessAnnoyingCRM.name;
  pipedrive.name = Pipedrive.name; //create an array of used types;

  var types = [close, flow, lacrm, pipedrive, onecrm]; //include dev-status connectors;

  if (!includeConnectorsInDev) {
    types = types.filter(function (type) {
      if (!type.dev) {
        return type;
      }
    });
  } //apply filter;


  if (filter) {
    return types.filter(function (type) {
      var compliant = true; //apply authorization type filter;

      if (filter.authType && type.auth.type !== filter.authType) {
        compliant = false;
      } //apply other filter options;


      for (var prop in filter) {
        if (filter[prop] && type[prop] !== filter[prop] && prop !== 'authType') {
          compliant = false;
        }
      }

      if (compliant) {
        return type;
      }
    });
  }

  return types;
}
/**
 * Returns Connectors configuration;
 * @param {Object=} filter filter settings;
 * @param {Boolean=} exclude flag to exclude or include matched Connectors;
 * @returns {Array} array of Connector config objects;
 */


function getConfig(_x, _x2) {
  return _getConfig.apply(this, arguments);
}

function _getConfig() {
  _getConfig = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(filter, exclude) {
    var connectors;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return getProperty('config', 'user');

        case 2:
          connectors = _context.sent;

          if (!(connectors === null)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", []);

        case 5:
          if (!filter) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", connectors.filter(function (connector) {
            var compliant = true;

            if (exclude) {
              //apply filters to exclude Connector matching filter;
              if (filter.authType && connector.auth === filter.authType) {
                compliant = false;
              }

              for (var prop in filter) {
                if (filter[prop] && (connector[prop] === filter[prop] || prop === 'authType')) {
                  compliant = false;
                }
              }
            } else {
              //apply filters to include Connector matching filter;
              if (filter.authType && connector.auth !== filter.authType) {
                compliant = false;
              }

              for (var prop in filter) {
                if (filter[prop] && connector[prop] !== filter[prop] && prop !== 'authType') {
                  compliant = false;
                }
              }
            }

            if (compliant) {
              return connector;
            }
          }));

        case 7:
          return _context.abrupt("return", connectors);

        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getConfig.apply(this, arguments);
}