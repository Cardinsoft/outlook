function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Close.io type constructor;
 */
function Close() {
  Connector.call(this);
  this.icon = globalCloseIconUrl;
  this.typeName = 'Close';
  this.short = globalCloseShort;
  this.url = 'https://api.close.com/api/v1';
  this.traversable = true;
  this.addInCRM = {
    domain: 'app.close.com',
    base: '/search'
  };
  this.config = [{
    widgets: [{
      type: globalKeyValue,
      title: 'Enable actions',
      content: 'By default, the Connector displays custom fields, deals and activities assigned to the contact. If you want to keep things simple, you can switch them off'
    }, {
      type: globalKeyValue,
      name: 'fields',
      content: 'Show custom fields',
      switchValue: true,
      selected: true
    }, {
      type: globalKeyValue,
      name: 'tasks',
      content: 'Show tasks',
      switchValue: true,
      selected: true
    }, {
      type: globalKeyValue,
      name: 'opportunities',
      content: 'Show opportunities',
      switchValue: true,
      selected: true
    }, {
      type: globalKeyValue,
      name: 'activities',
      content: 'Show activities',
      switchValue: true,
      selected: true
    }, {
      type: globalKeyValue,
      name: 'initOpportunity',
      title: 'Initial opportunity',
      content: 'Create leads (lead view only) in bundle with an initial opportunity',
      switchValue: true,
      selected: false
    }, {
      type: globalKeyValue,
      name: 'updates',
      title: 'Handle updates',
      switchValue: true,
      selected: true,
      content: 'Updates are sent to Close as soon as inputs lose focus. If turned off, they can be submitted when needed'
    }, {
      type: globalKeyValue,
      title: 'Choose view',
      content: 'The Connector can prioritize display of lead or contact information depending on your preferences:'
    }, {
      type: globalEnumDropdown,
      name: 'view',
      content: [{
        text: 'Leads',
        value: 'lead',
        selected: true
      }, {
        text: 'Contacts',
        value: 'contact',
        selected: false
      }]
    }]
  }];
  this.caps = {
    activities: 8,
    fields: 8,
    statuses: 8,
    users: 4
  };
  this.auth = {
    type: globalApiTokenAuthType,
    config: {
      header: globalConfigAuthHeader,
      isCollapsible: true,
      numUncollapsible: 1,
      widgets: [{
        type: globalKeyValue,
        title: globalAuthTypeApiTokenTitle,
        content: 'This Connector uses API key-based authorization (your API key can be obtained from <a href="https://app.close.com/settings">Close settings</a>)'
      }, {
        name: globalApiTokenTokenFieldName,
        type: globalTextInput,
        title: 'API key',
        content: '',
        hint: 'e.g. 744707f029a966b5599780'
      }]
    }
  };
  /**
   * General method for refreshng info;
   * @param {Object} msg object with current message info;
   * @param {Object} connector Connector configuration;
   * @param {Object} data optional object for display modification (pass an empty object otherwise);
   * @return {Function} this run() method call;
   */

  this.refresh =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(msg, connector, data) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", this.run(msg, connector));

          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * General method for removing info;
   * @param {Object} msg object with current message info;
   * @param {Object} connector Connector configuration;
   * @param {Object} data optional object for display modification (pass an empty object otherwise);
   * @return {Function} this run() method call;
   */


  this.remove =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(msg, connector, data) {
      var view, headers, id, removeResponse, content;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            view = connector.view;

            if (!view) {
              view = 'contact';
            }

            headers = {
              Authorization: 'Basic ' + Utilities.base64Encode(connector[globalApiTokenTokenFieldName] + ':')
            };
            _context2.t0 = view;
            _context2.next = _context2.t0 === 'lead' ? 6 : _context2.t0 === 'contact' ? 7 : 8;
            break;

          case 6:
            return _context2.abrupt("break", 8);

          case 7:
            return _context2.abrupt("break", 8);

          case 8:
            id = data[0].entity;
            _context2.next = 11;
            return performFetch(this.url + (view === 'lead' ? '/lead/' : '/contact/') + id + '/', 'delete', headers);

          case 11:
            removeResponse = _context2.sent;

            if (!(removeResponse.code >= 200 && removeResponse.code < 300)) {
              _context2.next = 16;
              break;
            }

            content = JSON.parse(removeResponse.content);
            _context2.next = 16;
            return Utilities.sleep(500);

          case 16:
            return _context2.abrupt("return", this.run(msg, connector));

          case 17:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * General method for adding info;
   * @param {Object} connector Connector configuration;
   * @param {Object} msg object with current message info;
   * @return {Object} adder config;
   */


  this.addConfig =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(connector, msg) {
      var message, headers, type, config, users, leadUsers, stats, opptStats, ous, leads, contLeads, las;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            message = trimMessage(msg, true, true);
            headers = {
              Authorization: 'Basic ' + Utilities.base64Encode(connector[globalApiTokenTokenFieldName] + ':')
            }; //initiate type;

            type = new this[connector.type]();
            config = [];
            _context3.t0 = connector.view;
            _context3.next = _context3.t0 === 'lead' ? 7 : _context3.t0 === 'contact' ? 21 : 29;
            break;

          case 7:
            _context3.next = 9;
            return type.fetchUsers_(headers, ['id', 'first_name', 'last_name'], false, 0, 4);

          case 9:
            users = _context3.sent;
            leadUsers = users.map(function (user) {
              return {
                text: user.first_name + ' ' + user.last_name,
                value: user.id,
                selected: false
              };
            });
            leadUsers[0].selected = true; //fetch and prepare opportunity statuses;

            _context3.next = 14;
            return type.fetchOpportStatuses_(headers);

          case 14:
            stats = _context3.sent;
            opptStats = stats.map(function (stat) {
              return {
                text: stat.label,
                value: stat.id,
                selected: false
              };
            });
            opptStats.sort(function (a, b) {
              return order(a.text, b.text);
            });
            opptStats[0].selected = true;
            config.push({
              header: 'Lead info',
              widgets: [{
                type: globalTextInput,
                title: 'Company Name',
                content: message.domain,
                name: 'name',
                hint: 'e.g. Close'
              }, {
                type: globalTextInput,
                title: 'Contact Name',
                content: message.name,
                name: 'contacts-name',
                hint: 'e.g. Steli Efti'
              }, {
                type: globalTextInput,
                title: 'Contact Email',
                content: message.email,
                name: 'contacts-emails-email'
              }, {
                type: globalEnumDropdown,
                content: [{
                  value: 'office',
                  text: 'Office',
                  selected: true
                }, {
                  value: 'mobile',
                  text: 'Mobile',
                  selected: false
                }, {
                  value: 'direct',
                  text: 'Direct',
                  selected: false
                }, {
                  value: 'home',
                  text: 'Home',
                  selected: false
                }, {
                  value: 'other',
                  text: 'Other',
                  selected: false
                }],
                name: 'contacts-emails-type'
              }]
            }); //if opportunity bundle enabled;

            if (connector.initOpportunity) {
              ous = {
                type: globalEnumDropdown,
                title: 'Assign user',
                name: 'opportunities-user_id',
                content: leadUsers,
                fetch: {
                  fetcher: {
                    callback: 'fetchUsers_',
                    params: [['id', 'first_name', 'last_name'], false, 0, 4]
                  },
                  displayer: {
                    edit: [{
                      value: 'id',
                      map: ['first_name', 'last_name'],
                      join: ' ',
                      select: []
                    }]
                  }
                }
              };
              ous.editMap = [copyObject(ous, {})];
              config.push({
                header: 'Opportunity',
                isCollapsible: true,
                widgets: [{
                  type: globalEnumDropdown,
                  title: 'Status',
                  content: opptStats,
                  name: 'opportunities-status_id'
                }, {
                  type: globalTextInput,
                  title: 'Confidence',
                  content: '',
                  hint: 'e.g. 65 (50% by default)',
                  name: 'opportunities-confidence'
                }, {
                  type: globalTextInput,
                  title: 'Value',
                  content: '',
                  name: 'opportunities-value'
                }, {
                  type: globalEnumDropdown,
                  content: [{
                    text: 'One-time',
                    value: 'one_time',
                    selected: true
                  }, {
                    text: 'Monthly',
                    value: 'monthly',
                    selected: false
                  }, {
                    text: 'Annually',
                    value: 'annual',
                    selected: false
                  }],
                  name: 'opportunities-value_period'
                }, {
                  type: globalTextInput,
                  title: 'Estimated Close',
                  content: new Date().toLocaleDateString(),
                  name: 'opportunities-date_won',
                  hint: 'Keep date format the same'
                }, {
                  type: globalTextInput,
                  title: 'Comments',
                  content: '',
                  name: 'opportunities-note',
                  multiline: true
                }]
              });
              config[1].widgets.push(ous);
            }

            return _context3.abrupt("break", 29);

          case 21:
            _context3.next = 23;
            return type.fetchLeads_(headers, ['id', 'name'], false, 0, 4);

          case 23:
            leads = _context3.sent;
            leads.sort(function (a, b) {
              return order(a.name, b.name);
            });
            contLeads = leads.map(function (lead, l) {
              return {
                text: lead.name,
                value: lead.id,
                selected: l === 0 ? true : false
              };
            });
            config.push({
              header: 'Contact info',
              widgets: [{
                type: globalTextInput,
                title: 'Name',
                name: 'name',
                content: message.name,
                hint: 'e.g. Steli Efti'
              }, {
                type: globalTextInput,
                title: 'Title',
                name: 'title',
                content: '',
                hint: 'Job title'
              }, {
                type: globalTextInput,
                title: 'Contact Email',
                content: message.email,
                name: 'emails-email'
              }, {
                type: globalEnumDropdown,
                content: [{
                  value: 'office',
                  text: 'Office',
                  selected: true
                }, {
                  value: 'mobile',
                  text: 'Mobile',
                  selected: false
                }, {
                  value: 'direct',
                  text: 'Direct',
                  selected: false
                }, {
                  value: 'home',
                  text: 'Home',
                  selected: false
                }, {
                  value: 'other',
                  text: 'Other',
                  selected: false
                }],
                name: 'emails-type'
              }]
            }); //add lead assignment or new lead section;

            if (leads.length > 0) {
              las = {
                title: 'Assign to Lead',
                type: globalEnumDropdown,
                content: contLeads,
                name: 'lead_id',
                fetch: {
                  fetcher: {
                    callback: 'fetchLeads_',
                    params: [['id', 'name'], false, 0, 4]
                  },
                  displayer: {
                    edit: [{
                      value: 'id',
                      map: ['name'],
                      join: '',
                      select: []
                    }]
                  }
                }
              };
              las.editMap = [copyObject(las, {})];
              config[0].widgets.push(las);
            } else {
              config.push({
                header: 'Lead info',
                isCollapsible: true,
                widgets: [{
                  type: globalTextInput,
                  title: 'Company Name',
                  content: message.domain,
                  name: 'name',
                  hint: 'e.g. Close'
                }, {
                  type: globalTextInput,
                  title: 'Contact Name',
                  content: message.name,
                  name: 'contacts-name',
                  hint: 'e.g. Steli Efti'
                }, {
                  type: globalTextInput,
                  title: 'Contact Email',
                  content: message.email,
                  name: 'contacts-emails-email'
                }, {
                  type: globalEnumDropdown,
                  content: [{
                    value: 'office',
                    text: 'Office',
                    selected: true
                  }, {
                    value: 'mobile',
                    text: 'Mobile',
                    selected: false
                  }, {
                    value: 'direct',
                    text: 'Direct',
                    selected: false
                  }, {
                    value: 'home',
                    text: 'Home',
                    selected: false
                  }, {
                    value: 'other',
                    text: 'Other',
                    selected: false
                  }],
                  name: 'contacts-emails-type'
                }]
              });
            }

            return _context3.abrupt("break", 29);

          case 29:
            return _context3.abrupt("return", {
              config: JSON.stringify(config),
              method: 'add',
              prompt: connector.view
            });

          case 30:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));

    return function (_x7, _x8) {
      return _ref3.apply(this, arguments);
    };
  }();
  /**
   * General method for updating info;
   * @param {Object} msg object with current message info;
   * @param {Object} connector Connector configuration;
   * @param {Object} forms formInput inputs;
   * @param {Object} data optional object for display modification (pass an empty object otherwise);
   * @param {String} method action to perform - add or edit;
   * @return {Function} this run() method call;
   */


  this.update =
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(msg, connector, forms, data, method) {
      var headers, contacts, leads, opportunities, key, input, k, kName, kSubs, kNameSub, kSub, kSubSub, kId, kType, update, updatedLeads, l, lead, responseL, contentL, updatedOppts, o, oppt, leadAssigned, responseO, contentO, updatedContacts, c, contact, responseC, contentC;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            //construct headers;
            headers = {
              Authorization: 'Basic ' + Utilities.base64Encode(connector[globalApiTokenTokenFieldName] + ':')
            }; //initiate updates;

            contacts = [];
            leads = [];
            opportunities = []; //create payload;

            _context4.t0 = regeneratorRuntime.keys(forms);

          case 5:
            if ((_context4.t1 = _context4.t0()).done) {
              _context4.next = 66;
              break;
            }

            key = _context4.t1.value;
            input = forms[key];

            if (!(input.length === 0)) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("continue", 5);

          case 10:
            k = key.split('&');
            kName = k[0]; //field name;

            kSubs = kName.split('-');
            kNameSub = kSubs[0]; //field name with subprops;

            kSub = kSubs[1]; //field subprop;

            kSubSub = kSubs[2]; //field subprop subprop;

            kId = k[1]; //contact or lead Id;

            kType = k[2]; //type for custom field;
            //initiate update;

            if (kId && kId.indexOf('lead_') !== -1) {
              update = getByProperty(leads, 'id', kId)[0];

              if (!update) {
                update = {
                  id: kId
                };
                leads.push(update);
              }
            } else if (kId) {
              update = getByProperty(contacts, 'id', kId)[0];

              if (!update) {
                update = {
                  id: kId
                };
                contacts.push(update);
              }
            } else if (kNameSub === 'opportunities') {
              update = getByProperty(opportunities, 'id', 'temp')[0];

              if (!update) {
                update = {
                  id: 'temp'
                };
                opportunities.push(update);
              }
            } else if (method === 'add') {
              if (connector.view === 'lead') {
                update = leads[0];
                update = update || (leads[0] = {});
              } else {
                update = contacts[0];
                update = update || (contacts[0] = {});
              }
            }

            _context4.t2 = true;
            _context4.next = _context4.t2 === (kName === 'status_id') ? 22 : _context4.t2 === (kNameSub === 'emails') ? 24 : _context4.t2 === (kName.indexOf('lcf_') !== -1) ? 27 : _context4.t2 === (kNameSub === 'opportunities') ? 43 : _context4.t2 === (kNameSub === 'contacts') ? 54 : 63;
            break;

          case 22:
            update[kName] = input[0];
            return _context4.abrupt("break", 64);

          case 24:
            if (!update[kNameSub]) {
              update[kNameSub] = [{}];
            }

            update[kNameSub][0][kSub] = input[0];
            return _context4.abrupt("break", 64);

          case 27:
            _context4.t3 = true;
            _context4.next = _context4.t3 === (kType === 'choices' || kType === 'user' && input.length > 1) ? 30 : _context4.t3 === (kType === 'date' || kType === 'datetime') ? 32 : 41;
            break;

          case 30:
            update['custom.' + kName] = input;
            return _context4.abrupt("break", 42);

          case 32:
            _context4.prev = 32;
            input = new Date(input[0]).toISOString();
            _context4.next = 39;
            break;

          case 36:
            _context4.prev = 36;
            _context4.t4 = _context4["catch"](32);
            return _context4.abrupt("break", 42);

          case 39:
            update['custom.' + kName] = input;
            return _context4.abrupt("break", 42);

          case 41:
            update['custom.' + kName] = input[0];

          case 42:
            return _context4.abrupt("break", 64);

          case 43:
            _context4.t5 = kSub;
            _context4.next = _context4.t5 === 'value' ? 46 : _context4.t5 === 'date_won' ? 48 : _context4.t5 === 'confidence' ? 50 : 52;
            break;

          case 46:
            try {
              update[kSub] = +input[0];
            } catch (e) {
              update[kSub] = 0;
            }

            return _context4.abrupt("break", 53);

          case 48:
            try {
              update[kSub] = new Date(input[0]).toISOString();
            } catch (e) {
              update[kSub] = new Date().toISOString();
            }

            return _context4.abrupt("break", 53);

          case 50:
            try {
              update[kSub] = +input[0];
            } catch (e) {
              update[kSub] = 50;
            }

            return _context4.abrupt("break", 53);

          case 52:
            update[kSub] = input[0];

          case 53:
            return _context4.abrupt("break", 64);

          case 54:
            if (!update[kNameSub]) {
              update[kNameSub] = [{}];
            }

            _context4.t6 = kSub;
            _context4.next = _context4.t6 === 'emails' ? 58 : 61;
            break;

          case 58:
            if (!update[kNameSub][0][kSub]) {
              update[kNameSub][0][kSub] = [{}];
            }

            update[kNameSub][0][kSub][0][kSubSub] = input[0];
            return _context4.abrupt("break", 62);

          case 61:
            update[kNameSub][0][kSub] = input[0];

          case 62:
            return _context4.abrupt("break", 64);

          case 63:
            update[kName] = input[0];

          case 64:
            _context4.next = 5;
            break;

          case 66:
            //end form handler;
            //send lead updates;
            updatedLeads = [];
            l = 0;

          case 68:
            if (!(l < leads.length)) {
              _context4.next = 77;
              break;
            }

            lead = leads[l];
            _context4.next = 72;
            return performFetch(this.url + '/lead/' + (method === 'add' ? '' : lead.id + '/'), method === 'add' ? 'post' : 'put', headers, lead);

          case 72:
            responseL = _context4.sent;

            if (responseL.code >= 200 && responseL.code < 300) {
              contentL = JSON.parse(responseL.content);
              updatedLeads.push(contentL);
            }

          case 74:
            l++;
            _context4.next = 68;
            break;

          case 77:
            //update or create opportunities;
            updatedOppts = [];
            o = 0;

          case 79:
            if (!(o < opportunities.length)) {
              _context4.next = 97;
              break;
            }

            oppt = opportunities[o];

            if (!(oppt.id === 'temp')) {
              _context4.next = 94;
              break;
            }

            leadAssigned = updatedLeads[0];

            if (!leadAssigned.id) {
              _context4.next = 92;
              break;
            }

            oppt.lead = leadAssigned.id;
            _context4.next = 87;
            return performFetch(this.url + '/opportunity' + (method === 'add' ? '' : leadAssigned.id + '/'), method === 'add' ? 'post' : 'put', headers, oppt);

          case 87:
            responseO = _context4.sent;
            console.log(this.url + '/opportunity/' + (method === 'add' ? '' : leadAssigned.id + '/'));
            console.log(method === 'add' ? '' : leadAssigned.id + '/');
            console.log(headers);

            if (responseO.code >= 200 && responseO.code < 300) {
              contentO = JSON.parse(responseO.content);
              updatedOppts.push(contentO);
            }

          case 92:
            _context4.next = 94;
            break;

          case 94:
            o++;
            _context4.next = 79;
            break;

          case 97:
            if (updatedLeads.length > 0) {
              updatedLeads[0].opportunities = updatedLeads[0].opportunities.concat(updatedOppts);
            }

            updatedContacts = [];
            c = 0;

          case 100:
            if (!(c < contacts.length)) {
              _context4.next = 109;
              break;
            }

            contact = contacts[c];
            _context4.next = 104;
            return performFetch(this.url + '/contact/' + (method === 'add' ? '' : contact.id + '/'), method === 'add' ? 'post' : 'put', headers, contact);

          case 104:
            responseC = _context4.sent;

            if (responseC.code >= 200 && responseC.code < 300) {
              contentC = JSON.parse(responseC.content);
              updatedContacts.push(contentC);
            }

          case 106:
            c++;
            _context4.next = 100;
            break;

          case 109:
            if (!(updatedLeads.length > 0 && updatedContacts.length === 0)) {
              _context4.next = 113;
              break;
            }

            return _context4.abrupt("return", this.run(msg, connector, {
              code: 200,
              headers: {},
              content: JSON.stringify({
                data: updatedLeads
              })
            }));

          case 113:
            return _context4.abrupt("return", this.run(msg, connector));

          case 114:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this, [[32, 36]]);
    }));

    return function (_x9, _x10, _x11, _x12, _x13) {
      return _ref4.apply(this, arguments);
    };
  }();
  /**
  * General method for retrieving info;
  * @param {Object} msg object with current message info;
  * @param {Object} connector Connector configuration;
  * @param {Object} data data to pass to endpoint;
  * @returns {Object} Display configuration;
  */


  this.run =
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(msg, connector, data) {
      var message, queryL, url, headers, view, response, sections, contents, has_more, total, leads, users, leadStatuses, fields, lead, leadId, leadName, contacts, orgId, custom, leadStatus, leadDescr, leadURL, addresses, opportunities, tasks, leadCreated, leadEdited, sectionCont, sectionEmpl, sectionTask, sectionOppt, sectionAct, sectionFields, actFields, activities, c, contact, contId, name, title, emails, phones, urls, socials, created, edited, hasQueryEmail, authErr, returned;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            //modify message;
            message = trimMessage(msg, true, true);
            queryL = ['email_address:' + message.email.toLowerCase(), '_limit=' + 1];

            if (connector.page) {
              queryL.push('_skip=' + connector.page);
            }

            queryL.push('_fields=id,name,contacts,organization_id,custom,status_label,description,url,addresses,opportunities,tasks,date_created,date_updated');
            url = encodeURI(this.url + '/lead?query=' + queryL.join('&')); //construct headers;

            headers = {
              Authorization: 'Basic ' + Utilities.base64Encode(connector[globalApiTokenTokenFieldName] + ':')
            }; //access view type;

            view = connector.view;

            if (!view) {
              view = 'contact';
            } //fetch endpoint and return response;


            if (data) {
              _context5.next = 14;
              break;
            }

            _context5.next = 11;
            return performFetch(url, 'get', headers);

          case 11:
            response = _context5.sent;
            _context5.next = 15;
            break;

          case 14:
            response = data;

          case 15:
            sections = [];

            if (!(response.code >= 200 && response.code < 300)) {
              _context5.next = 89;
              break;
            }

            //access contacts and create sections for each contact;
            contents = JSON.parse(response.content);
            has_more = contents.has_more;
            total = contents.total_results;
            connector.hasNext = has_more;

            if (connector.method === 'traverse') {
              connector.pages = total;
            }

            leads = contents.data;

            if (!(leads.length > 0)) {
              _context5.next = 87;
              break;
            }

            connector.method = 'edit'; //access users;

            _context5.next = 27;
            return this.fetchUsers_(headers, ['id', 'first_name', 'last_name'], false, 0, 4);

          case 27:
            users = _context5.sent;
            _context5.next = 30;
            return this.fetchLeadStatuses_(headers, ['id', 'label'], false, 0, 1);

          case 30:
            leadStatuses = _context5.sent;
            //access fields;
            fields = [];

            if (!connector.fields) {
              _context5.next = 36;
              break;
            }

            _context5.next = 35;
            return this.fetchFields_(headers, ['id', 'type', 'name', 'choices'], false, 0, 8);

          case 35:
            fields = _context5.sent;

          case 36:
            lead = leads[0]; //access lead properties;

            leadId = lead.id;
            leadName = lead.name;
            contacts = lead.contacts;
            orgId = lead.organization_id;
            custom = lead.custom;
            leadStatus = lead.status_label;
            leadDescr = lead.description; //empty string;

            leadURL = lead.url; //null;

            addresses = lead.addresses;
            opportunities = lead.opportunities;
            tasks = lead.tasks;
            leadCreated = lead.date_created;
            leadEdited = lead.date_updated; //initiate contact sections;

            sectionCont = {
              header: globalContactInfoHeader,
              isCollapsible: true,
              widgets: []
            };
            sectionEmpl = {
              header: globalEmploymentContactHeader,
              isCollapsible: true,
              widgets: [],
              entity: leadId,
              editable: true
            };
            sectionTask = {
              header: 'Tasks',
              isCollapsible: true,
              widgets: []
            };
            sectionOppt = {
              header: 'Opportunities',
              isCollapsible: true,
              widgets: []
            };
            sectionAct = {
              header: globalActivitiesHeader,
              isCollapsible: true,
              widgets: [],
              fetch: [{
                fetcher: {
                  callback: 'fetchActivities_',
                  params: [headers, ['_type', 'date_created', 'date_updated', 'date_sent', 'direction', 'duration', 'new_status_label', 'note', 'old_status_label', 'organization_id', 'phone', 'status', 'subject', 'task_assigned_to_name', 'task_text', 'template_id', 'template_name'], false, 0, 8, leadId]
                },
                displayer: {
                  callback: 'displayActivities',
                  params: [leadId]
                }
              }]
            };
            sectionFields = {
              header: 'Custom fields',
              isCollapsible: true,
              widgets: [],
              fetch: [{
                fetcher: {
                  callback: 'fetchFields_',
                  params: [headers, ['id', 'type', 'name', 'choices'], false, 0, 8]
                },
                displayer: {
                  callback: 'displayFields',
                  params: [custom, leadId, users]
                }
              }]
            };

            if (view === 'lead') {
              sectionEmpl.widgets = this.displayLead(sectionEmpl, orgId, leadId, leadName, leadDescr, leadStatuses, leadStatus, leadURL, addresses, leadCreated, leadEdited, view);
            } //if tasks enabled -> display;


            if (connector.tasks) {
              sectionTask.widgets = this.displayTasks(tasks, leadId);
            } //if opportunities enabled -> display;


            if (connector.opportunities) {
              sectionOppt.widgets = this.displayOpportunities(opportunities);
            } //if activities enabled -> display;


            if (!connector.activities) {
              _context5.next = 65;
              break;
            }

            actFields = ['_type', 'date_created', 'date_updated', 'date_sent', 'direction', 'duration', 'new_status_label', 'note', 'old_status_label', 'organization_id', 'phone', 'status', 'subject', 'task_assigned_to_name', 'task_text', 'template_id', 'template_name'];
            _context5.next = 63;
            return this.fetchActivities_(headers, actFields, false, 0, 8, leadId, view === 'contact' ? contacts[0].id : null);

          case 63:
            activities = _context5.sent;
            sectionAct.widgets = this.displayActivities(activities, leadId);

          case 65:
            //if fields enabled -> display;
            if (connector.fields) {
              sectionFields.widgets = this.displayFields(fields, custom, leadId, users);
            }

            c = 0;

          case 67:
            if (!(c < contacts.length)) {
              _context5.next = 86;
              break;
            }

            contact = contacts[c]; //access contact properties;

            contId = contact.id;
            name = contact.name; //empty String;

            title = contact.title; //empty String;

            emails = contact.emails; //Array 1 length;

            phones = contact.phones; //empty Array;

            urls = contact.urls; //empty Array;

            socials = contact.integration_links; //Array 1 length;

            created = contact.date_created;
            edited = contact.date_updated; //equal to created;
            //skip contact if does not comply to email query;

            hasQueryEmail = emails.filter(function (email) {
              if (email.email === message.email.toLowerCase()) {
                return email;
              }
            }).length > 0;

            if (!(!hasQueryEmail && view === 'contact')) {
              _context5.next = 81;
              break;
            }

            return _context5.abrupt("continue", 83);

          case 81:
            if (view === 'contact') {
              sectionCont.entity = contId;
              sectionCont.widgets = this.displayContact(sectionCont, leadId, contId, name, title, emails, phones, connector.fields, created, edited, view);
              sectionEmpl.widgets = this.displayLead(sectionEmpl, orgId, leadId, leadName, leadDescr, leadStatuses, leadStatus, leadURL, addresses, leadCreated, leadEdited, view);
            } else {
              if (c !== 0) {
                sectionCont.widgets = sectionCont.widgets.concat([globalWidgetSeparator]);
              }

              sectionCont.widgets = sectionCont.widgets.concat(this.displayContact(sectionCont, leadId, contId, name, title, emails, phones, connector.fields, created, edited, view));
            }

            if (view === 'contact') {
              sections.push(sectionCont, sectionEmpl, sectionTask, sectionOppt, sectionAct, sectionFields);
            }

          case 83:
            c++;
            _context5.next = 67;
            break;

          case 86:
            //end contacts loop;        
            if (view === 'lead') {
              sectionEmpl.header = 'Lead';
              sectionCont.header = 'Contacts';
              sections.push(sectionEmpl, sectionTask, sectionOppt, sectionCont, sectionAct, sectionFields);
            }

          case 87:
            _context5.next = 96;
            break;

          case 89:
            if (!(response.code === 401)) {
              _context5.next = 95;
              break;
            }

            propertiesToString(connector);
            authErr = [{
              header: 'Invalid credentials',
              widgets: [{
                type: globalKeyValue,
                content: 'We couldn\'t access your account due to invalid credentials. Please, check your API key and update the Connector!'
              }, {
                type: globalButtonSet,
                content: [{
                  type: globalTextButton,
                  title: 'Get API key',
                  action: globalActionLink,
                  content: 'https://app.close.com/settings'
                }, {
                  type: globalTextButton,
                  title: 'Open settings',
                  action: 'click',
                  funcName: 'goSettings',
                  parameters: connector
                }]
              }]
            }];
            return _context5.abrupt("return", {
              code: 200,
              headers: {},
              content: JSON.stringify(authErr),
              hasMatch: {
                value: true,
                text: 'Reauth'
              }
            });

          case 95:
            return _context5.abrupt("return", response);

          case 96:
            //contruct resulting object;
            returned = {
              code: response.code,
              headers: response.headers,
              content: JSON.stringify(sections)
            };

            if (sections.length > 0) {
              returned.hasMatch = {
                value: true,
                text: 'found'
              };
            }

            return _context5.abrupt("return", returned);

          case 99:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this);
    }));

    return function (_x14, _x15, _x16) {
      return _ref5.apply(this, arguments);
    };
  }();
  /**
   * Utility method for fetching leads;
   * @param {Object} headers request headers;
   * @param {Array<String>} fields fileds to return;
   * @param {Boolean} fetchAll autopaginate flag;
   * @param {Integer=} start start for pagination;
   * @param {Integer=} limit limit for pagination;
   * @return {Array<Object>} leads;   
   */


  this.fetchLeads_ =
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(headers, fields, fetchAll, start, limit) {
      var lds, query, url, response, content, statuses, hasMore;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            start = start || 0;
            lds = [];
            query = ['_fields=' + fields.join(','), '_skip=' + start];

            if (limit) {
              query.push('_limit=' + limit);
            }

            url = encodeURI(this.url + '/lead/?' + query.join('&'));
            _context6.next = 7;
            return performFetch(url, 'get', headers);

          case 7:
            response = _context6.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context6.next = 19;
              break;
            }

            content = JSON.parse(response.content);
            statuses = content.data;
            lds = lds.concat(statuses); //check pagination and fetch;

            hasMore = content.has_more;

            if (!(hasMore && fetchAll)) {
              _context6.next = 19;
              break;
            }

            _context6.t0 = lds;
            _context6.next = 17;
            return this.fetchLeads_(headers, fields, fetchAll, start + limit, limit);

          case 17:
            _context6.t1 = _context6.sent;
            lds = _context6.t0.concat.call(_context6.t0, _context6.t1);

          case 19:
            return _context6.abrupt("return", lds);

          case 20:
          case "end":
            return _context6.stop();
        }
      }, _callee6, this);
    }));

    return function (_x17, _x18, _x19, _x20, _x21) {
      return _ref6.apply(this, arguments);
    };
  }();
  /**
   * Utility method for fetching lead statuses;
   * @param {Object} headers request headers;
   * @param {Array<String>} fields fields to return;   
   * @param {Boolean} fetchAll autopaginate flag;   
   * @param {Integer=} start start for pagination;
   * @param {Integer=} limit limit for pagination;   
   * @param {String=} lsid status id filter;
   * @return {Array<Object>} lead statuses;
   */


  this.fetchLeadStatuses_ =
  /*#__PURE__*/
  function () {
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(headers, fields, fetchAll, start, limit, lsid) {
      var lsts, query, url, response, content, statuses, hasMore;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            start = start || 0;
            lsts = [];
            query = ['_skip=' + start];

            if (limit) {
              query.push('_limit=' + limit);
            }

            url = encodeURI(this.url + '/status/lead' + (lsid ? '/' + lsid + '/' : ''));
            _context7.next = 7;
            return performFetch(url, 'get', headers);

          case 7:
            response = _context7.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context7.next = 19;
              break;
            }

            content = JSON.parse(response.content);
            statuses = content.data;
            lsts = lsts.concat(statuses); //check pagination and fetch;

            hasMore = content.has_more;

            if (!(hasMore && fetchAll)) {
              _context7.next = 19;
              break;
            }

            _context7.t0 = lsts;
            _context7.next = 17;
            return this.fetchLeadStatuses_(headers, fields, fetchAll, start + limit, limit, lsid);

          case 17:
            _context7.t1 = _context7.sent;
            lsts = _context7.t0.concat.call(_context7.t0, _context7.t1);

          case 19:
            return _context7.abrupt("return", lsts);

          case 20:
          case "end":
            return _context7.stop();
        }
      }, _callee7, this);
    }));

    return function (_x22, _x23, _x24, _x25, _x26, _x27) {
      return _ref7.apply(this, arguments);
    };
  }();
  /**
   * Utility method for fetching activities;
   * @param {Object} request headers;
   * @param {Array<String>} fields fields to return;
   * @param {Boolean} fetchAll autopaginate flag;
   * @param {Integer=} start start for pagination;
   * @param {Integer=} limit limit for pagination;
   * @param {String=} lid lead id filter;
   * @param {String=} cid contact id filter;
   * @return {Array<Object>} activities;
   */


  this.fetchActivities_ =
  /*#__PURE__*/
  function () {
    var _ref8 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(headers, fields, fetchAll, start, limit, lid, cid) {
      var acts, query, url, response, content, activities, hasMore;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            start = start || 0;
            acts = [];
            query = ['_skip=' + start];

            if (fields) {
              query.push('_fields=' + fields.join(','));
            }

            if (lid) {
              query.push('lead_id=' + lid);
            }

            if (cid) {
              query.push('contact_id=' + cid);
            }

            if (limit) {
              query.push('_limit=' + limit);
            }

            url = encodeURI(this.url + '/activity' + (query.length > 0 ? '?' + query.join('&') : ''));
            _context8.next = 10;
            return performFetch(url, 'get', headers);

          case 10:
            response = _context8.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context8.next = 22;
              break;
            }

            content = JSON.parse(response.content);
            activities = content.data;
            acts = acts.concat(activities); //check pagination and fetch;

            hasMore = content.has_more;

            if (!(hasMore && fetchAll)) {
              _context8.next = 22;
              break;
            }

            _context8.t0 = acts;
            _context8.next = 20;
            return this.fetchActivities_(headers, fields, fetchAll, start + limit, limit, lid, cid);

          case 20:
            _context8.t1 = _context8.sent;
            acts = _context8.t0.concat.call(_context8.t0, _context8.t1);

          case 22:
            return _context8.abrupt("return", acts);

          case 23:
          case "end":
            return _context8.stop();
        }
      }, _callee8, this);
    }));

    return function (_x28, _x29, _x30, _x31, _x32, _x33, _x34) {
      return _ref8.apply(this, arguments);
    };
  }();
  /**
   * Utility method for fetching custom fields;
   * @param {Object} headers request headers;
   * @param {Array<String>} fields fields to return;
   * @param {Boolean} fetchAll autopaginate flag;
   * @param {Integer=} start start for pagination;
   * @param {Integer=} limit limit for pagination;   
   * @param {String=} lid lead id filter;
   * @return {Array<Object>} custom fields;
   */


  this.fetchFields_ =
  /*#__PURE__*/
  function () {
    var _ref9 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9(headers, fields, fetchAll, start, limit, lid) {
      var fds, query, url, response, content, hasMore;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            start = start || 0;
            fds = [];
            query = ['_skip=' + start];

            if (fields) {
              query.push('_fields=' + fields.join(','));
            }

            if (limit) {
              query.push('_limit=' + limit);
            }

            url = encodeURI(this.url + '/custom_fields/lead' + (lid ? '/' + lid + '/' : '') + (query.length > 0 ? '?' + query.join('&') : ''));
            _context9.next = 8;
            return performFetch(url, 'get', headers);

          case 8:
            response = _context9.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context9.next = 20;
              break;
            }

            content = JSON.parse(response.content);
            fields = content.data;
            fds = fds.concat(fields); //check pagination and fetch;

            hasMore = content.has_more;

            if (!(hasMore && fetchAll)) {
              _context9.next = 20;
              break;
            }

            _context9.t0 = fds;
            _context9.next = 18;
            return this.fetchFields_(headers, fields, fetchAll, start + limit, lid);

          case 18:
            _context9.t1 = _context9.sent;
            fds = _context9.t0.concat.call(_context9.t0, _context9.t1);

          case 20:
            return _context9.abrupt("return", fds);

          case 21:
          case "end":
            return _context9.stop();
        }
      }, _callee9, this);
    }));

    return function (_x35, _x36, _x37, _x38, _x39, _x40) {
      return _ref9.apply(this, arguments);
    };
  }();
  /**
   * Utility method for fetching users;
   * @param {Object} headers request headers;
   * @param {Array<String>} fields fields to return;
   * @param {Boolean} fetchAll autopaginate flag;
   * @param {Integer=} start start for pagination;
   * @param {Integer=} limit limit for pagination;   
   * @param {String=} uid user id to filter;
   * @return {Array<Object>} users; 
   */


  this.fetchUsers_ =
  /*#__PURE__*/
  function () {
    var _ref10 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10(headers, fields, fetchAll, start, limit, uid) {
      var uss, query, url, response, content, users, hasMore;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            start = start || 0;
            uss = [];
            query = ['_skip=' + start];

            if (fields) {
              query.push('_fields=' + fields.join(','));
            }

            if (limit) {
              query.push('_limit=' + limit);
            }

            url = encodeURI(this.url + '/user' + (uid ? '/' + uid + '/' : '') + (query.length > 0 ? '?' + query.join('&') : ''));
            _context10.next = 8;
            return performFetch(url, 'get', headers);

          case 8:
            response = _context10.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context10.next = 20;
              break;
            }

            content = JSON.parse(response.content);
            users = content.data;
            uss = uss.concat(users);
            hasMore = content.has_more;

            if (!(hasMore && fetchAll)) {
              _context10.next = 20;
              break;
            }

            _context10.t0 = uss;
            _context10.next = 18;
            return this.fetchUsers_(headers, fields, fetchAll, start + limit, uid);

          case 18:
            _context10.t1 = _context10.sent;
            uss = _context10.t0.concat.call(_context10.t0, _context10.t1);

          case 20:
            return _context10.abrupt("return", uss);

          case 21:
          case "end":
            return _context10.stop();
        }
      }, _callee10, this);
    }));

    return function (_x41, _x42, _x43, _x44, _x45, _x46) {
      return _ref10.apply(this, arguments);
    };
  }();
  /**
   * Utility method for fetching opportunity statuses;
   * @param {Object} headers request headers;
   * @param {String=} id if provided -> fetch single status;
   * @return {Array<Object>} opportunity statuses;
   */


  this.fetchOpportStatuses_ =
  /*#__PURE__*/
  function () {
    var _ref11 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11(headers, id) {
      var oss, url, response, content, statuses;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            oss = [];
            url = encodeURI(this.url + '/status/opportunity' + (id ? '/' + id + '/' : ''));
            _context11.next = 4;
            return performFetch(url, 'get', headers);

          case 4:
            response = _context11.sent;

            if (response.code >= 200 && response.code < 300) {
              content = JSON.parse(response.content);
              statuses = content.data;
              oss = oss.concat(statuses);
            }

            return _context11.abrupt("return", oss);

          case 7:
          case "end":
            return _context11.stop();
        }
      }, _callee11, this);
    }));

    return function (_x47, _x48) {
      return _ref11.apply(this, arguments);
    };
  }();
  /**
   * Utility method for building contact display; 
   * @param {Object} sectionCont contact section;
   * @param {String} leadId lead id;
   * @param {String} contId contact id;
   * @param {String} name contact name;
   * @param {String} title contact job title;
   * @param {Array<Object>} emails contact emails;
   * @param {Array<Object>} phones contact phones;
   * @param {String} created contact creation date;
   * @param {string} edited contact update date;
   * @param {String} view connector view type;
   * @return {Array<Object>} contact widgets;
   */


  this.displayContact = function (sectionCont, leadId, contId, name, title, emails, phones, showFields, created, edited, view) {
    var wmain = []; //create name widget;

    if (name !== '') {
      var n = {
        icon: 'PERSON',
        type: globalKeyValue,
        title: 'Full name',
        state: 'editable',
        name: ['name', contId].join('&'),
        content: name
      };
      n.editMap = [{
        type: globalTextInput,
        state: n.state,
        title: n.title,
        name: n.name,
        content: n.content
      }];
      wmain.push(n);
    } //create title widget;


    if (title !== '') {
      var tt = {
        icon: globalIconJobTitle,
        type: globalKeyValue,
        title: 'Job title',
        content: title,
        state: 'editable',
        name: 'title&' + contId
      };
      tt.editMap = [{
        type: globalTextInput,
        title: tt.title,
        content: tt.content,
        state: tt.state,
        name: tt.name
      }];
      wmain.push(tt);
    } //create email widgets;


    emails.forEach(function (email, el) {
      var t = email.type;
      var m = email.email;
      var em = {
        type: globalKeyValue,
        title: toSentenceCase(t) + ' email',
        content: '<a href="mailto:' + m + '">' + m + '</a>'
      };

      switch (t) {
        case 'office':
          em.icon = globalIconOfficeEmail;
          break;

        case 'mobile':
          em.icon = globalIconMobileEmail;
          break;

        case 'direct':
          em.icon = globalIconDirectEmail;
          break;

        case 'home':
          em.icon = globalIconHomeEmail;
          break;

        default:
          em.icon = 'EMAIL';
      }

      if (el === 0) {
        em.separate = true;
        em.prepend = true;
      }

      wmain.push(em);
    }); //create phone widgets;

    phones.forEach(function (phone, ph) {
      var t = phone.type;
      var p = phone.phone_formatted;
      var ep = {
        type: globalKeyValue,
        title: toSentenceCase(t) + ' phone',
        content: '<a href="tel:' + p + '">' + p + '</a>'
      };

      switch (t) {
        case 'office':
          ep.icon = globalIconWorkPhone;
          break;

        case 'mobile':
          ep.icon = globalIconMobilePhone;
          break;

        case 'direct':
          ep.icon = globalIconDirectPhone;
          break;

        case 'home':
          ep.icon = globalIconHomePhone;
          break;

        default:
          ep.icon = 'PHONE';
      }

      if (ph === 0) {
        ep.separate = true;
        ep.prepend = true;
      }

      wmain.push(ep);
    }); //if contact view -> add info widgets;

    var ei = {
      type: globalTextButton,
      action: globalActionLink,
      title: 'Edit in Close',
      content: 'https://app.close.com/lead/' + leadId,
      reload: true
    };

    if (view === 'contact') {
      wmain.push(ei); //parse dates and compare;

      var equal = false;
      created = created.split('.');
      edited = edited.split('.');
      var dCreated = new Date(created[0]);
      var dEdited = new Date(edited[0]);

      if (dCreated.valueOf() === dEdited.valueOf()) {
        equal = true;
      } //create contact creation widget;


      var cr = {
        icon: 'CLOCK',
        type: globalKeyValue,
        title: 'Created',
        content: dCreated.toLocaleDateString() + '\r' + dCreated.toLocaleTimeString(),
        separate: true,
        prepend: true
      };
      wmain.push(cr); //if difference in create-edit time -> create edit widget;

      if (!equal) {
        var up = {
          icon: 'CLOCK',
          type: globalKeyValue,
          title: 'Edited',
          content: dEdited.toLocaleDateString() + '\r' + dEdited.toLocaleTimeString()
        };
        wmain.push(up);
      } //set uncollapsible widgets;


      var num = wmain.length;

      if (!equal) {
        num -= 3;
      } else {
        num -= 2;
      }

      sectionCont.numUncollapsible = num;
    }

    return wmain;
  };
  /**
   * Utility method for building fields display;
   * @param {Array<Objects>} fields custom fields details;
   * @param {Object} custom lead's custom fields;
   * @param {String} leadId lead id;
   * @param {Array<Objects>} users set of users; 
   * @return {Array} custom fields widgets;
   */


  this.displayFields = function (fields, custom, leadId, users) {
    var wcfds = [];

    for (var key in custom) {
      var field = custom[key];
      var fieldInfo = fields.filter(function (f) {
        return f.name === key;
      })[0];

      if (fieldInfo && fieldInfo.type !== 'hidden') {
        var cfw = {
          icon: globalIconCustom,
          type: globalKeyValue,
          title: key,
          state: 'editable',
          name: [fieldInfo.id, leadId, fieldInfo.type].join('&')
        };

        switch (fieldInfo.type) {
          case 'text':
            cfw.icon = globalIconText;
            cfw.content = field.toString();
            break;

          case 'number':
            cfw.icon = globalIconNumber;
            cfw.content = field.toString();
            break;

          case 'date':
            cfw.icon = 'INVITE';
            var dateContent = new Date(field);
            cfw.content = dateContent.toLocaleDateString();
            cfw.editMap = [copyObject(cfw, {
              type: globalTextInput,
              hint: 'Please, keep date syntax as displayed'
            }, false)];
            break;

          case 'datetime':
            cfw.icon = 'INVITE';
            var dtime = new Date(field);
            cfw.content = dtime.toLocaleDateString() + '\r\n' + dtime.toLocaleTimeString();
            cfw.editMap = [copyObject(cfw, {
              type: globalTextInput,
              hint: 'Please, keep date syntax as displayed'
            }, false)];
            break;

          case 'choices':
            cfw.icon = globalIconList; //handle multiple and single choices;

            if (field instanceof Array) {
              cfw.content = field.join('\r\n');
              var customMultiChoices = field.map(function (mch) {
                return {
                  text: mch,
                  value: mch,
                  selected: true
                };
              });
              fieldInfo.choices.forEach(function (choice) {
                if (field.indexOf(choice) === -1) {
                  customMultiChoices.push({
                    text: choice,
                    value: choice,
                    selected: false
                  });
                }
              });
              cfw.editMap = [{
                type: globalEnumCheckbox,
                title: cfw.title,
                name: cfw.name,
                state: cfw.state,
                content: customMultiChoices
              }];
            } else {
              cfw.content = field;
              var customChoices = [{
                text: field,
                value: field,
                selected: true
              }];
              fieldInfo.choices.forEach(function (choice) {
                if (choice !== field) {
                  customChoices.push({
                    text: choice,
                    value: choice,
                    selected: false
                  });
                }
              });
              cfw.editMap = [{
                type: globalEnumDropdown,
                title: cfw.title,
                name: cfw.name,
                state: cfw.state,
                content: customChoices
              }];
            }

            break;

          case 'user':
            cfw.icon = globalIconAccount;
            var user;
            var userDisplay = 'Failed to get user info';

            if (field instanceof Array) {
              user = users.filter(function (u) {
                return field.indexOf(u.id) !== -1;
              });
              userDisplay = user.map(function (u) {
                return u.first_name + ' ' + u.last_name;
              }).join('\r\n');
              var customMultiUsers = user.map(function (mu) {
                return {
                  text: mu.first_name + ' ' + mu.last_name,
                  value: mu.id,
                  selected: true
                };
              });
              users.forEach(function (u) {
                var isOtherUser = user.every(function (ur) {
                  return ur.id !== u.id;
                });

                if (isOtherUser) {
                  customMultiUsers.push({
                    text: u.first_name + ' ' + u.last_name,
                    value: u.id,
                    selected: false
                  });
                }
              });
              cfw.editMap = [{
                type: globalEnumCheckbox,
                title: cfw.title,
                name: cfw.name,
                state: cfw.state,
                content: customMultiUsers
              }];
            } else {
              user = users.filter(function (u) {
                return u.id === field;
              })[0];

              if (user) {
                userDisplay = user.first_name + ' ' + user.last_name;
              }

              var customUsers = [{
                text: userDisplay,
                value: user.id,
                selected: true
              }];
              users.forEach(function (u) {
                if (u.id !== user.id) {
                  customUsers.push({
                    text: u.first_name + ' ' + u.last_name,
                    value: u.id,
                    selected: false
                  });
                }
              });
              cfw.editMap = [{
                type: globalEnumDropdown,
                title: cfw.title,
                name: cfw.name,
                state: cfw.state,
                content: customUsers
              }];
            }

            cfw.content = userDisplay;
            cfw.fetch = {
              fetcher: {
                callback: 'fetchUsers_',
                params: [['id', 'first_name', 'last_name'], false, 0, 4]
              },
              displayer: {
                show: {
                  map: ['first_name', 'last_name'],
                  join: '\r\n'
                },
                edit: [{
                  value: 'id',
                  map: ['first_name', 'last_name'],
                  join: ' ',
                  select: field
                }]
              }
            };
            break;
        }

        wcfds.push(cfw);
      } //end field info check;

    } //end fields loop;


    return wcfds;
  };
  /**
   * Utility method for building lead display;
   * @param {Object} sectionEmpl lead section;
   * @param {String} orgId organization id;
   * @param {String} leadId lead id;
   * @param {String} leadName lead name;
   * @param {String} leadDescr lead description;
   * @param {Array<Object>} leadStatuses lead statuses;
   * @param {String} leadStatus current lead status;
   * @param {String} leadURL lead url;
   * @param {Array<Object>} addresses lead addresses;
   * @param {String} leadCreated lead creation date; 
   * @param {String} leadEdited lead update date;
   * @param {String} view connector view type;
   * @return {Array<Object>} lead widgets;
   */


  this.displayLead = function (sectionEmpl, orgId, leadId, leadName, leadDescr, leadStatuses, leadStatus, leadURL, addresses, leadCreated, leadEdited, view) {
    var wempl = []; //create lead widget;

    var lw = {
      icon: globalIconCompany,
      type: globalKeyValue,
      title: 'Company',
      content: leadName,
      state: 'editable',
      name: 'name&' + leadId
    };
    lw.editMap = [{
      title: lw.title,
      type: globalTextInput,
      name: lw.name,
      content: lw.content,
      state: lw.state
    }];
    wempl.push(lw); //create description widget;

    if (leadDescr && leadDescr !== '') {
      var ldw = {
        icon: globalIconBackground,
        type: globalKeyValue,
        title: 'Description',
        content: leadDescr,
        state: 'editable',
        name: 'description&' + leadId
      };
      ldw.editMap = [{
        title: ldw.title,
        type: globalTextInput,
        name: ldw.name,
        content: ldw.content,
        state: ldw.state
      }];
      wempl.push(ldw);
    } //create lead status options;


    var lstOptions = [{
      text: leadStatus,
      value: leadStatus,
      selected: true
    }];
    leadStatuses.forEach(function (lst) {
      var lstLabel = lst.label;
      var lstId = lst.id;

      if (lst.organization_id === orgId && lstLabel !== leadStatus) {
        lstOptions.push({
          text: lstLabel,
          value: lstId,
          selected: false
        });
      }
    }); //create status widget;

    lstOptions.sort(function (a, b) {
      return order(a.text, b.text);
    });
    var lsw = {
      icon: 'BOOKMARK',
      type: globalKeyValue,
      title: 'Lead status',
      content: leadStatus,
      state: 'editable',
      name: 'status_id&' + leadId
    };
    lsw.editMap = [{
      title: lsw.title,
      type: globalEnumDropdown,
      name: lsw.name,
      content: lstOptions,
      state: lsw.state
    }];
    wempl.push(lsw); //create url widget;

    if (leadURL !== null) {
      leadURL = leadURL.replace('http://', 'https://');
      var urlw = {
        icon: globalIconLink,
        type: globalKeyValue,
        title: 'Link',
        content: leadURL.replace('https://', ''),
        state: 'editable',
        name: 'url&' + leadId
      };
      urlw.editMap = [{
        title: urlw.title,
        type: globalTextInput,
        name: urlw.name,
        content: leadURL,
        state: urlw.state
      }];
      wempl.push(urlw);
    } //create address widgets;


    if (addresses.length > 0) {
      addresses.forEach(function (address, a) {
        var addressContent = [];

        if (address.zipcode) {
          addressContent.push(address.zipcode);
        }

        if (address.address_1) {
          addressContent.push(address.address_1);
        }

        if (address.address_2) {
          addressContent.push(address.address_2);
        }

        if (address.city) {
          addressContent.push(address.city);
        }

        if (address.state) {
          addressContent.push(address.state);
        }

        if (address.country) {
          addressContent.push(address.country);
        }

        var alw = {
          type: globalKeyValue,
          title: toSentenceCase(address.label) + ' address',
          content: addressContent.join(', ')
        };

        switch (address.label) {
          case 'business':
            alw.icon = globalIconAddressBill;
            break;

          case 'mailing':
            alw.icon = globalIconAddressMail;
            break;

          case 'other':
            alw.icon = 'MAP_PIN';
            break;
        }

        if (a === 0) {
          alw.separate = true;
          alw.prepend = true;
        }

        wempl.push(alw);
      });
    } //if lead view -> add info widgets;


    if (view === 'lead') {
      var ei = {
        type: globalTextButton,
        action: globalActionLink,
        title: 'Edit in Close',
        content: 'https://app.close.com/lead/' + leadId,
        reload: true
      };
      wempl.push(ei);
      wempl.push(globalWidgetSeparator); //parse dates and compare;

      var lequal = false;
      leadCreated = leadCreated.split('.');
      leadEdited = leadEdited.split('.');
      var ldCreated = new Date(leadCreated[0]);
      var ldEdited = new Date(leadEdited[0]);

      if (ldCreated.valueOf() === ldEdited.valueOf()) {
        lequal = true;
      } //create contact creation widget;


      var lcr = {
        icon: 'CLOCK',
        type: globalKeyValue,
        title: 'Created',
        content: ldCreated.toLocaleDateString() + '\r' + ldCreated.toLocaleTimeString()
      };
      wempl.push(lcr); //if difference in create-edit time -> create edit widget;

      if (!lequal) {
        var lup = {
          icon: 'CLOCK',
          type: globalKeyValue,
          title: 'Edited',
          content: ldEdited.toLocaleDateString() + '\r' + ldEdited.toLocaleTimeString()
        };
        wempl.push(lup);
      } //set uncollapsible widgets;


      var lnum = wempl.length;

      if (!lequal) {
        lnum -= 3;
      } else {
        lnum -= 2;
      }

      sectionEmpl.numUncollapsible = lnum;
    }

    return wempl;
  };
  /**
   * Utility method for building tasks display;
   * @param {Array<Object>} tasks tasks content from API;
   * @param {String} leadId lead id;
   * @return {Array<Object>} tasks widgets;
   */


  this.displayTasks = function (tasks, leadId) {
    var wtask = [];
    tasks.sort(function (a, b) {
      return order(new Date(a.due_date), new Date(b.due_date), true);
    });
    tasks.forEach(function (task, t) {
      //access tasks properties;
      var taskTitle = task.text;
      var taskView = task.view; //future, inbox, archive;

      var taskUser = task.assigned_to_name; //null;

      var taskState = task.is_complete; //false;

      var taskDue = new Date(task.due_date);
      var ttw = {
        icon: globalIconActivities,
        type: globalKeyValue,
        content: taskTitle,
        title: 'due ' + taskDue.toLocaleDateString()
      };

      if (taskDue.getHours() > 0) {
        ttw.hint = 'till ' + taskDue.toLocaleTimeString();
      }

      if (taskState) {
        ttw.buttonIcon = globalIconTaskDone;
        ttw.buttonText = 'Done';
      } else if (!taskState && taskView === 'inbox') {
        ttw.buttonIcon = globalIconTaskFailed;
        ttw.buttonText = 'Failed';
      }

      if (!(taskView === 'future')) {
        ttw.buttonLink = 'https://app.close.com/lead/' + leadId;
      }

      wtask.push(ttw);
      var tatw = {
        icon: globalIconAccount,
        type: globalKeyValue,
        title: 'Assigned to',
        content: taskUser,
        separate: true
      };
      wtask.push(tatw);
    }); //end tasks loop;              

    return wtask;
  };
  /**
   * Utility method for building opportunities display;
   * @param {Array<Object>} opportunities 
   * @return {Array<Object>} opportunities widgets;
   */


  this.displayOpportunities = function (opportunities) {
    var woppt = [];
    opportunities.forEach(function (opportunity, op) {
      //access opportunity properties;
      var opptValue = opportunity.value_formatted; //empty string;

      var opptPeriod = opportunity.value_period; //one_time;

      var opptNote = opportunity.note; //empty string;

      var opptConf = opportunity.confidence; //50;

      var opptStatLbl = opportunity.status_label;
      var opptStat = opportunity.status_type; //active;

      var opptWon = opportunity.date_won; //null;

      var opptLost = opportunity.date_lost; //null;

      var opptCont = opportunity.contact_name; //null;

      var opw = {
        type: globalKeyValue
      };

      switch (opptPeriod) {
        case 'one_time':
          opw.icon = 'CLOCK';
          opw.content = 'One-time opportunity';
          break;

        case 'monthly':
          opw.icon = globalIconClockRecurrent;
          opw.content = 'Monthly opportunity';
          break;

        case 'annual':
          opw.icon = globalIconInviteRecurrent;
          opw.content = 'Yearly opportunity';
          break;
      }

      opw.buttonIcon = globalIconOpen;
      opw.buttonText = 'Open';
      opw.buttonLink = 'https://app.close.com/opportunities/';
      woppt.push(opw);
      var ostw = {
        icon: globalIconDealOpen,
        type: globalKeyValue,
        content: '<b>' + opptStatLbl + '</b>'
      };

      switch (opptStat) {
        case 'won':
          ostw.colour = '#88DD88';
          break;

        case 'lost':
          ostw.colour = '#cccccc';
          break;

        case 'active':
          ostw.colour = '#ffbd2e';
          break;
      }

      woppt.push(ostw);

      if (opptValue !== '') {
        var ovcw = {
          icon: 'DOLLAR',
          type: globalKeyValue,
          title: 'Value',
          content: opptValue
        };

        if (opptStat === 'active') {
          ovcw.buttonText = opptConf + '%';
        }

        woppt.push(ovcw);
      }

      if (opptNote !== '') {
        var onw = {
          icon: globalIconBackground,
          type: globalKeyValue,
          title: 'Note',
          content: opptNote
        };
        woppt.push(onw);
      }

      switch (opptStat) {
        case 'active':
          if (opptWon !== null) {
            var ecdw = {
              icon: 'INVITE',
              type: globalKeyValue,
              title: 'Estimated Close',
              content: new Date(opptWon).toLocaleDateString(),
              separate: opptCont ? false : true
            };
            woppt.push(ecdw);
          }

          break;

        default:
          var wlw = {
            icon: 'INVITE',
            type: globalKeyValue,
            title: 'Date ' + opptStat,
            separate: opptCont ? false : true
          };

          if (opptWon !== null) {
            wlw.content = new Date(opptWon).toLocaleDateString();
          }

          if (opptLost !== null) {
            wlw.content = new Date(opptLost.split('.')[0]).toLocaleDateString();
          }

          woppt.push(wlw);
      }

      if (opptCont !== null) {
        var cnw = {
          icon: 'PERSON',
          type: globalKeyValue,
          title: 'Contact name',
          content: opptCont,
          separate: true
        };
        woppt.push(cnw);
      }
    });
    return woppt;
  };
  /**
   * Utility method for building activities display;
   * @param {Array<Object>} activities activities set;
   * @param {String} leadId lead id;
   * @param {String} contactId contact id;
   * @return {Array<Object>} activities widgets;
   */


  this.displayActivities = function (activities, leadId, contactId) {
    var wact = [];
    activities.forEach(function (activity, a) {
      //access activity params;
      var type = activity._type;
      var organization = activity.organization_id;

      switch (type) {
        case 'TaskCompleted':
          var titleTC = activity.task_text;
          var userTC = activity.task_assigned_to_name;
          var dateTC = new Date(activity.date_updated.split('.')[0]);
          var atcw = {
            icon: globalIconTaskDone,
            type: globalKeyValue,
            title: 'Task completed',
            content: titleTC,
            hint: dateTC.toLocaleDateString() + ' ' + dateTC.toLocaleTimeString()
          };
          var utcw = {
            icon: globalIconAccount,
            type: globalKeyValue,
            title: 'Assigned user',
            content: userTC,
            separate: true
          };
          wact.push(atcw, utcw);
          break;

        case 'OpportunityStatusChange':
          var oldOpptStatus = activity.old_status_label;
          var newOpptStatus = activity.new_status_label;
          var dateOpptChanged = new Date(activity.date_updated.split('.')[0]);
          var oscw = {
            icon: globalIconSwitch,
            type: globalKeyValue,
            hint: dateOpptChanged.toLocaleDateString() + ' ' + dateOpptChanged.toLocaleTimeString(),
            content: oldOpptStatus + ' &rarr; ' + newOpptStatus,
            title: 'Opportunity status change',
            separate: true
          };
          wact.push(oscw);
          break;

        case 'LeadStatusChange':
          var newStatus = activity.new_status_label;
          var oldStatus = activity.old_status_label;
          var dateChanged = new Date(activity.date_updated.split('.')[0]);
          var lscw = {
            icon: globalIconSwitch,
            type: globalKeyValue,
            hint: dateChanged.toLocaleDateString() + ' ' + dateChanged.toLocaleTimeString(),
            content: oldStatus + ' &rarr; ' + newStatus,
            title: 'Lead status change',
            separate: true
          };
          wact.push(lscw);
          break;

        case 'Note':
          var noteText = activity.note;
          var noteTitle = new Date(activity.date_updated.split('.')[0]);
          var antw = {
            icon: globalIconNotes,
            type: globalKeyValue,
            title: 'Noted on ' + noteTitle.toLocaleDateString(),
            content: noteText,
            separate: true
          };
          wact.push(antw);
          break;

        case 'Email':
          var createdate = activity.date_created.split('.')[0];
          var sentdate = activity.date_sent ? activity.date_sent.split('.')[0] : null;
          var emailDirect = activity.direction;
          var idTempl = activity.template_id;
          var template = activity.template_name;
          var emailDate = sentdate ? new Date(sentdate).toLocaleDateString() + ' ' + new Date(sentdate).toLocaleTimeString() : new Date(createdate).toLocaleDateString() + ' ' + new Date(createdate).toLocaleTimeString();
          var at = {
            icon: emailDirect === 'incoming' ? globalIconInbox : globalIconSend,
            type: globalKeyValue,
            title: 'Subject',
            hint: emailDate,
            content: activity.subject
          };
          wact.push(at);

          if (template !== null) {
            var tu = {
              icon: globalIconBackground,
              type: globalKeyValue,
              title: 'Template used',
              content: template,
              disabled: false,
              separate: true,
              buttonIcon: globalIconOpen,
              buttonText: 'Edit',
              buttonLink: 'https://app.close.com/organization/' + organization + '/email_templates/' + idTempl
            };
            wact.push(tu);
          } else {
            at.separate = true;
          }

          break;

        case 'Call':
          var callStatus = activity.status;
          var callNote = activity.note;
          var callDirect = activity.direction;
          var callDate = new Date(activity.date_created.split('.')[0]);
          var duration = activity.duration / 60 / 60;
          var callPhone = activity.phone;
          var hs = endsOnOne(duration);
          var cf = {
            icon: callDirect === 'outbound' ? globalIconCallOutbound : globalIconCallInbound,
            type: globalKeyValue,
            title: 'Call info',
            hint: callDate.toLocaleDateString() + ' ' + callDate.toLocaleTimeString(),
            separate: callNote !== '' || duration > 0 ? false : true
          };

          if (callPhone) {
            cf.content = callPhone;
          } else {
            cf.content = 'Phone number not filled';
          }

          wact.push(cf);

          if (callNote !== '') {
            var cw = {
              icon: globalIconBackground,
              title: 'Call note',
              type: globalKeyValue,
              content: callNote,
              separate: duration > 0 ? false : true
            };
            wact.push(cw);
          }

          if (duration > 0) {
            var cd = {
              icon: 'CLOCK',
              type: globalKeyValue,
              title: 'Duration',
              separate: true
            };

            if (hs || duration < 1) {
              cd.content = duration + ' hour';
            } else {
              cd.content = duration + ' hours';
            }

            wact.push(cd);
          }

          break;
      }
    }); //end activities loop;

    return wact;
  };
}

Close.prototype = Object.create(Connector.prototype);