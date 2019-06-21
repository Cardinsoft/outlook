function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
} //Basic Connector class;


function Connector(icon, name, url) {
  if (icon === undefined) {
    icon = '';
  }

  if (name === undefined) {
    name = '';
  }

  if (url === undefined) {
    url = '';
  }

  this.icon = globalCustomIconUrl;
  this.typeName = 'Connector';
  this.basic = {
    'header': 'Basic config',
    'isCollapsible': false,
    'widgets': [{
      'name': globalNameFieldName,
      'type': 'TextInput',
      'title': globalCustomWidgetNameTitle,
      'content': name,
      'hint': globalCustomWidgetNameHint
    }]
  };
  this.config = [];
  this.auth = {};

  this.run =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(msg, connector, data) {
      var method, headers, trimmed, labels, payload, parameters, service, bearer;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            //set method for url fetch ('get' or 'post' for now);
            method = 'post'; //set headers for url fetch;

            headers = {}; //set payload in case POST request will be triggered;

            trimmed = trimMessage(msg, true, true);
            labels = msg.getThread().getLabels().map(function (label) {
              return label.getName();
            });
            payload = {
              'Bcc': msg.getBcc(),
              'Cc': msg.getCc(),
              'date': msg.getDate(),
              'sender': trimmed.name,
              'from': trimmed.email,
              'id': msg.getId(),
              'subject': msg.getSubject(),
              'labels': labels
            };

            if (data) {
              payload.data = data;
            } //build authorization;


            if (connector.auth === 'OAuth2') {
              parameters = {
                'name': connector.name,
                'scope': connector.scope,
                'urlAuth': connector.urlAuth,
                'urlToken': connector.urlToken,
                'id': connector.id,
                'secret': connector.secret
              };

              if (connector.hint) {
                parameters.hint = connector.hint;
              }

              if (connector.offline) {
                parameters.offline = connector.offline;
              }

              if (connector.prompt) {
                parameters.prompt = connector.prompt;
              }

              service = authService(parameters);
              bearer = 'Bearer ' + service.getAccessToken();
              headers.Authorization = bearer;
              payload.Authorization = bearer;
            } //initiate request;


            _context.next = 9;
            return performFetch(connector.url, method, headers, payload);

          case 9:
            return _context.abrupt("return", _context.sent);

          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
}