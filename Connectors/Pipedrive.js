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

  this.uninstall2 =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(params) {
      var auth, urlRevoke, service, headers, token, payload, fetchParams;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            //disabled {remove suffix 2 to enable} until Gmail add-ons support for Pipedrive Marketplace;
            //access auth;
            auth = this.auth;
            urlRevoke = auth.urlRevoke;

            if (!urlRevoke) {
              _context.next = 12;
              break;
            }

            //create service with parameters;
            service = authService(params); //authorize with basic auth;

            headers = {
              Authorization: 'Basic ' + Utilities.base64Encode(auth.id + ':' + auth.secret)
            }; //access token;

            token = service.getToken();

            if (!(token && token !== null)) {
              _context.next = 12;
              break;
            }

            //set refresh token to payload;
            token = token.refresh_token;
            payload = {
              token: token
            }; //set fetch parameters;

            fetchParams = {
              method: 'post',
              headers: headers,
              payload: payload,
              muteHttpExceptions: true
            }; //perform uninstall;

            _context.next = 12;
            return UrlFetchApp.fetch(urlRevoke, fetchParams);

          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * Builds notes display;
   * @param {String} domain company domain;
   * @param {String} token authorization token;
   * @param {Object} headers request headers;
   * @param {String=} type entity type to filter by;
   * @param {String=} id entity id to filter by;
   * @return {Array<Object>} notes display;
   */


  this.displayNotes = function (domain, token, headers, type, id) {
    var ns = [];
    var url = 'https://' + domain + '.' + this.url + '/';
    var query = ['api_token=' + token];

    if (id) {
      query.push(type + '_id=' + id);
    }

    var response = performFetch(encodeURI(url + 'notes?' + query.join('&')), 'get', headers);

    if (response.code >= 200 && response.code < 300) {
      var notes = JSON.parse(response.content).data;

      if (notes !== null) {
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
      }
    }

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
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(msg, connector, data) {
      var headers, trimmed, parameters, personsEP, activsEP, dealsEP, service, bearer, responsePersons, responseActivs, responseDeals, codeCD, contentCD, cdUrl, responseCD, dataCD, domain, fullUrl, sections, persReq, ids, idx, personId, personsResp, contact, sectionInfo, wci, name, label, emails, phones, created, updated, company, ciw, color, lw, responsePF, pfields, active, pa, eiw, pcw, puw, num, sectionEmpl, emw, cnw, caw, sectionBckg, sectionDeals, dsw, dealsResp, numOpen, numClosed, numWon, numLost, numPartO, numPartC, numRelO, numRelC, overviewPr, overviewPc, overviewRl, overviewSt, ocw, deals, sectionActivs, asw, activities, numActiv, numDone, numUndone, numRefed, nextDate, nextTime, overallActivs, statusActivs, ovActivsContent, oacw, nadw, act, activity, astatus, aperson, orgId, dealName, subject, type, duration, isDone, note, aDealTitle, aDealId, dueDate, dueTime, now, ac, aadw, acn, activDue, activDur, owner, sectionOwner, widgetsOwner, ownerName, ownerEmail, ownerActive, authError, cdError, returned;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            //set headers for url fetch;
            headers = {}; //set payload in case POST request will be triggered;

            trimmed = trimMessage(msg, true, true); //access authoorization parameters and set service name;

            parameters = this.auth; //initiate access endpoints;

            personsEP = '/persons';
            activsEP = '/activities';
            dealsEP = '/deals'; //Auth2.0 currently disabled, checking for API token;

            if (!(parameters.type === globalOAuth2AuthType)) {
              _context2.next = 23;
              break;
            }

            parameters.name = connector.name;
            parameters.ID = connector.ID; //create service and set authorization header;

            service = authService(parameters);
            bearer = 'Bearer ' + service.getAccessToken();
            headers.Authorization = bearer; //initate requests;

            _context2.next = 14;
            return performFetch(this.url + personsEP, method, headers);

          case 14:
            responsePersons = _context2.sent;
            _context2.next = 17;
            return performFetch(this.url + activsEP, method, headers);

          case 17:
            responseActivs = _context2.sent;
            _context2.next = 20;
            return performFetch(this.url + dealsEP, method, headers);

          case 20:
            responseDeals = _context2.sent;
            _context2.next = 213;
            break;

          case 23:
            if (connector.account) {
              _context2.next = 32;
              break;
            }

            cdUrl = 'https://api.pipedrive.com/v1/users/me?api_token=' + connector.apitoken;
            _context2.next = 27;
            return performFetch(cdUrl, 'get', {});

          case 27:
            responseCD = _context2.sent;
            codeCD = responseCD.code;
            contentCD = responseCD.content;
            _context2.next = 34;
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
              _context2.next = 203;
              break;
            }

            contentCD = JSON.parse(contentCD);
            dataCD = contentCD.data;
            domain = dataCD.company_domain; //set domain to connector;

            connector.account = domain;
            _context2.next = 41;
            return saveConnector(connector);

          case 41:
            //build full URL;
            fullUrl = 'https://' + domain + '.' + this.url; //initiate sections and get filtered persons;

            sections = [];
            _context2.next = 45;
            return performFetch(fullUrl + personsEP + '/find?search_by_email=1&term=' + trimmed.email + '&api_token=' + connector.apitoken, 'get', headers);

          case 45:
            persReq = _context2.sent;

            if (!(persReq.code >= 200 && persReq.code < 300)) {
              _context2.next = 201;
              break;
            }

            ids = JSON.parse(persReq.content).data;

            if (ids === null) {
              ids = [];
            }

            idx = 0;

          case 50:
            if (!(idx < ids.length)) {
              _context2.next = 201;
              break;
            }

            personId = ids[idx]; //get person by previously fetched id;

            _context2.next = 54;
            return performFetch(fullUrl + personsEP + '/' + personId.id + '?api_token=' + connector.apitoken, 'get', headers);

          case 54:
            personsResp = _context2.sent;

            if (!(personsResp.code >= 200 && personsResp.code < 300)) {
              _context2.next = 198;
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
              _context2.next = 88;
              break;
            }

            color = '#000000';
            _context2.t0 = label;
            _context2.next = _context2.t0 === 1 ? 73 : _context2.t0 === 2 ? 76 : _context2.t0 === 3 ? 79 : _context2.t0 === 4 ? 82 : 85;
            break;

          case 73:
            label = 'Customer';
            color = '#007A00';
            return _context2.abrupt("break", 86);

          case 76:
            label = 'Hot lead';
            color = '#ff0000';
            return _context2.abrupt("break", 86);

          case 79:
            label = 'Warm lead';
            color = '#FFCE00';
            return _context2.abrupt("break", 86);

          case 82:
            label = 'Cold lead';
            color = '#4285F4';
            return _context2.abrupt("break", 86);

          case 85:
            label = 'Custom label';

          case 86:
            lw = {
              icon: 'BOOKMARK',
              type: globalKeyValue,
              content: '<b><font color="' + color + '">' + label + '</font></b>'
            };
            wci.push(lw);

          case 88:
            if (!connector.fields) {
              _context2.next = 93;
              break;
            }

            _context2.next = 91;
            return performFetch(fullUrl + '/personFields' + '?api_token=' + connector.apitoken, 'get', headers);

          case 91:
            responsePF = _context2.sent;

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

          case 93:
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
            puw = {
              icon: 'CLOCK',
              title: 'Edited',
              type: globalKeyValue,
              content: updated.toLocaleDateString() + '\r' + updated.toLocaleTimeString()
            };
            wci.push(puw); //set uncollapsible widgets;

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
            sectionBckg.widgets = this.displayNotes(domain, connector.apitoken, headers, 'person', personId.id); //get person's deals if enabled;

            sectionDeals = {
              header: 'Deals',
              isCollapsible: true,
              widgets: []
            };
            dsw = sectionDeals.widgets;

            if (!connector.deals) {
              _context2.next = 125;
              break;
            }

            _context2.next = 123;
            return performFetch(fullUrl + dealsEP + '?api_token=' + connector.apitoken, 'get', headers);

          case 123:
            dealsResp = _context2.sent;

            if (dealsResp.code >= 200 && dealsResp.code < 300) {
              numOpen = contact.open_deals_count;
              numClosed = contact.closed_deals_count;
              numWon = contact.won_deals_count;
              numLost = contact.lost_deals_count;
              numPartO = contact.participant_open_deals_count;
              numPartC = contact.participant_closed_deals_count;
              numRelO = contact.related_open_deals_count;
              numRelC = contact.related_closed_deals_count;
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
              deals = JSON.parse(dealsResp.content).data;

              if (deals !== null) {
                deals.forEach(function (dl, idl) {
                  if (dl.person_id !== null) {
                    var dlName = dl.person_id.name;

                    if (contact.name === dlName) {
                      if (dsw.length > 0) {
                        dsw.push(globalWidgetSeparator);
                      } //access deal property;


                      var title = dl.title;
                      var value = dl.value; //0;

                      var curr = dl.currency;
                      var status = dl.status;
                      var dealOrg = dl.org_id;
                      var expClose = dl.expected_close_date; //null;

                      var wonDate = dl.won_time; //null;

                      var lostDate = dl.lost_time; //null;

                      var lostReas = dl.lost_reason; //null;

                      var dtw = {
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
                        var dow = {
                          icon: globalIconCompany,
                          type: globalKeyValue,
                          title: 'Company',
                          content: dealOrg.name
                        };
                        dsw.push(dow);
                      }

                      var dvcw = {
                        icon: 'DOLLAR',
                        type: globalKeyValue,
                        title: 'Value',
                        content: value + ' ' + curr
                      };
                      dsw.push(dvcw);

                      if (expClose !== null && lostDate === null && wonDate === null) {
                        var dclw = {
                          icon: 'INVITE',
                          type: globalKeyValue,
                          title: 'Expected close',
                          content: new Date(expClose).toLocaleDateString()
                        };
                        dsw.push(dclw);
                      } else if (lostDate !== null) {
                        var drw = {
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
                        var dww = {
                          icon: 'INVITE',
                          type: globalKeyValue,
                          title: 'Won date',
                          content: wonDate.toLocaleDateString() + '\r' + wonDate.toLocaleTimeString()
                        };
                        dsw.push(dww);
                      }
                    }
                  } //end unassigned deals check;

                });
              } //end deals not null;

            } //end deals success;


          case 125:
            //end deals check;
            //get person's deals if enabled;
            sectionActivs = {
              header: globalActivitiesHeader,
              isCollapsible: true,
              widgets: []
            };
            asw = sectionActivs.widgets;

            if (!connector.activities) {
              _context2.next = 193;
              break;
            }

            _context2.next = 130;
            return performFetch(fullUrl + activsEP + '?api_token=' + connector.apitoken, 'get', headers);

          case 130:
            responseActivs = _context2.sent;

            if (!(responseActivs.code >= 200 && responseActivs.code < 300)) {
              _context2.next = 193;
              break;
            }

            //access activities, sort and filter;
            activities = JSON.parse(responseActivs.content).data;

            if (activities !== null) {
              activities.sort(function (a, b) {
                return order(a.due_date, b.due_date, false);
              });
              activities = activities.filter(function (a) {
                if (a.participants !== null) {
                  if (a.participants.some(function (p) {
                    return p.person_id === contact.id;
                  })) {
                    return a;
                  }
                }
              });
            } else {
              activities = [];
            } //build activities statistics if any;


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

          case 136:
            if (!(act < activities.length)) {
              _context2.next = 193;
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
            _context2.t1 = type;
            _context2.next = _context2.t1 === 'email' ? 159 : _context2.t1 === 'call' ? 163 : _context2.t1 === 'meeting' ? 167 : _context2.t1 === 'deadline' ? 171 : _context2.t1 === 'lunch' ? 175 : _context2.t1 === 'task' ? 179 : 183;
            break;

          case 159:
            ac.title = 'Email info';
            ac.icon = 'EMAIL';

            if (astatus) {
              ac.buttonIcon = globalIconSend;
              ac.buttonText = 'Sent';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconOverdue;
              ac.buttonText = 'Unsent';
            }

            return _context2.abrupt("break", 183);

          case 163:
            ac.title = 'Call info';
            ac.icon = 'PHONE';

            if (astatus) {
              ac.buttonIcon = globalIconCallEnded;
              ac.buttonText = 'Ended';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconCallMissed;
              ac.buttonText = 'Missed';
            }

            return _context2.abrupt("break", 183);

          case 167:
            ac.title = 'Meeting info';
            ac.icon = 'EVENT_PERFORMER';

            if (astatus) {
              ac.buttonIcon = globalIconTaskDone;
              ac.buttonText = 'Attended';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconMissedMeeting;
              ac.buttonText = 'Missed';
            }

            return _context2.abrupt("break", 183);

          case 171:
            ac.title = 'Deadline';
            ac.icon = globalIconFlag;

            if (astatus) {
              ac.buttonIcon = globalIconTaskDone;
              ac.buttonText = 'Met';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconOverdue;
              ac.buttonText = 'Missed';
            }

            return _context2.abrupt("break", 183);

          case 175:
            ac.title = 'Lunch info';
            ac.icon = 'RESTAURANT_ICON';

            if (astatus) {
              ac.buttonIcon = 'RESTAURANT_ICON';
              ac.buttonText = 'Attended';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconOverdue;
              ac.buttonText = 'Skipped';
            }

            return _context2.abrupt("break", 183);

          case 179:
            ac.title = 'Task to do';
            ac.icon = globalIconTask;

            if (astatus) {
              ac.buttonIcon = globalIconTaskDone;
              ac.buttonText = 'Done';
            } else if (now > dueDate) {
              ac.buttonIcon = globalIconTaskFailed;
              ac.buttonText = 'Failed';
            }

            return _context2.abrupt("break", 183);

          case 183:
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

            if (note !== null) {
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

          case 190:
            act++;
            _context2.next = 136;
            break;

          case 193:
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

          case 198:
            idx++;
            _context2.next = 50;
            break;

          case 201:
            _context2.next = 213;
            break;

          case 203:
            if (!(codeCD === 401)) {
              _context2.next = 210;
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
            return _context2.abrupt("return", {
              code: 200,
              headers: {},
              content: JSON.stringify(authError),
              hasMatch: {
                value: true,
                text: 'Reauth'
              }
            });

          case 210:
            timestamp('failed to get company domain (Pipedrive)', responseCD, 'warning');
            cdError = {
              descr: 'We could not get your company domain to authorize request to Pipedrive. Please, see error details below for more information.'
            };
            return _context2.abrupt("return", {
              code: 0,
              content: cdError
            });

          case 213:
            //set content to return;
            returned = {
              code: persReq.code,
              headers: persReq.headers,
              content: JSON.stringify(sections)
            };
            return _context2.abrupt("return", returned);

          case 215:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));

    return function (_x2, _x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();
}

Pipedrive.prototype = Object.create(Connector.prototype);