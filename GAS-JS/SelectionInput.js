"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

//Emulate Class SelectionInput extending base Class Widget for CardService service;
let SelectionInput =
/*#__PURE__*/
function (_Widget) {
  (0, _inherits2.default)(SelectionInput, _Widget);

  function SelectionInput() {
    var _this;

    (0, _classCallCheck2.default)(this, SelectionInput);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SelectionInput).call(this));
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
  const isStringText = typeof text === 'string';
  const isStringValue = typeof value === 'string'; //convert non-string inputs to strings;

  if (!isStringText) {
    text = JSON.stringify(text);
  }

  if (!isStringValue) {
    value = JSON.stringify(value);
  } //set option object;


  const option = {
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
  const className = this.className;
  const fieldName = this.fieldName;
  let action = this.action;
  const title = this.title;
  const type = this.type;
  const options = this.options;
  let widget, row, inputWrap; //SelectionInput Ui

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
        let text = option.text;
        let value = option.value;
        let checked = option.selected; //set input;

        inputWrap = document.createElement('div');
        inputWrap.className = 'ms-CheckBox';
        row.append(inputWrap); //create input;

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'ms-CheckBox-input';
        input.checked = checked;
        input.value = value;
        input.name = fieldName;
        inputWrap.append(input); //set label class name, append & check;

        let label = document.createElement('label');
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
            (0, _asyncToGenerator2.default)(
            /*#__PURE__*/
            _regenerator.default.mark(function _callee() {
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
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
              }, _callee);
            }))
          );
        }

        inputWrap.addEventListener('click', curry(widget, input, label)); //create label text;

        let labelTxt = document.createElement('span');
        labelTxt.className = 'ms-Label';
        labelTxt.textContent = text;
        label.append(labelTxt);
      });
      break;

    case 'RADIO_BUTTON':
      let inputs = [];
      let labels = []; //set row;

      widget = document.createElement('div');
      widget.className = 'row ' + className;
      parent.append(widget); //set column;

      row = document.createElement('div');
      row.className = 'column';
      widget.append(row); //create input group;

      const group = document.createElement('div');
      group.className = 'ms-ChoiceFieldGroup';
      row.append(group); //create input list;

      const list = document.createElement('ul');
      list.className = 'ms-ChoiceFieldGroup-list';
      group.append(list); //create inputs;

      options.forEach(function (option) {
        //access option params;
        let text = option.text;
        let value = option.value;
        let checked = option.selected; //set input;

        inputWrap = document.createElement('li');
        inputWrap.className = 'ms-RadioButton';
        list.append(inputWrap); //set actual input;

        let input = document.createElement('input');
        input.type = 'radio';
        input.className = 'ms-RadioButton-input';
        input.checked = checked;
        input.name = fieldName;
        input.value = value;
        inputWrap.append(input);
        inputs.push(input); //set radio label;

        let label = document.createElement('label');
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
            (0, _asyncToGenerator2.default)(
            /*#__PURE__*/
            _regenerator.default.mark(function _callee2() {
              var isLastChecked;
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
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
              }, _callee2);
            }))
          );
        }

        inputWrap.addEventListener('click', curry(widget, action, input, inputs, labels)); //create label text;

        let labelTxt = document.createElement('span');
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
        let label = document.createElement('label');
        label.className = 'ms-Label SelectionInputTopLabel';
        label.textContent = title;
        inputWrap.append(label);
      } //create chevron;


      const chevron = document.createElement('i');
      chevron.className = 'ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown';
      inputWrap.append(chevron); //create actual select;

      let input = document.createElement('select');
      input.className = 'ms-Dropdown-select';
      input.name = fieldName;
      inputWrap.append(input); //append options;

      options.forEach(function (option) {
        //access option params;
        let text = option.text;
        let value = option.value;
        let selected = option.selected; //create option with params;

        let opt = document.createElement('option');
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
        (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee3() {
          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return actionCallback(widget);

              case 2:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        })));
      }

      new fabric['Dropdown'](inputWrap); //quick fix for dropdown Ui;

      inputWrap.querySelector('.ms-Dropdown-truncator').classList.add('hidden');
      break;
  }
};