function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate base Class Widget for CardService service;
let Widget = function Widget() {
  _classCallCheck(this, Widget);

  this.className = 'Widget';
};
/** TextParagraph class */


let TextParagraph =
/*#__PURE__*/
function (_Widget) {
  _inherits(TextParagraph, _Widget);

  function TextParagraph() {
    var _this;

    _classCallCheck(this, TextParagraph);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextParagraph).call(this));
    _this.className = 'TextParagraph';
    _this.content;
    return _this;
  }
  /**
   * Sets widget's content text;
   * @param {String} text text to set;
   * @return {TextParagraph} this TextParagraph;
   */


  _createClass(TextParagraph, [{
    key: "setText",
    value: function setText(text) {
      this.content = text;
      return this;
    }
  }, {
    key: "appendToUi",

    /**
     * Utility function appending TextParagraph widget to Ui;
     * @param {HtmlElement} parent element to append to;
     * @return {HtmlElement} built widget;
     */
    value: function appendToUi(parent) {
      //append row;
      const widget = document.createElement('div');
      widget.className = 'row ' + this.className;
      parent.append(widget); //append column;

      const wrapText = document.createElement('div');
      wrapText.className = 'column-text';
      widget.append(wrapText); //set widget text;

      const contentText = document.createElement('span');
      contentText.className = 'ms-font-m-plus';
      wrapText.append(contentText); //create content text element;

      const content = this.content || '';
      toDOM(contentText, content);
      loadMailto(contentText, content);
      loadAnchor(contentText, content);
      loadTel(contentText, content);
      return widget;
    }
  }]);

  return TextParagraph;
}(Widget);
/** ButtonSet class */


let ButtonSet =
/*#__PURE__*/
function (_Widget2) {
  _inherits(ButtonSet, _Widget2);

  function ButtonSet() {
    var _this2;

    _classCallCheck(this, ButtonSet);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ButtonSet).call(this));
    _this2.className = 'ButtonSet';
    _this2.buttons = [];
    return _this2;
  }
  /**
   * Adds a button to the set;
   * @param {ImageButton||TextButton} button to add;
   * @return {ButtonSet} this ButtonSet;
   */


  _createClass(ButtonSet, [{
    key: "addButton",
    value: function addButton(button) {
      this.buttons.push(button);
      return this;
    }
    /**
     * Utility function appending ButtonSet widget to Ui;
     * @param {HtmlElement} parent element to append to;
     * @return {HtmlElement} built widget;
     */

  }, {
    key: "appendToUi",
    value: function appendToUi(parent) {
      const buttons = this.buttons;
      const length = buttons.length;
      const widget = document.createElement('div');
      widget.className = 'row ' + this.className;
      parent.append(widget);
      buttons.forEach(function (button) {
        const backgroundColor = button.backgroundColor;
        const text = button.text;
        const disabled = button.disabled;
        const textButtonStyle = button.textButtonStyle;
        const action = button.action;
        const openLink = button.openLink;
        const authAction = button.authorizationAction;
        button.appendToUi(widget, true);
      });
      return widget;
    }
  }]);

  return ButtonSet;
}(Widget);