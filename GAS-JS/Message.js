"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate Message class that is obtained from current message auth flow;
var Message = function Message(msgFrom, msgBcc, msgCc, msgDate, msgPlainBody, msgSubject, msgId, msgThread) {
  _classCallCheck(this, Message);

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


var Thread = function Thread(msgThread) {
  _classCallCheck(this, Thread);

  this.id;
  this.labels;
  this.messages = [msgThread];
};

Thread.prototype.getId = function () {
  //access current message;
  var curr = this.messages[0]; //return conversation Id;

  return curr.conversationId;
};
/**
 * Emulates getLabels method with Categories API (as categories are not in core yet);
 * @returns {Array}
 */


Thread.prototype.getLabels =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var curr, id;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
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
    }
  }, _callee, this);
}));

Thread.prototype.removeLabel = function (label) {};