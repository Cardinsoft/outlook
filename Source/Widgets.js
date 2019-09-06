function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Creates KeyValue widgets with help info;
 * @param {CardSection} section section to append widget sets;
 * @returns {Array}
 */
function createWidgetGetSupport(section) {
  //create widgets with help prompt and email;
  var contactText = simpleKeyValueWidget(globalContactSupportTitle, 'Be sure to contact us if you need any assistance', true);
  var contactEmail = simpleKeyValueWidget('', '<a href="mailto:support@cardinsoft.com">support@cardinsoft.com</a>', true, 'EMAIL'); //append to section and return;

  section.addWidget(contactText);
  section.addWidget(contactEmail);
  return [contactText, contactEmail];
}
/**
 * Creates KeyValue widget with 401 code and text explaining further actions;
 * @param {CardSection} section section to append widget sets;
 * @param {String} content widget content or value;
 * @param {Integer} code response status code;
 * @returns {KeyValue}
 */


function createWidgetNotAuthorized(section, content, code) {
  //create widget with not authorized prompt;
  var widget = simpleKeyValueWidget(code, content, true); //append to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates KeyValue widget with text explaining auth type mismatch;
 * @param {CardSection} section section to append widget sets;
 * @param {String} content widget content or value;
 * @returns {KeyValue}
 */


function createWidgetAuthTypeErr(section, content) {
  //create widget with authorization error prompt;
  var widget = simpleKeyValueWidget(globalAuthTypeErrorTitle, content, true); //append to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates TextButton widget with action set to open Auth link;
 * @param {CardSection|ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} parameters authorization config object;
 * @returns {TextButton}
 */


function createWidgetOpenAuth(builder, text, parameters) {
  //create auth service;
  var service = authService(parameters); //create widget for initiating authorization flow;

  var widget = textButtonWidgetAuth(text, false, false, service.getAuthorizationUrl(parameters)); //append button or add to ButtonSet and return;

  try {
    builder.addWidget(widget);
  } catch (error) {
    builder.addButton(widget);
  }

  return widget;
}
/**
 * Creates TextButton widget with action set to revoke Auth;
 * @param {CardSection|ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} parameters authorization config object;
 * @returns {TextButton}
 */


function createWidgetRevoke(builder, text, parameters) {
  //create auth service;
  var service = authService(parameters); //check if service does not have access;

  var disableRevoke = !service.hasAccess(); //create widget for revoking authorization;

  var widget = textButtonWidget(text, disableRevoke, false, 'revokeAuth', parameters); //append button or add to ButtonSet and return;

  try {
    builder.addWidget(widget);
  } catch (error) {
    builder.addButton(widget);
  }

  return widget;
}
/**
 * Creates TextButton widget with action set to open login link;
 * @param {CardSection|ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {String} url URL to open link text;
 * @returns {TextButton}
 */


function createWidgetLogin(builder, text, url) {
  //create TextButton widget to open login link;
  var widget = textButtonWidgetLinked(text, false, false, url, false, false); //append button or add to ButtonSet and return;

  try {
    builder.addWidget(widget);
  } catch (error) {
    builder.addButton(widget);
  }

  return widget;
}
/**
 * Creates KeyValue widget for prompting user that this is a first-time use;
 * @param {CardSection} section section to append widget sets;
 * @returns {KeyValue}
 */


function createWidgetWelcomeText(section) {
  //create KeyValue widget with welcome prompt;
  var widget = simpleKeyValueWidget(globalWelcomeWidgetTitle, globalWelcomeWidgetContent, true); //append widget to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates KeyValue widget for help card section;
 * @param {CardSection} section section to append widget sets;
 * @returns {KeyValue}
 */


function createWidgetHelpText(section) {
  //create KeyValue widget with help prompt;
  var widget = simpleKeyValueWidget(globalHelpWidgetTitle, globalHelpWidgetContent, true); //append widget to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates widget for diplaying hint for optional fields usage;
 * @param {CardSection} section section to append widget sets;
 * @param {String} text text to diplay on widget;
 * @returns {TextParagraph}
 */


function createWidgetFieldsText(section, text) {
  //create TextParagraph with teext provided;
  var widget = textWidget(text); //add widget to section and return it;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates widget for displaying prompt that Connector allows custom icons;
 * @param {CardSection} section section to append widget sets;
 * @param {String} title title text of the widget; 
 * @param {String} content content text to diplay;
 * @returns {TextParagraph}
 */


function createWidgetCustomIconPrompt(section, title, content) {
  //create KeyValue widget for prompt;
  var widget = simpleKeyValueWidget(title, content, true); //append widget to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates TextInput widget with custom field name and content;
 * @param {CardSection} section section to append widget sets;
 * @param {String} fieldName field name for the formInput to use;
 * @param {String} title title text of the widget; 
 * @param {String} hint text that appears on the input;
 * @param {String} content content text to diplay;
 * @returns {TextInput}
 */


function createWidgetCustomInput(section, fieldName, title, hint, content) {
  //default to empty content if none provided;
  if (!content) {
    content = '';
  } //create TextInput 


  var widget = textInputWidget(title, fieldName, hint, content, false); //append widget to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates KeyValue widget for accessing connector config;
 * @param {CardSection} section section to append widget sets;
 * @param {Object} type connector class instance;
 * @returns {KeyValue}
 */


function createWidgetCreateType(section, type) {
  //access parameters in type;
  var params = {
    'basic': JSON.stringify(type.basic),
    'config': JSON.stringify(type.config),
    'type': type.name,
    'icon': type.icon,
    'name': type.typeName
  };

  if (type.short) {
    params.short = type.short;
  } //if type allows custom icons -> pass to params;


  if (type.allowCustomIcons) {
    params.allowCustomIcons = type.allowCustomIcons.toString();
  } //if type has authorization -> pass to params;


  if (type.auth) {
    params.auth = JSON.stringify(type.auth);
  } //create KeyValue widget with Connector creation card display action;


  var widget = actionKeyValueWidget(type.icon, '', type.typeName, 'action', 'cardCreate', params); //append widget to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates KeyValue widget with reset feature description;
 * @param {CardSection} section section to append widget sets;
 * @param {String} title widget title;
 * @param {String} content widget content;
 * @returns {KeyValue}
 */


function createWidgetShortText(section, title, content) {
  //create KeyValue widget with type short description;
  var widget = simpleKeyValueWidget(title, content, true); //append to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates KeyValue widget with reset prompt;
 * @param {CardSection} section section to append widget sets;
 * @returns {KeyValue}
 */


function createWidgetResetText(section) {
  //create KeyValue widget with reset prompt;
  var widget = simpleKeyValueWidget('', globalResetWidgetContent, true); //append to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates TextButton widget that performs full reset when clicked;
 * @param {CardSection} section section to append widget sets;
 * @returns {TextButton}
 */


function createWidgetResetSubmit(section) {
  //set confirmation params;
  var params = {
    confirmAction: 'performFullReset',
    cancelAction: 'goSettings',
    prompt: globalConfirmResetWidgetContent,
    success: globalResetSuccess,
    failure: globalResetFailure
  }; //create TextButton widget with full reset action set;

  var widget = textButtonWidget(globalResetWidgetSubmitText, false, false, 'actionConfirm', params); //append to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates KeyValue prompt and SelectionInput widgets for ordering type choice;
 * @param {CardSection} section section to append widget sets;
 * @returns {Array}
 */


function createWidgetSortBy(_x) {
  return _createWidgetSortBy.apply(this, arguments);
}
/**
 * Creates SelectionInput widget for choosing authentication type (none and OAuth2 for now);
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isEdit truthy value to determine which card to reload;
 * @param {String} selected value that should be selected;
 * @returns {SelectionInput}
 */


function _createWidgetSortBy() {
  _createWidgetSortBy = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(section) {
    var prompt, options, orderType, isReverse, reverse, select;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          //create KeyValue prompt for order type choice;
          prompt = simpleKeyValueWidget(globalOrderingWidgetTitle, globalOrderingWidgetContent, true);
          section.addWidget(prompt); //create options array for order type;

          options = [{
            text: 'Alphabetical',
            value: 'alphabet',
            selected: false
          }, {
            text: 'Connector type',
            value: 'type',
            selected: false
          }, {
            text: 'Creation order',
            value: 'creation',
            selected: true
          }]; //select current order type;

          _context.next = 5;
          return getProperty('order', 'user');

        case 5:
          orderType = _context.sent;

          if (orderType !== null) {
            options.forEach(function (option) {
              if (option.value === orderType) {
                option.selected = true;
              } else {
                option.selected = false;
              }
            });
          } //access reverse setting and create SelectionInput;


          _context.next = 9;
          return getProperty('reverse', 'user');

        case 9:
          isReverse = _context.sent;

          if (isReverse === null || isReverse === 'false') {
            isReverse = false;
          } else if (isReverse === 'true') {
            isReverse = true;
          }

          reverse = selectionInputWidget('', globalOrderReverseFieldName, globalEnumCheckbox, [{
            text: 'Reverse',
            value: 'true',
            selected: isReverse
          }], 'applySort', true);
          section.addWidget(reverse); //create SelectionInput for order type options;

          select = selectionInputWidget('', globalOrderTypeFieldName, globalEnumDropdown, options, 'applySort', true);
          section.addWidget(select);
          return _context.abrupt("return", [prompt, select, reverse]);

        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _createWidgetSortBy.apply(this, arguments);
}

function createWidgetChooseAuth(section, isEdit, selected) {
  //set auth options config;
  var options = [{
    'text': 'None',
    'value': 'none',
    'selected': true
  }, {
    'text': 'OAuth 2.0',
    'value': 'OAuth2',
    'selected': false
  }]; //if selected value param is provided, select this option;

  if (selected) {
    options.forEach(function (option) {
      if (option.value === selected) {
        option.selected = true;
        options.forEach(function (opt) {
          if (opt.value !== selected) {
            opt.selected = false;
          }
        });
      }
    });
  } //create SelectionInput with Auth choice options;


  var widget = selectionInputWidget(globalCustomWidgetAuthText, 'auth', globalEnumRadio, options, 'chooseAuth', true, {
    'isEdit': isEdit.toString()
  }); //append to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Creates Switch widget for setting connector to be invoked manually;
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isManual truthy value to determine invoking manually;
 * @returns {Switch} 
 */


function createWidgetSwitchManual(_x2, _x3) {
  return _createWidgetSwitchManual.apply(this, arguments);
}
/**
 * Creates Switch widget for setting connector to be loaded by default;
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isDefault truthy value to determine loading by default;
 * @returns {Switch}
 */


function _createWidgetSwitchManual() {
  _createWidgetSwitchManual = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(section, isManual) {
    var config, widget;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return getConfig();

        case 2:
          config = _context2.sent;

          if (config.length === 0) {
            isManual = false;
          } //parse stringified boolean parameters;


          if (isManual === undefined || isManual === 'true') {
            isManual = true;
          } else if (isManual === 'false') {
            isManual = false;
          } //create Switch for manual / auto behaviour choice;


          widget = switchWidget('', '', globalCustomWidgetSwitchText, globalManualFieldName, isManual, true); //append to section and return;

          section.addWidget(widget);
          return _context2.abrupt("return", widget);

        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _createWidgetSwitchManual.apply(this, arguments);
}

function createWidgetSwitchDefault(_x4, _x5) {
  return _createWidgetSwitchDefault.apply(this, arguments);
}
/**
 * Creates ButtonSet for going to root card;
 * @param {CardSection} section section to append widget sets;
 * @param {String} index index to use when going back;
 * @returns {ButtonSet}
 */


function _createWidgetSwitchDefault() {
  _createWidgetSwitchDefault = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(section, isDefault) {
    var config, widget;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return getConfig();

        case 2:
          config = _context3.sent;

          if (config.length === 0) {
            isDefault = true;
          } //parse stringified boolean parameters;


          if (isDefault === undefined || isDefault === 'false') {
            isDefault = false;
          } else if (isDefault === 'true') {
            isDefault = true;
          } //create Switch for default / listed behaviour choice;


          widget = switchWidget('', '', globalIsDefaultWidgetSwitchText, globalDefaultFieldName, isDefault, true); //append to section and return;

          section.addWidget(widget);
          return _context3.abrupt("return", widget);

        case 8:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _createWidgetSwitchDefault.apply(this, arguments);
}

function createWidgetsBackAndToRoot(section, index) {
  //set action parameters;
  var params = {
    'index': index
  }; //create TextButton with go to root action;

  var root = textButtonWidget(globalRootText, false, false, 'goRoot', params); //append widgets to ButtonSet;

  var widget = buttonSet([root]); //append to section and return;

  section.addWidget(widget);
  return widget;
}
/**
 * Create ButtonSet for confirming and cancelling;
 * @param {CardSection} section section to append widget sets;
 * @param {Object} e event object;
 * @returns {ButtonSet}
 */


function createWidgetsConfirm(section, e) {
  //access parameters;
  var params = e.parameters; //create KeyValue widget to prompt user of action;

  var userPrompt = simpleKeyValueWidget(globalConfirmWidgetTitle, params.prompt, true, globalIconWarning);
  section.addWidget(userPrompt); //create TextButton widgets to confirm or cancel;

  var btnConfirm = textButtonWidget(globalConfirmText, false, false, params.confirmAction, params);
  var btnCancel = textButtonWidget(globalCancelText, false, false, params.cancelAction, params); //create ButtonSet with confirm and cancel buttons;

  var widget = buttonSet([btnConfirm, btnCancel]);
  section.addWidget(widget); //create KeyValue prompt and SelectionInput for uninstall;

  var urlRevoke = params.urlRevoke;

  if (urlRevoke) {
    var revokePrompt = simpleKeyValueWidget(globalConfirmWidgetTitle, globalRevokeWidgetContent, true);
    var revokeCheckbox = selectionInputWidget(globalConfirmWidgetTitle, 'uninstall', globalEnumCheckbox, [{
      text: 'Uninstall',
      value: true,
      selected: false
    }]);
    section.addWidget(revokePrompt);
    section.addWidget(revokeCheckbox);
  }

  return widget;
}