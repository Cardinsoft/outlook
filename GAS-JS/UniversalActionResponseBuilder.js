function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** UniversalActionResponseBuilder class */
let UniversalActionResponseBuilder =
/*#__PURE__*/
function () {
  function UniversalActionResponseBuilder() {
    _classCallCheck(this, UniversalActionResponseBuilder);

    this.openLink;
  }

  _createClass(UniversalActionResponseBuilder, [{
    key: "setOpenLink",
    value: function setOpenLink(openLink) {
      this.openLink = openLink;
      return this;
    }
  }, {
    key: "displayAddOnCards",
    value: function () {
      var _displayAddOnCards = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(cardObjects) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              cardObjects.forEach(
              /*#__PURE__*/
              function () {
                var _ref = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(cardObject) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        console.log(cardObject.appendToUi);

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));

                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }());

            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));

      function displayAddOnCards(_x) {
        return _displayAddOnCards.apply(this, arguments);
      }

      return displayAddOnCards;
    }()
  }, {
    key: "build",
    value: function build() {
      const response = new UniversalActionResponse(this);
      return response; //TODO: refactor;
    }
  }]);

  return UniversalActionResponseBuilder;
}();
/** UniversalActionResponse class */


let UniversalActionResponse = function UniversalActionResponse(builder) {
  _classCallCheck(this, UniversalActionResponse);

  this.returns = builder;
}; //TODO printJSON()