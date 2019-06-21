"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

//Emulate Class ActionResponseBuilder for CardService service;
let ActionResponseBuilder = function ActionResponseBuilder() {
  (0, _classCallCheck2.default)(this, ActionResponseBuilder);
  this.navigation;
  this.notification;
  this.openLink;
  this.stateChanged = false;
}; //add new methods to the class;


ActionResponseBuilder.prototype.setNavigation = function (navigation) {
  this.navigation = navigation;
  return this;
};

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

ActionResponseBuilder.prototype.build = function () {
  const notif = this.notification;

  if (notif) {
    const ui = $('#main-Ui-wrap');
    notif.appendToUi(ui);
    return this;
  }
};