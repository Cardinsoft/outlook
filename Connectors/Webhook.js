function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//Flow connector class;
function Flow() {
  Connector.call(this);
  this.icon = globalIconWebhook;
  this.typeName = 'Webhook';
  this.short = globalWebhookShort;
  this.allowCustomIcons = true;
  this.config = [{
    'header': 'Webhook config',
    'isCollapsible': false,
    'widgets': [{
      'name': globalURLfieldName,
      'type': 'TextInput',
      'title': 'Webhook URL',
      'content': '',
      'hint': 'e.g. Http get or post URL'
    }]
  }];
  this.auth = {};

  this.run =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(msg, connector, data) {
      var method, headers, trimmed, payload, result, content, returned;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            //set method for url fetch ('get' or 'post' for now);
            method = 'post'; //set headers for url fetch;

            headers = {};
            connector.method = 'send'; //set payload in case POST request will be triggered;

            trimmed = trimMessage(msg, true, true);
            payload = {
              'Bcc': msg.getBcc(),
              'Cc': msg.getCc(),
              'date': msg.getDate(),
              'sender': trimmed.name,
              'from': trimmed.email,
              'id': msg.getId(),
              'subject': msg.getSubject()
            };

            if (data) {
              payload.data = data;
            } //perform data fetch and return result;


            _context.next = 8;
            return performFetch(connector.url, method, headers, payload);

          case 8:
            result = _context.sent;
            content = result.content;
            returned = {
              code: result.code,
              headers: result.headers,
              content: content
            };

            try {
              content = JSON.parse(content);

              if (content.hasMatch) {
                returned.content = content.content;
                returned.hasMatch = content.hasMatch;
              }
            } catch (e) {
              console.log('Webhook Connector tried to parse response and failed - this error is usually harmless');
            }

            return _context.abrupt("return", returned);

          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
} //chain custom connector to base class;


Flow.prototype = Object.create(Connector.prototype);