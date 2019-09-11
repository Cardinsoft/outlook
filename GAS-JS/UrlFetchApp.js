function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate HTTPResponse class;
let HTTPResponse = function HTTPResponse(headers, content, code) {
  _classCallCheck(this, HTTPResponse);

  this.className = 'HTTPResponse';
  this.headers = headers;
  this.content = content;
  this.code = code;
}; //add new methods to the class;


HTTPResponse.prototype.getHeaders = function () {
  return this.headers;
};

HTTPResponse.prototype.getAs = function (contentType) {//future release;
};

HTTPResponse.prototype.getContentText = function () {
  if (!this.content) {
    return '';
  }

  return this.content.toString();
};

HTTPResponse.prototype.getResponseCode = function () {
  return this.code;
}; //Emulate UrlFetchApp service;


let e_UrlFetchApp = function e_UrlFetchApp() {
  _classCallCheck(this, e_UrlFetchApp);

  this.className = 'UrlFetchApp';
};

e_UrlFetchApp.prototype.fetch =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(url, params) {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(params.muteHttpExceptions === true)) {
            _context.next = 15;
            break;
          }

          _context.prev = 1;
          _context.next = 4;
          return makeRequest(url, params);

        case 4:
          response = _context.sent;
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);

          if (!(_context.t0.code === 999)) {
            _context.next = 11;
            break;
          }

          throw new Error(_context.t0.content);

        case 11:
          if (!(response.code === 500 && response.content === 'DNS error')) {
            _context.next = 13;
            break;
          }

          throw new Error('DNS error: ' + url);

        case 13:
          _context.next = 18;
          break;

        case 15:
          _context.next = 17;
          return makeRequest(url, params);

        case 17:
          response = _context.sent;

        case 18:
          return _context.abrupt("return", new HTTPResponse(response.headers, response.content, response.code));

        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

const UrlFetchApp = new e_UrlFetchApp();
/**
 * Makes a HTTP request with parameters (optional);
 * @param {String} url url to request;
 * @param {Object=} params parameters object;
 * @returns {Object} response object {code,content,headers} 
 */

function makeRequest(url, params) {
  return new Promise(function (resolve, reject) {
    //prefent defaulting to location.href and throw an error message;
    if (url === '') {
      //construct empty URL error;
      let emptyUrlErr = {
        code: 999,
        content: 'Attribute provided with no value: url',
        headers: {}
      };
      reject(emptyUrlErr);
    } //default to GET method if no params provided;


    if (!params) {
      params = {
        method: 'get'
      };
    } //initiate and open XMLHttpRequest;


    let request = new XMLHttpRequest(); //check for IE11;

    try {
      request.timeout = 29000;
    } catch (error) {
      console.log('Using older browser with poor request timeout support (expect timeout to differ from 30s)');
    }

    request.open(params.method.toUpperCase(), 'https://cardin.azurewebsites.net/api/proxy?endpoint=' + url); //if content type is provided -> set request Content-Type header;

    if (params.contentType) {
      request.setRequestHeader('Content-Type', params.contentType);
    } //add headers if provided;


    if (params.headers) {
      //access headers to set with request;
      const hs = params.headers; //set request header for each param header;

      for (let key in hs) {
        let value = hs[key];

        if (value) {
          request.setRequestHeader(key, value);
        }
      }
    } //handle load event (set headers and resolve objects);


    request.onload = function () {
      let status = request.status;
      let response = request.response;
      let headers = request.getAllResponseHeaders().trim().split(/[\r\n]+/);
      let map = {}; //map response headers;

      headers.forEach(function (header) {
        let data = header.split(': ');
        let name = data.shift();
        let value = data.join(': ');
        map[name] = value;
      }); //construct response object;

      let obj = {
        code: status,
        content: response,
        headers: map
      };
      resolve(obj);
    }; //handle timeout event;


    try {
      request.ontimeout = function () {
        let statusText = request.statusText; //construct timeout response object;

        let timeout = {
          code: request.status,
          content: statusText,
          headers: {}
        };
        resolve(timeout);
      }; //send request with or without payload according to method;

    } catch (error) {
      console.log('Using older browser with poor request timeout event support (expect timeout to differ from 30s)');
    } //send request with or without payload according to method;


    if (params.payload && params.method !== 'get') {
      request.send(params.payload);
    } else {
      request.send();
    }
  });
}