"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate GmailApp service (partially);
var e_GmailApp = function e_GmailApp() {
  _classCallCheck(this, e_GmailApp);

  this.className = 'GmailApp';
};
/**
 * Sets message access token;
 * @param {String} accessToken token to set;
 */


e_GmailApp.prototype.setCurrentMessageAccessToken = function (accessToken) {};
/**
 * Gets message by its Id;
 * @param {String} messageId message Id to lookup;
 */


e_GmailApp.prototype.getMessageById = function (messageId) {
  var item = Office.context.mailbox.item;
  var name = Office.context.mailbox.item.sender.displayName;
  var email = Office.context.mailbox.item.sender.emailAddress;
  var msgFrom = "".concat(name, " <").concat(email, ">");
  var msg = new Message(msgFrom, '', item.cc, item.dateTimeCreated.toUTCString(), item.body, item.normalizedSubject, item.itemId, item);
  return msg;
}; //initiate GmailApp service;


var GmailApp = new e_GmailApp();