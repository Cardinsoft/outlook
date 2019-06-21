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
 * Creates new connector and saves it to properties;
 * @param {Object} e event object;
 */


function createConnector(_x) {
  return _createConnector.apply(this, arguments);
}
/**
 * Updates connector and saves it to properties;
 * @param {Object} e event object;
 */


function _createConnector() {
  _createConnector = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(e) {
    var builder, data, multi, isDefault, useManual, type, cType, connector, key, value, multivalue, cAuth, auth, scope, urlAuth, urlToken, id, secret, hint, offline, prompt, authType, usercode, apitoken, config, newID;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //access form input parameters;

          data = e.formInput;
          multi = e.formInputs;
          isDefault = data.isDefault;
          useManual = data.manual; //set to false if switched off;

          if (isDefault === undefined) {
            isDefault = false;
          }

          if (useManual === undefined) {
            useManual = false;
          } //initialize connector type;


          type = e.parameters.type;
          cType = new this[type](); //connector default properties;

          connector = {
            type: type,
            isDefault: isDefault,
            manual: useManual
          }; //set connector properties;

          for (key in data) {
            value = data[key]; //set multiple values if select input is present;

            multivalue = multi[key];

            if (multivalue.length > 1) {
              connector[key] = multivalue;
            } else {
              connector[key] = value;
            } //override stringifyed booleans;


            if (value === 'true') {
              value = true;
            }

            if (value === 'false') {
              value = false;
            } //default icon, name and url if custom connector and no content provided;


            if (value === '' && type === globalBaseClassName) {
              if (key === globalIconFieldName) {
                connector[key] = globalCustomIconUrl;
              }

              if (key === globalNameFieldName) {
                connector[key] = globalCustomNameName;
              }

              if (key === globalURLfieldName) {
                connector[key] = globalCustomUrlUrl;
              }
            }
          } //set icon and url for typed connectors;


          if (type !== globalBaseClassName) {
            //handle connector icon creation;
            if (data.hasOwnProperty(globalIconFieldName) && data[globalIconFieldName] !== '') {
              connector[globalIconFieldName] = data[globalIconFieldName];
            } else {
              connector[globalIconFieldName] = cType[globalIconFieldName];
            } //handle connector name creation;


            if (data[globalNameFieldName] === '') {
              connector[globalNameFieldName] = cType[globalNameFieldName];
            } //handle connector url creation;


            if (data.hasOwnProperty(globalURLfieldName)) {
              connector[globalURLfieldName] = data[globalURLfieldName];
            } else if (cType.hasOwnProperty(globalURLfieldName)) {
              connector[globalURLfieldName] = cType[globalURLfieldName];
            }
          } //add auth type property if connector type does not specify any;


          cAuth = new this[type]().auth;

          if (Object.keys(cAuth).length === 0) {
            auth = data.auth;

            if (data.auth === undefined) {
              auth = 'none';
            }

            connector.auth = auth;

            if (auth === globalOAuth2AuthType) {
              scope = data.scope;
              urlAuth = data.urlAuth;
              urlToken = data.urlToken;
              id = data.id;
              secret = data.secret;
              hint = data.hint;
              offline = data.offline;
              prompt = data.prompt;
              connector.scope = scope;
              connector.urlAuth = urlAuth;
              connector.urlToken = urlToken;
              connector.id = id;
              connector.secret = secret;

              if (hint) {
                connector.hint = hint;
              }

              if (offline) {
                connector.offline = offline;
              }

              if (prompt) {
                connector.prompt = prompt;
              }
            }
          } else {
            //build auth properties according to type;
            authType = cAuth.type;
            connector.auth = authType;

            if (authType === globalApiTokenAuthType) {
              //access user input for auth;
              usercode = data.usercode;
              apitoken = data.apitoken; //set auth properties to connector;

              connector.usercode = usercode;
              connector.apitoken = apitoken;
            }
          }

          _context.prev = 14;
          _context.next = 17;
          return getConfig();

        case 17:
          config = _context.sent;

          if (!(config === null)) {
            _context.next = 21;
            break;
          }

          _context.next = 21;
          return createSettings();

        case 21:
          _context.next = 23;
          return getConfig();

        case 23:
          config = _context.sent; //reset default connectors if new one is default;

          if (connector.isDefault) {
            config.forEach(function (conn) {
              if (conn.isDefault || conn.isDefault === undefined) {
                conn.isDefault = false;
              }
            });
          } //create connector and notify thwe user of success;


          config.push(connector); //generate new ID for the connector;

          newID = generateId(config);
          connector.ID = newID;
          _context.next = 30;
          return setProperty('config', config, 'user');

        case 30:
          builder.setNotification(notification(globalCreateSuccess));
          _context.next = 37;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](14); //notify the user that connector creation failed;

          console.error(_context.t0);
          builder.setNotification(error(globalCreateFailure));

        case 37:
          //change data state and build settings card;
          builder.setStateChanged(true);
          builder.setNavigation(CardService.newNavigation().popCard().updateCard(cardHome(e)));
          return _context.abrupt("return", builder.build());

        case 40:
        case "end":
          return _context.stop();
      }
    }, _callee, this, [[14, 33]]);
  }));
  return _createConnector.apply(this, arguments);
}

function updateConnector(_x2) {
  return _updateConnector.apply(this, arguments);
}
/**
 * Removes connector and saves properties;
 * @param {Object} e event object;
 */


function _updateConnector() {
  _updateConnector = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(e) {
    var builder, data, multi, icon, name, url, isDefault, useManual, ID, type, cType, connector, key, value, multivalue, cAuth, auth, scope, urlAuth, urlToken, id, secret, hint, offline, prompt, authType, usercode, apitoken, config, index;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder();
          data = e.formInput;
          multi = e.formInputs;
          icon = data[globalIconFieldName];
          name = data[globalNameFieldName];
          url = data[globalURLfieldName];
          isDefault = data.isDefault;
          useManual = data.manual;

          if (isDefault !== undefined) {
            isDefault = true;
          } else {
            isDefault = false;
          }

          if (useManual !== undefined) {
            useManual = true;
          } else {
            useManual = false;
          } //initialize connector type and get its ID;


          ID = e.parameters.ID;
          type = e.parameters.type;
          cType = new this[type](icon, name, url); //connector default properties;

          connector = {
            type: type,
            isDefault: isDefault,
            manual: useManual,
            ID: ID
          }; //set connector properties;

          for (key in data) {
            value = data[key]; //set multiple values if select input is present;

            multivalue = multi[key];

            if (multivalue.length > 1) {
              connector[key] = multivalue;
            } else {
              connector[key] = value;
            } //override stringifyed booleans;


            if (value === 'true') {
              value = true;
            }

            if (value === 'false') {
              value = false;
            } //default icon, name and url if custom connector and no content provided;


            if (value === '' && type === globalBaseClassName) {
              if (key === globalIconFieldName) {
                connector[key] = globalCustomIconUrl;
              }

              if (key === globalNameFieldName) {
                connector[key] = globalCustomNameName;
              }

              if (key === globalURLfieldName) {
                connector[key] = globalCustomUrlUrl;
              }
            }
          } //set icon and url for typed connectors;


          if (type !== globalBaseClassName) {
            //handle connector icon creation;
            if (data.hasOwnProperty(globalIconFieldName)) {
              connector[globalIconFieldName] = data[globalIconFieldName];
            } else {
              connector[globalIconFieldName] = cType[globalIconFieldName];
            } //handle connector name creation;


            if (data[globalNameFieldName] === '') {
              connector[globalNameFieldName] = cType[globalNameFieldName];
            } //handle connector url creation;


            if (data.hasOwnProperty(globalURLfieldName)) {
              connector[globalURLfieldName] = data[globalURLfieldName];
            } else if (cType.hasOwnProperty(globalURLfieldName)) {
              connector[globalURLfieldName] = cType[globalURLfieldName];
            }
          } //add auth type property if connector type does not specify any;


          cAuth = new this[type]().auth;

          if (Object.keys(cAuth).length === 0) {
            auth = data.auth;

            if (data.auth === undefined) {
              auth = 'none';
            }

            connector.auth = auth;

            if (auth === globalOAuth2AuthType) {
              scope = data.scope;
              urlAuth = data.urlAuth;
              urlToken = data.urlToken;
              id = data.id;
              secret = data.secret;
              hint = data.hint;
              offline = data.offline;
              prompt = data.prompt;
              connector.scope = scope;
              connector.urlAuth = urlAuth;
              connector.urlToken = urlToken;
              connector.id = id;
              connector.secret = secret;

              if (hint) {
                connector.hint = hint;
              }

              if (offline) {
                connector.offline = offline;
              }

              if (prompt) {
                connector.prompt = prompt;
              }
            }
          } else {
            //build auth properties according to type;
            authType = cAuth.type;
            connector.auth = authType;

            if (authType === globalApiTokenAuthType) {
              //access user input for auth;
              usercode = data.usercode;
              apitoken = data.apitoken; //set auth properties to connector;

              connector.usercode = usercode;
              connector.apitoken = apitoken;
            }
          } //connector index (for ease of flow);


          _context2.next = 20;
          return getConfig();

        case 20:
          config = _context2.sent;
          index = getIndex(config, e.parameters);
          _context2.prev = 22;
          _context2.next = 25;
          return getConfig();

        case 25:
          config = _context2.sent; //reset default connectors if updated one is default;

          if (connector.isDefault) {
            config.forEach(function (conn) {
              if (conn.isDefault || conn.isDefault === undefined) {
                conn.isDefault = false;
              }
            });
          } //update connector and notify the user of success;


          config[index] = connector;
          _context2.next = 30;
          return setProperty('config', config, 'user');

        case 30:
          builder.setNotification(notification(globalUpdateSuccess));
          _context2.next = 36;
          break;

        case 33:
          _context2.prev = 33;
          _context2.t0 = _context2["catch"](22); //notify the user that connector update failed;

          builder.setNotification(error(globalUpdateFailure));

        case 36:
          //change data state and build settings card;
          builder.setStateChanged(true);
          builder.setNavigation(CardService.newNavigation().popCard().updateCard(cardHome(e)));
          return _context2.abrupt("return", builder.build());

        case 39:
        case "end":
          return _context2.stop();
      }
    }, _callee2, this, [[22, 33]]);
  }));
  return _updateConnector.apply(this, arguments);
}

function removeConnector(_x3) {
  return _removeConnector.apply(this, arguments);
}

function _removeConnector() {
  _removeConnector = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(e) {
    var builder, config, index, params, form, cType, uninstall, src;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //connector index (for ease of flow);

          _context3.next = 3;
          return getConfig();

        case 3:
          config = _context3.sent;
          index = getIndex(config, e.parameters); //access parameters and formInput;

          params = e.parameters;
          form = e.formInput;
          cType = new this[params.type](); //uninstall Application from endpoint;

          uninstall = form.uninstall;

          if (uninstall) {
            new this[params.type]().uninstall(params);
          }

          _context3.prev = 10;
          _context3.next = 13;
          return getConfig();

        case 13:
          src = _context3.sent; //remove connector and notify the user of success;

          src = src.filter(function (connect, idx) {
            if (idx !== index) {
              return connect;
            }
          });
          _context3.next = 17;
          return setProperty('config', src, 'user');

        case 17:
          builder.setNotification(notification(globalRemoveSuccess));
          _context3.next = 23;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](10); //notify the user that connector removal failed;

          builder.setNotification(error(globalRemoveFailure));

        case 23:
          //change data state and build settings card;
          builder.setStateChanged(true);
          builder.setNavigation(CardService.newNavigation().popCard().updateCard(cardHome(e)));
          return _context3.abrupt("return", builder.build());

        case 26:
        case "end":
          return _context3.stop();
      }
    }, _callee3, this, [[10, 20]]);
  }));
  return _removeConnector.apply(this, arguments);
}