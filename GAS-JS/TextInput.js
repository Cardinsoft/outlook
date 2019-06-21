"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

//Emulate Class TextInput for base Class Widget for CacheService service;
var TextInput =
/*#__PURE__*/
function (_Widget) {
  _inherits(TextInput, _Widget);

  function TextInput() {
    var _this;

    _classCallCheck(this, TextInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextInput).call(this));
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
  var fieldName = this.fieldName;
  var action = this.action;
  var value = this.value;
  var multiline = this.multiline;
  var title = this.title;
  var hint = this.hint;
  var widget = document.createElement('div');
  widget.className = 'row ' + this.className;
  parent.append(widget);
  var row = document.createElement('div');
  row.className = 'column';
  widget.append(row); //append title text if provided;

  if (title) {
    var topLabel = document.createElement('label');
    topLabel.className = 'ms-fontSize-s TextInputTopLabel';
    topLabel.textContent = title;
    row.append(topLabel);
  }

  var inputWrap = document.createElement('div');
  inputWrap.className = 'ms-TextField ms-TextField--underlined';
  row.append(inputWrap);
  var label = document.createElement('label');
  label.className = 'ms-Label TextInputLabel';
  inputWrap.append(label); //create input element (via input or textarea);

  var input;

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

    var id = getId(); //set stringifyed action to global storage;

    e_actions[id] = JSON.stringify(action); //add action reference to widget;

    widget.setAttribute('action', id); //set event listener to widget;

    widget.addEventListener('focusout',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return actionCallback(this);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
  } //append input to wrapper;


  inputWrap.append(input); //initiate Fabric;

  new fabric['TextField'](inputWrap); //append hint text if provided;

  if (hint) {
    var bottomLabel = document.createElement('label');
    bottomLabel.className = 'ms-fontSize-s TextInputBottomLabel';
    bottomLabel.textContent = hint;
    row.append(bottomLabel);
  }
};