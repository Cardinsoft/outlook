function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** ActionResponseBuilder class */
let ActionResponseBuilder = function ActionResponseBuilder() {
  _classCallCheck(this, ActionResponseBuilder);

  this.navigation;
  this.notification;
  this.openLink;
  this.stateChanged = false;
};
/**
 * Sets navigation config;
 * @param {Navigation} navigation Navigation instance;
 * @return {ActionResponseBuilder} this instance;
 */


ActionResponseBuilder.prototype.setNavigation = function (navigation) {
  this.navigation = navigation;
  return this;
};
/**
 * Sets notification config;
 * @param {Notification} notification Notification instance;
 * @return {ActionResponseBuilder} this instance;
 */


ActionResponseBuilder.prototype.setNotification = function (notification) {
  this.notification = notification;
  return this;
};

ActionResponseBuilder.prototype.setOpenLink = function (openLink) {
  this.openLink = openLink;
  return this;
};

ActionResponseBuilder.prototype.setStateChanged = function (stateChanged) {
  this.stateChanged = stateChanged;
  return this;
};
/**
 * Builds action response from config;
 * @return {ActionResponse} this response object;
 */


ActionResponseBuilder.prototype.build =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var notif, ui, response, card;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        //if notification -> build;
        notif = this.notification;

        if (notif) {
          ui = $('#main-Ui-wrap');
          notif.appendToUi(ui);
        } //validate builder; //TODO: enable validation;


        response = new ActionResponse(this); //if navigation -> build card;

        if (!this.navigation) {
          _context.next = 8;
          break;
        }

        card = response.returns.navigation.card;
        _context.next = 7;
        return card.appendToUi();

      case 7:
        return _context.abrupt("return", card);

      case 8:
        return _context.abrupt("return", response);

      case 9:
      case "end":
        return _context.stop();
    }
  }, _callee, this);
}));
/** ActionResponse class */

let ActionResponse =
/*#__PURE__*/
function () {
  function ActionResponse(builder) {
    _classCallCheck(this, ActionResponse);

    this.className = 'ActionResponse';
    this.returns = builder;
  }
  /**
   * Prints out response for debug;
   * @return {String} JSON string;
   */


  _createClass(ActionResponse, [{
    key: "printJson",
    value: function printJson() {
      return JSON.stringify(this.returns);
    }
  }]);

  return ActionResponse;
}();