function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

//Emulate base Class Widget for CardService service;
function Widget() {
  this.className = 'Widget';
}
/**
 * TextParagraph constructor function;
 */


function TextParagraph() {
  Widget.call(this);
  this.className = 'TextParagraph';
  this.content;
}

TextParagraph.prototype = Object.create(Widget.prototype);

TextParagraph.prototype.setText = function (text) {
  this.content = text;
  return this;
};

TextParagraph.prototype.appendToUi = function (parent) {
  //append row;
  const widget = document.createElement('div');
  widget.className = 'row ' + this.className;
  parent.append(widget); //append column;

  const wrapText = document.createElement('div');
  wrapText.className = 'column-text';
  widget.append(wrapText); //set widget text;

  const content = document.createElement('span');
  content.className = 'ms-font-m-plus';
  content.innerHTML = this.content;
  wrapText.append(content);
}; //Emulate Class ButtonSet extending base Class Widget for CardService service;


let ButtonSet =
/*#__PURE__*/
function (_Widget) {
  _inherits(ButtonSet, _Widget);

  function ButtonSet() {
    var _this;

    _classCallCheck(this, ButtonSet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ButtonSet).call(this));
    _this.className = 'ButtonSet';
    _this.buttons = [];
    return _this;
  }

  return ButtonSet;
}(Widget); //add new methods to the class;


ButtonSet.prototype.addButton = function (button) {
  this.buttons.push(button);
  return this;
};

ButtonSet.prototype.appendToUi = function (parent) {
  const buttons = this.buttons;
  const length = buttons.length;
  const btnRow = document.createElement('div');
  btnRow.className = 'row ' + this.className;
  parent.append(btnRow);
  buttons.forEach(function (button) {
    const backgroundColor = button.backgroundColor;
    const text = button.text;
    const disabled = button.disabled;
    const textButtonStyle = button.textButtonStyle;
    const action = button.action;
    const openLink = button.openLink;
    const authAction = button.authorizationAction;
    button.appendToUi(btnRow, true);
  });
};