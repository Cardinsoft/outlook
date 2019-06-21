"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

//Emulate Message class that is obtained from current message auth flow;
let Message = function Message(msgFrom, msgBcc, msgCc, msgDate, msgPlainBody, msgSubject, msgId, msgThread) {
  (0, _classCallCheck2.default)(this, Message);
  this.msgFrom = msgFrom;
  this.msgBcc = msgBcc;
  this.msgCc = msgCc;
  this.msgDate = msgDate;
  this.msgPlainBody = msgPlainBody;
  this.msgSubject = msgSubject;
  this.msgId = msgId;
  this.msgThread = msgThread;
};

Message.prototype.getId = function () {
  return this.msgId;
};

Message.prototype.getBcc = function () {
  return this.msgBcc;
};

Message.prototype.getCc = function () {
  return this.msgCc;
};

Message.prototype.getDate = function () {
  return this.msgDate;
};

Message.prototype.getFrom = function () {
  return this.msgFrom;
};

Message.prototype.getPlainBody = function () {
  return this.msgPlainBody;
};

Message.prototype.getSubject = function () {
  return this.msgSubject;
};

Message.prototype.getThread = function () {
  return new Thread(this.msgThread);
}; //Emulate GmailThread class (partially);


let Thread = function Thread(msgThread) {
  (0, _classCallCheck2.default)(this, Thread);
  this.id;
  this.labels;
  this.messages = [msgThread];
};

Thread.prototype.getId = function () {
  //access current message;
  const curr = this.messages[0]; //return conversation Id;

  return curr.conversationId;
};
/**
 * Emulates getLabels method with Categories API (as categories are not in core yet);
 * @returns {Array}
 */


Thread.prototype.getLabels =
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var curr, id;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        //access current message;
        curr = this.messages[0]; //access current id;

        id = curr.itemId;
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

        return _context.abrupt("return", []);

      case 3:
      case "end":
        return _context.stop();
    }
  }, _callee, this);
}));

Thread.prototype.removeLabel = function (label) {};