function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// The initialize function must be run each time a new page is loaded;
Office.initialize = function (reason) {
  $(document).ready(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var menu;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          //initiate menu with universal actions;
          menu = new Menu();
          menu.create([]);
          $('.navelem').click(function (event) {
            event.stopPropagation();
            event.preventDefault();
            menu.switchShow();
          }); //initiate Services;

          CardService = new e_CardService();
          UrlFetchApp = new e_UrlFetchApp();
          Utilities = new e_Utilities();
          PropertiesService = new e_PropertiesService();
          Session = new e_Session();
          Logger = new e_Logger();
          $('#app-body').show(); //trigger Card;

          _context.next = 12;
          return trigger();

        case 12:
          Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, trigger);

        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
}; //=======================================START Ui Classes======================================//

/**
 * Creates an instance of Menu;
 */


function Menu() {
  this.id = '';
  this.className = 'Menu';
  this.items = {
    cardActions: [],
    universalActions: []
  };
  this.isOpen = false;
  this.element;
}
/**
 * Creates Menu and appends to Ui;
 * @param {Array} items an Array of items to add initially;
 * @returns {Object} this Menu;
 */


Menu.prototype.create = function (items) {
  const self = this;
  const navbar = document.querySelector('.navbar');
  const menu = document.createElement('div');
  menu.classList.add(this.className, 'singulared');
  navbar.append(menu); //set element reference;

  this.id = btoa((menus.length + 1).toString());
  this.element = menu;

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    this.addItem(item, item.isCA);
  } //handle menu close on outside border click;


  const body = document.body;
  menu.addEventListener('pointerover', function () {
    const out = function out() {
      menu.removeEventListener('pointerout', out);

      const switchMenu = function switchMenu() {
        if (self.isOpen) {
          self.switchShow();
        }

        body.removeEventListener('click', switchMenu);
      };

      body.addEventListener('click', switchMenu);
    };

    menu.addEventListener('pointerout', out);
  }); //default to open and push to global context;

  this.isOpen = true;
  menus.push(this);
  return this;
};
/**
 * Adds item to Menu;
 * @param {Object} item item to add;
 * @param {Boolean} isCardAction from where to remove item;
 * @returns {Object} this Menu;
 */


Menu.prototype.addItem = function (item, isCardAction) {
  let self = this;
  let menu = this.element;
  let action = item.action;
  let items = this.items; //create menu item;

  let menuItem = document.createElement('div');

  if (item.classList) {
    item.classList.forEach(function (cl) {
      menuItem.classList.add(cl);
    });
  }

  menuItem.classList.add('menuItem'); //add to CardActions or UniversalActions;

  if (isCardAction) {
    menu.prepend(menuItem);
    items.cardActions.push(item);
  } else {
    menu.append(menuItem);
    items.universalActions.push(item);
  } //set item's icon and text;


  let menuText = document.createElement('p');
  menuText.textContent = item.text;
  let cl = menuText.classList;
  cl.add('menuText');

  if (item.icon) {
    cl.add(item.icon);
  }

  menuItem.append(menuText); //set reference;

  setAction(menuItem, action);
  menuItem.addEventListener('click',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var result, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          self.switchShow(); //perform callback and check if a card should be displayed;

          _context2.next = 3;
          return actionCallback(this);

        case 3:
          result = _context2.sent;
          response = new UniversalActionResponseBuilder();
          _context2.next = 7;
          return response.displayAddOnCards([result]);

        case 7:
          response.build();

        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2, this);
  })));
  return this;
};
/**
 * Removes item from Menu by index;
 * @param {Integer} index item index to remove;
 * @param {Boolean} isCardAction from where to remove item;
 * @returns {Object} this Menu;
 */


Menu.prototype.removeItem = function (index, isCardAction) {
  let items = this.items; //access type-appropriate items;

  if (isCardAction) {
    items = items.cardActions;
  } else {
    items = items.universalActions;
  } //remove item from Menu;


  items.splice(index, 1); //remove item from HtmlElement;

  let menu = menus[0].element;
  menu.children.item(index).remove();
  return this;
};
/**
 * Clears Menu of items;
 * @param {Boolean} isCardAction from where to remove item;
 * @returns {Object} this Menu;
 */


Menu.prototype.clear = function (isCardAction) {
  //clear HtmlElement;
  let menu = menus[0].element;
  let menuItems = menu.children;
  const length = menuItems.length; //skip empty Menus;

  if (menuItems.length > 0) {
    //remove items from Menu;
    for (let i = 0; i < length; i++) {
      this.removeItem(0, isCardAction);
    }
  }

  return this;
};
/**
 * Switches Menu display;
 */


Menu.prototype.switchShow = function () {
  let menu = menus[0].element;
  let cl = menu.classList;

  if (cl.contains('singulared')) {
    this.isOpen = true;
  } else {
    this.isOpen = false;
  }

  menu.classList.toggle('singulared');
};
/**
 * Creates an instance of Selector;
 */


function Selector() {
  this.className = 'Select';
  this.element;
  this.options = [];
  this.isOpen = false;
}

Selector.prototype.create = function (parent, name) {
  //create displayed select wrapper;
  const wrap = document.createElement('div');
  wrap.classList.add(this.className
  /*,'singulared'*/
  );
  parent.append(wrap); //create select for form input;

  const input = document.createElement('select');
  input.name = name;
  input.hidden = true;
  wrap.append(input);
  this.element = wrap;
  return this;
};

Selector.prototype.add = function (items) {
  //add item to instance;
  const opt = this.options;
  const elem = this.element; //add items to select;

  if (items instanceof Array) {
    items.forEach(function (item) {
      opt.push(item);
    });
  } else {
    opt.push(items);
  } //append options to select;


  opt.forEach(function (o) {
    //create displayed option;
    const optionUi = document.createElement('div');
    optionUi.classList.add('selectItem');
    elem.append(optionUi); //create displayed text;

    const text = document.createElement('p');
    text.textContent = o.text;
    text.classList.add('selectText');
    optionUi.append(text); //create option for form input;

    const option = document.createElement('option');
    option.value = o.value;
    elem.children.item(0).append(option);
  });
  return this;
};

Selector.prototype.remove = function (index) {
  //remove item from instance;
  const opt = this.options;
  opt.splice(index, 1);
  this.element.children.item(index + 1).remove();
  return this;
};

Selector.prototype.select = function (index) {
  //select option;
  const opt = this.options;
  const elem = this.element;
  opt[index].selected = true;
  opt.forEach(function (o, idx) {
    if (o.selected && idx !== index) {
      o.selected = false;
    }
  }); //elem.children.item(0).children.item(index).selected = true;

  return this;
};

Selector.prototype.toggle = function () {} //future release;

/** Overlay class */
;

let Overlay =
/*#__PURE__*/
function () {
  function Overlay() {
    _classCallCheck(this, Overlay);

    this.color;
    this.tone;
    this.overlay;
  }
  /**
   * Sets overlay color;
   * @param {String} color color HEX code;
   * @return {Overlay} this Overlay;
   */


  _createClass(Overlay, [{
    key: "setColor",
    value: function setColor(color) {
      this.color = color;
      return this;
    }
  }, {
    key: "setTone",

    /**
     * Sets overlay opacity (color tone);
     * @param {String} tone opacity level;
     * @return {Overlay} this Overlay;
     */
    value: function setTone(tone) {
      this.tone = tone;
      return this;
    }
  }, {
    key: "show",

    /**
     * Adds overlay to Ui;
     * @return {Overlay} this Overlay;
     */
    value: function show() {
      const parent = document.querySelector('#app-overlay');
      const body = document.querySelector('#app-body');
      const c = document.createElement('div'); //set styling;

      let list = c.classList;
      list.add('overlay'); //set color and tone;

      if (this.color) {
        if (this.tone) {
          list.add('overlay-' + this.tone);
        } else {
          list.add('overlay-light');
        }

        c.style.backgroundColor = this.color;
      } //set overlay height to app body height;


      const bodyStyle = window.getComputedStyle(body);
      const bodyHeight = trimPx(bodyStyle.height) + 35;
      c.style.height = bodyHeight + 'px';
      parent.append(c);
      this.overlay = c;
      return this;
    }
  }, {
    key: "hide",

    /**
     * Removes overlay from Ui;
     * @return {Overlay} this Overlay;
     */
    value: function hide() {
      this.overlay.remove();
      return this;
    }
  }]);

  return Overlay;
}();
/**
 * Creates an instance of Spinner;
 */


function Spinner() {
  this.className = 'spinner';
  this.size;
}

Spinner.prototype.setSize = function (size) {
  this.size = 'spinner-' + size;
  return this;
};

Spinner.prototype.show = function () {
  let d = GLOBAL.document;
  let p = d.querySelector('#app-overlay');
  let c = d.createElement('div');
  p.append(c);
  let base = this.className;
  let size = this.size;
  c.className = [base, size].join(' ');
  return this;
};

Spinner.prototype.hide = function () {
  let d = GLOBAL.document;
  let c = d.querySelector('.spinner');
  c.remove();
}; //=======================================END Ui Classes======================================//
//========================================START CALLBACKS======================================//


function dialogCallback(event) {
  var log = '';

  switch (event.error) {
    case 12002:
      log = 'The dialog box has been directed to a page that it cannot find or load, or the URL syntax is invalid.';
      break;

    case 12003:
      log = 'The dialog box has been directed to a URL with the HTTP protocol. HTTPS is required.';
      break;

    case 12006:
      log = 'Dialog closed.';
      break;

    default:
      log = 'Unknown error in dialog box.';
      break;
  }

  timestamp('dialog event', {
    event: log,
    type: 'dialog'
  }, 'log');
}
/**
 * Triggers cardOpen with global event object preserved (panel change issue);
 */


function trigger() {
  return _trigger.apply(this, arguments);
}
/**
 * Handles action response object and returns;
 * @param {Object} obj response object;
 * @return {UniversalActionResponse} response;
 */


function _trigger() {
  _trigger = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var e, o, s, card, response;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          e = new e_EventObject(); //show app body overlay;

          o = new Overlay();
          o.setColor('white');
          o.show('#app-overlay'); //show spinner on overlay;

          s = new Spinner();
          s.setSize('large');
          s.show(); //initialize, build initial Card and response;

          _context4.next = 9;
          return cardOpen(e);

        case 9:
          card = _context4.sent;
          _context4.next = 12;
          return handleResponse(card);

        case 12:
          response = _context4.sent;
          o.hide('#app-overlay');
          s.hide();
          return _context4.abrupt("return", response);

        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _trigger.apply(this, arguments);
}

function handleResponse(_x) {
  return _handleResponse.apply(this, arguments);
}
/**
 * Initiates callback function and updates Ui;
 * @param {HtmlElement} elem caller element;
 * @returns {Function}
 */


function _handleResponse() {
  _handleResponse = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(obj) {
    var response;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.t0 = true;
          _context5.next = _context5.t0 === obj instanceof Card ? 3 : _context5.t0 === obj instanceof ActionResponse ? 8 : 10;
          break;

        case 3:
          response = new UniversalActionResponseBuilder();
          _context5.next = 6;
          return response.displayAddOnCards([obj]);

        case 6:
          return _context5.abrupt("return", response.build());

        case 8:
          return _context5.abrupt("return", obj);

        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _handleResponse.apply(this, arguments);
}

function actionCallback(_x2) {
  return _actionCallback.apply(this, arguments);
} //==========================================END CALLBACKS=======================================//
//=========================================START UTILITIES======================================//

/**
 * Matches input for being a mailto anchor and sets event listener;
 * @param {HtmlElement} element element to set listeners;
 * @param {String} input <a> html tag string to check;
 */


function _actionCallback() {
  _actionCallback = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(elem) {
    var action, e, forms, f, form, inputs, i, input, name, value, cl, valueIndiff, isSelected, exists, a, functionName, loadIndicator, params, result, o, s;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          //access action by its identifier;
          action = e_actions[elem.getAttribute('action')]; //construct event object;

          e = new e_EventObject(); //get form and access formInputs;

          forms = document.getElementsByTagName('form'); //if has forms -> set event objects formInput and formInputs params;

          if (forms.length > 0) {
            for (f = 0; f < forms.length; f++) {
              form = forms.item(f); //access form parameters;

              inputs = form.elements;

              for (i = 0; i < inputs.length; i++) {
                input = inputs.item(i); //access input parameter;

                name = input.name;
                value = input.value; //set formInput and formInputs properties;

                if (name !== '') {
                  //temp solution to check for Switches & Checkboxes;
                  cl = input.classList;
                  valueIndiff = cl.contains('ms-Toggle-input') || cl.contains('ms-CheckBox-input') || cl.contains('ms-RadioButton-input');

                  if (valueIndiff) {
                    isSelected = cl.contains('is-selected') || input.checked;
                    exists = Object.keys(e.formInput).some(function (key) {
                      return key === name;
                    });

                    if (isSelected) {
                      e.formInput[name] = value;

                      if (!exists) {
                        e.formInputs[name] = [value];
                      } else {
                        e.formInputs[name].push(value);
                      }
                    } else {
                      delete e.formInput[name];

                      if (!exists) {
                        e.formInputs[name] = [];
                      } else {
                        e.formInputs[name].splice(e.formInputs[name].indexOf(value), 1);
                      }
                    }
                  } else {
                    e.formInput[name] = value;
                    e.formInputs[name] = [value];
                  }
                }
              }
            }
          } //parse action object;


          a = JSON.parse(action); //access action parameters;

          functionName = a.functionName;
          loadIndicator = a.loadIndicator;
          params = a.parameters; //set parameters to event object;

          e.parameters = params;

          if (!(loadIndicator || loadIndicator !== 'NONE')) {
            _context6.next = 26;
            break;
          }

          o = new Overlay();
          o.setColor('white');
          o.show('#app-overlay');
          s = new Spinner();
          s.setSize('large');
          s.show(); //invoke callback and await response;

          _context6.next = 18;
          return GLOBAL[functionName](e);

        case 18:
          result = _context6.sent;

          if (!(result === undefined)) {
            _context6.next = 22;
            break;
          }

          _context6.next = 22;
          return Utilities.sleep(500);

        case 22:
          o.hide();
          s.hide();
          _context6.next = 29;
          break;

        case 26:
          _context6.next = 28;
          return GLOBAL[functionName](e);

        case 28:
          result = _context6.sent;

        case 29:
          return _context6.abrupt("return", result === undefined ? {} : result);

        case 30:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _actionCallback.apply(this, arguments);
}

function loadMailto(element, input) {
  element.addEventListener('click', function (event) {
    event.preventDefault(); //set parameters for Compose Ui;

    let mailParams = {
      toRecipients: [input]
    };
    Office.context.mailbox.displayNewMessageForm(mailParams);
    return false;
  });
}
/**
 * Matches input for being an anchor and sets event listener;
 * @param {HtmlElement} element element to set listeners;
 * @param {String} input <a> html tag string to check;
 */


function loadAnchor(element, input) {
  element.addEventListener('click', function (event) {
    event.preventDefault();
    Office.context.ui.displayDialogAsync('https://cardinsoft.github.io/outlook/redirect?endpoint=' + input, {
      width: 50,
      height: 50
    });
    return false;
  });
}
/**
 * Matches input for being a tel link and sets event listener;
 * @param {HtmlElement} element element to set listeners;
 * @param {String} input <a> html tag string to check;
 */


function loadTel(element, input) {
  element.addEventListener('click', function (event) {
    event.stopPropagation();
    element.target = '_self';
    return false;
  });
}
/**
 * Utility function to convert html string to DOM tree;
 * @param {HtmlElement} parent element to hook to;
 * @param {String} tagged string with html markup;
 * @return {HtmlElement} updated parent element;
 */


function toDOM(parent, tagged) {
  const reg = /(<\w+.*?>)|(<\/\w+.*?>)/;
  let t = tagged.split(reg).filter(function (e) {
    return e;
  });
  const otag = /<(\w+)(.*?)>/;
  const ctag = /<\/(\w+).*?>/;
  let depth = 0,
      collection = parent,
      tag;
  t.forEach(function (e) {
    switch (true) {
      case otag.test(e):
        //opening tag;
        tag = e.match(otag)[1];
        let sub = document.createElement(tag);

        if (tag === 'font' || tag === 'a' || tag === 'b' || tag === 'i' || tag === 'u' || tag === 's') {
          let attrs = e.match(otag)[2].split(' ').filter(function (a) {
            return a;
          });
          attrs.forEach(function (at) {
            let keyval = at.split('="');
            let key = keyval[0];

            if (key === 'color' || key === 'href') {
              let value = keyval[1].slice(0, keyval[1].length - 1);
              sub[key] = value;
            }
          });

          if (depth) {
            let collection = parent;

            for (c = 0; c < depth; c++) {
              collection = collection.children[collection.children.length - 1];
            }

            collection.appendChild(sub);
          } else {
            parent.appendChild(sub);
          }

          depth++;
        }

        break;

      case ctag.test(e):
        //closing tag;
        tag = e.match(ctag)[1];

        if (tag === 'font' || tag === 'a' || tag === 'b' || tag === 'i' || tag === 'u' || tag === 's') {
          depth--;
        }

        break;

      default:
        //simple text;
        if (depth) {
          let collection = parent;

          for (c = 0; c < depth; c++) {
            collection = collection.children[collection.children.length - 1];
          }

          collection.insertAdjacentText('beforeend', e);
        } else {
          parent.insertAdjacentText('beforeend', e);
        }

    }
  });
  return parent;
}
/**
 * Appends https method to URL if none;
 * @param {String} input 
 **/


function forceHttps(input) {
  const https = /^https:\/\//;
  const http = /^http:\/\//;
  const isSecure = https.test(input);
  const isMethod = http.test(input);

  if (!isSecure && !isMethod) {
    input = 'https://' + input;
  } else if (isMethod) {
    input = 'https://' + input.substring(7);
  }

  return input;
}
/**
 * Gets base64-encoded "random" Id;
 * @returns {String|Function}
 */


function getId() {
  let id = GLOBAL.btoa(Math.random().toString());

  const isUnique = function (a, i) {
    let result = true;

    for (let p in a) {
      if (a[p].id === i) {
        result = false;
      }
    }

    return result;
  }(e_actions, id);

  if (isUnique) {
    return id;
  } else {
    return getId();
  }
}
/**
 * Processes action and sets reference to widget;
 * @param {HtmlElement} element element on which to set reference;
 * @param {String} action stringifyed action object;
 */


function setAction(element, action) {
  //parse action if found;
  action = JSON.parse(action); //change cursor to pointer on hover;

  element.classList.add('pointer'); //get unique identifier;

  let id = getId(); //set stringifyed action to global storage;

  e_actions[id] = JSON.stringify(action); //add action reference to widget;

  element.setAttribute('action', id);
}
/**
 * Trims property value of pixel measurements;
 * @param {String|*} input property value (expected type string);
 * @returns {Integer|undefined}
 */


function trimPx(input) {
  if (input && typeof input === 'string') {
    return Math.ceil(+input.replace('px', ''));
  }
}
/**
 * Set height to computed from number of uncollapsible widgets;
 * @param {Integer} numuncol number of widgets to show;
 * @param {HtmlElement} overlay wrapper element to uncollapse;
 * @return {Integer} height to keep uncollapsed;
 */


function uncollapsible(numuncol, overlay) {
  if (!numuncol) {
    return 0;
  } //access children;


  const children = overlay.children;
  const chLength = children.length;
  let fullHeight = 0;

  for (let c = 0; c < chLength; c++) {
    let child = children[c];
    let computed = window.getComputedStyle(child);
    let computedT = trimPx(computed.marginTop);
    let computedH = trimPx(computed.height);
    let computedB = trimPx(computed.marginBottom);

    if (c < numuncol) {
      if (c === 0) {
        fullHeight += computedT + computedH;
      } else {
        fullHeight += computedB + computedH;
      }
    }
  }

  return fullHeight;
}
/**
 * Expands or collapses element;
 * @param {HtmlElement} trigger element trggering event;
 * @param {Htmlelement} overlay element to toggle;
 * @param {String} property property to animate;
 * @param {Integer} interval delay between incremenets;
 * @param {Integer} increment animation speed;
 * @param {Integer} initial initial value to start from;
 */


function collapse(trigger, overlay, property, interval, increment, initial) {
  return (
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var chProperty, children, end, change, i, chcomp, chMargin, computed, t;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            //compute child elems height;
            chProperty = 0, children = overlay.children, end = initial, change = increment;

            for (i = 0; i < children.length; i++) {
              chcomp = window.getComputedStyle(children.item(i));
              chProperty += trimPx(chcomp[property]);

              if (property === 'height') {
                if (i > 0) {
                  chMargin = trimPx(chcomp.marginBottom);
                } else {
                  chMargin = trimPx(chcomp.marginTop);
                }

                chProperty += chMargin;
              }
            } //compute and set height to element;


            computed = trimPx(window.getComputedStyle(overlay)[property]);
            overlay.style[property] = computed + 'px'; //if element is collapsed -> inverse increment;

            if (computed === initial) {
              change = -increment;
              end = chProperty;
            } //set recursive timeout to change height;


            t = setTimeout(function wait() {
              trigger.disabled = true;
              let newProp = trimPx(overlay.style[property]) - change;

              if (newProp < initial) {
                newProp = initial;
              }

              if (newProp > chProperty) {
                newProp = chProperty;
              } //if(end>initial&&newProp>end) {  newProp = end; }


              overlay.style[property] = newProp + 'px';
              let currProp = trimPx(overlay.style[property]);
              let stop = false;

              switch (true) {
                //uncollapsed;
                case computed > initial:
                  if (currProp <= end) {
                    stop = true;
                  }

                  break;
                //collapsed;

                case computed === initial:
                  if (currProp >= end) {
                    stop = true;
                  }

                  break;
              }

              if (stop) {
                trigger.disabled = false;
                return clearTimeout(t);
              }

              t = setTimeout(wait, interval);
            }, interval);

          case 6:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))
  );
} //===========================================END UTILITIES======================================//
//=======================================START GLOBAL OBJECTS===================================//
//emulate event object;


function e_EventObject() {
  this.messageMetadata = {
    accessToken: '',
    messageId: ''
  };
  this.formInput = {};
  this.clientPlatform;
  this.formInputs = {};
  this.parameters = {};
  this.userLocale;
  this.userTimezone = {
    offset: '',
    id: ''
  };
}

const cardStack = [];
const menus = [];
const GLOBAL = this;
const e_actions = {};
let Utilities;
let PropertiesService;
let Session;
let CardService;
let UrlFetchApp; //=======================================START POLYFILLS===================================//

const HtmlElement = GLOBAL.HTMLElement;
const Element = GLOBAL.Element; //polyfill for empty() method of HtmlElement;

if (!HtmlElement.prototype.empty) {
  HtmlElement.prototype.empty = function () {
    let chd = this.children;

    for (let c = 0; c < chd.length; c++) {
      let child = chd.item(c);
      this.removeChild(child);
    }
  };
} //polyfill for prepend() method of Element;


if (!Element.prototype.prepend) {
  Element.prototype.prepend = function (elem) {
    this.insertBefore(elem, this.children.item(0));
  };
} //polyfill for append() method of Element;


if (!Element.prototype.append) {
  Element.prototype.append = function (elem) {
    this.appendChild(elem);
  };
} //polyfill for remove() method of HtmlElement;


if (!HtmlElement.prototype.remove) {
  HtmlElement.prototype.remove = function () {
    let prt = this.parentElement;
    prt.removeChild(this);
  };
} //poltfill for add() method of classList property of HtmlElement;


const DOMTokenList = GLOBAL.DOMTokenList;
const addToken = DOMTokenList.prototype.add;

DOMTokenList.prototype.add = function () {
  for (let i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    addToken.call(this, arg);
  }
};