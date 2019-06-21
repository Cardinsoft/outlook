"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

//Emulate Class TextInput for base Class Widget for CacheService service;
let TextInput =
/*#__PURE__*/
function (_Widget) {
  (0, _inherits2.default)(TextInput, _Widget);

  function TextInput() {
    var _this;

    (0, _classCallCheck2.default)(this, TextInput);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TextInput).call(this));
    _this.className = 'TextInput';
    _this.fieldName = '';
    _this.hint;
    _this.multiline;
    _this.action; //this.suggestions;
    //this.suggestionsAction;

    _this.title;
    _this.value;
    return _this;
  }

  return TextInput;
}(Widget); //add new methods to the class;


TextInput.prototype.setFieldName = function (fieldName) {
  this.fieldName = fieldName;
  return this;
};

TextInput.prototype.setHint = function (hint) {
  this.hint = hint;
  return this;
};

TextInput.prototype.setMultiline = function (multiline) {
  this.multiline = multiline;
  return this;
};

TextInput.prototype.setOnChangeAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};

TextInput.prototype.setTitle = function (title) {
  this.title = title;
  return this;
};

TextInput.prototype.setValue = function (value) {
  this.value = value;
  return this;
};

TextInput.prototype.appendToUi = function (parent) {
  const fieldName = this.fieldName;
  let action = this.action;
  const value = this.value;
  const multiline = this.multiline;
  const title = this.title;
  const hint = this.hint;
  const widget = document.createElement('div');
  widget.className = 'row ' + this.className;
  parent.append(widget);
  const row = document.createElement('div');
  row.className = 'column';
  widget.append(row); //append title text if provided;

  if (title) {
    const topLabel = document.createElement('label');
    topLabel.className = 'ms-fontSize-s TextInputTopLabel';
    topLabel.textContent = title;
    row.append(topLabel);
  }

  const inputWrap = document.createElement('div');
  inputWrap.className = 'ms-TextField ms-TextField--underlined';
  row.append(inputWrap);
  const label = document.createElement('label');
  label.className = 'ms-Label TextInputLabel';
  inputWrap.append(label); //create input element (via input or textarea);

  let input;

  if (multiline) {
    input = document.createElement('textarea');
  } else {
    input = document.createElement('input');
    input.type = 'text';
  }

  input.className = 'ms-TextField-field TextInputInput';
  input.value = value;
  input.name = fieldName;
  input.addEventListener('keypress', function (e) {
    if (e.charCode === 13) {
      e.preventDefault();
      this.value += '\r';
    }
  }); //set optional parameters to input;

  if (action) {
    //parse action if found;
    action = JSON.parse(action); //change cursor to pointer on hover;

    widget.classList.add('pointer'); //get unique identifier;

    let id = getId(); //set stringifyed action to global storage;

    e_actions[id] = JSON.stringify(action); //add action reference to widget;

    widget.setAttribute('action', id); //set event listener to widget;

    widget.addEventListener('focusout',
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return actionCallback(this);

          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    })));
  } //append input to wrapper;


  inputWrap.append(input); //initiate Fabric;

  new fabric['TextField'](inputWrap); //append hint text if provided;

  if (hint) {
    const bottomLabel = document.createElement('label');
    bottomLabel.className = 'ms-fontSize-s TextInputBottomLabel';
    bottomLabel.textContent = hint;
    row.append(bottomLabel);
  }
};