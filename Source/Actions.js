function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Fetches new data and updates display;
 * @param {Object} e event object;
 * @return {ActionResponse} updated display;
 */
function reloadDisplay(_x) {
  return _reloadDisplay.apply(this, arguments);
}
/**
 * Fetches new data and updates a specific widget;
 * @param {Object} e event object;
 * @return {ActionResponse} updated display;
 */


function _reloadDisplay() {
  _reloadDisplay = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(e) {
    var builder, params, type, card, index, fetch, fetcher, displayer, fetched, displayed;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          builder = CardService.newActionResponseBuilder();
          params = e.parameters; //access type, card and fetcher config;

          type = new this[params.type]();
          card = JSON.parse(params.content);
          index = +params.section;
          fetch = JSON.parse(params.fetch); //access fetch and display config;

          fetcher = fetch.fetcher;
          displayer = fetch.displayer; //increment start;

          fetcher.params[3] += fetcher.params[4]; //fetch new data;

          _context.next = 11;
          return type[fetcher.callback].apply(type, fetcher.params);

        case 11:
          fetched = _context.sent;
          displayer.params.unshift(fetched); //construct new data display;

          displayed = type[displayer.callback].apply(type, displayer.params); //append to existing display and uncollapse;

          card[index].fetch = fetch;
          card[index].isCollapsible = false;

          if (displayed.length > 0) {
            card[index].widgets = card[index].widgets.concat(globalWidgetSeparator, displayed);
          } //update content and fetcher;


          e.parameters.content = JSON.stringify(card);
          builder.setNavigation(CardService.newNavigation().updateCard(cardDisplay(e)));
          builder.setStateChanged(true);
          return _context.abrupt("return", builder.build());

        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return _reloadDisplay.apply(this, arguments);
}

function reloadWidgetDisplay(_x2) {
  return _reloadWidgetDisplay.apply(this, arguments);
}
/**
 * Validates domain name entered;
 * @param {Object} e event object;
 * @returns {ActionResponse} domain check response;
 */


function _reloadWidgetDisplay() {
  _reloadWidgetDisplay = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(e) {
    var builder, params, headers, type, card, section, widget, fetch, fetcher, displayer, fetched, show, edit, showMapper, showJoiner;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          builder = CardService.newActionResponseBuilder(); //access parameters and construct headers;

          params = e.parameters;
          headers = {
            Authorization: 'Basic ' + Utilities.base64Encode(params[globalApiTokenTokenFieldName] + ':')
          }; //access type, card and fetcher config;

          type = new this[params.type]();
          card = JSON.parse(params.content);
          section = card[+params.section];
          widget = section.widgets[+params.widget]; //access fetch and display config;

          fetch = JSON.parse(params.fetch);
          fetcher = fetch.fetcher;
          displayer = fetch.displayer; //prepend headers;

          if (!fetcher.params[0].Authorization) {
            fetcher.params.unshift(headers);
          } //TODO: diff auth types;
          //increment start;


          fetcher.params[3] += fetcher.params[4]; //fetch new data;

          _context2.next = 14;
          return type[fetcher.callback].apply(type, fetcher.params);

        case 14:
          fetched = _context2.sent;
          //access display config;
          show = displayer.show; //Object<map,join>

          edit = displayer.edit; //Array<Object<value,text,join>>
          //access edit config and build;

          edit.forEach(function (e, w) {
            var prop = e.value;
            var selected = e.select;
            var mapper = e.map;
            var joiner = e.join;
            var edited = fetched.map(function (entity) {
              return {
                value: entity[prop],
                selected: selected.indexOf(entity[prop]) !== -1 ? true : false,
                text: mapper.map(function (t) {
                  return entity[t];
                }).join(joiner)
              };
            });

            if (edited.length > 0) {
              widget.editMap[w].content = widget.editMap[w].content.concat(edited);
            }
          }); //access show config and build;

          showMapper = show.map;
          showJoiner = show.join;
          widget.content += showJoiner + fetched.map(function (entity) {
            return showMapper.map(function (t) {
              return entity[t];
            }).join(' ');
          }).join(showJoiner); //update content and fetcher;

          widget.fetch = fetch;
          e.parameters.content = JSON.stringify(card);
          builder.setNavigation(CardService.newNavigation().updateCard(cardDisplay(e)));
          builder.setStateChanged(true);
          return _context2.abrupt("return", builder.build());

        case 26:
        case "end":
          return _context2.stop();
      }
    }, _callee2, this);
  }));
  return _reloadWidgetDisplay.apply(this, arguments);
}

function validateSubdomain(_x3) {
  return _validateSubdomain.apply(this, arguments);
}
/**
 * Configures contact add display;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _validateSubdomain() {
  _validateSubdomain = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(e) {
    var builder, subdomain, domainreg, success, regexp, matches, hasdomain, notify;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //access account name in input;

          subdomain = e.formInput.account;
          domainreg = new RegExp(e.parameters.domain);
          success = false;
          regexp = /^(?!\.|www)(?!http)[A-z0-9-_.]+[^\.|\s|\\|\/]$/;

          if (subdomain && subdomain !== '' && typeof subdomain === 'string') {
            matches = subdomain.match(regexp);
            hasdomain = domainreg.test(subdomain);

            if (matches !== null && !hasdomain) {
              success = true;
            }
          }

          if (success) {
            _context3.next = 10;
            break;
          }

          notify = notification('Please, enter a valid subdomain (avoid full URLs and hanging dots)'); //set notification and return;

          builder.setNotification(notify);
          return _context3.abrupt("return", builder.build());

        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _validateSubdomain.apply(this, arguments);
}

function configureContactAdd(_x4) {
  return _configureContactAdd.apply(this, arguments);
}
/**
 * Saves ordering preferences to user properties;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _configureContactAdd() {
  _configureContactAdd = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(e) {
    var builder, params;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder();
          params = e.parameters;
          params.code = 200;
          params.content = params.config; //set data state change and show form;

          builder.setNavigation(CardService.newNavigation().updateCard(cardDisplay(e)));
          builder.setStateChanged(true);
          return _context4.abrupt("return", builder.build());

        case 7:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _configureContactAdd.apply(this, arguments);
}

function applySort(_x5) {
  return _applySort.apply(this, arguments);
}
/**
 * Updates connector add / edit settings card on auth select change;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _applySort() {
  _applySort = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(e) {
    var builder, data, isReverse;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //access settings form;

          data = e.formInput; //access reverse input;

          isReverse = data.reverse;

          if (!isReverse) {
            isReverse = false;
          } //save ordering preference;


          _context5.next = 6;
          return setProperty('order', data.order, 'user');

        case 6:
          _context5.next = 8;
          return setProperty('reverse', isReverse, 'user');

        case 8:
          //set data state change and navigate to settings card;
          builder.setNavigation(CardService.newNavigation().updateCard(cardSettings(e)));
          builder.setStateChanged(true);
          return _context5.abrupt("return", builder.build());

        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _applySort.apply(this, arguments);
}

function chooseAuth(_x6) {
  return _chooseAuth.apply(this, arguments);
}
/**
 * Updates widget by provided index to generate form input instead of clickable field;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _chooseAuth() {
  _chooseAuth = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(e) {
    var builder, data, authType, parameters, isEdit, custom, input, val;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder();
          data = e.formInput;
          authType = data.auth;
          parameters = e.parameters;
          isEdit = parameters.isEdit;
          custom = new Connector();
          e.parameters.icon = data[globalIconFieldName];
          e.parameters.name = data[globalNameFieldName];
          e.parameters.url = data[globalURLfieldName];

          for (input in data) {
            val = data[input];
            e.parameters[input] = val;
          }

          if (data.manual === undefined) {
            e.parameters.manual = false;
          }

          if (data.isDefault === undefined) {
            e.parameters.isDefault = false;
          }

          e.parameters.authType = authType;
          e.parameters.auth = JSON.stringify({});
          e.parameters.basic = JSON.stringify(custom.basic);
          e.parameters.config = JSON.stringify(custom.config);
          e.parameters.type = custom.name;

          if (isEdit === 'true') {
            if (data.scope) {
              e.parameters.urlAuth = data.urlAuth;
              e.parameters.urlToken = data.urlToken;
              e.parameters.id = data.id;
              e.parameters.secret = data.secret;
              e.parameters.scope = data.scope;
            }
          }

          builder.setNavigation(CardService.newNavigation().updateCard(cardCreate(e)));
          builder.setStateChanged(true);
          return _context6.abrupt("return", builder.build());

        case 21:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _chooseAuth.apply(this, arguments);
}

function editSectionAdvanced(_x7) {
  return _editSectionAdvanced.apply(this, arguments);
}
/**
 * Updates data with form input values, performs request and calls display with updated response;
 * @param {Object} e event object;
  * @return {Function} actionShow call with modified data;
 */


function _editSectionAdvanced() {
  _editSectionAdvanced = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(e) {
    var builder, connector, content, isAuto, formInputs, keys, sectionIdx, widgetIdx, section, widgets, editable, editMap, fName, split, prop, idx, p, i;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //access content;

          connector = e.parameters;
          content = connector.content;
          isAuto = connector.updates; //parse content;

          if (typeof content === 'string') {
            content = JSON.parse(content);
          } //access form inputs and preserve;


          formInputs = e.formInputs;
          keys = Object.keys(formInputs);
          content.forEach(function (section) {
            section.widgets.forEach(function (widget) {
              keys.forEach(function (key) {
                if (key === widget.name) {
                  if (widget.type === globalEnumCheckbox || widget.type === globalEnumDropdown || widget.type === globalEnumRadio) {
                    widget.content.forEach(function (option) {
                      if (formInputs[key].indexOf(option.value) !== -1) {
                        option.selected = true;
                      } else {
                        option.selected = false;
                      }
                    });
                  } else {
                    widget.content = formInputs[key][0];
                  }
                }
              });
            });
          }); //access section and widget index;

          sectionIdx = +connector.sectionIdx;
          widgetIdx = +connector.widgetIdx; //check for editable widgets and process;

          section = content[sectionIdx];
          widgets = section.widgets;
          editable = widgets[widgetIdx];
          editMap = editable.editMap; //make section uncollapsed;

          section.isCollapsible = false;

          if (editMap) {
            //filter out widget on which edit map is set;
            widgets.splice(widgetIdx, 1); //insert edit map widgets;

            editMap.forEach(function (ew, i) {
              if (!ew.type) {
                ew.type = globalTextInput;
              }

              if (!ew.multiline) {
                ew.multiline = true;
              }

              if (isAuto && i === editMap.length - 1) {
                ew.callback = 'updateSectionAdvanced', ew.parameters = connector, ew.hasSpinner = true;
              }

              widgets.splice(widgetIdx + i, 0, ew);
            }); //set widgets with updated schema;

            content[sectionIdx].widgets = widgets; //access property and index;

            fName = editMap[0].name;
            split = fName.split('&');
            prop = split[0].split('-')[0];
            idx = split[0].split('-')[1]; //if index -> change all other widgets;

            if (idx) {
              widgets.forEach(function (widget, i) {
                var otherEM = widget.editMap;

                if (otherEM) {
                  var otherName = otherEM[0].name;
                  var otherSplit = otherName.split('&');
                  var otherProp = otherSplit[0].split('-')[0];

                  if (prop === otherProp) {
                    widgets = widgets.filter(function (widget, j) {
                      if (i !== j) {
                        return widget;
                      }
                    });
                    otherEM.forEach(function (ew, j) {
                      if (!ew.type) {
                        ew.type = globalTextInput;
                      }

                      if (!ew.multiline) {
                        ew.multiline = true;
                      }

                      widgets.splice(i + j, 0, ew);
                    });
                  }

                  content[sectionIdx].widgets = widgets;
                }
              });
            }
          } else {
            editable.type = globalTextInput;
            editable.multiline = true;

            if (isAuto) {
              editable.callback = 'updateSectionAdvanced', editable.parameters = connector, editable.hasSpinner = true;
            } //check for array-like properties;


            p = editable.name.split('&')[0];
            i = p.split('-');

            if (i[1]) {
              widgets.forEach(function (widget) {
                //check for editability and map;
                if (widget.state === 'editable' && !widget.editMap) {
                  if (widget.name.split('&')) {
                    if (widget.name.split('&')[0].split('-')[0] === i[0]) {
                      widget.type = globalTextInput;
                      widget.multiline = true;
                    }
                  }
                }
              });
            }
          } //stringify content to send to event object;


          e.parameters.content = JSON.stringify(content); //set data state change and navigate to display card;

          builder.setNavigation(CardService.newNavigation().updateCard(cardDisplay(e)));
          return _context7.abrupt("return", builder.build());

        case 19:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _editSectionAdvanced.apply(this, arguments);
}

function updateSectionAdvanced(_x8) {
  return _updateSectionAdvanced.apply(this, arguments);
}
/**
 * Checks if URL entered is valid and displays a warning if it is not;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _updateSectionAdvanced() {
  _updateSectionAdvanced = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(e) {
    var connector, data, form, forms, msg, cType, resp, method;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          connector = e.parameters;
          data = connector.content; //parse content; 

          data = parseData(data); //access form inputs;

          form = e.formInput;
          forms = e.formInputs;
          data.forEach(function (elem) {
            var widgets = elem.widgets;
            widgets.forEach(function (widget) {
              var type = widget.type;

              for (var key in form) {
                if (key === widget.name) {
                  if (type === globalEnumRadio || type === globalEnumCheckbox || type === globalEnumDropdown) {
                    var content = widget.content;
                    content.forEach(function (option) {
                      var isContained = false;

                      try {
                        isContained = forms[key].some(function (val) {
                          if (val === option.value) {
                            return val;
                          }
                        });
                      } catch (error) {
                        console.error(error);
                      }

                      if (isContained) {
                        option.selected = true;
                      } else {
                        option.selected = false;
                      }
                    });
                  } else if (type === globalKeyValue) {
                    if (form[key]) {
                      widget.switchValue = true;
                    }
                  } else {
                    widget.content = form[key];
                  }
                }
              } //perform additional check for all inputs switched off;


              if (!Object.keys(form).some(function (key) {
                return key === widget.name;
              })) {
                if (type === globalEnumRadio || type === globalEnumCheckbox) {
                  var content = widget.content;
                  content.forEach(function (option) {
                    option.selected = false;
                  });
                }
              }

              if (type === globalTextInput) {
                widget.state = 'editable';
                widget.type = globalKeyValue;
              } //handle widgets with switches that are toggled off after load;


              try {
                var noInput = !Object.keys(form).some(function (key) {
                  return key === widget.name;
                });
              } catch (error) {
                noInput = false;
              }

              if (type === globalKeyValue && widget.switchValue && noInput) {
                widget.switchValue = false;
              }
            });
          });
          msg = getToken(e);
          cType = new this[connector.type](); //initiate check variables;

          method = connector.method; //if type only has run() method or connector is simply comm;

          if (!(!cType.update && !cType.remove || method === 'send')) {
            _context8.next = 13;
            break;
          }

          _context8.next = 12;
          return cType.run(msg, connector, data);

        case 12:
          resp = _context8.sent;

        case 13:
          if (!(method === 'refresh' && cType.refresh)) {
            _context8.next = 19;
            break;
          }

          _context8.next = 16;
          return cType.refresh(msg, connector, data);

        case 16:
          resp = _context8.sent;
          _context8.next = 23;
          break;

        case 19:
          if (!(method === 'refresh' || method === 'traverse')) {
            _context8.next = 23;
            break;
          }

          _context8.next = 22;
          return cType.run(msg, connector);

        case 22:
          resp = _context8.sent;

        case 23:
          if (!(cType.update && method === 'add')) {
            _context8.next = 29;
            break;
          }

          delete connector.caText;
          _context8.next = 27;
          return cType.update(msg, connector, forms, data, method);

        case 27:
          resp = _context8.sent;
          connector.method = 'edit';

        case 29:
          if (!(cType.update && method === 'edit')) {
            _context8.next = 34;
            break;
          }

          _context8.next = 32;
          return cType.update(msg, connector, forms, data, method);

        case 32:
          resp = _context8.sent;
          connector.method = 'edit';

        case 34:
          if (!(cType.remove && method === 'remove')) {
            _context8.next = 39;
            break;
          }

          _context8.next = 37;
          return cType.remove(msg, connector, data);

        case 37:
          resp = _context8.sent;
          connector.method = 'add';

        case 39:
          //override event object parameters with response data;
          e.parameters.code = resp.code;
          e.parameters.content = resp.content;
          e.parameters.method = connector.method;
          return _context8.abrupt("return", actionShow(e));

        case 43:
        case "end":
          return _context8.stop();
      }
    }, _callee8, this);
  }));
  return _updateSectionAdvanced.apply(this, arguments);
}

function checkURL(_x9) {
  return _checkURL.apply(this, arguments);
}
/**
 * Removes card from navigation and loads previous card in stack;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _checkURL() {
  _checkURL = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(e) {
    var regExp, url, test, action;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          regExp = /^http:\/\/\S+\.+\S+|^https:\/\/\S+\.+\S+/;
          url = e.formInput.connectionURL;
          test = regExp.test(url);

          if (test) {
            _context9.next = 7;
            break;
          }

          action = CardService.newActionResponseBuilder();
          action.setNotification(warning(globalInvalidURLnoMethod));
          return _context9.abrupt("return", action.build());

        case 7:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _checkURL.apply(this, arguments);
}

function goBack(_x10) {
  return _goBack.apply(this, arguments);
}
/**
 * Removes all cards from navigation and loads root (first) card in stack;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _goBack() {
  _goBack = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(e) {
    var builder;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //set data state change and pop card from stack;

          builder.setNavigation(CardService.newNavigation().popCard());
          builder.setStateChanged(true);
          return _context10.abrupt("return", builder.build());

        case 4:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _goBack.apply(this, arguments);
}

function goRoot(_x11) {
  return _goRoot.apply(this, arguments);
}
/**
 * Pushes settings card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _goRoot() {
  _goRoot = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(e) {
    var builder;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //set data state change and navigate to main card;

          builder.setNavigation(CardService.newNavigation().popCard().pushCard(cardOpen(e)));
          builder.setStateChanged(true);
          return _context11.abrupt("return", builder.build());

        case 4:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _goRoot.apply(this, arguments);
}

function goSettings(_x12) {
  return _goSettings.apply(this, arguments);
}
/**
 * Pushes confirmation card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _goSettings() {
  _goSettings = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(e) {
    var builder;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //set data state change and navigate to settings card;

          builder.setNavigation(CardService.newNavigation().updateCard(cardUpdate(e)));
          builder.setStateChanged(true);
          return _context12.abrupt("return", builder.build());

        case 4:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return _goSettings.apply(this, arguments);
}

function actionConfirm(_x13) {
  return _actionConfirm.apply(this, arguments);
}
/**
 * Pushes connector create card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _actionConfirm() {
  _actionConfirm = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(e) {
    var builder;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //set data state change and navigate to confirmation card;

          builder.setNavigation(CardService.newNavigation().updateCard(cardConfirm(e)));
          builder.setStateChanged(false);
          return _context13.abrupt("return", builder.build());

        case 4:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return _actionConfirm.apply(this, arguments);
}

function actionCreate(_x14) {
  return _actionCreate.apply(this, arguments);
}
/**
 * Pushes connector update card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _actionCreate() {
  _actionCreate = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(e) {
    var builder;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //set data state change and navigate to edit connector card;

          builder.setNavigation(CardService.newNavigation().pushCard(cardCreate(e)));
          builder.setStateChanged(true);
          return _context14.abrupt("return", builder.build());

        case 4:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return _actionCreate.apply(this, arguments);
}

function actionEdit(_x15) {
  return _actionEdit.apply(this, arguments);
}
/**
 * Pushes display card on stack top with data provided and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _actionEdit() {
  _actionEdit = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee15(e) {
    var builder;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //set data state change and navigate to edit connector card;

          builder.setNavigation(CardService.newNavigation().pushCard(cardUpdate(e)));
          builder.setStateChanged(true);
          return _context15.abrupt("return", builder.build());

        case 4:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return _actionEdit.apply(this, arguments);
}

function actionShow(_x16) {
  return _actionShow.apply(this, arguments);
}
/**
 * Pushes display card on stack top after performing data fetch; 
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _actionShow() {
  _actionShow = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(e) {
    var builder, code;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder();
          code = +e.parameters.code; //handle failed responses;

          if (code < 200 || code >= 300) {
            e.parameters.content = '[]';
          } //set data state change and navigate to display card;


          builder.setNavigation(CardService.newNavigation().pushCard(cardDisplay(e)));
          builder.setStateChanged(true);
          return _context16.abrupt("return", builder.build());

        case 6:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return _actionShow.apply(this, arguments);
}

function actionManual(_x17) {
  return _actionManual.apply(this, arguments);
}
/**
 * Performs reset of every user preference;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */


function _actionManual() {
  _actionManual = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17(e) {
    var builder, msg, connector, cType, cAuth, response, isAuthError, code, content, len;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) switch (_context17.prev = _context17.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder();
          msg = getToken(e);
          connector = e.parameters;
          cType = new this[connector.type]();
          cAuth = cType.auth; //try to perform request;

          _context17.prev = 5;
          _context17.next = 8;
          return cType.run(msg, connector);

        case 8:
          response = _context17.sent;
          _context17.next = 17;
          break;

        case 11:
          _context17.prev = 11;
          _context17.t0 = _context17["catch"](5);
          timestamp('failed to run manual action (' + connector.type + ')', {
            error: _context17.t0,
            data: response
          }, 'error');
          response = {
            headers: '',
            content: {
              descr: 'Something went wrong during manual Connector run.'
            }
          }; //check if error is caused by code or fetch fail;

          isAuthError = checkAgainstErrorTypes(_context17.t0);

          if (isAuthError) {
            response.code = 401;
          } else {
            response.code = 0;
          }

        case 17:
          //access response code and content;
          code = response.code;
          content = response.content;
          e.parameters.code = code; //handle responses;

          if (code >= 200 && code < 300) {
            //if content has data in it -> check for length;
            if (content && content !== null) {
              len = content.length;
            } //if content has one or more data items -> pass to params;


            if (len > 0) {
              e.parameters.content = content;
            }
          } else {
            e.parameters.content = '[]';
            e.parameters.error = content;
          } //set data state change and navigate to display card;


          builder.setNavigation(CardService.newNavigation().pushCard(cardDisplay(e)));
          builder.setStateChanged(true);
          return _context17.abrupt("return", builder.build());

        case 24:
        case "end":
          return _context17.stop();
      }
    }, _callee17, this, [[5, 11]]);
  }));
  return _actionManual.apply(this, arguments);
}

function performFullReset(_x18) {
  return _performFullReset.apply(this, arguments);
}

function _performFullReset() {
  _performFullReset = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee18(e) {
    var builder, onSuccessText, onFailureText, config;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) switch (_context18.prev = _context18.next) {
        case 0:
          //create action response builder;
          builder = CardService.newActionResponseBuilder(); //custom text ot pass to notifications;

          onSuccessText = e.parameters.success;
          onFailureText = e.parameters.failure; //try to delete all OAuth2.0 specific properties;

          _context18.prev = 3;
          _context18.next = 6;
          return getConfig();

        case 6:
          config = _context18.sent;

          if (config.length !== 0) {
            config.forEach(function (connector) {
              var auth = new this[connector.type]().auth;

              if (Object.keys(auth).length !== 0) {
                var service = authService(auth);
                service.reset();
              }
            });
          }

          _context18.next = 13;
          break;

        case 10:
          _context18.prev = 10;
          _context18.t0 = _context18["catch"](3);
          timestamp('error during Add-in reset', {
            error: _context18.t0,
            action: 'full reset'
          }, 'error');

        case 13:
          _context18.prev = 13;
          _context18.next = 16;
          return deleteAllProperties('user');

        case 16:
          builder.setNotification(notification(onSuccessText));
          _context18.next = 22;
          break;

        case 19:
          _context18.prev = 19;
          _context18.t1 = _context18["catch"](13);
          builder.setNotification(error(onFailureText));

        case 22:
          //set data state change and navigate to main card;
          builder.setNavigation(CardService.newNavigation().updateCard(cardHome(e)));
          builder.setStateChanged(true);
          return _context18.abrupt("return", builder.build());

        case 25:
        case "end":
          return _context18.stop();
      }
    }, _callee18, null, [[3, 10], [13, 19]]);
  }));
  return _performFullReset.apply(this, arguments);
}