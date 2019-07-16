function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function Pipedrive() {
  Connector.call(this);
  this.icon = globalPipedriveIconUrl;
  this.typeName = 'Pipedrive';
  this.url = 'pipedrive.com/v1';
  this.short = globalPipedriveShort;
  this.config = [];
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
  }, this.login = function (params) {
    var base = 'https://www.pipedrive.com/en/login';
    var url = base;
    return url;
  };

  this.buildUrl = function (params) {
    var url = 'https://' + params.domain + '.' + this.url + params.endpoint + '?api_token=' + params.apitoken;
    return url;
  };

  this.run =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(msg, connector, data) {
      var method, headers, trimmed, parameters, personsEP, activsEP, dealsEP, service, bearer, responsePersons, responseActivs, responseDeals, cdUrl, responseCD, codeCD, contentCD, dataCD, domain, authError, cdError, codePersons, codeActivs, codeDeals, contentPersons, contentActivs, contentDeals, result, persons, matching, returned;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            //set method for url fetch ('get' or 'post' for now);
            method = 'get'; //set headers for url fetch;

            headers = {}; //set payload in case POST request will be triggered;

            trimmed = trimMessage(msg, true, true); //access authoorization parameters and set service name;

            parameters = this.auth; //initiate access endpoints;

            personsEP = '/persons';
            activsEP = '/activities';
            dealsEP = '/deals'; //Auth2.0 currently disabled, checking for API token;

            if (!(parameters.type === globalOAuth2AuthType)) {
              _context.next = 23;
              break;
            }

            parameters.name = connector.name; //create service and set authorization header;

            service = authService(parameters);
            bearer = 'Bearer ' + service.getAccessToken();
            headers.Authorization = bearer; //initate requests;

            _context.next = 14;
            return performFetch(this.url + personsEP, method, headers);

          case 14:
            responsePersons = _context.sent;
            _context.next = 17;
            return performFetch(this.url + activsEP, method, headers);

          case 17:
            responseActivs = _context.sent;
            _context.next = 20;
            return performFetch(this.url + dealsEP, method, headers);

          case 20:
            responseDeals = _context.sent;
            _context.next = 54;
            break;

          case 23:
            //fetch company domain;
            cdUrl = 'https://api.pipedrive.com/v1/users/me?api_token=' + connector.apitoken;
            _context.next = 26;
            return performFetch(cdUrl, 'get', {});

          case 26:
            responseCD = _context.sent;
            codeCD = responseCD.code;
            contentCD = responseCD.content; //on success -> authorize, on fail return error;

            if (!(codeCD === 200)) {
              _context.next = 47;
              break;
            }

            contentCD = JSON.parse(contentCD);
            dataCD = contentCD.data;
            domain = dataCD.company_domain; //set domain to connector;

            connector.account = domain;
            _context.next = 36;
            return saveConnector(connector);

          case 36:
            _context.next = 38;
            return performFetch(this.buildUrl({
              domain: domain,
              endpoint: personsEP,
              apitoken: connector.apitoken
            }), method, headers);

          case 38:
            responsePersons = _context.sent;
            _context.next = 41;
            return performFetch(this.buildUrl({
              domain: domain,
              endpoint: activsEP,
              apitoken: connector.apitoken
            }), method, headers);

          case 41:
            responseActivs = _context.sent;
            _context.next = 44;
            return performFetch(this.buildUrl({
              domain: domain,
              endpoint: dealsEP,
              apitoken: connector.apitoken
            }), method, headers);

          case 44:
            responseDeals = _context.sent;
            _context.next = 54;
            break;

          case 47:
            if (!(codeCD === 401)) {
              _context.next = 52;
              break;
            }

            authError = {
              descr: 'Seems like you are not authorized to Pipedrive. Please, go to Connector settings and check if the API token you provided matches the one <a href="https://app.pipedrive.com/settings/personal/api">currently used</a>.'
            };
            return _context.abrupt("return", {
              code: 0,
              content: authError
            });

          case 52:
            cdError = {
              descr: 'We could not get your company domain to authorize request to Pipedrive. Please, see error details below for more information.'
            };
            return _context.abrupt("return", {
              code: 0,
              content: cdError
            });

          case 54:
            //access response codes;
            codePersons = responsePersons.code;
            codeActivs = responseActivs.code;
            codeDeals = responseDeals.code; //access and parse response contents;

            contentPersons = JSON.parse(responsePersons.content);
            contentActivs = JSON.parse(responseActivs.content);
            contentDeals = JSON.parse(responseDeals.content); //initialize info parsing on successful fetch;

            if (codePersons >= 200 && codePersons < 300) {
              //initiate result array, sections and set required params;
              result = []; //access content and check if it is not null;

              persons = contentPersons.data;

              if (persons !== null) {
                //set section show to false by default;
                matching = false; //access each person and create widgets;

                persons.forEach(function (person) {
                  //access person email addresses;
                  var emailLabels = [],
                      emailAddresses = [];
                  var emails = person.email;
                  emails.forEach(function (email) {
                    var emailLabel = email.label;
                    var emailAddress = email.value;
                    emailLabels.push(emailLabel);
                    emailAddresses.push(emailAddress);
                  }); //check if there is email match;

                  var hasMatch = emailAddresses.some(function (email) {
                    if (email === trimmed.email) {
                      return email;
                    }
                  });

                  if (hasMatch) {
                    //create separator;
                    var separator = {
                      type: globalKeyValue,
                      content: '\r'
                    }; //create section persons;

                    var sectionPersons = {
                      header: 'Contact info',
                      isCollapsible: true,
                      widgets: []
                    }; //access widgets;

                    var widgetsPerson = sectionPersons.widgets; //access person properties;

                    var company = person.org_id;
                    var owner = person.owner_id;
                    var first = person.first_name;
                    var last = person.last_name;
                    var phones = person.phone;
                    var created = person.add_time;
                    var updated = person.update_time;
                    var label = person.label;
                    var numOpen = person.open_deals_count;
                    var numClosed = person.closed_deals_count;
                    var numWon = person.won_deals_count;
                    var numLost = person.lost_deals_count;
                    var numActiv = person.activities_count;
                    var nextDate = person.next_activity_date;
                    var nextTime = person.next_activity_time; //create person name widget;

                    var fullname = '';

                    if (first !== null) {
                      fullname += first;
                    }

                    if (last !== null) {
                      fullname += ' ' + last;
                    }

                    var personName = {
                      icon: 'PERSON',
                      title: 'Full Name',
                      type: globalKeyValue,
                      content: fullname
                    };
                    widgetsPerson.push(personName); //create person label widget;

                    if (label !== null) {
                      //set start and end tags and default color;
                      var sText = '<b><font color="';
                      var eText = '</font></b>';
                      var color = '#000000'; //set label text and color;

                      if (label === 1) {
                        label = 'Customer';
                        color = '#007A00';
                      }

                      if (label === 2) {
                        label = 'Hot lead';
                        color = '#ff0000';
                      }

                      if (label === 3) {
                        label = 'Warm lead';
                        color = '#FFCE00';
                      }

                      if (label === 4) {
                        label = 'Cold lead';
                        color = '#4285F4';
                      }

                      var personLabel = {
                        icon: 'BOOKMARK',
                        type: globalKeyValue,
                        content: sText + color + '">' + label + eText
                      };
                      widgetsPerson.push(personLabel);
                    } //create person email widgets;


                    if (emails !== null) {
                      emails.forEach(function (email) {
                        var label = email.label;
                        var value = '<a href="mailto:' + email.value + '">' + email.value + '</a>';
                        var isPrimary = email.primary;
                        var personEmail = {
                          icon: 'EMAIL',
                          title: label,
                          type: globalKeyValue,
                          content: value
                        };

                        if (isPrimary) {
                          personEmail.buttonText = 'Primary';
                        }

                        widgetsPerson.push(personEmail);
                      });
                    } //create person phone widgets;


                    if (phones !== null) {
                      phones.forEach(function (phone) {
                        var label = phone.label;
                        var value = phone.value;
                        var isPrimary = phone.primary;
                        var personPhone = {
                          icon: 'PHONE',
                          title: label,
                          type: globalKeyValue,
                          content: value
                        };

                        if (isPrimary) {
                          personPhone.buttonText = 'Primary';
                        }

                        widgetsPerson.push(personPhone);
                      });
                    } //create is active widget;


                    var active = 'Inactive',
                        color = '#ff0000';

                    if (person.active_flag) {
                      active = 'Active';
                      color = '#007A00';
                    }

                    var personActive = {
                      type: globalKeyValue,
                      content: '<font color="' + color + '">' + active.toString() + '</font>'
                    };
                    widgetsPerson.push(personActive); //create edit-in-CRM widget;

                    var personEditIn = {
                      type: globalTextButton,
                      action: globalActionLink,
                      title: 'Edit in Pipedrive',
                      content: domain + '.pipedrive.com/person/' + person.id
                    };
                    widgetsPerson.push(personEditIn); //set number of uncollapsible widgets to main info;

                    sectionPersons.numUncollapsible = widgetsPerson.length; //append separator;

                    widgetsPerson.push(separator); //create creation date widget;

                    var personCreated = {
                      icon: 'INVITE',
                      title: 'Created on',
                      type: globalKeyValue,
                      content: created
                    };
                    widgetsPerson.push(personCreated); //create update date widget;

                    if (updated !== null) {
                      var pesronUpdated = {
                        icon: 'INVITE',
                        title: 'Updated on',
                        type: globalKeyValue,
                        content: updated
                      };
                      widgetsPerson.push(pesronUpdated);
                    } //create deals section and widgets if are or were any;


                    if (numOpen > 0 || numClosed > 0) {
                      //set single / multiple ending;
                      var modOpen = '',
                          modClosed = '';

                      if (!endsOnOne(numOpen)) {
                        modOpen = 's';
                      }

                      if (!endsOnOne(numClosed)) {
                        modClosed = 's';
                      } //create deals section;


                      var sectionDeals = {
                        header: 'Deals',
                        isCollapsible: true,
                        widgets: []
                      }; //access section widgets;

                      var dealsWidgets = sectionDeals.widgets; //create number of won deals widget;

                      var won = {
                        icon: 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_thumbs_up_down_black_18dp.png',
                        type: globalKeyValue,
                        content: numWon + ' won | ' + numLost + ' lost'
                      };
                      dealsWidgets.push(won); //create number of open deals widget;

                      var open = {
                        icon: 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_work_outline_black_18dp.png',
                        type: globalKeyValue,
                        content: numOpen + ' open deal' + modOpen
                      };
                      dealsWidgets.push(open); //create number of closed deals widget;

                      var closed = {
                        icon: 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_work_black_18dp.png',
                        type: globalKeyValue,
                        content: numClosed + ' closed deal' + modClosed
                      };
                      dealsWidgets.push(closed); //access deals array;

                      var deals = contentDeals.data;
                    } //end deals section;
                    //create activities section and widgets if are or were any;


                    if (numActiv > 0) {
                      //create deals section;
                      var sectionActivs = {
                        header: 'Activities',
                        isCollapsible: true,
                        widgets: []
                      }; //access section widgets;

                      var activsWidgets = sectionActivs.widgets; //create number of activities widget;

                      var activsMod = 'ies';

                      if (endsOnOne(numActiv)) {
                        activsMod = 'y';
                      }

                      var activs = {
                        icon: 'EVENT_PERFORMER',
                        type: globalKeyValue,
                        content: numActiv + ' activit' + activsMod
                      };
                      activsWidgets.push(activs); //create next activity date;

                      if (nextDate !== null) {
                        var nextD = {
                          icon: 'INVITE',
                          title: 'Next activity on',
                          type: globalKeyValue,
                          content: nextDate
                        };
                        activsWidgets.push(nextD);
                      } //create widgets for activities;


                      if (codeActivs >= 200 && codeActivs < 300) {
                        //access activities info;
                        var activities = contentActivs.data; //loop through activities;

                        activities.forEach(function (activity) {
                          //access properties;
                          var personId = activity.person_id;
                          var orgId = activity.org_id;
                          var dealName = activity.deal_title;
                          var subject = activity.subject;
                          var type = activity.type;
                          var duration = activity.duration;
                          var isDone = activity.done;
                          var note = activity.note;
                          var dueDate = activity.due_date;
                          var dueTime = activity.due_time; //create separator widget;

                          activsWidgets.push(separator); //create subject widget;

                          var activSubject = {
                            icon: 'EVENT_PERFORMER',
                            title: 'Subject',
                            type: globalKeyValue,
                            content: subject
                          };
                          activsWidgets.push(activSubject); //create notes widget;

                          if (note !== null) {
                            var activNotes = {
                              icon: 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_speaker_notes_black_18dp.png',
                              title: 'Notes',
                              type: globalKeyValue,
                              content: note
                            };
                            activsWidgets.push(activNotes);
                          } //create due date and time widget;


                          var activDue = {
                            icon: 'INVITE',
                            title: 'Due to',
                            type: globalKeyValue,
                            content: dueDate + ' ' + dueTime
                          };
                          activsWidgets.push(activDue); //create duration widget;

                          if (duration !== '') {
                            var activDur = {
                              icon: 'CLOCK',
                              title: 'Duration',
                              type: globalKeyValue,
                              content: duration
                            };
                            activsWidgets.push(activDur);
                          }
                        });
                      } //end actives success;

                    } //create organization section and widgets;


                    if (company !== null) {
                      //create organization section;
                      var sectionCompany = {
                        header: 'Organization',
                        isCollapsible: false,
                        widgets: []
                      }; //access widgets;

                      var widgetsCompany = sectionCompany.widgets; //create organization name widget;

                      var companyName = {
                        icon: 'https://cardinsoft.com/wp-content/uploads/2019/04/BUSINESS.png',
                        title: 'Name',
                        type: globalKeyValue,
                        content: company.name
                      };
                      widgetsCompany.push(companyName); //create organization address widget;

                      if (company.address !== null) {
                        var companyAddress = {
                          icon: 'MAP_PIN',
                          title: 'Address',
                          type: globalKeyValue,
                          content: company.address
                        };
                        widgetsCompany.push(companyAddress);
                      }
                    } //end company section; 
                    //create person owner section and widgets;


                    if (owner !== null) {
                      //create owner section;
                      var sectionOwner = {
                        header: 'Contact owner',
                        isCollapsible: true,
                        widgets: []
                      }; //access widgets;

                      var widgetsOwner = sectionOwner.widgets; //create owner name widget;

                      var ownerName = {
                        icon: 'PERSON',
                        title: 'Name',
                        type: globalKeyValue,
                        content: owner.name
                      };
                      widgetsOwner.push(ownerName); //create owner email widget;

                      var ownerEmail = {
                        icon: 'EMAIL',
                        title: 'Email',
                        type: globalKeyValue,
                        content: '<a href="mailto:' + owner.email + '">' + owner.email + '</a>'
                      };
                      widgetsOwner.push(ownerEmail); //create is active widget;

                      var active = 'Inactive',
                          color = '#ff0000';

                      if (owner.active_flag) {
                        active = 'Active';
                        color = '#007A00';
                      }

                      var ownerActive = {
                        type: globalKeyValue,
                        content: '<font color="' + color + '">' + active.toString() + '</font>'
                      };
                      widgetsOwner.push(ownerActive);
                    } //end owner section;
                    //append sections;


                    result.push(sectionPersons);

                    if (sectionCompany) {
                      result.push(sectionCompany);
                    }

                    if (sectionDeals) {
                      result.push(sectionDeals);
                    }

                    if (sectionActivs) {
                      result.push(sectionActivs);
                    }

                    if (sectionOwner) {
                      result.push(sectionOwner);
                    }
                  } //end has match;

                }); //end persons loop;
              } //end persons not null;

            } //end on response success;
            //set content to return;


            returned = {
              code: codePersons,
              headers: '',
              content: JSON.stringify(result)
            }; //print debug info;

            console.log(returned); //return parsed info;

            return _context.abrupt("return", returned);

          case 64:
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

Pipedrive.prototype = Object.create(Connector.prototype);