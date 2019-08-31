function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Session class;
 */
let e_Session =
/*#__PURE__*/
function () {
  function e_Session() {
    _classCallCheck(this, e_Session);

    this.user;
    this.locale;
    this.timezone;
  }

  _createClass(e_Session, [{
    key: "getActiveUser",
    value: function getActiveUser() {}
  }, {
    key: "getActiveUserLocale",
    value: function getActiveUserLocale() {}
  }, {
    key: "getEffectiveUser",
    value: function getEffectiveUser() {}
  }, {
    key: "getScriptTimeZone",
    value: function getScriptTimeZone() {}
  }]);

  return e_Session;
}();
/**
 * User class;
 */


let User =
/*#__PURE__*/
function () {
  function User() {
    _classCallCheck(this, User);

    this.email;
  }
  /**
   * Gets user email (either active or effective);
   * @return {String} this user email;
   */


  _createClass(User, [{
    key: "getEmail",
    value: function getEmail() {
      return this.email;
    }
  }]);

  return User;
}();