function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//Emulate Message class that is obtained from current message auth flow;
let Message =
/*#__PURE__*/
function () {
  function Message(msg) {
    _classCallCheck(this, Message);

    this.id = msg.id;
    this.from = msg.from;
    this.to = msg.to;
    this.subject = msg.subject || '';
    this.bcc = msg.bcc || [];
    this.cc = msg.cc || [];
    this.plain = msg.plain || '';
    this.date = new Date(msg.date);
    this.thread = msg.thread;
  }

  _createClass(Message, [{
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "getFrom",
    value: function getFrom() {
      return this.from;
    }
  }, {
    key: "getTo",
    value: function getTo() {
      return this.to;
    }
  }, {
    key: "getSubject",
    value: function getSubject() {
      return this.subject;
    }
  }, {
    key: "getCc",
    value: function getCc() {
      return this.cc.join(',');
    }
  }, {
    key: "getBcc",
    value: function getBcc() {
      return this.bcc.join(',');
    }
  }, {
    key: "getDate",
    value: function getDate() {
      return this.date;
    }
  }, {
    key: "getPlainBody",
    value: function getPlainBody() {
      return this.plain;
    }
  }, {
    key: "getThread",
    value: function getThread() {
      return new Thread(this.thread);
    }
  }]);

  return Message;
}();

Message.prototype.getThread = function () {
  return new Thread(this.msgThread);
}; //Emulate GmailThread class (partially);


let Thread = function Thread(msgThread) {
  _classCallCheck(this, Thread);

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
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var curr, id;
  return regeneratorRuntime.wrap(function _callee$(_context) {
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