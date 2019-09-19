function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function LessAnnoyingCRM() {
  Connector.call(this);
  this.icon = globalLACRMiconUrl;
  this.typeName = 'LessAnnoyingCRM';
  this.short = globalLACRMshort;
  this.url = 'https://api.lessannoyingcrm.com';
  this.config = [{
    widgets: [{
      type: globalKeyValue,
      title: 'Action',
      content: 'You can choose between different actions for the Connector to perform (actions can be switched anytime in settings):'
    }, {
      name: 'action',
      type: globalEnumRadio,
      content: [{
        text: 'Pipeline reporting',
        value: 'pipeline',
        selected: false
      }, {
        text: 'Searching contacts',
        value: 'search',
        selected: true
      }]
    }, {
      type: globalKeyValue,
      title: 'Pipeline list',
      content: 'If you chose pipeline reporting, please, set at least one PipelineId (multiple ids should be separated by line breaks) obtained from <a href="https://www.lessannoyingcrm.com/app/Settings/Api">CRM settings</a>'
    }, {
      name: 'pipelineIds',
      type: globalTextInput,
      title: 'Pipeline Id',
      content: '',
      hint: 'e.g. 3587196306',
      multiline: true
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
        content: 'This Connector uses API token-based authorization - please, fill the form below with your UserCode and API token obtained from <a href="https://www.lessannoyingcrm.com/app/Settings/Api">CRM settings</a>'
      }, {
        name: globalApiTokenUserFieldName,
        type: globalTextInput,
        title: 'User code',
        content: '',
        hint: 'e.g. ABCDE'
      }, {
        name: globalApiTokenTokenFieldName,
        type: globalTextInput,
        title: 'API token',
        content: '',
        hint: 'e.g. CWX3HYV1GT6YQFY9YRMQ3G0VD6Q'
      }]
    }
  };
  /**
   * General method for adding info;
   * @param {Object} connector Connector configuration;
   * @param {Object} msg object with current message info;
   * @return {Object} adder config;
   */

  this.addConfig = function (connector, msg) {
    var trimmed = trimMessage(msg, true, true);
    var usercode = trimWhitespace(connector.usercode, true);
    var apitoken = trimWhitespace(connector.apitoken, true);
    var auth = {
      uc: usercode,
      api: apitoken
    };
    var config = [{
      header: 'Main info',
      widgets: [{
        type: globalTextInput,
        title: 'Salutation',
        content: '',
        hint: 'e.g. Mr., Mrs.',
        name: 'Salutation&' + 0
      }, {
        type: globalTextInput,
        title: 'First',
        content: trimmed.first,
        hint: 'First name',
        name: 'FirstName&' + 0
      }, {
        type: globalTextInput,
        title: 'Middle',
        content: '',
        hint: 'Middle name',
        name: 'MiddleName&' + 0
      }, {
        type: globalTextInput,
        title: 'Last',
        content: trimmed.last,
        hint: 'Last name',
        name: 'LastName&' + 0
      }, {
        type: globalTextInput,
        title: 'Suffix',
        content: '',
        hint: 'e.g. Jn.,Sn.',
        name: 'Suffix&' + 0
      }, {
        type: globalTextInput,
        title: 'Title',
        content: '',
        hint: 'Job title',
        name: 'Title&' + 0
      }, {
        type: globalTextInput,
        title: 'Assigned To',
        content: '',
        hint: 'User Id',
        name: 'AssignedTo&' + 0
      }, {
        type: globalKeyValue,
        title: 'How to get user Id',
        content: 'A list of user Ids for your account can be found in <a href="https://www.lessannoyingcrm.com/app/Settings/Api">CRM settings</a>'
      }]
    }, {
      header: 'Email',
      isCollapsible: true,
      widgets: [{
        type: globalTextInput,
        title: 'Text',
        content: trimmed.email,
        name: 'Email-' + 0 + '&Text&' + 0
      }, {
        type: globalEnumDropdown,
        title: 'Type',
        content: [{
          text: 'Work',
          value: 'Work',
          selected: false
        }, {
          text: 'Personal',
          value: 'Personal',
          selected: false
        }, {
          text: 'Other',
          value: 'Other',
          selected: false
        }],
        name: 'Email-' + 0 + '&Type&' + 0
      }]
    }, {
      header: 'Phone',
      isCollapsible: true,
      widgets: [{
        type: globalTextInput,
        title: 'Text',
        content: '',
        name: 'Phone-' + 0 + '&Text&' + 0
      }, {
        type: globalEnumDropdown,
        title: 'Type',
        content: [{
          text: 'Work',
          value: 'Work',
          selected: false
        }, {
          text: 'Mobile',
          value: 'Mobile',
          selected: false
        }, {
          text: 'Home',
          value: 'Home',
          selected: false
        }, {
          text: 'Fax',
          value: 'Fax',
          selected: false
        }, {
          text: 'Other',
          value: 'Other',
          selected: false
        }],
        name: 'Phone-' + 0 + '&Type&' + 0
      }]
    }, {
      header: 'Address',
      isCollapsible: true,
      widgets: [{
        type: globalTextInput,
        title: 'Street',
        content: '',
        name: 'Address-' + 0 + '&Street&' + 0
      }, {
        type: globalTextInput,
        title: 'City',
        content: '',
        name: 'Address-' + 0 + '&City&' + 0
      }, {
        type: globalTextInput,
        title: 'State',
        content: '',
        name: 'Address-' + 0 + '&State&' + 0
      }, {
        type: globalTextInput,
        title: 'Country',
        content: '',
        name: 'Address-' + 0 + '&Country&' + 0
      }, {
        type: globalTextInput,
        title: 'Zip',
        content: '',
        name: 'Address-' + 0 + '&Zip&' + 0
      }, {
        type: globalEnumDropdown,
        title: 'Type',
        content: [{
          text: 'Work',
          value: 'Work',
          selected: false
        }, {
          text: 'Billing',
          value: 'Billing',
          selected: false
        }, {
          text: 'Shipping',
          value: 'Shipping',
          selected: false
        }, {
          text: 'Home',
          value: 'Home',
          selected: false
        }, {
          text: 'Other',
          value: 'Other',
          selected: false
        }],
        name: 'Address-' + 0 + '&Type&' + 0
      }]
    }, {
      header: 'Background',
      isCollapsible: true,
      widgets: [{
        type: globalTextInput,
        title: 'Birthday',
        content: '',
        hint: '1970-01-01 or 01/01/1970',
        name: 'Birthday&' + 0
      }, {
        type: globalTextInput,
        title: 'Background',
        content: '',
        hint: 'Biorgraphy',
        name: 'BackgroundInfo&' + 0
      }]
    }];
    return {
      config: JSON.stringify(config),
      prompt: 'contact'
    };
  };

  this.remove =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(msg, connector, data) {
      var usercode, apitoken, endpoint, funcName, widgets, contId, params, query, response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            //access API parameters and connector type;
            usercode = connector.usercode;
            apitoken = connector.apitoken;
            endpoint = connector.url + '?';
            funcName = 'DeleteContact'; //access Id property and set Id to params;

            widgets = data[0].widgets;
            contId = widgets[widgets.length - 1].content;
            params = {
              ContactId: contId
            };
            query = ['UserCode=' + usercode, 'APIToken=' + apitoken, 'Function=' + funcName, 'Parameters=' + encodeURIComponent(JSON.stringify(params))].join('&');
            _context.next = 10;
            return performFetch(endpoint + query, 'get');

          case 10:
            response = _context.sent;
            return _context.abrupt("return", this.run(msg, connector));

          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  this.update =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(msg, connector, forms, data, method) {
      var usercode, apitoken, endpoint, actionType, funcName, eventAction, updates, update, key, params, prop, idx, sub, id, value, subprop, k, otherParams, otherProp, otherIdx, otherSub, otherId, otherValue, updIdx, isNew, i, query, response;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            //access API parameters and connector type;
            usercode = connector.usercode;
            apitoken = connector.apitoken;
            endpoint = connector.url + '?';
            actionType = connector.action; //set add or edit action;

            if (method === 'add') {
              funcName = 'CreateContact';
              eventAction = 'Add'; //analytics;
            } else if (method === 'edit') {
              funcName = 'EditContact';
              eventAction = 'Edit'; //analytics;
            }

            updates = [];

            for (key in forms) {
              //access property params;
              params = key.split('&');
              prop = params[0].split('-')[0]; //Phone;

              idx = params[0].split('-')[1]; //Index;

              sub = params.filter(function (p, i, a) {
                if (i > 0 && i < a.length - 1) {
                  return p;
                }
              })[0]; //Text;

              id = params[params.length - 1]; //contact id;

              if (!update) {
                update = {
                  ContactId: id
                };
              }

              value = forms[key];

              if (value.length === 1) {
                value = value[0];
              }

              if (!idx) {
                //process simple value;
                if (!update[prop]) {
                  //initiate first subproperty;
                  if (!sub) {
                    //process simple value with no subproperties;
                    update[prop] = value;
                  } else {
                    //process simple value with subprops;
                    subprop = {};
                    subprop[sub] = value;
                    update[prop] = subprop;
                  }
                } else {
                  //add subpropery to property;
                  update[prop][sub] = value;
                }
              } else {
                //process value with multiple properties;
                if (!sub) {//process indexed values without subprops;
                  //curently not needed for API, reference value;
                } else {
                  //process indexed values with subprops;
                  for (k in forms) {
                    //check every value;
                    //access other parameters;
                    otherParams = k.split('&');
                    otherProp = otherParams[0].split('-')[0]; //Phone;

                    otherIdx = otherParams[0].split('-')[1]; //Index;

                    otherSub = otherParams.filter(function (p, i, a) {
                      if (i > 0 && i < a.length - 1) {
                        return p;
                      }
                    })[0]; //Text;

                    otherId = otherParams[otherParams.length - 1]; //contact id;         
                    //access other value;

                    otherValue = forms[k];

                    if (otherValue.length === 1) {
                      otherValue = otherValue[0];
                    }

                    if (id === otherId && prop === otherProp) {
                      //find equal by property and id;
                      if (!update[prop] && prop !== 'CustomFields') {
                        update[prop] = [];
                      } else if (!update[prop]) {
                        update[prop] = {};
                      }

                      if (prop !== 'CustomFields') {
                        //process fields that are send to API as Array;
                        if (!sub && !otherSub) {
                          //process indexed properties without subproperties;
                          update[prop][otherIdx] = value;
                        } else {
                          //process indexed properties with subproperties;
                          if (!update[prop][otherIdx]) {
                            update[prop][otherIdx] = {};
                          }

                          update[prop][otherIdx][otherSub] = otherValue;
                        }
                      } else {
                        update[prop][otherSub] = otherValue;
                      }
                    } //end equality check;

                  } //end forms loop;

                } //end indexed values with subs;

              } //end multi-prop values;
              //check if updates have update;


              isNew = updates.every(function (upd, i) {
                if (upd.ContactId !== id) {
                  return upd;
                } else {
                  updIdx = i;
                }
              });

              if (!isNew) {
                mergeObjects(updates[updIdx], update);
              } else {
                updates.push(update);
              }
            } //send update if there is anything to update;


            if (!(updates.length > 0)) {
              _context2.next = 20;
              break;
            }

            i = 0;

          case 9:
            if (!(i < updates.length)) {
              _context2.next = 19;
              break;
            }

            update = updates[i];

            if (method === 'add') {
              delete update.ContactId;
            }

            query = ['UserCode=' + usercode, 'APIToken=' + apitoken, 'Function=' + funcName, 'Parameters=' + encodeURIComponent(JSON.stringify(update))].join('&');
            _context2.next = 15;
            return performFetch(endpoint + query, 'post', {});

          case 15:
            response = _context2.sent;

          case 16:
            i++;
            _context2.next = 9;
            break;

          case 19:
            ;

          case 20:
            return _context2.abrupt("return", this.run(msg, connector, data));

          case 21:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));

    return function (_x4, _x5, _x6, _x7, _x8) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.run =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(msg, connector, data) {
      var usercode, apitoken, endpoint, actionType, funcName, method, headers, query, params, result, code, success, sections, trimmed, content, pipelineIds, pipeError, errDetails, index, pId, fullquery, pipelineResponse, pipelineCode, pipelineHeaders, pipelineContent, pipelineSuccess, settingsQuery, settingsResponse, name, isActive, pipelineSettings, pipeline, pipelineSection, pipelineWidgets, c, contact, fullName, isCompany, status, title, company, salutation, first, middle, last, suffix, emails, phones, lastNote, custom, background, nameWidget, compContent, companyWidget, contactBkg, contactNote, prop, value, contactCustom, separator, info, k, entry, contSection, contWidgets, addresses, websites, contactId, companyId, companyName, companyBckg, createdCont, editedCont, birthday, contactName, contactTitle, customIdx, field, customWidget, created, createdDate, createdTime, contactCreated, edited, editedDate, editedTime, contactEdited, num, hiddenId, getCompanyQuery, companyResponse, companyContent, cName, cEmpl, cIndustry, cEmails, cPhones, cWebsites, cAddresses, cCreated, cEdited, cSection, cWidgets, companyInd, cEmplContent, numEmployees, companyCreated, companyEdited, backgroundSection, backgroundWidgets, contactBckLabel, contactBirthday, contactBackground, companyBckLabel, companyBackground, returned;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            //access API parameters and connector type;
            usercode = connector.usercode;
            apitoken = connector.apitoken;
            endpoint = connector.url + '?';
            actionType = connector.action; //initiate function name according to action type;

            funcName = '';

            if (actionType === 'search') {
              funcName += 'SearchContacts';
            } else if (actionType === 'pipeline') {
              funcName += 'GetPipelineReport';
            } //set method for url fetch ('get' or 'post' for now);


            method = 'get'; //set headers for url fetch;

            headers = {}; //initiate query and parameters;

            query = ['UserCode=' + usercode, 'APIToken=' + apitoken, 'Function=' + funcName];
            sections = [];

            if (!(actionType !== 'pipeline')) {
              _context3.next = 29;
              break;
            }

            //unpack message object with to trimmed data;
            trimmed = trimMessage(msg, true, true); //initiate request parameters;

            params = {
              SearchTerms: trimmed.email,
              Sort: 'Relevance'
            }; //set query with parameters and authorization provided;

            query.push('Parameters=' + encodeURI(JSON.stringify(params)));
            query = query.join('&'); //perform data fetch and return result;

            _context3.next = 17;
            return performFetch(endpoint + query, method, headers);

          case 17:
            result = _context3.sent;
            code = result.code;
            content = JSON.parse(result.content);
            success = content.Success; //on failure -> process errored response;

            if (success) {
              _context3.next = 27;
              break;
            }

            if (!(content.Error === 'Your account is not active')) {
              _context3.next = 26;
              break;
            }

            return _context3.abrupt("return", {
              code: code,
              headers: headers,
              content: [{
                header: 'Inactive account',
                widgets: [{
                  type: globalKeyValue,
                  content: 'Unfortunately, we couldn\'t access your account as it is inactive.\r\nPlease, check your subscription status info and update billing if necessary'
                }, {
                  type: globalTextButton,
                  action: globalActionLink,
                  title: 'Update billing info',
                  content: 'https://www.lessannoyingcrm.com/app/Settings/Billing'
                }]
              }],
              hasMatch: {
                value: true,
                text: 'Inactive'
              }
            });

          case 26:
            return _context3.abrupt("return", {
              code: code,
              headers: headers,
              content: content.Error
            });

          case 27:
            _context3.next = 78;
            break;

          case 29:
            //access id list, if not set -> return error message;
            pipelineIds = connector.pipelineIds;

            if (!pipelineIds) {
              _context3.next = 34;
              break;
            }

            pipelineIds = pipelineIds.split('\n');
            _context3.next = 36;
            break;

          case 34:
            pipeError = {
              descr: 'Pipeline Id list was not provided.\rPlease, set at least one Id or a comma-separated list of Ids. Pipelines info can be obtained from <a href="https://www.lessannoyingcrm.com/app/Settings/Api">CRM settings</a>'
            };
            return _context3.abrupt("return", {
              code: 0,
              headers: {},
              content: JSON.stringify(pipeError)
            });

          case 36:
            //initiate result;
            result = {};
            code = 200;
            result.headers = {};
            success = [];
            errDetails = '';
            index = 0;

          case 42:
            if (!(index < pipelineIds.length)) {
              _context3.next = 76;
              break;
            }

            pId = pipelineIds[index];
            params = {
              PipelineId: pId
            };
            query.push('Parameters=' + encodeURI(JSON.stringify(params)));
            fullquery = query.join('&'); //perform data fetch and process, then reset query;

            _context3.next = 49;
            return performFetch(endpoint + fullquery, method, headers);

          case 49:
            pipelineResponse = _context3.sent;
            pipelineCode = pipelineResponse.code;
            pipelineHeaders = pipelineResponse.headers;
            pipelineContent = JSON.parse(pipelineResponse.content);
            pipelineSuccess = pipelineContent.Success;
            query.pop(); //push success value and error data on fail, else -> process;

            success.push(pipelineSuccess);

            if (pipelineSuccess) {
              _context3.next = 60;
              break;
            }

            errDetails += index + 1 + '. ' + pipelineContent.Error + '\r';
            _context3.next = 73;
            break;

          case 60:
            //access pipeline settings;
            settingsQuery = 'UserCode=' + usercode + '&APIToken=' + apitoken + '&Function=GetPipelineSettings';
            _context3.next = 63;
            return performFetch(endpoint + settingsQuery, 'get', headers);

          case 63:
            settingsResponse = _context3.sent;
            name = '';
            isActive = true; //on success set pipeline parameters or use default;

            if (settingsResponse.code === 200) {
              pipelineSettings = JSON.parse(settingsResponse.content)[index];
              name = pipelineSettings.Name;
              isActive = pipelineSettings.IsActive; //isn't used for now;
            } else {
              name = 'Pipeline ' + (index + 1);
            } //access content and create section;


            pipeline = pipelineContent.Result;
            pipelineSection = {
              header: name,
              isCollapsible: false,
              widgets: []
            }; //if more than one section -> collapse;

            if (pipelineIds.length > 1) {
              pipelineSection.isCollapsible = true;
            }

            pipelineWidgets = pipelineSection.widgets;

            for (c = 0; c < pipeline.length; c++) {
              contact = pipeline[c]; //access contact properties;

              fullName = [];
              isCompany = +contact.IsCompany;
              status = contact.StatusName;
              title = contact.Title;
              company = contact.EmployerName;
              salutation = contact.Salutation;
              first = contact.FirstName;
              middle = contact.MiddleName;
              last = contact.LastName;
              suffix = contact.Suffix;
              emails = contact.Email;
              phones = contact.Phone;
              lastNote = contact.LastNote;
              custom = contact.ContactCustomFields;
              background = contact.BackgroundInfo; //create fullName;

              if (salutation && salutation !== null) {
                fullName.push(salutation);
              }

              if (first && first !== null) {
                fullName.push(first);
              }

              if (middle && middle !== null) {
                fullName.push(middle);
              }

              if (last && last !== null) {
                fullName.push(last);
              }

              if (suffix && suffix !== null) {
                fullName.push(suffix);
              }

              fullName = fullName.join(' '); //create contact name + status widget;

              nameWidget = {
                type: globalKeyValue,
                content: fullName,
                buttonText: status
              };

              if (isCompany > 0) {
                nameWidget.icon = 'https://cardinsoft.com/wp-content/uploads/2019/04/BUSINESS.png';
                nameWidget.title = 'Company';
                nameWidget.content = contact.CompanyName;
              } else {
                nameWidget.icon = 'PERSON';
                nameWidget.title = 'Contact';
                nameWidget.content = fullName;
              }

              pipelineWidgets.push(nameWidget); //if company -> add company widget;

              if (company) {
                if (!title) {
                  compContent = company;
                } else {
                  compContent = title + ' at ' + company;
                }

                companyWidget = {
                  icon: 'https://cardinsoft.com/wp-content/uploads/2019/04/BUSINESS.png',
                  type: globalKeyValue,
                  title: 'Title',
                  content: compContent
                };
                pipelineWidgets.push(companyWidget);
              } //create email widgets;


              emails.forEach(function (email, index) {
                var contactEmail = {
                  icon: 'EMAIL',
                  type: globalKeyValue,
                  title: email.Type + ' email',
                  content: '<a href="mailto:' + email.Text + '">' + email.Text + '</a>'
                };
                pipelineWidgets.push(contactEmail);
              }); //create phone widgets;

              phones.forEach(function (phone, index) {
                var contactPhone = {
                  icon: 'PHONE',
                  type: globalKeyValue,
                  title: phone.Type + ' phone',
                  content: '<a href="tel:' + phone.Text + '">' + phone.Text + '</a>'
                };
                pipelineWidgets.push(contactPhone);
              }); //create background widget;

              if (background) {
                contactBkg = {
                  icon: globalIconBackground,
                  type: globalKeyValue,
                  //title   : 'Background',
                  content: background
                };
                pipelineWidgets.push(contactBkg);
              } //create last notes widget;


              if (lastNote) {
                contactNote = {
                  icon: 'DESCRIPTION',
                  type: globalKeyValue,
                  content: lastNote
                };
                pipelineWidgets.push(contactNote);
              } //create custom properties widgets;


              if (Object.keys(custom).length > 0) {
                for (prop in custom) {
                  value = custom[prop];

                  if (value !== '') {
                    contactCustom = {
                      icon: 'https://cardinsoft.com/wp-content/uploads/2019/06/CUSTOM.png',
                      title: prop,
                      type: globalKeyValue,
                      content: value
                    };
                    pipelineWidgets.push(contactCustom);
                  }
                }
              } //create separator widget;


              separator = {
                type: globalKeyValue,
                content: '\r'
              };
              pipelineWidgets.push(separator);
            }

            sections.push(pipelineSection);

          case 73:
            index++;
            _context3.next = 42;
            break;

          case 76:
            if (success.some(function (elem) {
              return elem;
            })) {
              _context3.next = 78;
              break;
            }

            return _context3.abrupt("return", {
              code: 0,
              headers: {},
              content: {
                descr: 'Every call to Less Annoying CRM resulted in error, please, see details below for more information',
                additional: errDetails
              }
            });

          case 78:
            if (!(actionType === 'search')) {
              _context3.next = 151;
              break;
            }

            info = content.Result; //create result config;

            if (!(info.length > 0)) {
              _context3.next = 151;
              break;
            }

            //as there is entity, set action to edit;
            connector.method = 'edit';
            k = 0;

          case 83:
            if (!(k < info.length)) {
              _context3.next = 151;
              break;
            }

            entry = info[k];
            isCompany = +entry.IsCompany;

            if (!(isCompany === 0)) {
              _context3.next = 148;
              break;
            }

            //create contact section and access widgets;
            contSection = {
              header: 'Contact info',
              isCollapsible: true,
              widgets: []
            };
            contWidgets = contSection.widgets; //access contact properties;

            fullName = [];
            salutation = entry.Salutation;
            first = entry.FirstName;
            middle = entry.MiddleName;
            last = entry.LastName;
            suffix = entry.Suffix;
            emails = entry.Email;
            phones = entry.Phone;
            addresses = entry.Address;
            websites = entry.Website;
            background = entry.BackgroundInfo;
            contactId = entry.ContactId;
            companyId = entry.CompanyId;
            companyName = entry.CompanyName;
            //will be needed in company section;
            createdCont = entry.CreationDate;
            editedCont = entry.EditedDate;
            birthday = entry.Birthday;
            title = entry.Title;
            custom = entry.CustomFields; //create fullname widget;

            if (salutation && salutation !== null) {
              fullName.push(salutation);
            }

            if (first && first !== null) {
              fullName.push(first);
            }

            if (middle && middle !== null) {
              fullName.push(middle);
            }

            if (last && last !== null) {
              fullName.push(last);
            }

            if (suffix && suffix !== null) {
              fullName.push(suffix);
            }

            fullName = fullName.join(' '); //create contact name widget;

            contactName = {
              icon: 'PERSON',
              type: globalKeyValue,
              title: 'Full Name',
              state: 'editable',
              editMap: [{
                title: 'Salutation',
                content: salutation,
                name: 'Salutation&' + contactId
              }, {
                title: 'First name',
                content: first,
                name: 'FirstName&' + contactId
              }, {
                title: 'Middle name',
                content: middle,
                name: 'MiddleName&' + contactId
              }, {
                title: 'Last name',
                content: last,
                name: 'LastName&' + contactId
              }, {
                title: 'Suffix',
                content: suffix,
                name: 'Suffix&' + contactId
              }],
              content: fullName
            };
            contWidgets.push(contactName); //create title widget;

            if (companyName && companyName !== null && title) {
              compContent = title + ' at ' + companyName;
              contactTitle = {
                icon: 'https://cardinsoft.com/wp-content/uploads/2019/04/WORK_BLACK.png',
                type: globalKeyValue,
                state: 'editable',
                editMap: [{
                  title: 'Title',
                  content: title,
                  name: 'Title&' + contactId
                }],
                title: 'Title',
                content: compContent
              };
              contWidgets.push(contactTitle);
            } //create email widgets;


            emails.forEach(function (email, index) {
              var contactEmail = {
                icon: 'EMAIL',
                type: globalKeyValue,
                state: 'editable',
                editMap: [{
                  title: 'Text',
                  content: email.Text,
                  name: 'Email-' + index + '&Text&' + contactId
                }, {
                  title: 'Type',
                  content: [{
                    text: 'Work',
                    value: 'Work',
                    selected: false
                  }, {
                    text: 'Personal',
                    value: 'Personal',
                    selected: false
                  }, {
                    text: 'Other',
                    value: 'Other',
                    selected: false
                  }],
                  name: 'Email-' + index + '&Type&' + contactId,
                  type: globalEnumDropdown
                }],
                title: email.Type + ' email',
                content: '<a href="mailto:' + email.Text + '">' + email.Text + '</a>'
              };
              contactEmail.editMap[1].content.forEach(function (option) {
                if (option.value === email.Type) {
                  option.selected = true;
                }
              });
              contWidgets.push(contactEmail);
            }); //create phone widgets;

            phones.forEach(function (phone, index) {
              var contactPhone = {
                icon: 'PHONE',
                type: globalKeyValue,
                state: 'editable',
                editMap: [{
                  title: 'Text',
                  content: phone.Text,
                  name: 'Phone-' + index + '&Text&' + contactId
                }, {
                  title: 'Type',
                  content: [{
                    text: 'Work',
                    value: 'Work',
                    selected: false
                  }, {
                    text: 'Mobile',
                    value: 'Mobile',
                    selected: false
                  }, {
                    text: 'Home',
                    value: 'Home',
                    selected: false
                  }, {
                    text: 'Fax',
                    value: 'Fax',
                    selected: false
                  }, {
                    text: 'Other',
                    value: 'Other',
                    selected: false
                  }],
                  name: 'Phone-' + index + '&Type&' + contactId,
                  type: globalEnumDropdown
                }],
                title: phone.Type + ' phone',
                content: '<a href="tel:' + phone.Text + '">' + phone.Text + '</a>'
              };
              contactPhone.editMap[1].content.forEach(function (option) {
                if (option.value === phone.Type) {
                  option.selected = true;
                }
              });
              contWidgets.push(contactPhone);
            }); //create website widgets;

            websites.forEach(function (website, index) {
              var contactWebsite = {
                icon: 'https://cardinsoft.com/wp-content/uploads/2019/04/web.png',
                type: globalKeyValue,
                state: 'editable',
                name: 'Website-' + index + '&Text&' + contactId,
                title: 'Website ' + (index + 1),
                content: website.Text
              };
              contWidgets.push(contactWebsite);
            }); //create address widgets;

            addresses.forEach(function (address, index) {
              var fullAddress = [];
              var street = address.Street;
              var city = address.City;
              var state = address.State;
              var country = address.Country;
              var zip = address.Zip;

              if (street) {
                fullAddress.push(street);
              }

              if (city) {
                fullAddress.push(city);
              }

              if (state) {
                fullAddress.push(state);
              }

              if (country) {
                fullAddress.push(country);
              }

              if (zip) {
                fullAddress.push(zip);
              }

              fullAddress = fullAddress.join(', ');
              var contactAddress = {
                icon: 'MAP_PIN',
                type: globalKeyValue,
                state: 'editable',
                editMap: [{
                  title: 'Street',
                  content: street,
                  name: 'Address-' + index + '&Street&' + contactId
                }, {
                  title: 'City',
                  content: city,
                  name: 'Address-' + index + '&City&' + contactId
                }, {
                  title: 'State',
                  content: state,
                  name: 'Address-' + index + '&State&' + contactId
                }, {
                  title: 'Country',
                  content: country,
                  name: 'Address-' + index + '&Country&' + contactId
                }, {
                  title: 'Zip',
                  content: zip,
                  name: 'Address-' + index + '&Zip&' + contactId
                }, {
                  title: 'Type',
                  content: [{
                    text: 'Work',
                    value: 'Work',
                    selected: false
                  }, {
                    text: 'Billing',
                    value: 'Billing',
                    selected: false
                  }, {
                    text: 'Shipping',
                    value: 'Shipping',
                    selected: false
                  }, {
                    text: 'Home',
                    value: 'Home',
                    selected: false
                  }, {
                    text: 'Other',
                    value: 'Other',
                    selected: false
                  }],
                  name: 'Address-' + index + '&Type&' + contactId,
                  type: globalEnumDropdown
                }],
                title: address.Type + ' address',
                content: fullAddress
              };
              contactAddress.editMap[5].content.forEach(function (option) {
                if (option.value === address.Type) {
                  option.selected = true;
                }
              });
              contWidgets.push(contactAddress);
            }); //create edit-in-CRM widget;

            /*
            var contactEditIn = {
              type    : globalTextButton,
              action  : globalActionLink,
              title   : 'Edit in LACRM',
              content : 'https://www.lessannoyingcrm.com/app/View_Contact?ContactId='+contactId
            };
            contWidgets.push(contactEditIn);
            */
            //create custom fields widget;

            customIdx = 0;

            for (field in custom) {
              if (custom[field]) {
                customWidget = {
                  icon: 'https://cardinsoft.com/wp-content/uploads/2019/06/CUSTOM.png',
                  type: globalKeyValue,
                  state: 'editable',
                  name: 'CustomFields-' + customIdx + '&' + field + '&' + contactId,
                  title: field,
                  content: custom[field]
                };
                contWidgets.push(customWidget);
                customIdx++;
              }
            } //create separator, creation and edit widgets;


            separator = {
              type: globalKeyValue,
              content: '\r'
            };
            contWidgets.push(separator); //create widget for creation date;

            created = createdCont.split(' ');
            createdDate = new Date(created[0]);
            createdTime = created[1].split(':');
            createdDate.setHours(createdTime[0]);
            createdDate.setMinutes(createdTime[1]);
            createdDate.setSeconds(createdTime[2]);
            contactCreated = {
              icon: 'CLOCK',
              type: globalKeyValue,
              title: 'Created',
              content: createdDate.toLocaleDateString() + '\r' + createdDate.toLocaleTimeString()
            };
            contWidgets.push(contactCreated); //create widget for edit date;

            if (editedCont) {
              edited = editedCont.split(' ');
              editedDate = new Date(edited[0]);
              editedTime = edited[1].split(':');
              editedDate.setHours(editedTime[0]);
              editedDate.setMinutes(editedTime[1]);
              editedDate.setSeconds(editedTime[2]);
              contactEdited = {
                icon: 'CLOCK',
                type: globalKeyValue,
                title: 'Edited',
                content: editedDate.toLocaleDateString() + '\r' + editedDate.toLocaleTimeString()
              };
              contWidgets.push(contactEdited);
            } //set uncollapsible widgets;


            num = contWidgets.length;

            if (contactEdited) {
              num -= 3;
            } else {
              num -= 2;
            }

            if (num <= 0) {
              num = 1;
            }

            contSection.numUncollapsible = num; //push hidden Id widget;

            hiddenId = {
              state: 'hidden',
              content: contactId
            };
            contWidgets.push(hiddenId);
            sections.push(contSection);

            if (!companyId) {
              _context3.next = 147;
              break;
            }

            //perform company query by company Id;
            getCompanyQuery = ['UserCode=' + usercode, 'APIToken=' + apitoken, 'Function=GetContact', 'Parameters=' + encodeURI(JSON.stringify({
              ContactId: companyId
            }))].join('&');
            _context3.next = 145;
            return performFetch(endpoint + getCompanyQuery, 'get', {});

          case 145:
            companyResponse = _context3.sent;

            //on successful fetch -> create company section;
            if (companyResponse.code >= 200 && companyResponse.code < 300) {
              companyContent = JSON.parse(companyResponse.content);

              if (companyContent.Success) {
                //access company property;
                company = companyContent.Contact;
                cName = company.CompanyName;
                cEmpl = company.NumEmployees;
                cIndustry = company.Industry;
                cEmails = company.Email;
                cPhones = company.Phone;
                cWebsites = company.Website;
                cAddresses = company.Address;
                cCreated = company.CreationDate;
                cEdited = company.EditedDate;
                companyBckg = company.BackgroundInfo; //create company section and access widgets;

                cSection = {
                  header: 'Company info',
                  isCollapsible: true,
                  widgets: []
                };
                cWidgets = cSection.widgets; //create company name widget;

                companyName = {
                  icon: 'https://cardinsoft.com/wp-content/uploads/2019/04/BUSINESS.png',
                  type: globalKeyValue,
                  state: 'editable',
                  name: 'CompanyName&' + companyId,
                  title: 'Name',
                  content: cName
                };
                cWidgets.push(companyName);

                if (cIndustry) {
                  //create company industry widget;
                  companyInd = {
                    icon: 'https://cardinsoft.com/wp-content/uploads/2019/04/CITY.png',
                    type: globalKeyValue,
                    state: 'editable',
                    name: 'Industry&' + companyId,
                    title: 'Industry',
                    content: cIndustry
                  };
                  cWidgets.push(companyInd);
                } //create email widgets;


                if (cEmails) {
                  cEmails.forEach(function (email, index) {
                    var companyEmail = {
                      icon: 'EMAIL',
                      type: globalKeyValue,
                      state: 'editable',
                      editMap: [{
                        title: 'Text',
                        content: email.Text,
                        name: 'Email-' + index + '&Text&' + companyId
                      }, {
                        title: 'Type',
                        content: [{
                          text: 'Work',
                          value: 'Work',
                          selected: false
                        }, {
                          text: 'Personal',
                          value: 'Personal',
                          selected: false
                        }, {
                          text: 'Other',
                          value: 'Other',
                          selected: false
                        }],
                        name: 'Email-' + index + '&Type&' + companyId,
                        type: globalEnumDropdown
                      }],
                      title: email.Type + ' email',
                      content: '<a href="mailto:' + email.Text + '">' + email.Text + '</a>'
                    };
                    companyEmail.editMap[1].content.forEach(function (option) {
                      if (option.value === email.Type) {
                        option.selected = true;
                      }
                    });
                    cWidgets.push(companyEmail);
                  });
                } //create phone widgets;


                if (cPhones) {
                  cPhones.forEach(function (phone, index) {
                    var companyPhone = {
                      icon: 'PHONE',
                      type: globalKeyValue,
                      state: 'editable',
                      editMap: [{
                        title: 'Text',
                        content: phone.Text,
                        name: 'Phone-' + index + '&Text&' + companyId
                      }, {
                        title: 'Type',
                        content: [{
                          text: 'Work',
                          value: 'Work',
                          selected: false
                        }, {
                          text: 'Mobile',
                          value: 'Mobile',
                          selected: false
                        }, {
                          text: 'Home',
                          value: 'Home',
                          selected: false
                        }, {
                          text: 'Fax',
                          value: 'Fax',
                          selected: false
                        }, {
                          text: 'Other',
                          value: 'Other',
                          selected: false
                        }],
                        name: 'Phone-' + index + '&Type&' + companyId,
                        type: globalEnumDropdown
                      }],
                      title: phone.Type + ' phone',
                      content: '<a href="tel:' + phone.Text + '">' + phone.Text + '</a>'
                    };
                    companyPhone.editMap[1].content.forEach(function (option) {
                      if (option.value === phone.Type) {
                        option.selected = true;
                      }
                    });
                    cWidgets.push(companyPhone);
                  });
                } //create websites widgets;


                if (cWebsites && cWebsites.length > 0) {
                  cWebsites.forEach(function (website, index) {
                    var companyWebsite = {
                      icon: 'https://cardinsoft.com/wp-content/uploads/2019/04/web.png',
                      type: globalKeyValue,
                      state: 'editable',
                      name: 'Website-' + index + '&Text&' + companyId,
                      title: 'Website ' + (index + 1),
                      content: website.Text
                    };
                    cWidgets.push(companyWebsite);
                  });
                } //create address widgets;


                if (cAddresses) {
                  cAddresses.forEach(function (address, index) {
                    var fullAddress = [];
                    var street = address.Street;
                    var city = address.City;
                    var state = address.State;
                    var country = address.Country;
                    var zip = address.Zip;

                    if (street) {
                      fullAddress.push(street);
                    }

                    if (city) {
                      fullAddress.push(city);
                    }

                    if (state) {
                      fullAddress.push(state);
                    }

                    if (country) {
                      fullAddress.push(country);
                    }

                    if (zip) {
                      fullAddress.push(zip);
                    }

                    fullAddress = fullAddress.join(', ');
                    var companyAddress = {
                      icon: 'MAP_PIN',
                      type: globalKeyValue,
                      state: 'editable',
                      editMap: [{
                        title: 'Street',
                        content: street,
                        name: 'Address-' + index + '&Street&' + companyId
                      }, {
                        title: 'City',
                        content: city,
                        name: 'Address-' + index + '&City&' + companyId
                      }, {
                        title: 'State',
                        content: state,
                        name: 'Address-' + index + '&State&' + companyId
                      }, {
                        title: 'Country',
                        content: country,
                        name: 'Address-' + index + '&Country&' + companyId
                      }, {
                        title: 'Zip',
                        content: zip,
                        name: 'Address-' + index + '&Zip&' + companyId
                      }, {
                        title: 'Type',
                        content: [{
                          text: 'Work',
                          value: 'Work',
                          selected: false
                        }, {
                          text: 'Billing',
                          value: 'Billing',
                          selected: false
                        }, {
                          text: 'Shipping',
                          value: 'Shipping',
                          selected: false
                        }, {
                          text: 'Home',
                          value: 'Home',
                          selected: false
                        }, {
                          text: 'Other',
                          value: 'Other',
                          selected: false
                        }],
                        name: 'Address-' + index + '&Type&' + companyId,
                        type: globalEnumDropdown
                      }],
                      title: address.Type + ' address',
                      content: fullAddress
                    };
                    companyAddress.editMap[5].content.forEach(function (option) {
                      if (option.value === address.Type) {
                        option.selected = true;
                      }
                    });
                    cWidgets.push(companyAddress);
                  });
                } //create number of employees widgets;


                if (cEmpl) {
                  cEmplContent = cEmpl;

                  if (endsOnOne(cEmpl)) {
                    cEmplContent += ' employee';
                  } else {
                    cEmplContent += ' employees';
                  }

                  numEmployees = {
                    icon: 'EVENT_PERFORMER',
                    type: globalKeyValue,
                    state: 'editable',
                    editMap: [{
                      title: 'Number of employees',
                      content: cEmpl,
                      name: 'NumEmployees&' + companyId
                    }],
                    content: cEmplContent
                  };
                  cWidgets.push(numEmployees);
                } //create separator, creation and edit widgets;


                separator = {
                  type: globalKeyValue,
                  content: '\r'
                };
                cWidgets.push(separator); //create widget for creation date;

                created = cCreated.split(' ');
                createdDate = new Date(created[0]);
                createdTime = created[1].split(':');
                createdDate.setHours(createdTime[0]);
                createdDate.setMinutes(createdTime[1]);
                createdDate.setSeconds(createdTime[2]);
                companyCreated = {
                  icon: 'CLOCK',
                  type: globalKeyValue,
                  title: 'Created',
                  content: createdDate.toLocaleDateString() + '\r' + createdDate.toLocaleTimeString()
                };
                cWidgets.push(companyCreated); //create widget for edit date;

                if (cEdited) {
                  edited = cEdited.split(' ');
                  editedDate = new Date(edited[0]);
                  editedTime = edited[1].split(':');
                  editedDate.setHours(editedTime[0]);
                  editedDate.setMinutes(editedTime[1]);
                  editedDate.setSeconds(editedTime[2]);
                  companyEdited = {
                    icon: 'CLOCK',
                    type: globalKeyValue,
                    title: 'Edited',
                    content: editedDate.toLocaleDateString() + '\r' + editedDate.toLocaleTimeString()
                  };
                  cWidgets.push(companyEdited);
                } //set uncollapsible widgets;


                num = cWidgets.length;

                if (cEdited) {
                  num -= 3;
                } else {
                  num -= 2;
                }

                if (num <= 0) {
                  num = 1;
                }

                cSection.numUncollapsible = num;
                sections.push(cSection);
              } //end company fetch success;

            } //end code 200;


          case 147:
            //end company id check;
            //if contact has background -> add;
            if (background) {
              backgroundSection = {
                header: 'Background',
                isCollapsible: true,
                widgets: []
              };
              backgroundWidgets = backgroundSection.widgets; //create contact background label widget;

              contactBckLabel = {
                type: globalKeyValue,
                title: 'Contact',
                content: ''
              };
              backgroundWidgets.push(contactBckLabel); //if birthday provided -> set widget;

              if (birthday) {
                contactBirthday = {
                  icon: 'https://cardinsoft.com/wp-content/uploads/2019/04/CAKE.png',
                  type: globalKeyValue,
                  state: 'editable',
                  name: 'Birthday&' + contactId,
                  title: 'Birthday',
                  content: birthday,
                  multiline: false
                };
                backgroundWidgets.push(contactBirthday);
              } //create background widget;


              contactBackground = {
                icon: globalIconBackground,
                type: globalKeyValue,
                state: 'editable',
                name: 'BackgroundInfo&' + contactId,
                content: background,
                multiline: true
              };
              backgroundWidgets.push(contactBackground);

              if (companyBckg) {
                backgroundWidgets.push(globalWidgetSeparator);
                companyBckLabel = {
                  type: globalKeyValue,
                  title: 'Company',
                  content: ''
                };
                backgroundWidgets.push(companyBckLabel);
                companyBackground = {
                  icon: globalIconBackground,
                  type: globalKeyValue,
                  state: 'editable',
                  name: 'BackgroundInfo&' + companyId,
                  content: companyBckg,
                  multiline: true
                };
                backgroundWidgets.push(companyBackground);
              }

              sections.push(backgroundSection);
            }

          case 148:
            k++;
            _context3.next = 83;
            break;

          case 151:
            //build return object;
            returned = {
              code: code,
              headers: result.headers,
              content: JSON.stringify(sections),
              hasMatch: {
                value: true,
                text: 'found'
              }
            };
            return _context3.abrupt("return", returned);

          case 153:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));

    return function (_x9, _x10, _x11) {
      return _ref3.apply(this, arguments);
    };
  }();
} //chain custom connector to base class;


LessAnnoyingCRM.prototype = Object.create(Connector.prototype);