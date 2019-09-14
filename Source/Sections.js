function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Creates section for authorizing Connectors after initial check;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Array} connectors an array of Connectors to authorize;
 * @returns {CardSection} this CardSection;
 */
function authorizeSection(builder, isCollapsed, connectors) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //sort connectors alphabetically for simplicity;

  connectors.sort(function (a, b) {
    return order(a.name, b.name, false);
  }); //append authorization buttons and prompts;

  connectors.forEach(function (connector) {
    var type = new this[connector.type]();
    var auth = type.auth;
    auth.name = connector.name;
    auth.ID = connector.ID;

    if (connector.sandbox) {
      auth.id = auth.sandbox.id;
      auth.secret = auth.sandbox.secret;
    }

    var service = authService(auth);
    var hasAccess = service.hasAccess();

    if (!hasAccess) {
      //try access type's login button image and default to global enter;
      var authIcon = type.iconLogin;

      if (!authIcon) {
        authIcon = globalEnterIconUrl;
      }

      var authButton = imageButtonWidgetAuth(authIcon, globalOpenAuthText, service.getAuthorizationUrl(auth));
      var authPrompt = simpleKeyValueWidget({
        content: connector.name,
        multiline: true,
        icon: connector.icon,
        button: authButton
      });
      section.addWidget(authPrompt);
    }
  }); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section prompting user to choose to skip auth for Connector types;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Array} types an array of types with OAuth2.0 auth flow;
 * @returns {CardSection} this CardSection;
 */


function skipInitialAuthSection(builder, isCollapsed, types) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //prompt user that they can skip initial auth check;

  var prompt = simpleKeyValueWidget({
    title: globalSkipAuthWidgetTitle,
    content: globalSkipAuthWidgetContent,
    multiline: true
  });
  section.addWidget(prompt); //get skip configuration;

  var skipped = getProperty('skipAuth', 'user');

  if (!skipped) {
    skipped = {};
  } //add skip witch for each type passed;


  types.forEach(function (type) {
    //check for skip and default to false;
    var isOn = false;

    if (skipped[type.name]) {
      isOn = true;
    }

    var skipper = switchWidget(type.icon, '', type.typeName, 'skip-' + type.name, isOn, type.name, 'saveSkip', false);
    section.addWidget(skipper);
  }); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section prompting user to authorize the Connector;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector object;
 * @param {String} error error message to set to title;
 * @returns {CardSection} this CardSection;
 */


function createNotAuthorizedSection(builder, isCollapsed, connector, error) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //access authorization parameters;

  var cAuth = new this[connector.type]().auth;
  var authType = connector.auth;

  if (authType !== 'none') {
    //explain that connector requires auth;
    createWidgetNotAuthorized(section, globalNotAuthorizedContent, error); //if auth data not provided by type -> invoke from connector;

    if (Object.keys(cAuth).length > 0) {
      cAuth.name = connector.name;
      cAuth.ID = connector.ID;
      cAuth.type = connector.type;
      createWidgetOpenAuth(section, globalOpenAuthText, cAuth);
    } else if (authType === globalOAuth2AuthType) {
      createWidgetOpenAuth(section, globalOpenAuthText, connector);
    }
  } else {
    //explain that there was a connector type mismatch;
    createWidgetAuthTypeErr(section, globalAuthTypeErrorContent);
  } //append section and return it;


  builder.addSection(section);
  return section;
}
/**
 * Creates section with a ButtonSet of actionable TextButtons;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Array} actionsConfig an Array of objects with action config for TextButtons;
 * @returns {CardSection|undefined} this CardSection;
 */


function createActionsSection(builder, isCollapsed, actionsConfig) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed);
  var buttons = []; //createTextButtons;

  actionsConfig.forEach(function (action) {
    var button;

    if (action.icon) {
      button = imageButtonWidget(action.icon, action.text, action.funcName, action.params);
    } else {
      button = textButtonWidget(action.text, false, false, action.funcName, action.params);
    }

    buttons.push(button);
  });

  if (buttons.length > 0) {
    //create ButtonSet and set TextButtons;
    var set = buttonSet(buttons);
    section.addWidget(set); //append section and return it;

    builder.addSection(section);
    return section;
  }
}
/**
 * Creates section with a list of configured Connectors to display;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @param {Array} config an array of Connector settings objects;
 * @param {GmailMessage} msg current meassge object;
 * @returns {CardSection} this CardSection;
 */


function createConnectorListSection(_x, _x2, _x3, _x4, _x5) {
  return _createConnectorListSection.apply(this, arguments);
}
/**
 * Creates section with a list of configured Connectors to edit;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Array} config an array of Connector settings objects;
 * @return {CardSection} this CardSection;
 */


function _createConnectorListSection() {
  _createConnectorListSection = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(builder, isCollapsed, header, config, msg) {
    var section, key, connector, type, icon, name, url, manual, authType, cType, cAuth, response, isAuth, code, content, hasMatch, button, widget, label, actionName, length, matched, text, colour;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          //create section and set required parameters;
          section = CardService.newCardSection();
          section.setCollapsible(isCollapsed); //set additional parameters;

          if (header !== '') {
            section.setHeader(header);
          }

          if (isCollapsed) {
            section.setNumUncollapsibleWidgets(globalNumUncollapsibleList);
          } //sort configuration;


          _context.next = 6;
          return sortConfig(config);

        case 6:
          _context.t0 = regeneratorRuntime.keys(config);

        case 7:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 49;
            break;
          }

          key = _context.t1.value;
          connector = config[key]; //get required parameters;

          type = connector.type;
          icon = connector.icon;
          name = connector.name;
          url = connector.url;
          manual = connector.manual;
          authType = connector.auth; //default to empty url if nothing is in source;

          if (!url) {
            url = '';
            connector.url === '';
          } //load connector type and get authorization config;


          cType = new this[type]();
          cAuth = cType.auth;

          if (Object.keys(cAuth).length !== 0) {
            //add properties for OAuth 2.0-based Connector;
            if (cAuth.type === globalOAuth2AuthType) {
              //set authorization properties from type;
              connector.urlAuth = cAuth.urlAuth;
              connector.urlToken = cAuth.urlToken;
              connector.id = cAuth.id;
              connector.secret = cAuth.secret;

              if (cAuth.hint) {
                connector.hint = cAuth.hint;
              }

              if (cAuth.offline) {
                connector.offline = cAuth.offline;
              }

              if (cAuth.prompt) {
                connector.prompt = cAuth.prompt;
              } //default to type's scope if none provided;


              if (connector.scope === '' || !connector.scope) {
                connector.scope = cAuth.scope;
              }
            }
          }

          if (manual) {
            _context.next = 41;
            break;
          }

          _context.prev = 21;
          _context.next = 24;
          return cType.run(msg, connector);

        case 24:
          response = _context.sent;
          _context.next = 33;
          break;

        case 27:
          _context.prev = 27;
          _context.t2 = _context["catch"](21);
          //temporary solution for uncaught 401 error;
          response = {
            headers: '',
            content: _context.t2.message
          };
          isAuth = checkAgainstErrorTypes(_context.t2);

          if (isAuth) {
            timestamp('not authorized to user account', {
              error: _context.t2,
              type: cType.typeName
            }, 'warning');
          } else {
            timestamp('error during dashboard display', {
              error: _context.t2,
              type: cType.typeName
            }, 'error');
          }

          if (!isAuth) {
            response.code = 0;
          } else {
            response.code = 401;
          }

        case 33:
          code = response.code;
          content = response.content;
          hasMatch = response.hasMatch; //initialize common varibales;

          //set response code to connector (display req);
          connector.code = code; //function name to run;

          actionName = 'actionShow';

          if (code >= 200 && code < 300) {
            //handle successful requests;
            content = parseData(content);
            length = content.length;

            if (hasMatch) {
              //access match properties;
              matched = hasMatch.value;
              text = hasMatch.text;
              colour = hasMatch.colour; //if custom text is not provided -> default;

              if (!text) {
                text = 'Has match';
              } //handle use cases;


              if (length > 0 && matched || length === 0 && !matched) {
                label = text;
              } else if (length > 0) {
                label = 'No match';
              } else {
                label = globalNoData;
              } //set button colour if provided, else -> default to secondary colour;


              if (colour) {
                label = '<font color="' + colour + '">' + label + '</font>';
              }
            } else {
              if (length > 0) {
                label = 'Has match';
              } else {
                label = globalNoData;
              }
            }

            connector.content = JSON.stringify(content);
          } else if (code === 401 || code === 403) {
            label = globalLoginText;
          } else {
            //handle failed requests;
            label = globalError;
            connector.error = JSON.stringify(content);
          }

          _context.next = 43;
          break;

        case 41:
          //set manual action function name and label;
          actionName = 'actionManual';
          label = globalManual;

        case 43:
          //stringify parameters to pass to action;
          connector = propertiesToString(connector); //set label and create widget representing connector;

          button = textButtonWidget(label, false, false, actionName, connector);
          widget = actionKeyValueWidgetButton(icon, '', name, button, actionName, connector);
          section.addWidget(widget);
          _context.next = 7;
          break;

        case 49:
          //append section and return it;   
          builder.addSection(section);
          return _context.abrupt("return", section);

        case 51:
        case "end":
          return _context.stop();
      }
    }, _callee, this, [[21, 27]]);
  }));
  return _createConnectorListSection.apply(this, arguments);
}

function createConfiguredConnectorsSection(_x6, _x7, _x8) {
  return _createConfiguredConnectorsSection.apply(this, arguments);
}
/**
 * Creates section with configuration error info and reset button and prompt;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @param {String} title error prompt widget title;
 * @param {String} content error prompt widget content;
 * @returns {CardSection} this CardSection;
 */


function _createConfiguredConnectorsSection() {
  _createConfiguredConnectorsSection = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(builder, isCollapsed, config) {
    var section;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          //create section and set required parameters;
          section = CardService.newCardSection();
          section.setCollapsible(isCollapsed);
          section.setHeader(globalConfigListHeader); //set additional parameters;

          if (isCollapsed) {
            section.setNumUncollapsibleWidgets(globalNumUncollapsible);
          } //sort configuration;


          _context2.next = 6;
          return sortConfig(config);

        case 6:
          config.forEach(function (connector, c) {
            var icon = connector.icon;
            var name = connector.name;
            var url = connector.url;
            var type = connector.type;

            try {
              //default to empty url if nothing is in source;
              if (url === undefined) {
                url = '';
                connector.url === '';
              } //stringify connector parameters;


              connector = propertiesToString(connector);
              var widget = actionKeyValueWidget(icon, '', name, 'action', 'actionEdit', connector);
              section.addWidget(widget);
            } catch (error) {
              timestamp('error in settings due to misconfig', {
                error: error,
                type: 'settings'
              }, 'error');
              var errorWidget = actionKeyValueWidget(icon, '', 'Configuration issue.\rClick here to remove', globalActionAction, 'removeConnector', propertiesToString(connector));
              section.addWidget(errorWidget);
            }
          });
          builder.addSection(section);
          return _context2.abrupt("return", section);

        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _createConfiguredConnectorsSection.apply(this, arguments);
}

function createConfigErrorSection(builder, isCollapsed, header, title, content) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed);
  section.setHeader(header); //set additional parameters;

  if (isCollapsed) {
    section.setNumUncollapsibleWidgets(globalNumUncollapsible);
  } //create reset prompt widget;


  var resetText = simpleKeyValueWidget({
    title: title,
    content: content,
    multiline: true
  });
  section.addWidget(resetText); //create TextButton widget for full reset;

  createWidgetResetSubmit(section); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section with partial data and navigation Ui for traversing full data (100 widgets cap handling);
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} end data element index to end on; 
 * @param {Integer} begin data element index to begin with;
 * @param {Integet} max maximum number of elements to show; 
 * @param {Array} data results array to traverse;
 * @param {Object} connector connector object;
 * @returns {CardSection} this CardSection;
 */


function createExtraDataSection(builder, isCollapsed, end, begin, max, data, connector) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //create widget prompting the user that there is more data to show;

  var restText = simpleKeyValueWidget({
    title: globalExtraDataTitle,
    content: globalExtraDataText,
    multiline: true
  });
  section.addWidget(restText); //set connector parameters;

  connector.data = data;
  connector.start = max; //stringify Connector parameters;

  connector = propertiesToString(connector); //set action function name to run;

  var actionName = 'actionShow';
  var show = textButtonWidget(globalLoadExtraForwardText, false, false, actionName, connector);
  connector.start = begin.toString();
  var back = textButtonWidget(globalLoadExtraBackText, false, false, actionName, connector); //handle conditionally adding buttons "back" and "next" according to data part that is being parsed

  if (max <= end) {
    if (max >= max - begin) {
      var set = buttonSet([back, show]);
      section.addWidget(set);
    } else {
      section.addWidget(show);
    }
  } else {
    section.addWidget(back);
  } //append section and return it;


  builder.addSection(section);
  return section;
}
/**
 * Creates section prompting use that there is no data to show;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector configuration object;
 * @param {GmailMessage} msg current meassge object;
 * @returns {CardSection} this CardSection;
 */


function createNoFieldsSection(_x9, _x10, _x11, _x12) {
  return _createNoFieldsSection.apply(this, arguments);
}
/**
 * Creates section containing promp to confirm action and set of buttons to proceed;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} e event object;
 * @returns {CardSection} this CardSection;
 */


function _createNoFieldsSection() {
  _createNoFieldsSection = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(builder, isCollapsed, connector, msg) {
    var section, trimmed, prompt, noData, cType, addQuery, addConfig, addInCRM, add, domain;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          //create section and set required parameters;
          section = CardService.newCardSection();
          section.setCollapsible(isCollapsed);
          section.setHeader(globalNoDataWidgetTitle); //create KeyValue widget prompting user that no data is available;

          trimmed = trimMessage(msg, true, true);
          prompt = globalNoDataWidgetContent + ' ' + trimmed.first + ' ' + trimmed.last + '\r<b>' + trimmed.email + '</b>';
          noData = simpleKeyValueWidget({
            content: prompt,
            multiline: true
          });
          section.addWidget(noData); //create TextButton for adding contact if config provides one;

          cType = new this[connector.type]();
          addQuery = '';
          addConfig = cType.addConfig;
          addInCRM = cType.addInCRM;

          if (!addConfig) {
            _context3.next = 21;
            break;
          }

          _context3.t0 = textButtonWidget;
          _context3.t1 = connector.view === 'lead' ? globalAddLeadText : globalAddContactText;
          _context3.next = 16;
          return addConfig(propertiesToString(connector), msg);

        case 16:
          _context3.t2 = _context3.sent;
          add = (0, _context3.t0)(_context3.t1, false, false, 'configureContactAdd', _context3.t2);
          section.addWidget(add);
          _context3.next = 22;
          break;

        case 21:
          if (addInCRM) {
            //access domain and prepend if required;
            domain = connector.account;

            if (domain) {
              addQuery = 'https://' + domain + '.' + (connector.domain ? connector.domain : addInCRM.domain) + addInCRM.base;
            } else {
              addQuery = 'https://' + (connector.domain ? connector.domain : addInCRM.domain) + addInCRM.base;
            } //put parameters into query string;


            if (addInCRM.params) {
              addQuery += jsonToQuery(addInCRM.params, trimmed);
            } //construct add in CRM widget;


            add = textButtonWidgetLinked(globalAddContactInCRMText, false, false, addQuery, false, true);
            section.addWidget(add);
          }

        case 22:
          //append section and return it;
          builder.addSection(section);
          return _context3.abrupt("return", section);

        case 24:
        case "end":
          return _context3.stop();
      }
    }, _callee3, this);
  }));
  return _createNoFieldsSection.apply(this, arguments);
}

function createSectionConfirm(builder, isCollapsed, e) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed);
  createWidgetsConfirm(section, e); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section containing error message and unparsed data;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} error error message to show;
 * @param {String} content unparsed content;
 * @returns {CardSection} this CardSection;
 */


function createUnparsedSection(builder, isCollapsed, error, content) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed);
  section.setHeader(globalUnparsedHeader); //create widget for unparsed error prompt;

  var errCode = simpleKeyValueWidget({
    title: globalUnparsedErrorWidgetTitle,
    content: error,
    multiline: true
  });
  section.addWidget(errCode); //create widget for unparsed data;

  var data = simpleKeyValueWidget({
    title: globalUnparsedDataWidgetTitle,
    content: content,
    multiline: true
  });
  section.addWidget(data); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section containing error code and error text;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} code response status code;
 * @param {String} error error message to show; 
 * @param {String=} header error section header;
 * @returns {CardSection} this CardSection;
 */


function createErrorSection(builder, isCollapsed, code, error, header) {
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //initiate error title and content;

  if (!header) {
    header = globalConnectorErrorHeader;
  }

  var content,
      errorDetails = ''; //create user-friendly prompts for http errors;

  if (code > 0) {
    //set user-friendly messages for response errors; 
    switch (code) {
      case 400:
        header = 'Bad request';
        content = 'The request made by the Connector is malformed. If this is a Webhook Connector, please, check your URLs syntax';

      case 404:
        header = 'Not found';
        content = 'Seems like the endpoint resource you want the Connector to access cannot be found or does not exist';
        break;

      case 405:
        header = 'Method Not Allowed';
        content = 'The method the Connector is using is not allowed by endpoint resource.\r';
        content += 'By default, our Add-on makes POST requests to external APIs - please, let us know if you need to be able to choose methods for this Connector type';
        break;

      case 413:
        header = 'Payload too large';
        content = 'Payload sent to the endpoint exceeded limits defined by it. Please, advise endpoint documentation if this is a Webhook Connector';

      case 500:
        header = 'Internal Server Error';
        content = 'Connector endpoint resource responded with a generic error. Please, check the error details provided below for additional information';
        break;

      case 501:
        header = 'Not Implemented';
        content = 'The Connector\'s method is not supported. You are witnessing an error that should not be possible.';
        content += 'Please, do <a href="mailto:support@cardinsoft.com">contact us</a>!';
        break;

      case 503:
        header = 'Service Unavailable';
        content = 'The endpoint resource is currently unavailable or is down for maintenance. Please, wait until it becomes available or contact service support';
        break;
    }

    errorDetails = error;
  } else {
    var custom;

    if (typeof error === 'string') {
      custom = {
        descr: globalGeneralErrorContent,
        additional: error
      };
    }

    custom = parseData(error);

    if (custom.descr) {
      content = custom.descr;
    }

    if (custom.additional) {
      errorDetails = custom.additional;
    }
  } //set section's header;


  section.setHeader(header); //create error description widget;

  if (content) {
    var description = simpleKeyValueWidget({
      content: content,
      multiline: true
    });
    section.addWidget(description);
  } //create error information widget;


  if (errorDetails) {
    if (typeof errorDetails === 'string') {
      try {
        errorDetails = JSON.parse(errorDetails).descr;
      } catch (e) {//do nothing;
      }
    } else {
      errorDetails = errorDetails.descr;
    }

    if (errorDetails) {
      var additional = simpleKeyValueWidget({
        title: globalErrorWidgetTitle,
        content: errorDetails,
        multiline: true
      });
      section.addWidget(additional);
    }
  } //create contact us widget;


  createWidgetGetSupport(section); //add section and return;

  builder.addSection(section);
  return section;
}
/**
 * Creates section with authorization and revoke buttons (for OAuth2.0-based Connectors);
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} connector connector configuration object;
 * @param {Object} auth section auth config object;
 * @returns {CardSection} this CardSection;
 */


function createSectionAuth(builder, connector, auth) {
  var section = CardService.newCardSection();
  var authText = textWidget(globalAuthTextWidgetContent);
  section.addWidget(authText);

  if (auth) {
    if (Object.keys(auth).length === 0) {
      var auth = {
        'urlAuth': connector.urlAuth,
        'urlToken': connector.urlToken,
        'id': connector.id,
        'secret': connector.secret,
        'scope': connector.scope
      };

      if (connector.hint) {
        auth.hint = connector.hint;
      }

      if (connector.offline) {
        auth.offline = connector.offline;
      }

      if (connector.prompt) {
        auth.prompt = connector.prompt;
      }
    } //pass auth to connector;    


    mergeObjects(connector, auth);
    propertiesToString(connector); //create ButtonSet for login, auth and revoke buttons;

    var buttonSet = CardService.newButtonSet(); //if connector provides login url -> create login button;

    if (connector.login) {
      createWidgetLogin(buttonSet, globalLoginText, connector.login);
    } //create widgets for initiating and revoking authorization flow;


    createWidgetOpenAuth(buttonSet, globalOpenAuthText, connector);
    createWidgetRevoke(buttonSet, globalRevokeAuthText, connector);
    section.addWidget(buttonSet);
  } //add section and return;


  builder.addSection(section);
  return section;
}
/**
 * Handles sections generation if a simple json schema (an array of objects with key-value pairs) is provided;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Array} data a set of key-value pairs representing widgets; 
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} index result index to append to section header;
 * @returns {CardSection} this CardSection;
 */


function createSectionSimple(builder, data, isCollapsed, index) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //set optional parameters;

  if (index) {
    section.setHeader(globalShowHeader + ' ' + (index + 1));
  } //create section if any widgets provided;


  if (Object.keys(data).length !== 0) {
    //append wigets to section;
    for (var key in data) {
      var widget = simpleKeyValueWidget({
        title: key,
        content: data[key],
        multiline: true
      });
      section.addWidget(widget);
    } //append section and return it;


    builder.addSection(section);
    return section;
  }
}
/**
 * Handles sections generation if a complex json schema is provided;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} obj data object element with section display settings;
 * @param {Integer} sectionIndex index of section currently created;
 * @param {Object} connector connector config object;
 * @param {Integer} max maximum number of widgets to create;
 * @param {Object=} start layout of sections starts;
 * @returns {CardSection} this CardSection;
 */


function createSectionAdvanced(builder, obj, sectionIndex, connector, max, start) {
  //access account preferences;
  var popup; //create section;

  var section = CardService.newCardSection(); //access section parameters;

  var header = obj.header;
  var isCollapsible = obj.isCollapsible;
  var numUncollapsible = obj.numUncollapsible;
  var widgets = obj.widgets; //set optional parameters;

  if (header) {
    section.setHeader(header);
  }

  if (isCollapsible) {
    section.setCollapsible(isCollapsible);

    if (numUncollapsible > 0) {
      section.setNumUncollapsibleWidgets(numUncollapsible);
    } else if (numUncollapsible) {
      section.setNumUncollapsibleWidgets(globalNumUncollapsible);
    }
  } //default start or parse start layout;


  if (!start) {
    start = [];
  } else {
    start = JSON.parse(start);
  }

  var starter = start.filter(function (s) {
    return s.section === sectionIndex;
  })[0];

  if (!starter) {
    starter = {
      widget: 0,
      section: sectionIndex
    };
  } //append widgets if there are any;


  var curr = 0;

  if (widgets.length > 0) {
    for (var index = starter.widget; index < widgets.length; index++) {
      var widget = widgets[index];

      if (index <= starter.widget + max) {
        var state = widget.state;

        if (state !== 'hidden') {
          curr++;
          var element;
          var type = widget.type;

          if (type) {
            var icon = widget.icon;
            var title = widget.title;
            var hint = widget.hint;
            var name = widget.name;
            var content = widget.content;
            var callback = widget.callback;
            var spin = widget.hasSpinner;
            var params = widget.parameters;

            switch (type) {
              case globalTextParagraph:
                element = textWidget(content);
                break;

              case globalImage:
                var alt = widget.alt;
                element = imageWidget(content, alt); //expand on future UPD;

                break;

              case globalButtonSet:
                var buttons = []; //construct buttons;

                for (var b = 0; b < content.length; b++) {
                  var btn = content[b];
                  var ic = btn.icon;
                  var al = btn.alt;
                  var bt = btn.type;
                  var t = btn.title;
                  var co = btn.content;
                  var d = btn.disabled;
                  var fi = btn.filled;
                  var fu = btn.fullsized;
                  var r = btn.reload;
                  var a = btn.action;
                  var f = btn.funcName;
                  var p = btn.parameters;
                  var c = btn.colour; //modify parameters;

                  if (c) {
                    t = '<font color="' + c + '">' + t + '</font>';
                  }

                  if (!p) {
                    p = connector;
                  }

                  if (popup) {
                    fu = popup;
                  } //build either a clickable or a linked button;


                  if (bt !== globalImageButton) {
                    if (a === globalActionClick) {
                      buttons.push(textButtonWidget(t, d, fi, f, p));
                    } else if (a === globalActionAction) {
                      buttons.push(textButtonWidgetLinked(t, d, fi, co, fu, r, true, f, p));
                    } else {
                      buttons.push(textButtonWidgetLinked(t, d, fi, co, fu, r));
                    }
                  } else {
                    if (a === globalActionClick) {//buttons.push(); //ADD LATER;
                    } else if (a === globalActionAction) {//buttons.push(); //ADD LATER;
                    } else {
                      buttons.push(imageButtonWidget(ic, al, f, p, globalActionLink, fu, r));
                    }
                  }
                }

                element = buttonSet(buttons);
                break;

              case globalImageButton:
                var alt = widget.alt;
                var fullsized = widget.fullsized;
                var reload = widget.reload; //if account has preferences -> override;

                if (popup) {
                  fullsized = popup;
                }

                element = imageButtonWidget(icon, alt, content, {}, globalActionLink, fullsized, reload);
                break;

              case globalTextButton:
                //access TextButton-specific params;
                var disabled = widget.disabled;
                var filled = widget.filled;
                var fullsized = widget.fullsized;
                var reload = widget.reload;
                var action = widget.action;
                var funcName = widget.funcName;
                var colour = widget.colour; //set button text colour if provided;

                if (colour) {
                  title = '<font color="' + colour + '">' + title + '</font>';
                } //set parameters if provided and default to connector;


                if (!params) {
                  params = connector;
                } //if account has preferences -> override;


                if (popup) {
                  fullsized = popup;
                } //build either a clickable or a linked button;


                if (action === globalActionClick) {
                  element = textButtonWidget(title, disabled, filled, funcName, params);
                } else if (action === globalActionAction) {
                  element = textButtonWidgetLinked(title, disabled, filled, content, fullsized, reload, true, funcName, params);
                } else {
                  element = textButtonWidgetLinked(title, disabled, filled, content, fullsized, reload);
                }

                break;

              case globalKeyValue:
                //access KeyValue-specific params;
                var isMultiline = widget.isMultiline;
                var switchValue = widget.switchValue;
                var buttonIcon = widget.buttonIcon;
                var buttonText = widget.buttonText;
                var buttonLink = widget.buttonLink;
                var selected = widget.selected;
                var disabled = widget.disabled;
                var filled = widget.filled;
                var reload = widget.reload;
                var funcName = widget.funcName;
                var action = widget.action;
                var colour = widget.colour; //set colour if provided;

                if (colour) {
                  content = '<font color="' + colour + '">' + content + '</font>';
                } //default to multiline;


                if (!isMultiline) {
                  isMultiline = true;
                } //default to no icon;


                if (!icon) {
                  icon = '';
                } //set Switch or TextButton to widget if provided;


                if (switchValue) {
                  element = switchWidget(icon, title, content, name, selected, switchValue);
                } else {
                  //set section and widget index and stringify;
                  connector.sectionIdx = sectionIndex;
                  connector.widgetIdx = index;
                  connector = propertiesToString(connector);

                  if (buttonText || buttonLink || buttonIcon) {
                    if (disabled === undefined) {
                      disabled = true;
                    }

                    if (!filled) {
                      filled = false;
                    } //if account has preferences -> override;


                    if (popup) {
                      fullsized = popup;
                    }

                    if (params && popup) {
                      params.fullsized = popup;
                    } //create link button or action button;


                    var button;

                    if (!buttonLink) {
                      button = textButtonWidget(buttonText, disabled, filled);
                    } else if (buttonIcon) {
                      button = imageButtonWidget(buttonIcon, buttonText, buttonLink, connector, 'link', fullsized, reload);
                    } else {
                      button = textButtonWidgetLinked(buttonText, disabled, false, buttonLink, fullsized, reload);
                    }

                    if (state !== 'editable' && !funcName) {
                      element = simpleKeyValueWidget({
                        title: title,
                        content: content,
                        hint: hint,
                        multiline: isMultiline,
                        icon: icon,
                        button: button
                      });
                    } else if (state !== 'editable') {
                      element = actionKeyValueWidget(icon, title, content, action, funcName, params);
                    } else {
                      element = actionKeyValueWidgetButton(icon, title, content, button, 'editSectionAdvanced', connector);
                    }
                  } else {
                    if (state !== 'editable' && !funcName) {
                      element = simpleKeyValueWidget({
                        title: title,
                        content: content,
                        hint: hint,
                        multiline: isMultiline,
                        icon: icon
                      });
                    } else if (state !== 'editable') {
                      element = actionKeyValueWidget(icon, title, content, action, funcName, params);
                    } else {
                      element = actionKeyValueWidget(icon, title, content, 'action', 'editSectionAdvanced', connector);
                    }
                  }
                }

                break;

              case globalTextInput:
                //access TextInput-specific params;
                var hint = widget.hint;
                var multiline = widget.multiline;
                element = textInputWidget(title, name, hint, content, multiline, callback, spin, connector);
                break;

              case globalEnumRadio:
                element = selectionInputWidget(title, name, type, content, callback, spin, connector);
                break;

              case globalEnumCheckbox:
                element = selectionInputWidget(title, name, type, content);
                break;

              case globalEnumDropdown:
                element = selectionInputWidget(title, name, type, content);
                break;
            }

            section.addWidget(element);
          } //end type check;

        } //end state check;

      } //end cap check;

    } //initiate new starter;


    var newStarter = {
      widget: 0,
      section: sectionIndex
    };
    var sidx;
    start.forEach(function (o, i) {
      if (o.section === sectionIndex) {
        sidx = i;
      }
    }); //append back and forward widgets;

    if (widgets.length > max) {
      //update config to prior widgets and append "back" button;
      if (starter.widget > 0) {
        if (widgets.length > max) {
          newStarter.widget = starter.widget - (max + 1);
        }

        if (sidx || sidx === 0) {
          start[sidx] = newStarter;
        } else {
          start.push(newStarter);
        }

        connector.start = JSON.stringify(start);
        var back = textButtonWidget('back', false, false, 'cardDisplay', connector);
      } //update config to next widgets and append "forward" button;


      if (starter.widget + curr !== widgets.length) {
        if (widgets.length > max) {
          newStarter.widget = starter.widget + (max + 1);
        }

        if (sidx || sidx === 0) {
          start[sidx] = newStarter;
        } else {
          start.push(newStarter);
        }

        connector.start = JSON.stringify(start);
        var next = textButtonWidget('next', false, false, 'cardDisplay', connector);
      }

      var buttons = [];

      if (back) {
        section.setCollapsible(false);
        buttons.push(back);
      }

      if (next) {
        buttons.push(next);
      }

      if (back || next) {
        var bset = buttonSet(buttons);
        section.addWidget(bset);
      }
    } //append section and return it;


    builder.addSection(section);
    return section;
  } //end non-empty check;

}
/**
 * Creates section containing widgets representing connector types;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String=} header section header text;
 * @returns {CardSection} this CardSection;
 */


function createSectionChooseType(builder, isCollapsed, header) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //set optional parameters;

  if (header) {
    section.setHeader(header);
  } //create an array of used types;


  var types = getTypes(); //create widgets for each type;

  types.forEach(function (type) {
    createWidgetCreateType(section, type);
  }); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section with manual and default switches + add connector button;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @param {Object} type connector type object;
 * @returns {Array} Array of CardSections;
 */


function createSectionAddConnector(_x13, _x14, _x15, _x16) {
  return _createSectionAddConnector.apply(this, arguments);
}
/**
 * Creates section with manual and default switches + edit connector button and sets input values;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector configuration object;
 * @param {Boolean} isReloaded truthy value to derermine wheter it is invoked from input change;
 * @param {String} authType authorization type to set auth type choice group to;
 * @returns {Array} Array of CardSections;
 */


function _createSectionAddConnector() {
  _createSectionAddConnector = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(builder, isCollapsed, header, type) {
    var man, def, config, section, actionSection;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          man = false;
          def = false; //access config and make first Connector default and auto;

          _context4.next = 4;
          return getConfig();

        case 4:
          config = _context4.sent;

          if (config.length === 0) {
            man = false;
            def = true;
          }

          section = {
            header: globalConfigAdvancedHeader,
            isCollapsible: true,
            widgets: [{
              type: globalKeyValue,
              title: 'Choose behaviour',
              content: 'If you have multiple accounts or want to control when to search your account, you can set the Connector to run on explicit interaction only'
            }, {
              type: globalKeyValue,
              content: globalCustomWidgetSwitchText,
              name: globalManualFieldName,
              switchValue: true,
              selected: man
            }, {
              type: globalKeyValue,
              title: 'Choose display',
              content: 'If you have multiple accounts or configured Connectors, switching on this option will make it display results directly to the dashboard'
            }, {
              type: globalKeyValue,
              content: globalIsDefaultWidgetSwitchText,
              name: globalDefaultFieldName,
              switchValue: true,
              selected: def
            }]
          };
          createSectionAdvanced(builder, section, 0, type, section.widgets.length, 0);
          actionSection = {
            widgets: [{
              type: globalButtonSet,
              content: [{
                type: globalTextButton,
                title: globalCreateConnectorText,
                action: globalActionClick,
                funcName: 'createConnector',
                parameters: type
              }]
            }]
          };
          createSectionAdvanced(builder, actionSection, 0, type, actionSection.widgets.length, 0);
          return _context4.abrupt("return", [section, actionSection]);

        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _createSectionAddConnector.apply(this, arguments);
}

function createSectionUpdateConnector(builder, isCollapsed, connector, isReloaded, authType) {
  //configure advanced config section;
  var section = {
    header: globalConfigAdvancedHeader,
    isCollapsible: true,
    widgets: [{
      type: globalKeyValue,
      title: 'Choose behaviour',
      content: 'If you have multiple accounts or want to control when to search your account, you can set the Connector to run on explicit interaction only'
    }, {
      type: globalKeyValue,
      content: globalCustomWidgetSwitchText,
      name: globalManualFieldName,
      switchValue: true,
      selected: connector.manual
    }, {
      type: globalKeyValue,
      title: 'Choose display',
      content: 'If you have multiple accounts or configured Connectors, switching on this option will make it display results directly to the dashboard'
    }, {
      type: globalKeyValue,
      content: globalIsDefaultWidgetSwitchText,
      name: globalDefaultFieldName,
      switchValue: true,
      selected: connector.isDefault
    }]
  };
  createSectionAdvanced(builder, section, 0, connector, section.widgets.length, 0); //set confirmation procedure;

  connector.cancelAction = 'cardUpdate';
  connector.confirmAction = 'removeConnector';
  connector.prompt = globalConfirmRemoveWidgetContent; //configure actions section;

  var actionSection = {
    widgets: [{
      type: globalButtonSet,
      content: [{
        type: globalTextButton,
        title: globalUpdateConnectorText,
        action: globalActionClick,
        funcName: 'updateConnector',
        parameters: connector
      }, {
        type: globalTextButton,
        title: globalRemoveConnectorText,
        action: globalActionClick,
        funcName: 'actionConfirm',
        parameters: connector
      }]
    }]
  };
  createSectionAdvanced(builder, actionSection, 0, connector, actionSection.widgets.length, 0);
  return [section, actionSection];
}
/**
 * Creates section for connector type description;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} short connector type description;
 * @param {String} header section header text;
 * @returns {CardSection} this CardSection;
 */


function createDescriptionSection(builder, isCollapsed, short, header) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //set optional parameters;

  if (header) {
    section.setHeader(header);
  } //create widget with short Connector desription;


  createWidgetShortText(section, '', short); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section for Connector custom icon input;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {String} content input content text;
 * @returns {CardSection} this CardSection;
 */


function createCustomIconsSection(builder, isCollapsed, content) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed);
  section.setHeader(globalCustomIconHeader); //set user prompt with a link to whitelisted domain URL;

  var prompt = 'This Connector type allows custom icons - simply provide the URL of the icon you want to use. ';
  prompt += 'Please, note that it must be <b>publicly hosted</b>'; //create widgets with prompt and input for icon URL;

  createWidgetCustomIconPrompt(section, '', prompt);
  createWidgetCustomInput(section, globalIconFieldName, 'Custom icon', globalCustomIconHint, content); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section for welcome info;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection} this CardSection;
 */


function createSectionWelcome(builder, isCollapsed, header) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed); //set optional parameters;

  if (header) {
    section.setHeader(header);
  } //create FTU prompt widget;


  createWidgetWelcomeText(section); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section for settings;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection} this CardSection;
 */


function createSectionSettings(_x17, _x18, _x19) {
  return _createSectionSettings.apply(this, arguments);
}
/**
 * Creates section for advanced settings;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @returns {CardSection} this CardSection;
 */


function _createSectionSettings() {
  _createSectionSettings = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(builder, isCollapsed, header) {
    var section;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          //create section and set required parameters;
          section = CardService.newCardSection();
          section.setCollapsible(isCollapsed); //set optional parameters;

          if (header) {
            section.setHeader(header);
          } //create sorting widgets;


          _context5.next = 5;
          return createWidgetSortBy(section);

        case 5:
          //append section and return it;
          builder.addSection(section);
          return _context5.abrupt("return", section);

        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _createSectionSettings.apply(this, arguments);
}

function createSectionAdvancedSettings(builder, isCollapsed) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed);
  section.setHeader('Reset'); //create reset prompt;

  createWidgetResetText(section); //create reset button with reset action;

  createWidgetResetSubmit(section); //append section and return it;

  builder.addSection(section);
  return section;
}
/**
 * Creates section for help info;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @returns {CardSection} this CardSection;
 */


function createSectionHelp(builder, isCollapsed) {
  //create section and set required parameters;
  var section = CardService.newCardSection();
  section.setCollapsible(isCollapsed);
  section.setHeader(globalResourceHeader); //create help prompt widget;

  createWidgetHelpText(section); //create integrations section;

  var sectionInt = {
    header: 'Connector help',
    widgets: [{
      type: globalKeyValue,
      content: 'For detailed setup and debug instructions, visit our Connector-specific pages'
    }, {
      type: globalButtonSet,
      content: [{
        type: globalImageButton,
        icon: globalOneCRMiconUrl,
        alt: '1CRM',
        action: globalActionLink,
        funcName: 'https://cardinsoft.com/gmail-integrations/1crm/'
      }, {
        type: globalImageButton,
        icon: globalCloseIconUrl,
        alt: 'Close',
        action: globalActionLink,
        funcName: 'https://cardinsoft.com/gmail-integrations/close/'
      }, {
        type: globalImageButton,
        icon: globalLACRMiconUrl,
        alt: 'LACRM',
        action: globalActionLink,
        funcName: 'https://cardinsoft.com/gmail-integrations/less-annoying-crm/'
      }, {
        type: globalImageButton,
        icon: globalPipedriveIconUrl,
        alt: 'Pipedrive',
        action: globalActionLink,
        funcName: 'https://cardinsoft.com/gmail-integrations/pipedrive/'
      }, {
        type: globalImageButton,
        icon: globalIconWebhook,
        alt: 'Webhook',
        action: globalActionLink,
        funcName: 'https://cardinsoft.com/gmail-integrations/webhook/'
      }]
    }]
  };
  createSectionAdvanced(builder, sectionInt, 0, {}, sectionInt.widgets.length, 0); //create help action widgets;

  var web = simpleKeyValueWidget({
    content: '<a href="https://cardinsoft.com/support/">cardinsoft.com</a>',
    multiline: false,
    icon: globalIconWebsite
  });
  var mail = simpleKeyValueWidget({
    content: '<a href="mailto:support@cardinsoft.com">support@cardinsoft.com</a>',
    multiline: false,
    icon: 'EMAIL'
  });
  section.addWidget(web);
  section.addWidget(mail); //append section and return it;

  builder.addSection(section);
  return section;
}