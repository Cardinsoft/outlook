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
      var view, headers, id, removeResponse;
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
            return _context2.abrupt("return", this.run(msg, connector));

          case 13:
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
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(msg, connector, forms, data, method) {
      var headers, contacts, leads, key, input, k, kName, kSubs, kNameSub, kSub, kSubSub, kId, kType, update, l, lead, responseL, c, contact, responseC;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            //construct headers;
            headers = {
              Authorization: 'Basic ' + Utilities.base64Encode(connector[globalApiTokenTokenFieldName] + ':')
            }; //initiate updates;

            contacts = [];
            leads = []; //create payload;

            _context3.t0 = regeneratorRuntime.keys(forms);

          case 4:
            if ((_context3.t1 = _context3.t0()).done) {
              _context3.next = 49;
              break;
            }

            key = _context3.t1.value;
            input = forms[key];
            k = key.split('&');
            kName = k[0]; //field name;

            kSubs = kName.split('-');
            kNameSub = kSubs[0]; //field naem with subprops;

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
            } else if (method === 'add') {
              if (connector.view === 'lead') {
                update = leads[0];
                update = update || (leads[0] = {});
              } else {
                update = contacts[0];
                update = update || (contacts[0] = {});
              }
            }

            _context3.t2 = true;
            _context3.next = _context3.t2 === (kName === 'status_id') ? 19 : _context3.t2 === (kName.indexOf('lcf_') !== -1) ? 21 : _context3.t2 === (kNameSub === 'contacts') ? 37 : 46;
            break;

          case 19:
            update[kName] = input[0];
            return _context3.abrupt("break", 47);

          case 21:
            _context3.t3 = true;
            _context3.next = _context3.t3 === (kType === 'choices' || kType === 'user' && input.length > 1) ? 24 : _context3.t3 === (kType === 'date' || kType === 'datetime') ? 26 : 35;
            break;

          case 24:
            update['custom.' + kName] = input;
            return _context3.abrupt("break", 36);

          case 26:
            _context3.prev = 26;
            input = new Date(input[0]).toISOString();
            _context3.next = 33;
            break;

          case 30:
            _context3.prev = 30;
            _context3.t4 = _context3["catch"](26);
            return _context3.abrupt("break", 36);

          case 33:
            update['custom.' + kName] = input;
            return _context3.abrupt("break", 36);

          case 35:
            update['custom.' + kName] = input[0];

          case 36:
            return _context3.abrupt("break", 47);

          case 37:
            if (!update[kNameSub]) {
              update[kNameSub] = [{}];
            }

            _context3.t5 = kSub;
            _context3.next = _context3.t5 === 'emails' ? 41 : 44;
            break;

          case 41:
            if (!update[kNameSub][0][kSub]) {
              update[kNameSub][0][kSub] = [{}];
            }

            update[kNameSub][0][kSub][0][kSubSub] = input[0];
            return _context3.abrupt("break", 45);

          case 44:
            update[kNameSub][0][kSub] = input[0];

          case 45:
            return _context3.abrupt("break", 47);

          case 46:
            update[kName] = input[0];

          case 47:
            _context3.next = 4;
            break;

          case 49:
            l = 0;

          case 50:
            if (!(l < leads.length)) {
              _context3.next = 58;
              break;
            }

            lead = leads[l];
            _context3.next = 54;
            return performFetch(this.url + '/lead/' + (method === 'add' ? '' : lead.id + '/'), method === 'add' ? 'post' : 'put', headers, lead);

          case 54:
            responseL = _context3.sent;

          case 55:
            l++;
            _context3.next = 50;
            break;

          case 58:
            c = 0;

          case 59:
            if (!(c < contacts.length)) {
              _context3.next = 67;
              break;
            }

            contact = contacts[c];
            _context3.next = 63;
            return performFetch(this.url + '/contact/' + (method === 'add' ? '' : contact.id + '/'), method === 'add' ? 'post' : 'put', headers, contact);

          case 63:
            responseC = _context3.sent;

          case 64:
            c++;
            _context3.next = 59;
            break;

          case 67:
            return _context3.abrupt("return", this.run(msg, connector));

          case 68:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this, [[26, 30]]);
    }));

    return function (_x7, _x8, _x9, _x10, _x11) {
      return _ref3.apply(this, arguments);
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


    if (emails.length > 1) {
      wmain.push(globalWidgetSeparator);
    }

    emails.forEach(function (email) {
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

      wmain.push(em);
    }); //create phone widgets;

    if (phones.length > 1) {
      wmain.push(globalWidgetSeparator);
    }

    phones.forEach(function (phone) {
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
      wmain.push(ei);
      wmain.push(globalWidgetSeparator); //parse dates and compare;

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
        content: dCreated.toLocaleDateString() + '\r' + dCreated.toLocaleTimeString()
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
          cfw.content = field;
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
          break;
      }

      wcfds.push(cfw);
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
      wempl.push(globalWidgetSeparator);
      addresses.forEach(function (address) {
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
            alw.icon = 'EMAIL';
            break;

          case 'other':
            alw.icon = 'MAP_PIN';
            break;
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
        content: taskTitle
      };

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
      var tdw = {
        icon: 'INVITE',
        type: globalKeyValue,
        title: 'Due date',
        content: taskDue.toLocaleDateString()
      };

      if (taskDue.getHours() > 0) {
        tdw.content += '\r\n' + taskDue.toLocaleTimeString();
      }

      wtask.push(tdw);
      var tatw = {
        icon: globalIconAccount,
        type: globalKeyValue,
        title: 'Assigned to',
        content: taskUser
      };
      wtask.push(tatw);

      if (t < tasks.length - 1) {
        wtask.push(globalWidgetSeparator);
      }
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

      switch (opptStat) {
        case 'active':
          opw.buttonIcon = globalIconDealOpen;
          break;

        case 'won':
          opw.buttonIcon = globalIconDealWon;
          break;

        case 'lost':
          opw.buttonIcon = globalIconDealLost;
          break;
      }

      opw.buttonText = opptStat;
      opw.buttonLink = 'https://app.close.com/opportunities/';
      woppt.push(opw);

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
              content: new Date(opptWon).toLocaleDateString()
            };
            woppt.push(ecdw);
          }

          break;

        default:
          var wlw = {
            icon: 'INVITE',
            type: globalKeyValue,
            title: 'Date ' + opptStat
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
          content: opptCont
        };
        woppt.push(cnw);
      }

      if (op !== opportunities.length - 1) {
        woppt.push(globalWidgetSeparator);
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

      if (a > 0 && type !== 'Created') {
        wact.push(globalWidgetSeparator);
      }

      switch (type) {
        case 'TaskCompleted':
          var titleTC = activity.task_text;
          var userTC = activity.task_assigned_to_name;
          var dateTC = new Date(activity.date_updated.split('.')[0]);
          var atcw = {
            icon: globalIconTaskDone,
            type: globalKeyValue,
            title: 'Task completed',
            content: titleTC
          };
          var utcw = {
            icon: globalIconAccount,
            type: globalKeyValue,
            title: 'Assigned user',
            content: userTC
          };
          var oscuw = {
            icon: 'INVITE',
            type: globalKeyValue,
            content: dateTC.toLocaleDateString() + ' ' + dateTC.toLocaleTimeString()
          };
          wact.push(atcw, utcw, oscuw);
          break;

        case 'OpportunityStatusChange':
          var oldOpptStatus = activity.old_status_label;
          var newOpptStatus = activity.new_status_label;
          var dateOpptChanged = new Date(activity.date_updated.split('.')[0]);
          var oscw = {
            icon: globalIconSwitch,
            type: globalKeyValue,
            title: 'Opportunity status change',
            content: oldOpptStatus + ' &rarr; ' + newOpptStatus
          };
          var oscuw = {
            icon: 'INVITE',
            type: globalKeyValue,
            content: dateOpptChanged.toLocaleDateString() + ' ' + dateOpptChanged.toLocaleTimeString()
          };
          wact.push(oscw, oscuw);
          break;

        case 'LeadStatusChange':
          var newStatus = activity.new_status_label;
          var oldStatus = activity.old_status_label;
          var dateChanged = new Date(activity.date_updated.split('.')[0]);
          var lscw = {
            icon: globalIconSwitch,
            type: globalKeyValue,
            title: 'Lead status change',
            content: oldStatus + ' &rarr; ' + newStatus
          };
          var lscuw = {
            icon: 'INVITE',
            type: globalKeyValue,
            content: dateChanged.toLocaleDateString() + ' ' + dateChanged.toLocaleTimeString()
          };
          wact.push(lscw, lscuw);
          break;

        case 'Note':
          var noteText = activity.note;
          var noteTitle = new Date(activity.date_updated.split('.')[0]);
          var antw = {
            icon: globalIconNotes,
            type: globalKeyValue,
            title: 'Noted on ' + noteTitle.toLocaleDateString(),
            content: noteText
          };
          wact.push(antw);
          break;

        case 'Email':
          var sentdate = activity.date_sent;
          var emailDirect = activity.direction;
          var idTempl = activity.template_id;
          var template = activity.template_name;
          var at = {
            icon: 'EMAIL',
            type: globalKeyValue,
            title: 'Subject',
            content: activity.subject,
            buttonText: emailDirect
          };
          wact.push(at);

          if (sentdate !== null) {
            var sent = new Date(sentdate.split('.')[0]);
            var as = {
              icon: 'CLOCK',
              type: globalKeyValue,
              content: sent.toLocaleDateString() + ' ' + sent.toLocaleTimeString()
            };
            wact.push(as);
          }

          if (template !== null) {
            var tu = {
              icon: globalIconBackground,
              type: globalKeyValue,
              title: 'Template used',
              content: template,
              buttonText: 'Edit',
              disabled: false,
              buttonLink: 'https://app.close.com/organization/' + organization + '/email_templates/' + idTempl
            };
            wact.push(tu);
          }

          break;

        case 'Call':
          var callStatus = activity.status;
          var callNote = activity.note;
          var callDirect = activity.direction;
          var callDate = activity.date_created;
          var duration = activity.duration / 60 / 60;
          var callPhone = activity.phone;
          var hs = endsOnOne(duration);
          var cf = {
            type: globalKeyValue,
            title: 'Call info',
            buttonText: callDirect
          };

          switch (callStatus) {
            case 'completed':
              cf.icon = globalIconCallEnded;
              break;

            default:
              cf.icon = 'PHONE';
          }

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
              content: callNote
            };
            wact.push(cw);
          }

          callDate = new Date(callDate.split('.')[0]);
          var ccd = {
            icon: 'INVITE',
            type: globalKeyValue,
            content: callDate.toLocaleDateString() + ' ' + callDate.toLocaleTimeString()
          };
          wact.push(ccd);

          if (duration > 0) {
            var cd = {
              icon: 'CLOCK',
              type: globalKeyValue,
              title: 'Duration'
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
    });
    return wact;
  };
  /**
   * Utility method for fetching lead statuses;
   * @param {Object} headers request headers;
   * @param {Integer=} start start for pagination;
   * @param {String=} id status id filter;
   * @return {Array<Object>} lead statuses;
   */


  this.fetchLeadStatuses_ =
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(headers, start, id) {
      var lsts, url, response, content, statuses, hasMore;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            start = start || 0;
            lsts = [];
            url = encodeURI(this.url + '/status/lead' + (id ? '/' + id + '/' : ''));
            _context4.next = 5;
            return performFetch(url, 'get', headers);

          case 5:
            response = _context4.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context4.next = 17;
              break;
            }

            content = JSON.parse(response.content);
            statuses = content.data;
            lsts = lsts.concat(statuses); //check pagination and fetch;

            hasMore = content.has_more;

            if (!hasMore) {
              _context4.next = 17;
              break;
            }

            _context4.t0 = lsts;
            _context4.next = 15;
            return this.fetchFields_(headers, start + 100, id);

          case 15:
            _context4.t1 = _context4.sent;
            lsts = _context4.t0.concat.call(_context4.t0, _context4.t1);

          case 17:
            return _context4.abrupt("return", lsts);

          case 18:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this);
    }));

    return function (_x12, _x13, _x14) {
      return _ref4.apply(this, arguments);
    };
  }();
  /**
   * Utility method for fetching activities;
   * @param {Object} request headers;
   * @param {Integer=} start start for pagination;
   * @param {String=} lid lead id filter;
   * @param {String=} cid contact id filter;
   * @return {Array<Object>} activities;
   */


  this.fetchActivities_ =
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(headers, start, lid, cid) {
      var acts, query, url, response, content, activities, hasMore;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            start = start || 0;
            acts = [];
            query = [lid ? 'lead_id=' + lid : '', cid ? 'contact_id=' + cid : ''];
            url = encodeURI(this.url + '/activity?' + (query.length > 0 ? query.join('&') : ''));
            _context5.next = 6;
            return performFetch(url, 'get', headers);

          case 6:
            response = _context5.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context5.next = 18;
              break;
            }

            content = JSON.parse(response.content);
            activities = content.data;
            acts = acts.concat(activities); //check pagination and fetch;

            hasMore = content.has_more;

            if (!hasMore) {
              _context5.next = 18;
              break;
            }

            _context5.t0 = acts;
            _context5.next = 16;
            return this.fetchActivities_(headers, start + 100, lid, cid);

          case 16:
            _context5.t1 = _context5.sent;
            acts = _context5.t0.concat.call(_context5.t0, _context5.t1);

          case 18:
            return _context5.abrupt("return", acts);

          case 19:
          case "end":
            return _context5.stop();
        }
      }, _callee5, this);
    }));

    return function (_x15, _x16, _x17, _x18) {
      return _ref5.apply(this, arguments);
    };
  }();
  /**
   * Utility method for fetching custom fields;
   * @param {Object} headers request headers;
   * @param {Integer=} start start for pagination;
   * @param {String=} id if provided -> fetch single lead;
   * @return {Array<Object>} custom fields;
   */


  this.fetchFields_ =
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(headers, start, id) {
      var fds, url, response, content, fields, hasMore;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            start = start || 0;
            fds = [];
            url = this.url + '/custom_fields/lead' + (id ? '/' + id + '/' : '') + (start === 0 ? '?_skip=' + start : '');
            _context6.next = 5;
            return performFetch(url, 'get', headers);

          case 5:
            response = _context6.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context6.next = 17;
              break;
            }

            content = JSON.parse(response.content);
            fields = content.data;
            fds = fds.concat(fields); //check pagination and fetch;

            hasMore = content.has_more;

            if (!hasMore) {
              _context6.next = 17;
              break;
            }

            _context6.t0 = fds;
            _context6.next = 15;
            return this.fetchFields_(headers, start + 100, id);

          case 15:
            _context6.t1 = _context6.sent;
            fds = _context6.t0.concat.call(_context6.t0, _context6.t1);

          case 17:
            return _context6.abrupt("return", fds);

          case 18:
          case "end":
            return _context6.stop();
        }
      }, _callee6, this);
    }));

    return function (_x19, _x20, _x21) {
      return _ref6.apply(this, arguments);
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
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(msg, connector, data) {
      var message, queryL, url, headers, response, view, sections, contents, leads, users, usersURL, usersResp, leadStatuses, fields, l, lead, leadId, leadName, contacts, orgId, custom, leadStatus, leadDescr, leadURL, addresses, opportunities, tasks, leadCreated, leadEdited, sectionCont, sectionEmpl, sectionTask, sectionOppt, sectionAct, c, contact, contId, name, title, emails, phones, urls, socials, created, edited, hasQueryEmail, activities, sectionFields, authErr, returned;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            //modify message;
            message = trimMessage(msg, true, true);
            queryL = encodeURI('?query=email_address:' + message.email.toLowerCase());
            url = this.url + '/lead' + queryL; //construct headers;

            headers = {
              Authorization: 'Basic ' + Utilities.base64Encode(connector[globalApiTokenTokenFieldName] + ':')
            }; //fetch endpoint and return response;

            _context7.next = 6;
            return performFetch(url, 'get', headers);

          case 6:
            response = _context7.sent;
            //access view type;
            view = connector.view;

            if (!view) {
              view = 'contact';
            }

            sections = [];

            if (!(response.code >= 200 && response.code < 300)) {
              _context7.next = 88;
              break;
            }

            //access contacts and create sections for each contact;
            contents = JSON.parse(response.content);
            leads = contents.data; //initiate actions if has result;

            if (leads.length > 0) {
              connector.method = 'edit';
            } //access users;


            users = [];
            usersURL = this.url + '/user';
            _context7.next = 18;
            return performFetch(usersURL, 'get', headers);

          case 18:
            usersResp = _context7.sent;

            if (usersResp.code >= 200 && usersResp.code < 300) {
              users = JSON.parse(usersResp.content).data;
            } //end user success;
            //access lead statuses;


            _context7.next = 22;
            return this.fetchLeadStatuses_(headers);

          case 22:
            leadStatuses = _context7.sent;
            _context7.next = 25;
            return this.fetchFields_(headers);

          case 25:
            fields = _context7.sent;
            l = 0;

          case 27:
            if (!(l < leads.length)) {
              _context7.next = 86;
              break;
            }

            lead = leads[l]; //access lead properties;

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
              entity: leadId
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
              widgets: []
            };

            if (view === 'lead') {
              sectionEmpl.widgets = this.displayLead(sectionEmpl, orgId, leadId, leadName, leadDescr, leadStatuses, leadStatus, leadURL, addresses, leadCreated, leadEdited, view);
            } //if tasks enabled -> show;


            if (connector.tasks) {
              sectionTask.widgets = this.displayTasks(tasks, leadId);
            } //if opportunities enabled -> show;


            if (connector.opportunities) {
              sectionOppt.widgets = this.displayOpportunities(opportunities);
            }

            c = 0;

          case 51:
            if (!(c < contacts.length)) {
              _context7.next = 82;
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
              if (email.email === message.email) {
                return email;
              }
            }).length > 0;

            if (!(!hasQueryEmail && view === 'contact')) {
              _context7.next = 65;
              break;
            }

            return _context7.abrupt("continue", 79);

          case 65:
            if (view === 'contact') {
              sectionCont.entity = contId;
              sectionCont.widgets = this.displayContact(sectionCont, leadId, contId, name, title, emails, phones, connector.fields, created, edited, view);
              sectionEmpl.widgets = this.displayLead(sectionEmpl, orgId, leadId, leadName, leadDescr, leadStatuses, leadStatus, leadURL, addresses, leadCreated, leadEdited, view);
            } else {
              if (c !== 0) {
                sectionCont.widgets = sectionCont.widgets.concat([globalWidgetSeparator]);
              }

              sectionCont.widgets = sectionCont.widgets.concat(this.displayContact(sectionCont, leadId, contId, name, title, emails, phones, connector.fields, created, edited, view));
            } //if activities enabled -> show;


            if (!connector.activities) {
              _context7.next = 78;
              break;
            }

            activities = [];

            if (!(view === 'contact')) {
              _context7.next = 74;
              break;
            }

            _context7.next = 71;
            return this.fetchActivities_(headers, 0, leadId, contId);

          case 71:
            activities = _context7.sent;
            _context7.next = 77;
            break;

          case 74:
            _context7.next = 76;
            return this.fetchActivities_(headers, 0, leadId);

          case 76:
            activities = _context7.sent;

          case 77:
            sectionAct.widgets = sectionAct.widgets.concat(this.displayActivities(activities, leadId, contId));

          case 78:
            if (view === 'contact') {
              sections.push(sectionCont, sectionEmpl, sectionTask, sectionOppt, sectionAct);

              if (connector.fields) {
                sectionFields = {
                  header: 'Custom fields',
                  isCollapsible: true,
                  widgets: []
                };
                sectionFields.widgets = this.displayFields(fields, custom, leadId, users);
                sections.push(sectionFields);
              }
            }

          case 79:
            c++;
            _context7.next = 51;
            break;

          case 82:
            //end contacts loop;
            if (view === 'lead') {
              sectionEmpl.header = 'Lead';
              sectionCont.header = 'Contacts';
              sections.push(sectionEmpl, sectionTask, sectionOppt, sectionCont, sectionAct);

              if (connector.fields) {
                sectionFields = {
                  header: 'Custom fields',
                  isCollapsible: true,
                  widgets: []
                };
                sectionFields.widgets = this.displayFields(fields, custom, leadId, users);
                sections.push(sectionFields);
              }
            }

          case 83:
            l++;
            _context7.next = 27;
            break;

          case 86:
            _context7.next = 95;
            break;

          case 88:
            if (!(response.code === 401)) {
              _context7.next = 94;
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
            return _context7.abrupt("return", {
              code: 200,
              headers: {},
              content: JSON.stringify(authErr),
              hasMatch: {
                value: true,
                text: 'Reauth'
              }
            });

          case 94:
            return _context7.abrupt("return", response);

          case 95:
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

            return _context7.abrupt("return", returned);

          case 98:
          case "end":
            return _context7.stop();
        }
      }, _callee7, this);
    }));

    return function (_x22, _x23, _x24) {
      return _ref7.apply(this, arguments);
    };
  }();
}

Close.prototype = Object.create(Connector.prototype);