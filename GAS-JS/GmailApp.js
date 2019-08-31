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
    let nameFrom = item.sender.displayName;
    let emailFrom = item.sender.emailAddress;
    let msgFrom = "".concat(nameFrom, " <").concat(emailFrom, ">");
    let msgTo = item.to;
    msgTo = msgTo.map(function (r) {
      return "".concat(r.displayName, " <").concat(r.emailAddress, ">");
    });
    let msgBcc = item.bcc;
    msgBcc = msgBcc.map(function (bcc) {
      return "".concat(bcc.displayName, " <").concat(bcc.emailAddress, ">");
    });
    let msgCc = item.cc;
    msgCc = msgCc.map(function (cc) {
      return "".concat(cc.displayName, " <").concat(cc.emailAddress, ">");
    });
    const config = {
      id: item.itemId,
      from: msgFrom,
      to: msgTo,
      subject: item.normalizedSubject,
      bcc: msgBcc,
      cc: msgCc,
      date: item.dateTimeCreated.toUTCString(),
      plain: item.body,
      thread: item.conversationId
    };
    const msg = new Message(config);
    return msg;
  }
}; //initiate GmailApp service;


const GmailApp = new e_GmailApp();