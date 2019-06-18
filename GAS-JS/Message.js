//Emulate Message class that is obtained from current message auth flow;
class Message {
	constructor(msgFrom,msgBcc,msgCc,msgDate,msgPlainBody,msgSubject,msgId,msgThread) {
		this.msgFrom      = msgFrom;
		this.msgBcc       = msgBcc;
		this.msgCc        = msgCc;
		this.msgDate      = msgDate;
		this.msgPlainBody = msgPlainBody;
		this.msgSubject   = msgSubject;
		this.msgId        = msgId;
		this.msgThread    = msgThread;
	}
}
Message.prototype.getId = function () {
	return this.msgId;
}
Message.prototype.getBcc = function () {
	return this.msgBcc;
}
Message.prototype.getCc = function () {
	return this.msgCc;
}
Message.prototype.getDate = function () {
	return this.msgDate;
}
Message.prototype.getFrom = function () {
	return this.msgFrom;
}
Message.prototype.getPlainBody = function () {
	return this.msgPlainBody;
}
Message.prototype.getSubject = function () {
	return this.msgSubject;
}
Message.prototype.getThread = function () {
	return new Thread(this.msgThread);
}

//Emulate GmailThread class (partially);
class Thread {
	constructor(msgThread) {
		this.id;
		this.labels;
		this.messages = [msgThread];
	}

}
Thread.prototype.getId = function () {
		//access current message;
		const curr = this.messages[0];
		
		//return conversation Id;
		return curr.conversationId;
	}
	
/**
 * Emulates getLabels method with Categories API (as categories are not in core yet);
 * @returns {Array}
 */
Thread.prototype.getLabels = async function () {
	//access current message;
	const curr = this.messages[0];
	
	//access current id;
	const id = curr.itemId;
	
	/*
	//get access token;
	const options = {isRest: true};
	Office.context.mailbox.getCallbackTokenAsync(options,async function(token){
		
		//build url;
		const url = 'https://graph.microsoft.com/v1.0/me/messages/'+id;
		
		//make request to Graph API;
		const parameters = {
			method : 'get',
			headers : {
				Authorization : 'Bearer '+token.value
			}
		};
		const message = await UrlFetchApp.fetch(url,parameters);
		console.log(message);		
		
	});
	*/
	
	return [];
}
Thread.prototype.removeLabel = function (label) {}