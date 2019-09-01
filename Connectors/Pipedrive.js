function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Pipedrive class constructor function;
 */
function Pipedrive() {
  Connector.call(this);
  this.icon = globalPipedriveIconUrl;
  this.typeName = 'Pipedrive';
  this.url = 'pipedrive.com/v1';
  this.url2 = 'https://api-proxy.pipedrive.com/'; //disabled {remove suffix 2 to enable} until Gmail add-ons support for Pipedrive Marketplace;

  this.addInCRM = {
    base: 'pipedrive.com/persons/list#dialog/person/add'
  };
  this.short = globalPipedriveShort;
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
      name: 'deals',
      content: 'Show deals',
      switchValue: true,
      selected: true
    }, {
      type: globalKeyValue,
      name: 'activities',
      content: 'Show activities',
      switchValue: true,
      selected: true
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
        content: 'This Connector uses API token-based authorization (your API token can be obtained from <a href="https://app.pipedrive.com/settings/personal/api">Pipedrive settings</a>)'
      }, {
        name: globalApiTokenTokenFieldName,
        type: 'TextInput',
        title: 'API token',
        content: '',
        hint: 'e.g. 744707f029a966b5599780'
      }]
    }
  }, this.auth2 = {
    //disabled {remove suffix 2 and add any suffix to API token auth to enable} until Gmail add-ons support for Pipedrive Marketplace;
    type: globalOAuth2AuthType,
    urlAuth: 'https://oauth.pipedrive.com/oauth/authorize',
    urlToken: 'https://oauth.pipedrive.com/oauth/token',
    urlRevoke: 'https://oauth.pipedrive.com/oauth/revoke',
    id: '12cefab496cfcb98',
    secret: 'c4842d0956b6188431e300ca311a8d3832def793',
    scope: 'contacts:read'
  };

  this.login = function (params) {
    var base = 'https://www.pipedrive.com/en/login';
    var url = base;
    return url;
  };
  /**
   * Fetches deals from API;
   * @param {String} domain company domain;
   * @param {String} token authorization token;
   * @param {Object} headers request headers;
   * @param {Integer} start deals fetch start (for paged responses);
   * @return {Array<Object>} deals objects;
   */


  this.fetchDeals_ =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(domain, token, headers, start) {
      var ds, url, query, response, content, deals, ad, pages, page, limit, hasMore;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            ds = [];
            url = 'https://' + domain + '.' + this.url + '/';
            query = ['api_token=' + token];

            if (start > 0) {
              query.push('start=' + start);
            }

            _context.next = 6;
            return performFetch(encodeURI(url + 'deals?' + query.join('&')), 'get', headers);

          case 6:
            response = _context.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context.next = 23;
              break;
            }

            content = JSON.parse(response.content);
            deals = content.data || [];
            ds = ds.concat(deals); //access pagination params;

            ad = content.additional_data;
            pages = ad.pagination;
            page = pages.start;
            limit = pages.limit;
            hasMore = pages.more_items_in_collection;

            if (!hasMore) {
              _context.next = 23;
              break;
            }

            start = page + limit;
            _context.t0 = ds;
            _context.next = 21;
            return this.fetchDeals_(domain, token, headers, start);

          case 21:
            _context.t1 = _context.sent;
            ds = _context.t0.concat.call(_context.t0, _context.t1);

          case 23:
            return _context.abrupt("return", ds);

          case 24:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));

    return function (_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * Fetches activities from API;
   * @param {String} domain company domain;
   * @param {String} token authorization token;
   * @param {Object} headers request headers;
   * @param {Integer} start deals fetch start (for paged responses);
   * @return {Array<Object>} activities objects;
   */


  this.fetchActivities_ =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(domain, token, headers, start) {
      var acts, url, query, response, content, activities, ad, pages, page, limit, hasMore, nextActivities;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            acts = [];
            url = 'https://' + domain + '.' + this.url + '/';
            query = ['api_token=' + token];

            if (start > 0) {
              query.push('start=' + start);
            }

            _context2.next = 6;
            return performFetch(encodeURI(url + 'activities?' + query.join('&')), 'get', headers);

          case 6:
            response = _context2.sent;

            if (!(response.code >= 200 && response.code < 300)) {
              _context2.next = 29;
              break;
            }

            content = JSON.parse(response.content);
            activities = content.data || [];
            acts = acts.concat(activities);
            console.log(acts.length); //access pagination params;

            ad = content.additional_data;
            pages = ad.pagination;
            page = pages.start;
            limit = pages.limit;
            hasMore = pages.more_items_in_collection;
            console.log(hasMore);
            console.log(page);
            console.log(limit);

            if (!hasMore) {
              _context2.next = 27;
              break;
            }

            start = page + limit;
            _context2.next = 24;
            return this.fetchDeals_(domain, token, headers, start);

          case 24:
            nextActivities = _context2.sent;
            console.log(nextActivities);
            acts = acts.concat(nextActivities);

          case 27:
            _context2.next = 30;
            break;

          case 29:
            console.log(response);

          case 30:
            return _context2.abrupt("return", acts);

          case 31:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));

    return function (_x5, _x6, _x7, _x8) {
      return _ref2.apply(this, arguments);
    };
  }();
  /**
   * Fetches notes from API;
   * @param {String} domain company domain;
   * @param {String} token authorization token;
   * @param {Object} headers request headers;
   * @param {String=} type entity type to filter by;
   * @param {String=} id entity id to filter by;
   * @return {Array<Object>} notes objects;
   */


  this.fetchNotes_ =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(domain, token, headers, type, id) {
      var ns, url, query, response, notes;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            ns = [];
            url = 'https://' + domain + '.' + this.url + '/';
            query = ['api_token=' + token];

            if (id) {
              query.push(type + '_id=' + id);
            }

            _context3.next = 6;
            return performFetch(encodeURI(url + 'notes?' + query.join('&')), 'get', headers);

          case 6:
            response = _context3.sent;

            if (response.code >= 200 && response.code < 300) {
              notes = JSON.parse(response.content).data;

              if (notes !== null) {
                if (type === 'person') {
                  notes = notes.filter(function (n) {
                    return n.deal === null;
                  });
                }

                ns = notes;
              }
            }

            return _context3.abrupt("return", ns);

          case 9:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));

    return function (_x9, _x10, _x11, _x12, _x13) {
      return _ref3.apply(this, arguments);
    };
  }();
  /**
   * Builds notes display;
   * @param {Array<Object>} notes note object set;
   * @return {Array<Object>} notes display;
   */


  this.displayNotes = function (notes) {
    var ns = [];
    notes.forEach(function (note) {
      note = note.content;
      note = note.replace(/<ul>|<ol>/, '');
      note = note.replace(/<li>+/g, '');
      note = note.replace(/<\/li>+/g, '\r');
      note = note.replace(/<\/ul><\/ol>/, '');
      var ntw = {
        icon: globalIconBackground,
        type: globalKeyValue,
        content: note
      };
      ns.push(ntw);
    });
    return ns;
  };
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
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(msg, connector, data) {
      var headers, trimmed, parameters, personsEP, activsEP, dealsEP, service, bearer, responsePersons, responseActivs, responseDeals, codeCD, contentCD, cdUrl, responseCD, dataCD, domain, fullUrl, sections, persReq, ids, idx, personId, personsResp, contact, sectionInfo, wci, name, label, emails, phones, created, updated, company, ciw, color, lw, responsePF, pfields, active, pa, eiw, pcw, puw, num, sectionEmpl, emw, cnw, caw, sectionBckg, personNotes, sectionDeals, dsw, numOpen, numClosed, numWon, numLost, numPartO, numPartC, numRelO, numRelC, overviewPr, overviewPc, overviewRl, overviewSt, ocw, deals, dls, dl, dlName, title, value, curr, status, dealOrg, expClose, wonDate, lostDate, lostReas, dtw, dow, dvcw, dealNotes, dclw, drw, dww, sectionActivs, asw, activities, numActiv, numDone, numUndone, numRefed, nextDate, nextTime, overallActivs, statusActivs, ovActivsContent, oacw, nadw, act, activity, astatus, aperson, orgId, dealName, subject, type, duration, isDone, note, aDealTitle, aDealId, dueDate, dueTime, now, ac, aadw, acn, activDue, activDur, owner, sectionOwner, widgetsOwner, ownerName, ownerEmail, ownerActive, authError, cdError, returned;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            //set headers for url fetch;
            headers = {}; //set payload in case POST request will be triggered;

            trimmed = trimMessage(msg, true, true); //access authoorization parameters and set service name;

            parameters = this.auth; //initiate access endpoints;

            personsEP = '/persons';
            activsEP = '/activities';
            dealsEP = '/deals'; //Auth2.0 currently disabled, checking for API token;

            if (!(parameters.type === globalOAuth2AuthType)) {
              _context4.next = 23;
              break;
            }

            parameters.name = connector.name;
            parameters.ID = connector.ID; //create service and set authorization header;

            service = authService(parameters);
            bearer = 'Bearer ' + service.getAccessToken();
            headers.Authorization = bearer; //initate requests;

            _context4.next = 14;
            return performFetch(this.url + personsEP, method, headers);

          case 14:
            responsePersons = _context4.sent;
            _context4.next = 17;
            return performFetch(this.url + activsEP, method, headers);

          case 17:
            responseActivs = _context4.sent;
            _context4.next = 20;
            return performFetch(this.url + dealsEP, method, headers);

          case 20:
            responseDeals = _context4.sent;
            _context4.next = 254;
            break;

          case 23:
            if (connector.account) {
              _context4.next = 32;
              break;
            }

            cdUrl = 'https://api.pipedrive.com/v1/users/me?api_token=' + connector.apitoken;
            _context4.next = 27;
            return performFetch(cdUrl, 'get', {});

          case 27:
            responseCD = _context4.sent;
            codeCD = responseCD.code;
            contentCD = responseCD.content;
            _context4.next = 34;
            break;

          case 32:
            codeCD = 200;
            contentCD = JSON.stringify({
              data: {
                company_domain: connector.account
              }
            });

          case 34:
            if (!(codeCD === 200)) {
              _context4.next = 244;
              break;
            }

            contentCD = JSON.parse(contentCD);
            dataCD = contentCD.data;
            domain = dataCD.company_domain; //set domain to connector;

            connector.account = domain;
            saveConnector(connector); //build full URL;

            fullUrl = 'https://' + domain + '.' + this.url; //initiate sections and get filtered persons;

            sections = [];
            _context4.next = 44;
            return performFetch(fullUrl + personsEP + '/find?search_by_email=1&term=' + trimmed.email + '&api_token=' + connector.apitoken, 'get', headers);

          case 44:
            persReq = _context4.sent;

            if (!(persReq.code >= 200 && persReq.code < 300)) {
              _context4.next = 242;
              break;
            }

            ids = JSON.parse(persReq.content).data;

            if (ids === null) {
              ids = [];
            }

            idx = 0;

          case 49:
            if (!(idx < ids.length)) {
              _context4.next = 242;
              break;
            }

            personId = ids[idx]; //get person by previously fetched id;

            _context4.next = 53;
            return performFetch(fullUrl + personsEP + '/' + personId.id + '?api_token=' + connector.apitoken, 'get', headers);

          case 53:
            personsResp = _context4.sent;

            if (!(personsResp.code >= 200 && personsResp.code < 300)) {
              _context4.next = 239;
              break;
            }

            contact = JSON.parse(personsResp.content).data; //initiate main info section;

            sectionInfo = {
              header: globalContactInfoHeader,
              isCollapsible: true,
              widgets: []
            };
            wci = sectionInfo.widgets; //access contact properties;

            name = contact.name;
            label = contact.label; //null;

            emails = contact.email; //Array 1 elem;

            phones = contact.phone; //Array 1 elem with value empty string;

            created = contact.add_time;
            updated = contact.update_time; //equal to created;

            company = contact.org_id; //null;

            ciw = {
              icon: 'PERSON',
              title: 'Full Name',
              type: globalKeyValue,
              content: name
            };
            wci.push(ciw); //create person label widget;

            if (!(label !== null)) {
              _context4.next = 87;
              break;
            }

            color = '#000000';
            _context4.t0 = label;
            _context4.next = _context4.t0 === 1 ? 72 : _context4.t0 === 2 ? 75 : _context4.t0 === 3 ? 78 : _context4.t0 === 4 ? 81 : 84;
            break;

          case 72:
            label = 'Customer';
            color = '#007A00';
            return _context4.abrupt("break", 85);

          case 75:
            label = 'Hot lead';
            color = '#ff0000';
            return _context4.abrupt("break", 85);

          case 78:
            label = 'Warm lead';
            color = '#FFCE00';
            return _context4.abrupt("break", 85);

          case 81:
            label = 'Cold lead';
            color = '#4285F4';
            return _context4.abrupt("break", 85);

          case 84:
            label = 'Custom label';

          case 85:
            lw = {
              icon: 'BOOKMARK',
              type: globalKeyValue,
              content: '<b><font color="' + color + '">' + label + '</font></b>'
            };
            wci.push(lw);

          case 87:
            if (!connector.fields) {
              _context4.next = 92;
              break;
            }

            _context4.next = 90;
            return performFetch(fullUrl + '/personFields' + '?api_token=' + connector.apitoken, 'get', headers);

          case 90:
            responsePF = _context4.sent;

            if (responsePF.code >= 200 && responsePF.code < 300) {
              pfields = JSON.parse(responsePF.content).data;

              if (pfields !== null) {
                pfields.forEach(function (p) {
                  if (p.key.toString().length === 40) {
                    var cValue = contact[p.key];

                    if (cValue !== null) {
                      var cName = p.name;
                      var cfw = {
                        type: globalKeyValue,
                        title: cName
                      }; //prepare content and icons for one of the types;

                      switch (p.field_type) {
                        case 'address':
                          cfw.icon = 'MAP_PIN';
                          break;

                        case 'varchar':
                          cfw.icon = globalIconText;
                          break;

                        case 'varchar_auto':
                          cfw.icon = globalIconEdit;
                          break;

                        case 'text':
                          cfw.icon = 'DESCRIPTION';
                          break;

                        case 'double':
                          cfw.icon = globalIconNumber;
                          break;

                        case 'monetary':
                          cfw.icon = 'DOLLAR';
                          cValue = cValue + ' ' + contact[p.key + '_currency'];
                          break;

                        case 'phone':
                          cfw.icon = 'PHONE';
                          break;

                        case 'enum':
                          cfw.icon = globalIconList;
                          var enums = p.options;

                          for (var oe = 0; oe < enums.length; oe++) {
                            if (enums[oe].id === +cValue) {
                              cValue = enums[oe].label;
                            }
                          }

                          break;

                        case 'set':
                          cfw.icon = globalIconList;
                          cValue = cValue.split(',').map(function (v) {
                            var opts = p.options;

                            for (var o = 0; o < opts.length; o++) {
                              if (opts[o].id === +v) {
                                return opts[o].label;
                              }
                            }
                          });
                          cValue = cValue.join(', ');
                          break;

                        case 'date':
                          cfw.icon = 'INVITE';
                          cValue = new Date(cValue).toLocaleDateString();
                          break;

                        case 'daterange':
                          cfw.icon = 'INVITE';
                          cValue = new Date(cValue).toLocaleDateString() + '<br>';
                          cValue += new Date(contact[p.key + '_until']).toLocaleDateString();
                          break;

                        case 'time':
                          cfw.icon = 'CLOCK';
                          cValue = new Date('1970-01-01T' + cValue).toLocaleTimeString();
                          break;

                        case 'timerange':
                          cfw.icon = 'CLOCK';
                          cValue = new Date('1970-01-01T' + cValue).toLocaleTimeString() + '<br>';
                          cValue += new Date('1970-01-01T' + contact[p.key + '_until']).toLocaleTimeString();
                          break;

                        case 'people':
                          cfw.icon = 'PERSON';
                          cValue = contact[p.key].name;
                          cfw.buttonText = 'Open';
                          cfw.buttonLink = domain + '.pipedrive.com/person/' + contact[p.key].value;
                          cfw.disabled = false;
                          break;

                        case 'org':
                          cfw.icon = globalIconCompany;
                          cValue = contact[p.key].name;
                          cfw.buttonText = 'Open';
                          cfw.buttonLink = domain + '.pipedrive.com/organization/' + contact[p.key].value;
                          cfw.disabled = false;
                          break;

                        case 'user':
                          cfw.icon = globalIconAccount;
                          cValue = contact[p.key].name;
                          cfw.buttonText = 'Open';
                          cfw.buttonLink = domain + '.pipedrive.com/users/details/' + contact[p.key].id;
                          cfw.disabled = false;
                          break;
                      }

                      if (!cfw.icon) {
                        cfw.icon = globalIconCustom;
                      }

                      cfw.content = cValue;
                      wci.push(cfw);
                    }
                  } //end custom field check;                    

                }); //end custom fields loop;
              } //end custom not null;

            }

          case 92:
            //create person email widgets;
            if (emails.length > 1) {
              wci.push(globalWidgetSeparator);
            }

            emails.forEach(function (email) {
              var value = '<a href="mailto:' + email.value + '">' + email.value + '</a>';
              var pem = {
                title: toSentenceCase(email.label) + ' email',
                type: globalKeyValue,
                content: value
              };

              if (email.primary) {
                pem.buttonText = 'Primary';
              }

              switch (email.label) {
                case 'work':
                  pem.icon = globalIconOfficeEmail;
                  break;

                case 'home':
                  pem.icon = globalIconHomeEmail;
                  break;

                case 'other':
                  pem.icon = 'EMAIL';
                  break;
              }

              wci.push(pem);
            });

            if (phones.length > 1) {
              wci.push(globalWidgetSeparator);
            }

            phones.forEach(function (phone) {
              var label = phone.label;
              var value = phone.value;

              if (value !== '') {
                var isPrimary = phone.primary;
                var pph = {
                  title: toSentenceCase(label) + ' phone',
                  type: globalKeyValue,
                  content: value
                };

                if (isPrimary) {
                  pph.buttonText = 'Primary';
                }

                switch (label) {
                  case 'work':
                    pph.icon = globalIconWorkPhone;
                    break;

                  case 'home':
                    pph.icon = globalIconHomePhone;
                    break;

                  case 'mobile':
                    pph.icon = globalIconMobilePhone;
                    break;

                  case 'other':
                    pph.icon = 'PHONE';
                    break;
                }

                wci.push(pph);
              }
            }); //create is active widget;

            active = 'Inactive', color = '#ff0000';

            if (contact.active_flag) {
              active = 'Active';
              color = '#007A00';
            }

            pa = {
              type: globalKeyValue,
              content: '<font color="' + color + '">' + active.toString() + '</font>'
            };
            wci.push(pa);
            eiw = {
              type: globalTextButton,
              action: globalActionLink,
              title: 'Edit in Pipedrive',
              content: domain + '.pipedrive.com/person/' + contact.id,
              reload: true
            };
            wci.push(eiw);
            created = new Date(created.split(' ').join('T'));
            updated = new Date(updated.split(' ').join('T'));
            wci.push(globalWidgetSeparator);
            pcw = {
              icon: 'CLOCK',
              title: 'Created',
              type: globalKeyValue,
              content: created.toLocaleDateString() + '\r' + created.toLocaleTimeString()
            };
            wci.push(pcw);

            if (!(created.valueOf() === updated.valueOf())) {
              puw = {
                icon: 'CLOCK',
                title: 'Edited',
                type: globalKeyValue,
                content: updated.toLocaleDateString() + '\r' + updated.toLocaleTimeString()
              };
              wci.push(puw);
            } //set uncollapsible widgets;


            num = wci.length;

            if (!(created.valueOf() === updated.valueOf())) {
              num -= 3;
            } else {
              num -= 2;
            }

            sectionInfo.numUncollapsible = num; //initiate employment section;

            sectionEmpl = {
              header: globalEmploymentContactHeader,
              isCollapsible: true,
              widgets: []
            };
            emw = sectionEmpl.widgets;

            if (company !== null) {
              cnw = {
                icon: globalIconCompany,
                title: 'Company',
                type: globalKeyValue,
                content: company.name
              };
              emw.push(cnw);

              if (company.address !== null) {
                caw = {
                  icon: 'MAP_PIN',
                  title: 'Address',
                  type: globalKeyValue,
                  content: company.address
                };
                emw.push(caw);
              }
            } //initiate background section;


            sectionBckg = {
              header: 'Background',
              isCollapsible: true,
              widgets: []
            };
            _context4.next = 117;
            return this.fetchNotes_(domain, connector.apitoken, headers, 'person', personId.id);

          case 117:
            personNotes = _context4.sent;
            sectionBckg.widgets = this.displayNotes(personNotes); //get person's deals if enabled;

            sectionDeals = {
              header: 'Deals',
              isCollapsible: true,
              widgets: []
            };
            dsw = sectionDeals.widgets;

            if (!connector.deals) {
              _context4.next = 167;
              break;
            }

            numOpen = contact.open_deals_count;
            numClosed = contact.closed_deals_count;
            numWon = contact.won_deals_count;
            numLost = contact.lost_deals_count;
            numPartO = contact.participant_open_deals_count;
            numPartC = contact.participant_closed_deals_count;
            numRelO = contact.related_open_deals_count;
            numRelC = contact.related_closed_deals_count;

            if (numOpen > 0 || numClosed > 0 || numWon > 0 || numLost > 0 || numPartO > 0 || numPartC > 0 || numRelO > 0 || numRelC > 0) {
              overviewPr = '<b>primary</b>\t' + numClosed + ' closed, ' + numOpen + ' open';
              overviewPc = '<b>part of</b>\t' + numPartC + ' closed, ' + numPartO + ' open';
              overviewRl = '<b>related</b>\t' + numRelC + ' closed, ' + numRelO + ' open';
              overviewSt = '<b>status</b>\t' + numWon + ' won, ' + numLost + ' lost';
              ocw = {
                icon: globalIconDealOpen,
                type: globalKeyValue,
                content: [overviewPr, overviewPc, overviewRl, overviewSt].join('\r\n')
              };
              dsw.push(ocw);
            }

            _context4.next = 133;
            return this.fetchDeals_(domain, connector.apitoken, headers, 0);

          case 133:
            deals = _context4.sent;
            dls = 0;

          case 135:
            if (!(dls < deals.length)) {
              _context4.next = 167;
              break;
            }

            dl = deals[dls];

            if (!(dl.person_id !== null)) {
              _context4.next = 164;
              break;
            }

            dlName = dl.person_id.name;

            if (!(contact.name === dlName)) {
              _context4.next = 164;
              break;
            }

            if (dsw.length > 0) {
              dsw.push(globalWidgetSeparator);
            } //access deal property;


            title = dl.title;
            value = dl.value; //0;

            curr = dl.currency;
            status = dl.status;
            dealOrg = dl.org_id;
            expClose = dl.expected_close_date; //null;

            wonDate = dl.won_time; //null;

            lostDate = dl.lost_time; //null;

            lostReas = dl.lost_reason; //null;

            dtw = {
              icon: globalIconDeal,
              type: globalKeyValue,
              title: 'Deal info',
              content: title
            };

            if (status === 'won') {
              dtw.buttonIcon = globalIconDealWon;
              dtw.buttonText = 'Won';
            } else if (status === 'lost') {
              dtw.buttonIcon = globalIconDealLost;
              dtw.buttonText = 'Lost';
            } else {
              dtw.buttonText = 'Edit';
              dtw.disabled = false;
            }

            dtw.buttonLink = domain + '.pipedrive.com/deal/' + dl.id;
            dtw.reload = true;
            dsw.push(dtw);

            if (dealOrg !== null) {
              dow = {
                icon: globalIconCompany,
                type: globalKeyValue,
                title: 'Company',
                content: dealOrg.name
              };
              dsw.push(dow);
            }

            dvcw = {
              icon: 'DOLLAR',
              type: globalKeyValue,
              title: 'Value',
              content: value + ' ' + curr
            };
            dsw.push(dvcw);

            if (!(dl.notes_count > 0)) {
              _context4.next = 163;
              break;
            }

            _context4.next = 161;
            return this.fetchNotes_(domain, connector.apitoken, headers, 'deal', dl.id);

          case 161:
            dealNotes = _context4.sent;
            dealNotes.forEach(function (dn) {
              dsw.push({
                icon: globalIconBackground,
                title: 'Note',
                type: globalKeyValue,
                content: dn.content
              });
            });

          case 163:
            if (expClose !== null && lostDate === null && wonDate === null) {
              dclw = {
                icon: 'INVITE',
                type: globalKeyValue,
                title: 'Expected close',
                content: new Date(expClose).toLocaleDateString()
              };
              dsw.push(dclw);
            } else if (lostDate !== null) {
              drw = {
                icon: globalIconLostInfo,
                type: globalKeyValue,
                title: 'Lost reason',
                content: lostReas
              };
              lostDate = new Date(lostDate.replace(' ', 'T'));
              dclw = {
                icon: 'INVITE',
                type: globalKeyValue,
                title: 'Lost date',
                content: lostDate.toLocaleDateString() + '\r' + lostDate.toLocaleTimeString()
              };
              dsw.push(drw, dclw);
            } else if (wonDate !== null) {
              wonDate = new Date(wonDate.replace(' ', 'T'));
              dww = {
                icon: 'INVITE',
                type: globalKeyValue,
                title: 'Won date',
                content: wonDate.toLocaleDateString() + '\r' + wonDate.toLocaleTimeString()
              };
              dsw.push(dww);
            }

          case 164:
            dls++;
            _context4.next = 135;
            break;

          case 167:
            //end deals check;
            //get person's activities if enabled;
            sectionActivs = {
              header: globalActivitiesHeader,
              isCollapsible: true,
              widgets: []
            };
            asw = sectionActivs.widgets;

            if (!connector.activities) {
              _context4.next = 234;
              break;
            }

            _context4.next = 172;
            return this.fetchActivities_(domain, connector.apitoken, headers, 0);

          case 172:
            activities = _context4.sent;
            activities.sort(function (a, b) {
              return order(a.due_date, b.due_date, false);
            });
            activities = activities.filter(function (a) {
              if (a.participants !== null && a.participants !== undefined) {
                if (a.participants.some(function (p) {
                  return p.person_id === contact.id;
                })) {
                  return a;
                }
              }
            }); //build activities statistics if any;

            if (activities.length > 0) {
              numActiv = contact.activities_count;
              numDone = contact.done_activities_count;
              numUndone = contact.undone_activities_count;
              numRefed = contact.reference_activities_count;
              nextDate = contact.next_activity_date;
              nextTime = contact.next_activity_time;
              overallActivs = '<b>overall</b>\t' + numActiv + ' total, ' + numRefed + ' referenced';
              statusActivs = '<b>status</b>\t' + numDone + ' done, ' + numUndone + ' undone';
              ovActivsContent = [overallActivs, statusActivs];
              oacw = {
                icon: globalIconActivities,
                type: globalKeyValue,
                content: ovActivsContent.join('\r')
              };
              asw.push(oacw);

              if (nextDate !== null) {
                nextDate = '<b>next on</b>\t' + new Date(nextDate).toLocaleDateString();
                nadw = {
                  icon: 'INVITE',
                  type: globalKeyValue,
                  content: nextDate
                };
                asw.push(nadw);
              }
            }

            act = 0;

          case 177:
            if (!(act < activities.length)) {
              _context4.next = 234;
              break;
            }

            activity = activities[act]; //access properties;

            astatus = activity.done;
            aperson = activity.person_name;
            personId = activity.person_id;
            orgId = activity.org_id;
            dealName = activity.deal_title;
            subject = activity.subject;
            type = activity.type;
            duration = activity.duration;
            isDone = activity.done;
            note = activity.note;
            aDealTitle = activity.deal_title; //null;

            aDealId = activity.deal_id; //null;

            dueDate = new Date(activity.due_date);
            dueTime = activity.due_time; //empty string;

            if (dueTime !== '') {
              dueTime = dueTime.split(':');
              dueDate.setHours(dueTime[0]);
              dueDate.setMinutes(dueTime[1]);
            }

            asw.push(globalWidgetSeparator);
            now = new Date();
            ac = {
              type: globalKeyValue,
              content: subject
            };
            _context4.t1 = type;
            _context4.next = _context4.t1 === 'email' ? 200 : _context4.t1 === 'call' ? 204 : _context4.t1 === 'meeting' ? 208 : _context4.t1 === 'deadline' ? 212 : _context4.t1 === 'lunch' ? 216 : _context4.t1 === 'task' ? 220 : 224;
            break;

          case 200:
            ac.title = 'Email info';
            ac.icon = 'EMAIL';

            if (astatus) {
              ac.buttonIcon = globalIconSend;
              ac.buttonText = 'Sent';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconOverdue;
              ac.buttonText = 'Unsent';
            }

            return _context4.abrupt("break", 224);

          case 204:
            ac.title = 'Call info';
            ac.icon = 'PHONE';

            if (astatus) {
              ac.buttonIcon = globalIconCallEnded;
              ac.buttonText = 'Ended';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconCallMissed;
              ac.buttonText = 'Missed';
            }

            return _context4.abrupt("break", 224);

          case 208:
            ac.title = 'Meeting info';
            ac.icon = 'EVENT_PERFORMER';

            if (astatus) {
              ac.buttonIcon = globalIconTaskDone;
              ac.buttonText = 'Attended';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconMissedMeeting;
              ac.buttonText = 'Missed';
            }

            return _context4.abrupt("break", 224);

          case 212:
            ac.title = 'Deadline';
            ac.icon = globalIconFlag;

            if (astatus) {
              ac.buttonIcon = globalIconTaskDone;
              ac.buttonText = 'Met';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconOverdue;
              ac.buttonText = 'Missed';
            }

            return _context4.abrupt("break", 224);

          case 216:
            ac.title = 'Lunch info';
            ac.icon = 'RESTAURANT_ICON';

            if (astatus) {
              ac.buttonIcon = 'RESTAURANT_ICON';
              ac.buttonText = 'Attended';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconOverdue;
              ac.buttonText = 'Skipped';
            }

            return _context4.abrupt("break", 224);

          case 220:
            ac.title = 'Task to do';
            ac.icon = globalIconTask;

            if (astatus) {
              ac.buttonIcon = globalIconTaskDone;
              ac.buttonText = 'Done';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconTaskFailed;
              ac.buttonText = 'Failed';
            }

            return _context4.abrupt("break", 224);

          case 224:
            if (now > dueDate && !astatus || astatus) {
              ac.buttonLink = domain + '.pipedrive.com/activities/list';
            }

            asw.push(ac);

            if (aDealId !== null && aDealTitle !== null) {
              aadw = {
                icon: globalIconDeal,
                type: globalKeyValue,
                title: 'Deal',
                content: aDealTitle,
                buttonText: 'Open',
                buttonLink: domain + '.pipedrive.com/deal/' + aDealId,
                disabled: false
              };
              asw.push(aadw);
            }

            if (note !== null && note !== '') {
              acn = {
                icon: globalIconBackground,
                type: globalKeyValue,
                title: 'Notes',
                content: note
              };
              asw.push(acn);
            } //create due date and time widget;


            activDue = {
              icon: 'INVITE',
              type: globalKeyValue,
              title: 'Due date',
              content: dueDate.toLocaleDateString() + '\r' + dueDate.toLocaleTimeString()
            };
            asw.push(activDue); //create duration widget;

            if (duration !== '') {
              activDur = {
                icon: 'CLOCK',
                title: 'Duration',
                type: globalKeyValue,
                content: duration
              };
              asw.push(activDur);
            }

          case 231:
            act++;
            _context4.next = 177;
            break;

          case 234:
            //end activities check;
            //access person properties;
            owner = contact.owner_id; //create person owner section and widgets;

            sectionOwner = {
              header: 'Contact owner',
              isCollapsible: true,
              widgets: []
            };
            widgetsOwner = sectionOwner.widgets;

            if (owner !== null) {
              //create owner name widget;
              ownerName = {
                icon: 'PERSON',
                title: 'Name',
                type: globalKeyValue,
                content: owner.name
              };
              widgetsOwner.push(ownerName); //create owner email widget;

              ownerEmail = {
                icon: 'EMAIL',
                title: 'Email',
                type: globalKeyValue,
                content: '<a href="mailto:' + owner.email + '">' + owner.email + '</a>'
              };
              widgetsOwner.push(ownerEmail); //create is active widget;

              active = 'Inactive', color = '#ff0000';

              if (owner.active_flag) {
                active = 'Active';
                color = '#007A00';
              }

              ownerActive = {
                type: globalKeyValue,
                content: '<font color="' + color + '">' + active.toString() + '</font>'
              };
              widgetsOwner.push(ownerActive);
            } //end owner section;              


            sections.push(sectionInfo, sectionEmpl, sectionBckg, sectionDeals, sectionActivs, sectionOwner);

          case 239:
            idx++;
            _context4.next = 49;
            break;

          case 242:
            _context4.next = 254;
            break;

          case 244:
            if (!(codeCD === 401)) {
              _context4.next = 251;
              break;
            }

            timestamp('failed to access Pipedrive account', responseCD, 'warning');
            propertiesToString(connector);
            authError = [{
              header: 'Invalid credentials',
              widgets: [{
                type: globalKeyValue,
                content: 'We couldn\'t access your account due to invalid credentials. Please, check your API token and update the Connector!'
              }, {
                type: globalButtonSet,
                content: [{
                  type: globalTextButton,
                  title: 'Get API token',
                  action: globalActionLink,
                  content: 'https://app.pipedrive.com/settings/personal/api'
                }, {
                  type: globalTextButton,
                  title: 'Open settings',
                  action: 'click',
                  funcName: 'goSettings',
                  parameters: connector
                }]
              }]
            }];
            return _context4.abrupt("return", {
              code: 200,
              headers: {},
              content: JSON.stringify(authError),
              hasMatch: {
                value: true,
                text: 'Reauth'
              }
            });

          case 251:
            timestamp('failed to get company domain (Pipedrive)', responseCD, 'warning');
            cdError = {
              descr: 'We could not get your company domain to authorize request to Pipedrive. Please, see error details below for more information.'
            };
            return _context4.abrupt("return", {
              code: 0,
              content: cdError
            });

          case 254:
            //set content to return;
            returned = {
              code: persReq.code,
              headers: persReq.headers,
              content: JSON.stringify(sections)
            }; //send to analytics and return;

            return _context4.abrupt("return", returned);

          case 256:
          case "end":
            return _context4.stop();
        }
      }, _callee4, this);
    }));

    return function (_x14, _x15, _x16) {
      return _ref4.apply(this, arguments);
    };
  }();
}

Pipedrive.prototype = Object.create(Connector.prototype);