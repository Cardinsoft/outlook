"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
} //Emulate Class CardSection for CardService service;


var CardSection = function CardSection() {
  _classCallCheck(this, CardSection);

  this.className = 'CardSection';
  this.widgets = [];
  this.collapsible = false;
  this.header;
  this.numUncollapsibleWidgets;
}; //add new methods to the class;


CardSection.prototype.addWidget = function (widget) {
  this.widgets.push(widget);
  return this;
};

CardSection.prototype.setCollapsible = function (collapsible) {
  this.collapsible = collapsible;
  return this;
};

CardSection.prototype.setHeader = function (header) {
  this.header = header;
  return this;
};

CardSection.prototype.setNumUncollapsibleWidgets = function (numUncollapsibleWidgets) {
  this.numUncollapsibleWidgets = numUncollapsibleWidgets;
  return this;
};

CardSection.prototype.appendToUi =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(parent, serialize, sI) {
    var collapsible, uncollapse, section, headerText, header, widgetsWrap, wrapper, widgets, hasInput, formElem, appendWidgetsAsync, _appendWidgetsAsync, toggler;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //access parameters;
            collapsible = this.collapsible;
            uncollapse = this.numUncollapsibleWidgets;

            if (uncollapse && typeof uncollapse !== 'number') {
              uncollapse = +uncollapse;
            } //create section and set its Id number;


            section = document.createElement('div');
            section.id = 'section' + sI;
            section.className = this.className; //if multiple sections -> add separators;

            if (serialize) {
              section.classList.add('separated');
            } //access header text and set section header if provided;


            headerText = this.header;

            if (headerText && headerText !== '') {
              header = document.createElement('p');
              header.className = 'ms-font-m-plus sectionHeader';
              header.textContent = headerText;
              section.append(header);
            } //append widgets wrapper and handle collapsed Ui;


            widgetsWrap = document.createElement('div');

            if (collapsible) {
              widgetsWrap.className = 'collapsible';
            }

            section.append(widgetsWrap); //set wrapper to widgets wrapper;

            wrapper = widgetsWrap; //access widgets and append;

            widgets = this.widgets;

            if (!(widgets.length !== 0)) {
              _context2.next = 21;
              break;
            }

            _appendWidgetsAsync = function _ref3() {
              _appendWidgetsAsync = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(warr, wrapper) {
                var i, widget;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < warr.length)) {
                          _context.next = 8;
                          break;
                        }

                        widget = warr[i];
                        _context.next = 5;
                        return widget.appendToUi(wrapper);

                      case 5:
                        i++;
                        _context.next = 1;
                        break;

                      case 8:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return _appendWidgetsAsync.apply(this, arguments);
            };

            appendWidgetsAsync = function _ref2(_x4, _x5) {
              return _appendWidgetsAsync.apply(this, arguments);
            }; //check if at least one widget is a form input;


            hasInput = widgets.some(function (widget) {
              //access widget's parameters;
              var name = widget.className;
              var hasSwitch = widget.switchToSet; //check if widget is a form element;

              var isFormElem = name === 'TextInput' || name === 'SelectionInput' || hasSwitch; //return true if found;

              if (isFormElem) {
                return widget;
              }
            }); //if found form input -> append form element and set wrapper to form;

            if (hasInput) {
              formElem = document.createElement('form');
              widgetsWrap.append(formElem);
              wrapper = formElem;
            } //append widgets to Ui;	


            _context2.next = 21;
            return appendWidgetsAsync(widgets, wrapper);

          case 21:
            //handle collapsible sections;
            if (collapsible && widgets.length > uncollapse || collapsible && !uncollapse) {
              //create toggler element;
              toggler = document.createElement('div');
              toggler.className = 'toggler centered ms-Icon ms-Icon--ChevronDown pointer';
              section.append(toggler); //add event handler for toggling target element's state;

              toggler.addEventListener('click', function () {
                this.classList.toggle('toggler-up');
              });
            }

            parent.append(section);
            return _context2.abrupt("return", section);

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();