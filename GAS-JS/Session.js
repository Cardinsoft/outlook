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

    this.user = new User();
    this.timezone;
  }
  /**
   * Gets active Add-in user;
   * @return {Object} active user;
   */


  _createClass(e_Session, [{
    key: "getActiveUser",
    value: function getActiveUser() {
      return this.user.setActive_();
    }
  }, {
    key: "getEffectiveUser",

    /**
     * Gets user under whose authority Add-in is running;
     * @return {Object} effective user;
     */
    value: function getEffectiveUser() {
      return this.user.setEffective_();
    }
  }, {
    key: "getActiveUserLocale",

    /**
     * Gets user locale preferences;
     * @return {String} user locale code;
     */
    value: function getActiveUserLocale() {
      let user = this.user.setActive_();
      return user.locale;
    }
  }, {
    key: "getScriptTimeZone",

    /**
     * Gets script timezone;
     * @return {String} timezone code;
     */
    value: function getScriptTimeZone() {
      return this.timezone;
    }
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
    this.user;
    this.locale;
  }

  _createClass(User, [{
    key: "setActive_",
    value: function setActive_() {
      //this.user = Office.context.mailbox.userProfile;
      //this.locale = Office.context.displayLanguage;
      //this.email = this.user.emailAddress;
      return this;
    }
  }, {
    key: "setEffective_",
    value: function setEffective_() {
      this.user = Office.context.mailbox.userProfile;
      this.locale = Office.context.displayLanguage;
      this.email = this.user.emailAddress;
      return this;
    }
  }, {
    key: "getEmail",

    /**
     * Gets user email (either active or effective);
     * @return {String} this user email;
     */
    value: function getEmail() {
      return this.user.email;
    }
  }]);

  return User;
}();