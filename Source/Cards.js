function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Creates and shows card with Connector add form;
 * @param {Object} e event object; 
 * @returns {Card}
 */
function cardCreate(_x) {
  return _cardCreate.apply(this, arguments);
}
/**
 * Creates and shows card with Connector update form;
 * @param {Object} e event object;
 * @returns {Card}
 */


function _cardCreate() {
  _cardCreate = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(e) {
    var builder, data, type, header, basic, widgets, advanced, config, auth;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          builder = CardService.newCardBuilder();
          data = e.formInput;
          type = e.parameters; //create and set card header;

          header = CardService.newCardHeader();
          header.setTitle(type.name);
          header.setImageUrl(type.icon);
          builder.setHeader(header); //access type's basic and advanced config;

          basic = JSON.parse(type.basic);
          widgets = basic.widgets;
          advanced = JSON.parse(type.config); //create section with short type description;

          if (type.short) {
            createDescriptionSection(builder, false, type.short);
          } //create section with custom icon URL input;


          if (type.allowCustomIcons === 'true') {
            createCustomIconsSection(builder, false);
          }

          if (advanced.length === 1) {
            //extend basic with advanced and create config section;
            advanced.forEach(function (c) {
              mergeObjects(widgets, c.widgets);
            }); //preserve values for config widgets;

            preserveValues(type, widgets); //create config object and section;

            config = {
              header: globalConfigHeader,
              widgets: widgets
            };
            createSectionAdvanced(builder, config, 0, type, config.widgets.length);
          } else {
            //preserve values for config widgets;
            preserveValues(type, basic.widgets); //create basic config section;

            createSectionAdvanced(builder, basic, 0, type, basic.widgets.length); //create advanced config sections;

            advanced.forEach(function (section, i) {
              createSectionAdvanced(builder, section, i, type, section.widgets.length);
            });
          } //create API token config section;


          auth = JSON.parse(type.auth);

          if (auth.type === globalApiTokenAuthType) {
            auth.config.isCollapsible = false; //make expanded by default;

            createSectionAdvanced(builder, auth.config, 0, type, auth.config.widgets.length);
          } //create config for connector behaviour;


          _context.next = 17;
          return createSectionAddConnector(builder, false, '', type);

        case 17:
          return _context.abrupt("return", menu(builder));

        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _cardCreate.apply(this, arguments);
}

function cardUpdate(_x2) {
  return _cardUpdate.apply(this, arguments);
}
/**
 * Creates and shows card with connector display according to data passed with event object;
 * @param {Object} e event object;
 * @returns {Card}
 */


function _cardUpdate() {
  _cardUpdate = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(e) {
    var builder, connector, type, icon, name, url, manual, isDefault, authType, isReloaded, header, cType, cAuth, basic, widgets, advanced, config, auth, authConfig;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          builder = CardService.newCardBuilder();
          connector = e.parameters;
          type = connector.type;
          icon = connector.icon;
          name = connector.name;
          url = connector.url;
          manual = connector.manual;
          isDefault = connector.isDefault;
          authType = connector.authType;

          if (authType === globalOAuth2AuthType) {
            isReloaded = true;
          } else {
            isReloaded = false;
          } //convert strings to boolean as e.parameters accepts only strings;


          if (manual === 'true') {
            manual = true;
          } else {
            manual = false;
          }

          if (isDefault === 'true') {
            isDefault = true;
          } else {
            isDefault = false;
          }

          connector.manual = manual;
          connector.isDefault = isDefault; //create and set card header;

          header = CardService.newCardHeader();
          header.setTitle(name);
          header.setImageUrl(icon);
          builder.setHeader(header); //access connector type;

          cType = new this[type](); //create section with authorize/revoke for OAuth-based authentication;

          cAuth = cType.auth;

          if (Object.keys(cAuth).length !== 0) {
            if (connector.auth === globalOAuth2AuthType) {
              if (cType.login) {
                connector.login = cType.login(connector);
              }

              createSectionAuth(builder, connector, cAuth);
            }
          } //access type's basic and advanced config;


          basic = new Connector(icon, name, url).basic;
          widgets = basic.widgets;
          advanced = cType.config; //create section with custom icon URL input;

          if (cType.allowCustomIcons === true) {
            createCustomIconsSection(builder, false, connector.icon);
          }

          if (advanced.length === 1) {
            //extend basic with advanced and create config section;
            advanced.forEach(function (c) {
              mergeObjects(widgets, c.widgets);
            }); //preserve values for config widgets;

            preserveValues(connector, widgets); //create config object and section;

            config = {
              header: globalConfigHeader,
              widgets: widgets
            };
            createSectionAdvanced(builder, config, 0, connector, config.widgets.length);
          } else {
            preserveValues(connector, basic.widgets); //create basic config section;

            createSectionAdvanced(builder, basic, 0, connector, basic.widgets.length); //create advanced config sections;

            advanced.forEach(function (section, i) {
              preserveValues(connector, section.widgets);
              createSectionAdvanced(builder, section, i, connector, section.widgets.length);
            });
          } //create API token config section;


          auth = cType.auth;
          authConfig = auth.config;

          if (auth.config) {
            preserveValues(connector, authConfig.widgets);
          }

          if (auth.type === globalApiTokenAuthType) {
            createSectionAdvanced(builder, authConfig, 0, connector, authConfig.widgets.length);
          } //create section with manual and default widgets + update button;


          _context2.next = 32;
          return createSectionUpdateConnector(builder, false, connector, true, isReloaded, authType);

        case 32:
          return _context2.abrupt("return", menu(builder));

        case 33:
        case "end":
          return _context2.stop();
      }
    }, _callee2, this);
  }));
  return _cardUpdate.apply(this, arguments);
}

function cardDisplay(_x3) {
  return _cardDisplay.apply(this, arguments);
}
/**
 * Creates and shows home or a connector config card;
 * @param {Object} e event object;
 * @returns {Card}
 */


function _cardDisplay() {
  _cardDisplay = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(e) {
    var builder, connector, id, code, content, manual, isDefault, type, authType, method, cType, error, start, msg, header, config, hasNested, hasEditable, caText, actionsConfig, has_more, total, page, paramsForward, paramsBackward, paramsRefresh, paramsUpdate, paramsRemove, j, section, bm, full, begin, max, cap, result, length, diff, end, prev, addConfig, adder, add, trimmed, a;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          builder = CardService.newCardBuilder(); //get required parameters;

          connector = e.parameters;
          id = connector.ID;
          code = +connector.code;
          content = connector.content;
          manual = connector.manual;
          isDefault = connector.isDefault;
          type = connector.type;
          authType = connector.auth;
          method = connector.method;
          cType = new this[type](); //get optional parameters;

          error = connector.error;
          start = connector.start; //e.parameters accepts only strings;

          manual = toBoolean(manual);
          isDefault = toBoolean(isDefault); //access current message object;

          msg = getToken(e); //create card header with connector properties;

          header = CardService.newCardHeader();
          header.setImageUrl(connector.icon);
          header.setTitle(connector.name);
          builder.setHeader(header); //access Connector config and get its index;

          _context3.next = 22;
          return getConfig({
            ID: id
          }, true);

        case 22:
          config = _context3.sent;

          if (!((code < 200 || code >= 300) && code !== 401)) {
            _context3.next = 28;
            break;
          }

          _context3.next = 26;
          return createErrorSection(builder, false, code, error);

        case 26:
          _context3.next = 134;
          break;

        case 28:
          if (!(code === 401)) {
            _context3.next = 36;
            break;
          }

          //create section with authorization prompt and list of other connectors;
          createNotAuthorizedSection(builder, false, connector, code);

          if (!(config.length > 0)) {
            _context3.next = 33;
            break;
          }

          _context3.next = 33;
          return createConnectorListSection(builder, true, globalConnectorListHeader, config, msg);

        case 33:
          return _context3.abrupt("return", menu(builder));

        case 36:
          //parse content;
          content = parseData(content); //try to display content or show unparsed data if error;

          _context3.prev = 37;

          if (!(content.length !== 0 && method !== 'add')) {
            _context3.next = 106;
            break;
          }

          //check if there are any nested objects or not;
          hasNested = checkNested(content);

          if (!hasNested) {
            _context3.next = 87;
            break;
          }

          //check for editable widgets and create actions (add,edit,etc) section;
          hasEditable = checkEditable(content);

          if (!hasEditable) {
            _context3.next = 69;
            break;
          }

          //stringify connector properties;
          connector = propertiesToString(connector);

          if (!connector.method) {
            _context3.next = 69;
            break;
          }

          //get action text or default to global value;
          caText = connector.caText;

          if (!caText) {
            caText = globalUpdateConnectorText;
          } //initialize actions configuration;


          actionsConfig = []; //if is traversable -> add traverse actions;

          if (!cType.traversable) {
            _context3.next = 65;
            break;
          }

          has_more = toBoolean(connector.hasNext);
          total = +connector.pages;
          page = +connector.page;
          paramsForward = copyObject(connector, {
            method: 'traverse',
            page: page + 1 || '1'
          }, false);
          paramsBackward = copyObject(connector, {
            method: 'traverse',
            page: page - 1 || '0'
          }, false);
          propertiesToString(paramsForward);
          propertiesToString(paramsBackward);
          _context3.t0 = true;
          _context3.next = _context3.t0 === (!has_more && page === total - 1) ? 59 : _context3.t0 === (has_more && page < total && page > 0) ? 61 : _context3.t0 === (has_more && !page) ? 63 : 65;
          break;

        case 59:
          actionsConfig.push({
            icon: globalIconBackArrow,
            text: 'Previous',
            funcName: 'updateSectionAdvanced',
            params: paramsBackward
          });
          return _context3.abrupt("break", 65);

        case 61:
          actionsConfig.push({
            icon: globalIconBackArrow,
            text: 'Previous',
            funcName: 'updateSectionAdvanced',
            params: paramsBackward
          }, {
            icon: globalIconForwardArrow,
            text: 'Next',
            funcName: 'updateSectionAdvanced',
            params: paramsForward
          });
          return _context3.abrupt("break", 65);

        case 63:
          actionsConfig.push({
            icon: globalIconForwardArrow,
            text: 'Next',
            funcName: 'updateSectionAdvanced',
            params: paramsForward
          });
          return _context3.abrupt("break", 65);

        case 65:
          //if has refresh() method, add action;
          if (cType.refresh) {
            paramsRefresh = copyObject(connector, {
              method: 'refresh'
            }, false);
            actionsConfig.push({
              icon: globalIconRefresh,
              text: 'Refresh',
              funcName: 'updateSectionAdvanced',
              params: paramsRefresh
            });
          } //if has update() method, add action;


          if (!connector.updates) {
            if (cType.update || connector.method === 'send') {
              paramsUpdate = copyObject(connector, {
                method: connector.method
              }, false);
              actionsConfig.push({
                icon: globalIconUpload,
                text: caText,
                funcName: 'updateSectionAdvanced',
                params: paramsUpdate
              });
            }
          } //if has remove() method, add action;


          if (cType.remove && connector.method !== 'add') {
            paramsRemove = copyObject(connector, {
              method: 'remove',
              prompt: 'You are about to remove a record in ' + cType.typeName + '. Are you sure?',
              confirmAction: 'updateSectionAdvanced',
              cancelAction: 'cardDisplay'
            }, false);
            actionsConfig.push({
              icon: globalIconRemove,
              text: globalRemoveConnectorText,
              funcName: 'actionConfirm',
              params: paramsRemove
            });
          }

          createActionsSection(builder, false, actionsConfig);

        case 69:
          j = 0;

        case 70:
          if (!(j < content.length)) {
            _context3.next = 85;
            break;
          }

          section = content[j];

          if (typeof section === 'string') {
            section = JSON.parse(section);
          }

          _context3.prev = 73;
          _context3.next = 76;
          return createSectionAdvanced(builder, section, j, connector, globalWidgetsCap, start);

        case 76:
          _context3.next = 82;
          break;

        case 78:
          _context3.prev = 78;
          _context3.t1 = _context3["catch"](73);
          console.error('Failed to create advanced section: ' + _context3.t1); //try to handle nested objects that do not conform to our schema;

          try {
            createSectionSimple(builder, section, true, j);
          } catch (err) {
            console.error('Failed to create simple section after error in advanced: ' + err); //try handle simple section faling as well;

            createErrorSection(builder, true, 0, {
              descr: 'An error occured during display build'
            }, 'Display error');
          }

        case 82:
          j++;
          _context3.next = 70;
          break;

        case 85:
          _context3.next = 104;
          break;

        case 87:
          //get parameters for extra data;
          bm = getBeginMax(content, start);
          full = bm.full;
          begin = bm.begin;
          max = bm.max;
          cap = bm.cap; //create simple sections;

          j = begin;

        case 93:
          if (!(j < content.length)) {
            _context3.next = 101;
            break;
          }

          if (!(j === max)) {
            _context3.next = 96;
            break;
          }

          return _context3.abrupt("break", 101);

        case 96:
          result = content[j];

          if (content.length !== 1) {
            createSectionSimple(builder, result, true, j);
          } else {
            createSectionSimple(builder, result, false, j);
          }

        case 98:
          j++;
          _context3.next = 93;
          break;

        case 101:
          length = content.length;
          diff = max - begin; //if length is greater than cap, append extra data section;

          if (full > cap) {
            end = length - 1;

            if (length > max || length + diff - 1 === max) {
              prev = begin - diff;
              createExtraDataSection(builder, false, end, prev, max, content, connector);
            }
          }

        case 104:
          _context3.next = 128;
          break;

        case 106:
          if (error) {
            _context3.next = 128;
            break;
          }

          addConfig = cType.addConfig;

          if (!addConfig) {
            _context3.next = 127;
            break;
          }

          _context3.next = 111;
          return addConfig(propertiesToString(connector), msg);

        case 111:
          adder = _context3.sent;
          add = JSON.parse(adder.config); //set method and config;

          connector.method = 'add';

          if (content.length === 0) {
            connector.content = adder.config;
          } else {
            add = content;
          } //access message;


          trimmed = trimMessage(msg, true, true); //prepend no data prompt and append adder button;

          add[0].widgets.unshift({
            type: globalKeyValue,
            content: globalNoDataWidgetContent + ' ' + cType.typeName
          });
          add[0].widgets.push({
            type: globalTextButton,
            title: 'Add ' + adder.prompt,
            action: globalActionClick,
            funcName: 'updateSectionAdvanced',
            params: connector
          }); //build add config;

          a = 0;

        case 119:
          if (!(a < add.length)) {
            _context3.next = 125;
            break;
          }

          _context3.next = 122;
          return createSectionAdvanced(builder, add[a], a, connector, globalWidgetsCap, 0);

        case 122:
          a++;
          _context3.next = 119;
          break;

        case 125:
          _context3.next = 128;
          break;

        case 127:
          createNoFieldsSection(builder, false, connector, msg);

        case 128:
          _context3.next = 134;
          break;

        case 130:
          _context3.prev = 130;
          _context3.t2 = _context3["catch"](37);
          timestamp('error during display Card build', {
            error: _context3.t2,
            type: 'display'
          }, 'error');
          createErrorSection(builder, true, 0, {
            descr: 'An error occured during display build'
          }, 'Display error');

        case 134:
          if (!(config.length > 0)) {
            _context3.next = 137;
            break;
          }

          _context3.next = 137;
          return createConnectorListSection(builder, true, globalConnectorListHeader, config, msg);

        case 137:
          return _context3.abrupt("return", menu(builder));

        case 138:
        case "end":
          return _context3.stop();
      }
    }, _callee3, this, [[37, 130], [73, 78]]);
  }));
  return _cardDisplay.apply(this, arguments);
}

function cardHome(_x4) {
  return _cardHome.apply(this, arguments);
}
/**
 * Creates and shows welcome card on FTE or after reset;
 * @param {Object} e event object;
 * @returns {Card}
 */


function _cardHome() {
  _cardHome = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(e) {
    var builder, config;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          builder = CardService.newCardBuilder();
          _context4.next = 3;
          return getConfig();

        case 3:
          config = _context4.sent;

          if (!(config.length > 0)) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", cardOpen(e));

        case 8:
          return _context4.abrupt("return", cardWelcome(e));

        case 9:
          return _context4.abrupt("return", menu(builder));

        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _cardHome.apply(this, arguments);
}

function cardWelcome(e) {
  var builder = CardService.newCardBuilder(); //create card header and set icon and title on FTE;

  var header = CardService.newCardHeader();
  header.setImageUrl(globalCardinIconUrl);
  header.setTitle(globalWelcomeHeader);
  builder.setHeader(header); //build welcome, types and settings section on FTE;

  createSectionWelcome(builder, false);
  createSectionChooseType(builder, false, globalChooseTypeHeader);
  createSectionHelp(builder, false);
  return menu(builder);
}
/**
 * Triggers either a welcome or display of connections card generators;
 * @param {Object} e event object;
 * @returns {Card}
 */


function cardOpen(_x5) {
  return _cardOpen.apply(this, arguments);
}
/**
 * Generates settings card according to configuration;
 * @param {Object} e event object;
 */


function _cardOpen() {
  _cardOpen = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(e) {
    var builder, config, msg, hasDefault, def, type, icon, name, url, manual, isDefault, authType, index, cType, cAuth, params, response, isAuth, code, content, len;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          builder = CardService.newCardBuilder(); //access connector configuration;

          _context5.next = 3;
          return getConfig();

        case 3:
          config = _context5.sent;
          //get message object;
          msg = getToken(e);
          _context5.prev = 5;
          hasDefault = config.some(function (conn) {
            if (conn.isDefault === true || conn.isDefault === 'true') {
              return conn;
            }
          });

          if (!hasDefault) {
            _context5.next = 41;
            break;
          }

          //fetch default connector from config;
          def = config.filter(function (conn) {
            if (conn.isDefault !== false && conn.isDefault) {
              return conn;
            }
          })[0]; //get required parameters;

          type = def.type;
          icon = def.icon;
          name = def.name || def.type;
          url = def.url || '';
          manual = def.manual;
          isDefault = def.isDefault;
          authType = def.auth; //find connector's index in config;

          index = getIndex(config, def); //load connector type and get authorization config;

          cType = new this[type]();
          cAuth = cType.auth; //set parameters to default connector;

          params = propertiesToString(def); //set authorization parameters;

          if (Object.keys(cAuth).length > 0) {
            if (cAuth.type === globalOAuth2AuthType) {
              params.urlAuth = cAuth.urlAuth;
              params.urlToken = cAuth.urlToken;
              params.id = cAuth.id;
              params.secret = cAuth.secret;

              if (cAuth.hint) {
                params.hint = cAuth.hint;
              }

              if (cAuth.offline) {
                params.offline = cAuth.offline;
              }

              if (cAuth.prompt) {
                params.prompt = cAuth.prompt;
              } //default to type's scope if none provided;


              if (def.scope === '' || !def.scope) {
                params.scope = cAuth.scope;
                def.scope = cAuth.scope;
              } else {
                params.scope = def.scope;
              }
            } else if (cAuth.type === globalApiTokenAuthType) {
              params.usercode = def.usercode;
              params.apitoken = def.apitoken;
            }
          } else if (authType === globalOAuth2AuthType) {
            params.urlAuth = def.urlAuth;
            params.urlToken = def.urlToken;
            params.id = def.id || def.ID;
            params.secret = def.secret;
            params.scope = def.scope;

            if (def.hint) {
              params.hint = def.hint;
            }

            if (def.offline) {
              params.offline = def.offline;
            }

            if (def.prompt) {
              params.prompt = def.prompt;
            }
          } //perform request and parse response if connector is not manual;


          _context5.prev = 21;
          _context5.next = 24;
          return cType.run(msg, def);

        case 24:
          response = _context5.sent;
          _context5.next = 33;
          break;

        case 27:
          _context5.prev = 27;
          _context5.t0 = _context5["catch"](21);
          timestamp('error during default connector run', {
            error: _context5.t0,
            type: cType.typeName
          }, 'error');
          response = {
            headers: '',
            content: _context5.t0.message
          };
          isAuth = checkAgainstErrorTypes(_context5.t0);

          if (!isAuth) {
            response.code = 0;
          } else {
            response.code = 401;
          }

        case 33:
          code = response.code;
          content = response.content; //set response code to parameters;

          params.code = code; //handle response codes;

          if (code >= 200 && code < 300) {
            len = content.length;

            if (len !== 0) {
              params.content = content;
              params.method = def.method;
            }
          } else {
            if (typeof content !== 'string') {
              content = JSON.stringify(content);
            }

            params.content = '[]';
            params.error = content;
          } //assign parameters to event object;


          e.parameters = params;
          return _context5.abrupt("return", cardDisplay(e));

        case 41:
          if (!(config.length === 0)) {
            _context5.next = 45;
            break;
          }

          return _context5.abrupt("return", cardWelcome(e));

        case 45:
          _context5.prev = 45;
          _context5.next = 48;
          return createConnectorListSection(builder, false, '', config, msg);

        case 48:
          _context5.next = 54;
          break;

        case 50:
          _context5.prev = 50;
          _context5.t1 = _context5["catch"](45);
          timestamp('error during Connector list display', {
            error: _context5.t1
          }, 'error');
          createConfigErrorSection(builder, false, globalConfigErrorHeader, '', globalConnectorListErrorContent);

        case 54:
          return _context5.abrupt("return", menu(builder));

        case 55:
          _context5.next = 62;
          break;

        case 57:
          _context5.prev = 57;
          _context5.t2 = _context5["catch"](5);
          //handle unexpected config errors;
          timestamp('configuration error', {
            error: _context5.t2
          }, 'error');
          createErrorSection(builder, false, 0, {
            descr: globalConfigErrorWidgetContent,
            additional: _context5.t2.message
          }, globalConfigErrorHeader);
          return _context5.abrupt("return", menu(builder));

        case 62:
        case "end":
          return _context5.stop();
      }
    }, _callee5, this, [[5, 57], [21, 27], [45, 50]]);
  }));
  return _cardOpen.apply(this, arguments);
}

function cardSettings(_x6) {
  return _cardSettings.apply(this, arguments);
}
/**
 * Generates advanced settings card according to configuration;
 * @param {Object} e event object;
 */


function _cardSettings() {
  _cardSettings = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(e) {
    var builder, config, header;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          builder = CardService.newCardBuilder();
          _context6.next = 3;
          return getConfig();

        case 3:
          config = _context6.sent;
          //build and set CardHeader;
          header = CardService.newCardHeader();
          header.setTitle(globalSettingsHeader);
          builder.setHeader(header); //create section with configured connectors if any;

          if (!(config.length > 0)) {
            _context6.next = 10;
            break;
          }

          _context6.next = 10;
          return createConfiguredConnectorsSection(builder, false, config);

        case 10:
          _context6.next = 12;
          return createSectionChooseType(builder, false, globalChooseTypeHeader);

        case 12:
          _context6.next = 14;
          return createSectionSettings(builder, false, globalPreferencesHeader);

        case 14:
          return _context6.abrupt("return", menu(builder));

        case 15:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _cardSettings.apply(this, arguments);
}

function cardAdvanced(e) {
  var builder = CardService.newCardBuilder(); //build and set CardHeader;

  var header = CardService.newCardHeader();
  header.setTitle(globalAdvancedHeader);
  builder.setHeader(header);
  createSectionAdvancedSettings(builder, false);
  return menu(builder);
}
/**
 * Generates help card;
 * @param {Object} e event object;
 */


function cardHelp(e) {
  var builder = CardService.newCardBuilder(); //build and set CardHeader;

  var header = CardService.newCardHeader();
  header.setTitle(globalHelpHeader);
  builder.setHeader(header); //createSectionAdvancedSettings(builder,false);

  createSectionHelp(builder, false);
  return menu(builder);
}
/**
 * Generates card for confirming or cancelling action;
 * @param {Object} e event object;
 */


function cardConfirm(e) {
  //create card builder and set required params;
  var builder = CardService.newCardBuilder(); //create and set card header;

  var header = CardService.newCardHeader();
  header.setTitle(globalConfirmHeader);
  builder.setHeader(header);
  createSectionConfirm(builder, false, e);
  return menu(builder);
}