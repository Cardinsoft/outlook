"use strict";

import _regeneratorRuntime from "@babel/runtime/regenerator";

function _readOnlyError(name) {
  throw new Error("\"" + name + "\" is read-only");
}

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

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
} //Emulate OAuth2 object (instead of library call);


var e_OAuth2 = function e_OAuth2() {
  _classCallCheck(this, e_OAuth2);

  this.service;
};
/**
 * Create OAuth2 service object;
 * @param {String} name service name to set;
 * @returns {Object}
 */


e_OAuth2.prototype.createService = function (name) {
  //initiate Service;
  this.service = new Service(name); //return Service;

  return this.service;
}; //emulate service object creation;


var Service =
/*#__PURE__*/
function () {
  function Service(name) {
    _classCallCheck(this, Service);

    this.params = {
      providerID: name,
      redirect_uri: 'https://cardinsoft.github.io/outlook/OAuth2-result.html'
    };
  }

  _createClass(Service, [{
    key: "build",
    value: function build() {
      var service = {};
      return service;
    }
  }]);

  return Service;
}(); //add new methods to the class - FOR NOW WITH NO OPTIONAL PARAMETERS;


Service.prototype.getAuthorizationUrl = function (parameters) {
  //initiate Service with set parameters;
  var service = this.build();
  var params = this.params;
  var base = params.authorization + '?';
  var query = [];

  for (var key in params) {
    if (key !== 'scope') {
      query.push(key + '=' + params[key]);
    }
  }

  query = query.join('&');
  console.log(base + query);
  return base + query;
};

Service.prototype.setAuthorizationBaseUrl = function (urlAuth) {
  //access parameters;
  var params = this.params;
  params.authorization = urlAuth;
  return this;
};

Service.prototype.setRedirectUri = function (redirectUri) {
  //access parameters;
  var params = this.params;
  params.redirect_uri = redirectUri;
  return this;
};

Service.prototype.setTokenUrl = function (urlToken) {
  //access parameters;
  var params = this.params;
  params.token = urlToken;
  return this;
};

Service.prototype.setClientId = function (clientId) {
  //access parameters;
  var params = this.params;
  params.client_id = clientId;
  return this;
};

Service.prototype.setClientSecret = function (secret) {
  //access parameters;
  var params = this.params;
  params.client_secret = secret;
  return this;
};

Service.prototype.setScope = function (scope) {
  //access parameters;
  var params = this.params;
  params.scopes = {}; //access scopes;

  var scopes = params.scopes;
  scopes.request = [];
  scopes.require = []; //access request & require;

  var request = scopes.request;
  var require = scopes.require; //add scope to scopes list;

  request.push(scope);

  require.push(scope);

  return this;
};

Service.prototype.setCallbackFunction = function (callback) {};

Service.prototype.setParam = function (key, value) {
  //access parameters;
  var params = this.params;
  params[key] = value;
  return this;
};

Service.prototype.setPropertyStore = function (userStore) {
  this;
};

Service.prototype.setCache = function (userCache) {};

Service.prototype.setLock = function (userLock) {};

Service.prototype.hasAccess = function () {
  //initiate Service with set parameters;
  var service = this.build(); //await for token;

  var hasToken = service.checkToken();
  return false;
};

Service.prototype.getAccessToken =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee() {
  var service, captured;
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //initiate Service with set parameters;
          service = this.build();
          service.setLoader(jso.IFramePassive);
          captured = null; //obtain token;

          service.getToken().then(function (token) {
            captured = (_readOnlyError("captured"), token);
            console.log(token);
          }).catch(function (error) {
            console.log(error);
          });
          console.log(captured);
          return _context.abrupt("return", captured);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));
Service.prototype.wipeTokens =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee2() {
  return _regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return");

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
}));
Service.prototype.reset =
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee3() {
  return _regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return this.wipeTokens();

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3, this);
}));
var OAuth2 = new e_OAuth2();