"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

//Emulate Class Switch for CardService service;
let Switch =
/*#__PURE__*/
function (_e_CardService) {
  (0, _inherits2.default)(Switch, _e_CardService);

  function Switch() {
    var _this;

    (0, _classCallCheck2.default)(this, Switch);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Switch).call(this));
    _this.className = 'Switch';
    _this.fieldName;
    _this.action;
    _this.selected;
    _this.value;
    return _this;
  }

  return Switch;
}(e_CardService); //add new methods to the class;


Switch.prototype.setFieldName = function (fieldName) {
  this.fieldName = fieldName;
  return this;
};

Switch.prototype.setOnChangeAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};

Switch.prototype.setSelected = function (selected) {
  this.selected = selected;
  return this;
};

Switch.prototype.setValue = function (value) {
  this.value = value;
  return this;
};

Switch.prototype.appendToUi = function (parent) {
  //access Switch parameters;
  const fieldName = this.fieldName;
  let action = this.action;
  const selected = this.selected;
  const value = this.value; //create toggler paragraph;

  const pToggle = document.createElement('p');
  parent.append(pToggle); //create toggler wrapper and set required parameters;

  const wrapToggle = document.createElement('div');
  wrapToggle.className = 'ms-Toggle ms-font-m-plus ' + this.className;
  pToggle.append(wrapToggle); //create input and set required parameters;

  const input = document.createElement('input');
  input.id = fieldName;
  input.className = 'ms-Toggle-input';
  input.type = 'checkbox';
  input.name = fieldName;
  input.value = value; //append toggler wrap;

  wrapToggle.append(input); //set action if provided;

  if (action) {
    //parse action if found;
    action = JSON.parse(action); //change cursor to pointer on hover;

    widget.classList.add('pointer'); //get unique identifier;

    let id = getId(); //set stringifyed action to global storage;

    e_actions[id] = JSON.stringify(action); //add action reference to widget;

    widget.setAttribute('action', id); //set event listener to widget;

    widget.addEventListener('click',
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
  }

  const label = document.createElement('label');

  if (selected === true || selected === 'true') {
    input.className = 'ms-Toggle-input is-selected';
    label.className = 'ms-Toggle-field is-selected';
  } else {
    input.className = 'ms-Toggle-input';
    label.className = 'ms-Toggle-field';
  } //set state listener;


  wrapToggle.addEventListener('click', function () {
    input.classList.toggle('is-selected');
  }); //append toggle label to wrapper;

  wrapToggle.append(label);
  new fabric['Toggle'](wrapToggle);
};