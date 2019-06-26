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
}
/**
 * Performs URL fetch with payload to external service;
 * @param {String} url url to be passed to request;
 * @param {Object} headers headers to be passed to request;
 * @param {Object} payload payload to be passed to request;
 * @returns {Object}
 */


function performFetch(_x, _x2, _x3, _x4) {
  return _performFetch.apply(this, arguments);
}

function _performFetch() {
  _performFetch = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(url, method, headers, payload) {
    var params, response, code, content, isValid;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          params = {
            'method': method,
            'muteHttpExceptions': true,
            'contentType': 'application/json',
            'headers': headers
          };

          if (method !== 'get') {
            params.payload = JSON.stringify(payload);
          }

          _context.next = 5;
          return UrlFetchApp.fetch(url, params);

        case 5:
          response = _context.sent;
		  console.log('RESP')
		  console.log(response)
          code = response.getResponseCode();
          headers = response.getHeaders();
          content = response.getContentText();
          isValid = content !== null && content !== undefined;

          if (!isValid) {
            content = '[]';
          }

          return _context.abrupt("return", {
            code: code,
            headers: headers,
            content: content
          });

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0); //handles request exceptions not caught by muteHttpExceptions;

          console.error(_context.t0);
          return _context.abrupt("return", {
            code: 0,
            //0 signifies custom error;
            headers: {},
            //headers not needed for error prompt;
            content: {
              descr: _context.t0.message
            }
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 14]]);
  }));
  return _performFetch.apply(this, arguments);
}