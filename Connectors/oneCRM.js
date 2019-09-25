function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * 1CRM Connector type constructor;
 */
function oneCRM() {
  Connector.call(this);
  this.icon = globalOneCRMiconUrl;
  this.typeName = '1CRM';
  this.short = globalOneCRMshort;
  this.url = '/api.php';
  this.addInCRM = {
    domain: '1crmcloud.com',
    base: '/?module=Contacts&action=EditView&record=&',
    params: {
      email: 'email1',
      first: 'first_name',
      last: 'last_name'
    }
  };
  this.config = [{
    widgets: [{
      type: globalKeyValue,
      title: 'Account name',
      content: 'Enter your account name (you can find it at [account name].[domain])'
    }, {
      name: 'account',
      type: globalTextInput,
      title: 'Account name',
      content: '',
      callback: 'validateSubdomain',
      parameters: {
        domain: '(1crmcloud\.com)|(1crmcloud)|(opencrm\.eu)|(opencrm)'
      },
      hint: 'e.g. cardin'
    }, {
      type: globalKeyValue,
      title: 'Domain',
      content: 'Choose your deployment domain. If your account is on domain not available below, please <a href="mailto:support@cardinsoft.com?subject=' + encodeURIComponent('New domain support for 1CRM request') + '">contact us</a>'
    }, {
      name: 'domain',
      type: globalEnumDropdown,
      content: [{
        text: '1crmcloud',
        value: '1crmcloud.com',
        selected: true
      }, {
        text: 'opencrm',
        value: 'opencrm.eu',
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
        title: globalAuthTypeUserCredTitle,
        content: 'This Connector uses User Credentials (login & password) to authenticate to your account. Please, note that this information is only persisted until the Connector is removed and is only used to authenticate requests.'
      }, {
        name: globalApiTokenUserFieldName,
        type: globalTextInput,
        title: 'Login',
        content: '',
        hint: 'e.g. Cardin Software'
      }, {
        name: globalApiTokenTokenFieldName,
        type: globalTextInput,
        title: 'Password',
        content: '',
        hint: 'e.g. N$5_r2EW#'
      }]
    }
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
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(msg, connector, data) {
      var endpoint, url, cred, headers, message, filters, fields, fieldsMain, fieldsCont, fieldsPaddr, fieldsOaddr, fieldsBckg, params, fullUrl, response, sections, contents, contacts, i, contact, sectionMain, sectionEmpl, sectionBckg, sectionAct, wmain, wempl, wbckg, wact, id, salut, name, company, categ, role, source, title, depart, birth, canCall, phoneW, phoneM, phoneH, phoneO, email1, email2, canEmail, website, descr, partner, pStreet, pCity, pState, pPostal, pCountry, oStreet, oCity, oState, oPostal, oCountry, created, edited, n1, ca, e1, e2, pw, pm, ph, po, address, ad, oAddress, oad, ei, equal, dCreated, dEdited, tCreated, cr, tEdited, up, num, c, d, b, urlEvents, start, end, fullEventsUrl, responseEvents, events, eventPrompt, ek, event, sd, dd, n, t, l, subj, icon, loc, from, due, authErr, sslErr, dnsErr, returned;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            connector.account = trimWhitespace(connector.account, false, true, true);

            if (!(!connector.account || connector.account === '')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", {
              code: 200,
              headers: {},
              content: JSON.stringify([{
                header: 'Invalid account name',
                widgets: [{
                  type: globalKeyValue,
                  content: 'We couldn\'t access your account because you left the name blank or it consists of reserved characters only.'
                }, {
                  type: globalTextButton,
                  title: 'Open settings',
                  action: 'click',
                  funcName: 'goSettings',
                  parameters: connector
                }]
              }])
            });

          case 3:
            //construct url and credentials for request;
            endpoint = '/data/Contact?';
            url = 'https://' + connector.account + '.' + (connector.domain ? connector.domain : '1crmcloud.com') + this.url;
            cred = Utilities.base64Encode(connector.usercode + ':' + connector.apitoken);
            headers = {
              Authorization: 'Basic ' + cred
            }; //modify message;

            message = trimMessage(msg, true, true); //construct parameters;

            filters = 'filters[any_email]=' + message.email;
            fields = [];
            fieldsMain = ['primary_account', 'categories', 'business_role', 'lead_source', 'title', 'department', 'do_not_call', 'skype_id', 'email_opt_out', 'partner', 'photo', 'date_entered', 'date_modified'];
            fieldsCont = ['phone_home', 'phone_mobile', 'phone_work', 'phone_other', 'email1', 'email2', 'website'];
            fieldsPaddr = ['primary_address_street', 'primary_address_city', 'primary_address_state', 'primary_address_postalcode', 'primary_address_country'];
            fieldsOaddr = ['alt_address_street', 'alt_address_city', 'alt_address_state', 'alt_address_postalcode', 'alt_address_country'];
            fieldsBckg = ['birthdate', 'description'];
            fields = fields.concat(fieldsMain, fieldsCont, fieldsPaddr, fieldsOaddr, fieldsBckg);
            fields = fields.map(function (field) {
              return 'fields[]=' + field;
            }).join('&'); //join parameters to query;

            params = [filters, fields].join('&'); //construct full url with parameters;

            fullUrl = url + endpoint + params; //fetch endpoint and return response;

            _context.next = 21;
            return performFetch(fullUrl, 'get', headers);

          case 21:
            response = _context.sent;
            sections = [];

            if (!(response.code >= 200 && response.code < 300)) {
              _context.next = 157;
              break;
            }

            //access contacts and create sections for each contact;
            contents = JSON.parse(response.content);
            contacts = contents.records;
            i = 0;

          case 27:
            if (!(i < contacts.length)) {
              _context.next = 155;
              break;
            }

            contact = contacts[i]; //initiate contact sections;

            sectionMain = {
              header: globalContactInfoHeader,
              isCollapsible: true
            };
            sectionEmpl = {
              header: globalEmploymentContactHeader,
              isCollapsible: true
            };
            sectionBckg = {
              header: 'Background',
              isCollapsible: true
            };
            sectionAct = {
              header: globalActivitiesHeader,
              isCollapsible: true
            }; //access sections widgets;

            wmain = [];
            wempl = [];
            wbckg = [];
            wact = []; //access contact parameters; //comment - if empty;

            id = contact.id;
            salut = contact.salutation; //empty string;

            name = contact.name;
            company = contact.primary_account; //null;

            categ = contact.categories.split('^,^'); //empty string;

            role = contact.business_role; //null;

            source = contact.lead_source; //null;

            title = contact.title; //empty string;

            depart = contact.department; //null;

            birth = contact.birthdate; //null;

            canCall = +contact.do_not_call; //1 or 0;

            phoneW = contact.phone_work; //null;

            phoneM = contact.phone_mobile; //null;

            phoneH = contact.phone_home; //null;

            phoneO = contact.phone_other; //null;

            email1 = contact.email1; //null;

            email2 = contact.email2; //null;

            canEmail = +contact.email_opt_out; //1 or 0;

            website = contact.website; //null;

            descr = contact.description; //null;

            partner = contact.partner; //null;

            pStreet = contact.primary_address_street; //null;

            pCity = contact.primary_address_city; //null;

            pState = contact.primary_address_state; //null;

            pPostal = contact.primary_address_postalcode; //null;

            pCountry = contact.primary_address_country; //null;

            oStreet = contact.alt_address_street; //null;

            oCity = contact.alt_address_city; //null;

            oState = contact.alt_address_state; //null;

            oPostal = contact.alt_address_postalcode; //null;

            oCountry = contact.alt_address_country; //null;        

            created = contact.date_entered.split(' ');
            edited = contact.date_modified.split(' ');

            if (name !== null) {
              n1 = {
                icon: 'PERSON',
                type: globalKeyValue,
                title: 'Full name',
                content: name
              };
              wmain.push(n1);
            } //if assigned categories -> create category widget;


            if (categ.length > 0 && categ[0] !== '') {
              ca = {
                icon: globalIconList,
                type: globalKeyValue,
                title: 'Categories',
                content: ''
              };
              categ.forEach(function (category) {
                ca.content += category + '\r';
              });
              wmain.push(ca);
            } //create primary email widget;


            if (email1 !== null) {
              e1 = {
                icon: 'EMAIL',
                type: globalKeyValue,
                title: 'Email',
                content: email1
              };
              wmain.push(e1);

              if (canEmail === 1) {
                e1.buttonText = 'opted out';
              } else {
                e1.content = '<a href="mailto:' + email1 + '">' + email1 + '</a>';
              }
            } //create other email widget;


            if (email2 !== null) {
              e2 = {
                icon: 'EMAIL',
                type: globalKeyValue,
                title: 'Other email',
                content: email2
              };
              wmain.push(e2);

              if (email1 === null && canEmail === 1) {
                e2.buttonText = 'opted out';
              } else if (canEmail === 0) {
                e2.content = '<a href="mailto:' + email2 + '">' + email2 + '</a>';
              }
            } //create work phone widget;


            if (phoneW !== null) {
              wmain.push(globalWidgetSeparator);
              pw = {
                icon: globalIconWorkPhone,
                type: globalKeyValue,
                title: 'Work phone',
                content: phoneW
              };

              if (canCall === 1) {
                pw.buttonText = 'don\'t call';
              }

              wmain.push(pw);
            } //create mobile phone widget;


            if (phoneM !== null) {
              if (phoneW === null) {
                wmain.push(globalWidgetSeparator);
              }

              pm = {
                icon: globalIconMobilePhone,
                type: globalKeyValue,
                title: 'Mobile phone',
                content: phoneM
              };

              if (canCall === 1 && phoneW === null) {
                pm.buttonText = 'don\'t call';
              }

              wmain.push(pm);
            } //create home phone widget;


            if (phoneH !== null) {
              if (phoneM === null) {
                wmain.push(globalWidgetSeparator);
              }

              ph = {
                icon: globalIconHomePhone,
                type: globalKeyValue,
                title: 'Home phone',
                content: phoneH
              };

              if (canCall === 1 && phoneM === null && phoneW === null) {
                ph.buttonText = 'don\'t call';
              }

              wmain.push(ph);
            } //create other phone widget;


            if (phoneO !== null) {
              if (phoneH === null) {
                wmain.push(globalWidgetSeparator);
              }

              po = {
                icon: 'PHONE',
                type: globalKeyValue,
                title: 'Other phone',
                content: phoneO
              };

              if (canCall === 1 && phoneH === null && phoneM === null && phoneW === null) {
                po.buttonText = 'don\'t call';
              }

              wmain.push(po);
            } //create primary address widget;


            if (pStreet !== null || pCity !== null || pState !== null || pPostal !== null || pCountry !== null) {
              wmain.push(globalWidgetSeparator);
              address = [];
              ad = {
                icon: 'MAP_PIN',
                type: globalKeyValue,
                title: 'Primary address'
              };

              if (pPostal !== null) {
                address.push(pPostal);
              }

              if (pStreet !== null) {
                address.push(pStreet);
              }

              if (pCity !== null) {
                address.push(pCity);
              }

              if (pState !== null) {
                address.push(pState);
              }

              if (pCountry !== null) {
                address.push(pCountry);
              }

              ad.content = address.join(', ');
              wmain.push(ad);
            } //create other address widget;


            if (oStreet !== null || oCity !== null || oState !== null || oPostal !== null || oCountry !== null) {
              if (pStreet === null && pCity === null && pState === null && pPostal === null && pCountry === null) {
                wmain.push(globalWidgetSeparator);
              }

              oAddress = [];
              oad = {
                icon: 'MAP_PIN',
                type: globalKeyValue,
                title: 'Other address'
              };

              if (oPostal !== null) {
                oAddress.push(oPostal);
              }

              if (oStreet !== null) {
                oAddress.push(oStreet);
              }

              if (oCity !== null) {
                oAddress.push(oCity);
              }

              if (oState !== null) {
                oAddress.push(oState);
              }

              if (oCountry !== null) {
                oAddress.push(oCountry);
              }

              oad.content = oAddress.join(', ');
              wmain.push(oad);
            } //create edit in 1CRM widget;     


            ei = {
              type: globalTextButton,
              action: globalActionLink,
              title: 'Edit in 1CRM',
              content: 'https://' + connector.account + '.1crmcloud.com?module=Contacts&action=EditView&record=' + id,
              reload: true
            };
            wmain.push(ei);
            wmain.push(globalWidgetSeparator); //parse dates;

            equal = false;
            dCreated = new Date(created[0]);
            dEdited = new Date(edited[0]);

            if (dCreated.valueOf() === dEdited.valueOf()) {
              equal = true;
            } //create contact creation widget;


            tCreated = created[1].split(':');
            dCreated.setHours(+tCreated[0]);
            dCreated.setMinutes(+tCreated[1]);
            cr = {
              icon: 'CLOCK',
              type: globalKeyValue,
              title: 'Created',
              content: dCreated.toLocaleDateString() + '\r' + dCreated.toLocaleTimeString()
            };
            wmain.push(cr); //if difference in create-edit time -> create edit widget;

            if (!equal) {
              tEdited = edited[1].split(':');
              dEdited.setHours(+tEdited[0]);
              dEdited.setMinutes(+tEdited[1]);
              up = {
                icon: 'CLOCK',
                type: globalKeyValue,
                title: 'Edited',
                content: dEdited.toLocaleDateString() + '\r' + dEdited.toLocaleTimeString()
              };
              wmain.push(up);
            } //set uncollapsible widgets;


            num = wmain.length;

            if (!equal) {
              num -= 3;
            } else {
              num -= 2;
            }

            sectionMain.numUncollapsible = num; //create employment section widgets;

            if (company !== null) {
              c = {
                icon: globalIconCompany,
                type: globalKeyValue,
                title: 'Company',
                content: company
              };
              wempl.push(c);
            }

            if (depart !== null) {
              d = {
                icon: globalIconDepartment,
                type: globalKeyValue,
                title: 'Department',
                content: depart
              };
              wempl.push(d);
            } //create background section widgets;


            if (birth !== null) {
              b = {
                icon: globalIconBirthday,
                type: globalKeyValue,
                title: 'Birthday',
                content: new Date(birth).toLocaleDateString()
              };
              wbckg.push(b);
            }

            if (descr !== null) {
              d = {
                icon: globalIconBackground,
                type: globalKeyValue,
                title: 'Description',
                content: descr
              };
              wbckg.push(d);
            } //construct activities parameters;


            endpoint = '/calendar/events?';
            urlEvents = 'https://' + connector.account + '.' + (connector.domain ? connector.domain : '1crmcloud.com') + this.url; //construct start date (required format YYYY-MM-DD HH-MM-SS);

            start = new Date().toISOString();
            start = start.substring(0, start.length - 5).split('T').join(' ');
            start = 'start_date=' + start; //construct end date (required format YYYY-MM-DD HH-MM-SS);

            end = new Date(new Date().valueOf() + 7 * 24 * 60 * 60 * 1000).toISOString();
            end = end.substring(0, end.length - 5).split('T').join(' ');
            end = 'end_date=' + end; //construct full url with parameters;

            fullEventsUrl = urlEvents + endpoint + start + '&' + end; //fetch endpoint and return response;

            _context.next = 111;
            return performFetch(fullEventsUrl, 'get', headers);

          case 111:
            responseEvents = _context.sent;

            if (!(responseEvents.code >= 200 && responseEvents.code < 300)) {
              _context.next = 147;
              break;
            }

            events = JSON.parse(responseEvents.content).records;
            events.sort(function (a, b) {
              order(a.date_start, b.date_start, true);
            }); //construct prompt for events;

            eventPrompt = {
              type: globalKeyValue,
              title: '',
              content: 'Your activities for the next week'
            };

            if (events.length === 0) {
              eventPrompt.content = 'No pending activities for the next week';
            }

            wact.push(eventPrompt); //construct event widgets for each event;

            ek = 0;

          case 119:
            if (!(ek < events.length)) {
              _context.next = 147;
              break;
            }

            event = events[ek];
            sd = event.date_start;
            dd = event.date_due; //null;

            n = event.name;
            t = event.type;
            l = event.location; //null;

            wact.push(globalWidgetSeparator);
            subj = {
              type: globalKeyValue,
              title: 'Subject',
              content: n
            };
            _context.t0 = t;
            _context.next = _context.t0 === 'Call' ? 131 : _context.t0 === 'Meeting' ? 133 : _context.t0 === 'ProjectTask' ? 135 : _context.t0 === 'Task' ? 137 : 139;
            break;

          case 131:
            icon = globalIconCall;
            return _context.abrupt("break", 139);

          case 133:
            icon = 'EVENT_PERFORMER';
            return _context.abrupt("break", 139);

          case 135:
            icon = globalIconTask;
            return _context.abrupt("break", 139);

          case 137:
            icon = globalIconTask;
            return _context.abrupt("break", 139);

          case 139:
            subj.icon = icon;
            wact.push(subj);

            if (l !== null) {
              loc = {
                icon: 'MAP_PIN',
                type: globalKeyValue,
                title: 'Location',
                content: l
              };
              wact.push(loc);
            }

            if (sd !== null) {
              sd = sd.split(' ')[0];
              from = {
                icon: 'INVITE',
                type: globalKeyValue,
                title: 'Start date',
                content: new Date(sd).toLocaleDateString()
              };
              wact.push(from);
            }

            if (dd !== null) {
              dd = dd.split(' ')[0];
              due = {
                icon: 'INVITE',
                type: globalKeyValue,
                title: 'Due date',
                content: new Date(dd).toLocaleDateString()
              };
              wact.push(due);
            }

          case 144:
            ek++;
            _context.next = 119;
            break;

          case 147:
            //end events success;
            //push widgets to sections and push sections;
            sectionMain.widgets = wmain;
            sectionEmpl.widgets = wempl;
            sectionBckg.widgets = wbckg;
            sectionAct.widgets = wact;
            sections.push(sectionMain, sectionEmpl, sectionBckg, sectionAct);

          case 152:
            i++;
            _context.next = 27;
            break;

          case 155:
            _context.next = 174;
            break;

          case 157:
            if (!(response.code === 401)) {
              _context.next = 163;
              break;
            }

            propertiesToString(connector);
            authErr = [{
              header: 'Invalid credentials',
              widgets: [{
                type: globalKeyValue,
                content: 'We couldn\'t access your account due to invalid credentials. Please, check user name and password and update the Connector!'
              }, {
                type: globalTextButton,
                title: 'Open settings',
                action: 'click',
                funcName: 'goSettings',
                parameters: connector
              }]
            }];
            return _context.abrupt("return", {
              code: 200,
              headers: {},
              content: JSON.stringify(authErr),
              hasMatch: {
                value: true,
                text: 'Reauth'
              }
            });

          case 163:
            if (!(response.code === 403)) {
              _context.next = 168;
              break;
            }

            //build inactive account prompt and action;
            sslErr = [{
              header: 'Inactive account',
              widgets: [{
                type: globalKeyValue,
                content: 'We couldn\'t access your account. Please, upgrade to Pro or Enterprise edition.'
              }, {
                type: globalKeyValue,
                title: 'New account',
                content: 'If you just created an account, please, login before continuing'
              }, {
                type: globalButtonSet,
                content: [{
                  type: globalTextButton,
                  title: 'Upgrade',
                  content: 'https://1crm.com/editions-and-pricing/'
                }, {
                  type: globalTextButton,
                  title: 'Login',
                  content: 'https://' + connector.account + '.' + (connector.domain ? connector.domain : '1crmcloud.com') + this.url.substring(0, 13),
                  reload: true
                }]
              }]
            }];
            return _context.abrupt("return", {
              code: 200,
              headers: {},
              content: JSON.stringify(sslErr),
              hasMatch: {
                value: true,
                text: 'Upgrade'
              }
            });

          case 168:
            if (!(response.content.descr.indexOf('DNS error') !== -1 || response.content.descr.indexOf('SSL Error') !== -1)) {
              _context.next = 173;
              break;
            }

            //build inactive account prompt and action;
            dnsErr = [{
              header: 'Inactive account',
              widgets: [{
                type: globalKeyValue,
                content: 'We couldn\'t access your account, most likely it is inactive (e.g. your trial expired or there is a typo in your account name). Please, check if you still have access!'
              }, {
                type: globalTextButton,
                title: 'Open account',
                content: 'https://' + connector.account + '.' + (connector.domain ? connector.domain : '1crmcloud.com') + this.url.substring(0, 13)
              }]
            }];
            return _context.abrupt("return", {
              code: 200,
              headers: {},
              content: JSON.stringify(dnsErr),
              hasMatch: {
                value: true,
                text: 'Inactive'
              }
            });

          case 173:
            return _context.abrupt("return", response);

          case 174:
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

            return _context.abrupt("return", returned);

          case 177:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
}

oneCRM.prototype = Object.create(Connector.prototype);