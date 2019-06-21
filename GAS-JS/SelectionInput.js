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

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
} //Emulate Class SelectionInput extending base Class Widget for CardService service;


var SelectionInput =
/*#__PURE__*/
function (_Widget) {
  _inherits(SelectionInput, _Widget);

  function SelectionInput() {
    var _this;

    _classCallCheck(this, SelectionInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectionInput).call(this));
    _this.className = 'SelectionInput';
    _this.fieldName;
    _this.options = [];
    _this.action;
    _this.title;
    _this.type = CardService.SelectionInputType.CHECK_BOX;
    return _this;
  }

  return SelectionInput;
}(Widget); //chain SelectionInput to Widget base class;


SelectionInput.prototype = Object.create(Widget.prototype); //add new methods to the class;

/**
 * Adds options to SelectInput;
 * @param {Object} text
 * @param {Object} value
 * @param {Boolean} selected 
 */

SelectionInput.prototype.addItem = function (text, value, selected) {
  //check if inputs are of string type;
  var isStringText = typeof text === 'string';
  var isStringValue = typeof value === 'string'; //convert non-string inputs to strings;

  if (!isStringText) {
    text = JSON.stringify(text);
  }

  if (!isStringValue) {
    value = JSON.stringify(value);
  } //set option object;


  var option = {
    text: text,
    value: value,
    selected: selected
  };
  this.options.push(option);
  return this;
};

SelectionInput.prototype.setFieldName = function (fieldName) {
  this.fieldName = fieldName;
  return this;
};

SelectionInput.prototype.setOnChangeAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};

SelectionInput.prototype.setTitle = function (title) {
  this.title = title;
  return this;
};

SelectionInput.prototype.setType = function (type) {
  this.type = type;
  return this;
};

SelectionInput.prototype.appendToUi = function (parent) {
  var className = this.className;
  var fieldName = this.fieldName;
  var action = this.action;
  var title = this.title;
  var type = this.type;
  var options = this.options;
  var widget, row, inputWrap; //SelectionInput Ui

  switch (type) {
    case 'CHECK_BOX':
      //set row;
      widget = document.createElement('div');
      widget.className = 'row ' + className;
      parent.append(widget); //set column;

      row = document.createElement('div');
      row.className = 'column';
      widget.append(row); //create inputs;

      options.forEach(function (option) {
        //access option params;
        var text = option.text;
        var value = option.value;
        var checked = option.selected; //set input;

        inputWrap = document.createElement('div');
        inputWrap.className = 'ms-CheckBox';
        row.append(inputWrap); //create input;

        var input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'ms-CheckBox-input';
        input.checked = checked;
        input.value = value;
        input.name = fieldName;
        inputWrap.append(input); //set label class name, append & check;

        var label = document.createElement('label');
        label.className = 'ms-CheckBox-field';
        inputWrap.append(label);

        if (checked) {
          label.classList.add('is-checked');
        }

        if (action) {
          //set refrence;
          setAction(widget, action);
        } //set event listener to widget;


        function curry(widget, input, label) {
          return (
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!input.checked) {
                        input.checked = true;
                      } else {
                        input.checked = false;
                      }

                      _context.next = 3;
                      return label.classList.toggle('is-checked');

                    case 3:
                      if (!action) {
                        _context.next = 6;
                        break;
                      }

                      _context.next = 6;
                      return actionCallback(widget);

                    case 6:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }))
          );
        }

        inputWrap.addEventListener('click', curry(widget, input, label)); //create label text;

        var labelTxt = document.createElement('span');
        labelTxt.className = 'ms-Label';
        labelTxt.textContent = text;
        label.append(labelTxt);
      });
      break;

    case 'RADIO_BUTTON':
      var inputs = [];
      var labels = []; //set row;

      widget = document.createElement('div');
      widget.className = 'row ' + className;
      parent.append(widget); //set column;

      row = document.createElement('div');
      row.className = 'column';
      widget.append(row); //create input group;

      var group = document.createElement('div');
      group.className = 'ms-ChoiceFieldGroup';
      row.append(group); //create input list;

      var list = document.createElement('ul');
      list.className = 'ms-ChoiceFieldGroup-list';
      group.append(list); //create inputs;

      options.forEach(function (option) {
        //access option params;
        var text = option.text;
        var value = option.value;
        var checked = option.selected; //set input;

        inputWrap = document.createElement('li');
        inputWrap.className = 'ms-RadioButton';
        list.append(inputWrap); //set actual input;

        var input = document.createElement('input');
        input.type = 'radio';
        input.className = 'ms-RadioButton-input';
        input.checked = checked;
        input.name = fieldName;
        input.value = value;
        inputWrap.append(input);
        inputs.push(input); //set radio label;

        var label = document.createElement('label');
        label.className = 'ms-RadioButton-field';
        inputWrap.append(label);

        if (checked) {
          label.classList.add('is-checked');
        }

        labels.push(label);

        if (action) {
          //set refrence;
          setAction(widget, action);
        } //set event listener to widget;


        function curry(widget, action, input, inputs, labels) {
          return (
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee2() {
              var isLastChecked;
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      //check if every other radio button is switched off;
                      isLastChecked = input.checked && inputs.every(function (i) {
                        if (input !== i) {
                          return i.checked === false;
                        } else {
                          return true;
                        }
                      });

                      if (isLastChecked) {
                        _context2.next = 4;
                        break;
                      }

                      _context2.next = 4;
                      return inputs.forEach(function (i, index) {
                        if (input === i && !input.checked) {
                          labels[index].classList.add('is-checked');
                          i.checked = true;
                        } else {
                          labels[index].classList.remove('is-checked');
                          i.checked = false;
                        }
                      });

                    case 4:
                      if (!action) {
                        _context2.next = 7;
                        break;
                      }

                      _context2.next = 7;
                      return actionCallback(widget);

                    case 7:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            }))
          );
        }

        inputWrap.addEventListener('click', curry(widget, action, input, inputs, labels)); //create label text;

        var labelTxt = document.createElement('span');
        labelTxt.className = 'ms-Label';
        labelTxt.textContent = text;
        label.append(labelTxt);
      });
      break;

    case 'DROPDOWN':
      //set row;
      widget = document.createElement('div');
      widget.className = 'row ' + this.className;
      parent.append(widget); //set class name and append to row;

      inputWrap = document.createElement('div');
      inputWrap.className = 'ms-Dropdown';
      widget.append(inputWrap); //append title text if provided;

      if (title) {
        var label = document.createElement('label');
        label.className = 'ms-Label SelectionInputTopLabel';
        label.textContent = title;
        inputWrap.append(label);
      } //create chevron;


      var chevron = document.createElement('i');
      chevron.className = 'ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown';
      inputWrap.append(chevron); //create actual select;

      var input = document.createElement('select');
      input.className = 'ms-Dropdown-select';
      input.name = fieldName;
      inputWrap.append(input); //append options;

      options.forEach(function (option) {
        //access option params;
        var text = option.text;
        var value = option.value;
        var selected = option.selected; //create option with params;

        var opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        opt.selected = selected;
        input.append(opt);
      });

      if (action) {
        //set refrence;
        setAction(widget, action); //set event listener to widget;

        input.addEventListener('change',
        /*#__PURE__*/
        _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3() {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return actionCallback(widget);

                case 2:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        })));
      }

      new fabric['Dropdown'](inputWrap); //quick fix for dropdown Ui;

      inputWrap.querySelector('.ms-Dropdown-truncator').classList.add('hidden');
      break;
  }
};