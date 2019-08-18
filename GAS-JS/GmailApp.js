function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate GmailApp service (partially);
let e_GmailApp = function e_GmailApp() {
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
 * @return {Object} Message class instance;
 */


e_GmailApp.prototype.getMessageById = function (messageId) {
  const item = Office.context.mailbox.item;

  if (item !== null) {
    const name = Office.context.mailbox.item.sender.displayName;
    const email = Office.context.mailbox.item.sender.emailAddress;
    const msgFrom = "".concat(name, " <").concat(email, ">");
    const msg = new Message(msgFrom, '', item.cc, item.dateTimeCreated.toUTCString(), item.body, item.normalizedSubject, item.itemId, item);
    return msg;
  }
}; //initiate GmailApp service;


const GmailApp = new e_GmailApp();