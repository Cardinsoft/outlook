function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Creates and shows card with Connector add form;
 * @param {Object} e event object; 
 * @returns {Card}
 */
function cardCreate(e) {
  var builder = CardService.newCardBuilder();
  var data = e.formInput;
  var type = e.parameters; //create and set card header;

  var header = CardService.newCardHeader();
  header.setTitle(type.name);
  header.setImageUrl(type.icon);
  builder.setHeader(header); //access type's basic and advanced config;

  var basic = JSON.parse(type.basic);
  var widgets = basic.widgets;
  var advanced = JSON.parse(type.config); //create section with short type description;

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

    var config = {
      header: globalConfigHeader,
      widgets: widgets
    };
    createSectionConfig(builder, config);
  } else {
    //preserve values for config widgets;
    preserveValues(type, basic.widgets); //create basic config section;

    createSectionConfig(builder, basic); //create advanced config sections;

    advanced.forEach(function (section) {
      createSectionConfig(builder, section);
    });
  } //create API token config section;


  var auth = JSON.parse(type.auth);

  if (auth.type === globalApiTokenAuthType) {
    createSectionConfig(builder, auth.config);
  } //create config for connector behaviour;


  createSectionAddConnector(builder, false, '', type);
  return menu(builder);
}
/**
 * Creates and shows card with Connector update form;
 * @param {Object} e event object;
 * @returns {Card}
 */


function cardUpdate(e) {
  var builder = CardService.newCardBuilder();
  var connector = e.parameters;
  var type = connector.type;
  var icon = connector.icon;
  var name = connector.name;
  var url = connector.url;
  var manual = connector.manual;
  var isDefault = connector.isDefault;
  var authType = connector.authType;

  if (authType === globalOAuth2AuthType) {
    var isReloaded = true;
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

  var header = CardService.newCardHeader();
  header.setTitle(name);
  header.setImageUrl(icon);
  builder.setHeader(header); //access connector type;

  var cType = new this[type](); //create section with authorize/revoke for OAuth-based authentication;

  var cAuth = cType.auth;

  if (Object.keys(cAuth).length !== 0) {
    if (connector.auth === globalOAuth2AuthType) {
      if (cType.login) {
        connector.login = cType.login(connector);
      }

      createSectionAuth(builder, connector, cAuth);
    }
  } //access type's basic and advanced config;


  var basic = new Connector(icon, name, url).basic;
  var widgets = basic.widgets;
  var advanced = cType.config; //create section with custom icon URL input;

  if (cType.allowCustomIcons === true) {
    createCustomIconsSection(builder, false, connector.icon);
  }

  if (advanced.length === 1) {
    //extend basic with advanced and create config section;
    advanced.forEach(function (c) {
      mergeObjects(widgets, c.widgets);
    }); //preserve values for config widgets;

    preserveValues(type, widgets); //create config object and section;

    var config = {
      header: globalConfigHeader,
      widgets: widgets
    };
    createSectionConfig(builder, config);
  } else {
    preserveValues(connector, basic.widgets); //create basic config section;

    createSectionConfig(builder, basic); //create advanced config sections;

    advanced.forEach(function (section) {
      preserveValues(connector, section.widgets);
      createSectionConfig(builder, section);
    });
  } //create API token config section;


  var auth = cType.auth;
  var authConfig = auth.config;

  if (auth.config) {
    preserveValues(connector, authConfig.widgets);
  }

  if (auth.type === globalApiTokenAuthType) {
    createSectionConfig(builder, authConfig);
  } //create section with manual and default widgets + update button;


  createSectionUpdateConnector(builder, false, connector, true, isReloaded, authType);
  return menu(builder);
}
/**
 * Creates and shows card with connector display according to data passed with event object;
 * @param {Object} e event object;
 * @returns {Card}
 */


function cardDisplay(_x) {
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
  regeneratorRuntime.mark(function _callee(e) {
    var builder, connector, code, content, manual, isDefault, type, authType, cType, error, start, msg, header, config, index, hasNested, hasEditable, caText, actionsConfig, actionParams, paramsUpdate, paramsRemove, layout, j, section, bm, full, begin, max, cap, result, length, diff, end, prev;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          builder = CardService.newCardBuilder(); //get required parameters;

          connector = e.parameters;
          code = +connector.code;
          content = connector.content;
          manual = connector.manual;
          isDefault = connector.isDefault;
          type = connector.type;
          authType = connector.auth;
          cType = new this[type](); //get optional parameters;

          error = connector.error;
          start = connector.start; //e.parameters accepts only strings;

          if (manual === 'true') {
            manual = true;
          } else if (manual === 'false') {
            manual = false;
          }

          if (isDefault === 'true') {
            isDefault = true;
          } else if (isDefault === 'false') {
            isDefault = false;
          } //access current message object;


          msg = getToken(e); //create card header with connector properties;

          header = CardService.newCardHeader();
          header.setImageUrl(connector.icon);
          header.setTitle(connector.name);
          builder.setHeader(header); //access Connector config and get its index;

          _context.next = 20;
          return getConfig();

        case 20:
          config = _context.sent;
          index = getIndex(config, connector); //filter out current Connector;

          config = config.filter(function (c, i) {
            if (i !== +index) {
              return c;
            }
          }); //handle failed response codes;

          if (!((code < 200 || code >= 300) && code !== 401)) {
            _context.next = 28;
            break;
          }

          _context.next = 26;
          return createErrorSection(builder, false, code, error);

        case 26:
          _context.next = 88;
          break;

        case 28:
          if (!(code === 401)) {
            _context.next = 36;
            break;
          }

          //create section with authorization prompt and list of other connectors;
          createNotAuthorizedSection(builder, false, connector, code);

          if (!(config.length > 0)) {
            _context.next = 33;
            break;
          }

          _context.next = 33;
          return createConnectorListSection(builder, true, globalConnectorListHeader, config, msg);

        case 33:
          return _context.abrupt("return", menu(builder));

        case 36:
          //parse content;
          content = parseData(content); //try to display content or show unparsed data if error;

          _context.prev = 37;

          if (!(content.length !== 0)) {
            _context.next = 81;
            break;
          }

          //check if there are any nested objects or not;
          hasNested = checkNested(content);

          if (!hasNested) {
            _context.next = 62;
            break;
          }

          //check for editable widgets and create actions (add,edit,etc) section;
          hasEditable = checkEditable(content);

          if (hasEditable) {
            //stringify connector properties;
            connector = propertiesToString(connector);

            if (connector.method) {
              //get action text or default to global value;
              caText = connector.caText;

              if (!caText) {
                caText = globalUpdateConnectorText;
              } //initialize actions configuration;


              actionsConfig = [];
              actionParams = {}; //if has update() method, add action;

              if (cType.update || connector.method === 'send') {
                paramsUpdate = copyObject(connector, {
                  method: connector.method
                }, false);
                actionsConfig.push({
                  text: caText,
                  funcName: 'updateSectionAdvanced',
                  params: paramsUpdate
                });
              } //if has remove() method, add action;


              if (cType.remove && connector.method !== 'add') {
                paramsRemove = copyObject(connector, {
                  method: 'remove'
                }, false);
                actionsConfig.push({
                  text: globalRemoveConnectorText,
                  funcName: 'updateSectionAdvanced',
                  params: paramsRemove
                });
              }

              createActionsSection(builder, false, actionsConfig);
            }
          } //get maximum number of widgets for each section;


          layout = getLayout(content);
          j = 0;

        case 45:
          if (!(j < content.length)) {
            _context.next = 60;
            break;
          }

          section = content[j];

          if (typeof section === 'string') {
            section = JSON.parse(section);
          }

          _context.prev = 48;
          _context.next = 51;
          return createSectionAdvanced(builder, section, j, connector, layout[j]);

        case 51:
          _context.next = 57;
          break;

        case 53:
          _context.prev = 53;
          _context.t0 = _context["catch"](48);
          console.error('Failed to create advanced section: ' + _context.t0); //try to handle nested objects that do not conform to our schema;

          try {
            createSectionSimple(builder, section, true, j);
          } catch (err) {
            console.error('Failed to create simple section after error in advanced: ' + err); //try handle simple section faling as well;

            createUnparsedSection(builder, true, err.message, JSON.stringify(section));
          }

        case 57:
          j++;
          _context.next = 45;
          break;

        case 60:
          _context.next = 79;
          break;

        case 62:
          //get parameters for extra data;
          bm = getBeginMax(content, start);
          full = bm.full;
          begin = bm.begin;
          max = bm.max;
          cap = bm.cap; //create simple sections;

          j = begin;

        case 68:
          if (!(j < content.length)) {
            _context.next = 76;
            break;
          }

          if (!(j === max)) {
            _context.next = 71;
            break;
          }

          return _context.abrupt("break", 76);

        case 71:
          result = content[j];

          if (content.length !== 1) {
            createSectionSimple(builder, result, true, j);
          } else {
            createSectionSimple(builder, result, false, j);
          }

        case 73:
          j++;
          _context.next = 68;
          break;

        case 76:
          length = content.length;
          diff = max - begin; //if length is greater than cap, append extra data section;

          if (full > cap) {
            end = length - 1;

            if (length > max || length + diff - 1 === max) {
              prev = begin - diff;
              createExtraDataSection(builder, false, end, prev, max, content, connector);
            }
          }

        case 79:
          _context.next = 82;
          break;

        case 81:
          if (!error) {
            createNoFieldsSection(builder, false, connector, msg);
          }

        case 82:
          _context.next = 88;
          break;

        case 84:
          _context.prev = 84;
          _context.t1 = _context["catch"](37);
          //handle data that failed to comply to JSON schema;
          console.error('Crash during display generation: ' + _context.t1);
          createUnparsedSection(builder, true, _context.t1.message, JSON.stringify(content));

        case 88:
          if (!(config.length > 0)) {
            _context.next = 91;
            break;
          }

          _context.next = 91;
          return createConnectorListSection(builder, true, globalConnectorListHeader, config, msg);

        case 91:
          return _context.abrupt("return", menu(builder));

        case 92:
        case "end":
          return _context.stop();
      }
    }, _callee, this, [[37, 84], [48, 53]]);
  }));
  return _cardDisplay.apply(this, arguments);
}

function cardHome(_x2) {
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
  regeneratorRuntime.mark(function _callee2(e) {
    var builder, config;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          builder = CardService.newCardBuilder();
          _context2.next = 3;
          return getConfig();

        case 3:
          config = _context2.sent;

          if (!(config.length > 0)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", cardOpen(e));

        case 8:
          return _context2.abrupt("return", cardWelcome(e));

        case 9:
          return _context2.abrupt("return", menu(builder));

        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
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


function cardOpen(_x3) {
  return _cardOpen.apply(this, arguments);
}
/**
 * Generates settings card according to configuration;
 * @param {Object} e event object;
 */


function _cardOpen() {
  _cardOpen = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(e) {
    var builder, config, msg, hasDefault, def, type, icon, name, url, manual, isDefault, authType, index, cType, cAuth, params, response, isAuth, code, content, len;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          builder = CardService.newCardBuilder(); //access connector configuration;

          _context3.next = 3;
          return getConfig();

        case 3:
          config = _context3.sent;
          //get message object;
          msg = getToken(e);
          _context3.prev = 5;
          hasDefault = config.some(function (conn) {
            if (conn.isDefault === true || conn.isDefault === 'true') {
              return conn;
            }
          });

          if (!hasDefault) {
            _context3.next = 42;
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
          name = def.name;
          url = def.url;
          manual = def.manual;
          isDefault = def.isDefault;
          authType = def.auth; //find connector's index in config;

          index = getIndex(config, def); //default to empty url if nothing is in source;

          if (!url) {
            url = '';
            def.url === '';
          } //load connector type and get authorization config;


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
            params.id = def.id;
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


          _context3.prev = 22;
          _context3.next = 25;
          return cType.run(msg, def);

        case 25:
          response = _context3.sent;
          _context3.next = 34;
          break;

        case 28:
          _context3.prev = 28;
          _context3.t0 = _context3["catch"](22);
          //temporary solution for uncaught 401 error;
          console.log(_context3.t0);
          response = {
            headers: '',
            content: _context3.t0.message
          };
          isAuth = checkAgainstErrorTypes(_context3.t0);

          if (!isAuth) {
            response.code = 0;
          } else {
            response.code = 401;
          }

        case 34:
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
            params.content = '[]';
            params.error = content;
          } //assign parameters to event object;


          e.parameters = params;
          return _context3.abrupt("return", cardDisplay(e));

        case 42:
          if (!(config.length === 0)) {
            _context3.next = 46;
            break;
          }

          return _context3.abrupt("return", cardWelcome(e));

        case 46:
          //on check fail load auth Ui;
          initCheck(); //build section with a list of configured Connectors;

          _context3.prev = 47;
          _context3.next = 50;
          return createConnectorListSection(builder, false, '', config, msg);

        case 50:
          _context3.next = 56;
          break;

        case 52:
          _context3.prev = 52;
          _context3.t1 = _context3["catch"](47);
          //log error to stackdriver and build Connectors list error section;
          console.error('An error occured during Connector list generation: %s', _context3.t1);
          createConfigErrorSection(builder, false, globalErrorHeader, '', globalConnectorListErrorContent);

        case 56:
          return _context3.abrupt("return", menu(builder));

        case 57:
          _context3.next = 64;
          break;

        case 59:
          _context3.prev = 59;
          _context3.t2 = _context3["catch"](5);
          //log error to stackdriver and build config error section;
          console.error(_context3.t2);
          createConfigErrorSection(builder, false, globalConfigErrorHeader, globalConfigErrorWidgetTitle, globalConfigErrorWidgetContent);
          return _context3.abrupt("return", menu(builder));

        case 64:
        case "end":
          return _context3.stop();
      }
    }, _callee3, this, [[5, 59], [22, 28], [47, 52]]);
  }));
  return _cardOpen.apply(this, arguments);
}

function cardSettings(_x4) {
  return _cardSettings.apply(this, arguments);
}
/**
 * Generates advanced settings card according to configuration;
 * @param {Object} e event object;
 */


function _cardSettings() {
  _cardSettings = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(e) {
    var builder, config, header;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          builder = CardService.newCardBuilder();
          _context4.next = 3;
          return getConfig();

        case 3:
          config = _context4.sent;
          //build and set CardHeader;
          header = CardService.newCardHeader();
          header.setTitle(globalSettingsHeader);
          builder.setHeader(header); //create section with configured connectors if any;

          if (!(config.length > 0)) {
            _context4.next = 10;
            break;
          }

          _context4.next = 10;
          return createConfiguredConnectorsSection(builder, false, config);

        case 10:
          _context4.next = 12;
          return createSectionChooseType(builder, false, globalChooseTypeHeader);

        case 12:
          _context4.next = 14;
          return createSectionSettings(builder, false, globalPreferencesHeader);

        case 14:
          return _context4.abrupt("return", menu(builder));

        case 15:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
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
  var builder = CardService.newCardBuilder();
  builder.setHeader(CardService.newCardHeader().setTitle(globalHelpHeader));
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