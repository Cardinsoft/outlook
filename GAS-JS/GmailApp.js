//Emulate GmailApp service (partially);
class e_GmailApp {
	constructor() {
		this.className = 'GmailApp';
	}
}

/**
 * Sets message access token;
 * @param {String} accessToken token to set;
 */
e_GmailApp.prototype.setCurrentMessageAccessToken = function (accessToken) {
	
}

/**
 * Gets message by its Id;
 * @param {String} messageId message Id to lookup;
 */
e_GmailApp.prototype.getMessageById = function (messageId) {
	const item = Office.context.mailbox.item;
	
	const name = Office.context.mailbox.item.sender.displayName;
	const email = Office.context.mailbox.item.sender.emailAddress;
	const msgFrom = `${name} <${email}>`;
	
	const msg = new Message( msgFrom,'',item.cc,item.dateTimeCreated.toUTCString(),item.body,item.normalizedSubject, item.itemId, item );
	return msg;	
}

//initiate GmailApp service;
const GmailApp = new e_GmailApp();