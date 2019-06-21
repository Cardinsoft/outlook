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
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
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
} //Emulate Class Switch for CardService service;


let Switch =
/*#__PURE__*/
function (_e_CardService) {
  _inherits(Switch, _e_CardService);

  function Switch() {
    var _this;

    _classCallCheck(this, Switch);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Switch).call(this));
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
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
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