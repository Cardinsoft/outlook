function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** KeyValue class */
let KeyValue =
/*#__PURE__*/
function () {
  function KeyValue() {
    _classCallCheck(this, KeyValue);

    this.className = 'KeyValue';
    this.button;
    this.content;
    this.icon;
    this.altText;
    this.url;
    this.multiline = true;
    this.switchToSet;
    this.topLabel;
    this.bottomLabel;
    this.action;
    this.authorizationAction;
    this.openLink;
    this.composedEmailType;
  }
  /**
   * Sets one of the predefined icons from CardService Enum;
   * @param {String} icon icon name from CardService Enum;
   * @return {KeyValue} this widget;
   */


  _createClass(KeyValue, [{
    key: "setIcon",
    value: function setIcon(icon) {
      if (!icon) {
        throw new Error('Invalid icon');
      }

      this.icon = icon;
      return this;
    }
  }, {
    key: "setIconUrl",

    /**
     * Sets image URL to append to widget as icon;
     * @param {String} url path to image;
     * @return {KeyValue} this widget;
     */
    value: function setIconUrl(url) {
      this.url = url;
      return this;
    }
    /**
     * Sets alt text for image acting as widget icon;
     * @param {String} altText text to display on source fail;
     * @return {KeyValue} this widget;
     */

  }, {
    key: "setIconAltText",
    value: function setIconAltText(altText) {
      this.altText = altText;
      return this;
    }
  }, {
    key: "setTopLabel",

    /**
     * Sets this widget's title text to top;
     * @param {String} text title text to set;
     * @return {KeyValue} this widget;
     */
    value: function setTopLabel(text) {
      this.topLabel = text;
      return this;
    }
  }, {
    key: "setContent",

    /**
     * Sets this widget's text content;
     * @param {String} text content to set;
     * @return {KeyValue} this widget;
     */
    value: function setContent(text) {
      this.content = text;
      return this;
    }
  }, {
    key: "setBottomLabel",

    /**
     * Sets this widget's title text to bottom;
     * @param {String} text title text to set;
     * @return {KeyValue} this widget;
     */
    value: function setBottomLabel(text) {
      this.bottomLabel = text;
      return this;
    }
  }, {
    key: "setMultiline",

    /**
     * Determines whether to display widget text as multiline or truncated single-line;
     * @param {Boolean} multiline truthy value to set multiline property to;
     * @return {KeyValue} this widget;
     */
    value: function setMultiline(multiline) {
      this.multiline = multiline;
      return this;
    }
  }]);

  return KeyValue;
}();
/**
 * Set authorization action to KeyValue;
 * @param {AuthorizationAction} action action to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setAuthorizationAction = function (action) {
  this.authorizationAction = JSON.stringify(action);
  return this;
};
/**
 * Set compose action to KeyValue;
 * @param {Action} action action to set;
 * @param {composedEmailType} composedEmailType email type to compose;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setComposeAction = function (action, composedEmailType) {
  this.action = JSON.stringify(action);
  this.composedEmailType = composedEmailType;
  return this;
};
/**
 * Set onclick action to KeyValue;
 * @param {Action} action action to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setOnClickAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};
/**
 * Set OpenLink action to KeyValue;
 * @param {Action} action action to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setOnClickOpenLinkAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};
/**
 * Set OpenLink to KeyValue;
 * @param {OpenLink} openLink openLink action to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setOpenLink = function (openLink) {
  this.openLink = JSON.stringify(openLink);
  return this;
};
/**
 * Sets Button to this widget if provided;
 * @param {TextButton} button TextButton widget to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setButton = function (button) {
  this.button = button;
  return this;
};
/**
 * Sets a Switch widget on this widget;
 * @param {Switch} switchToSet Switch widget to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setSwitch = function (switchToSet) {
  this.switchToSet = switchToSet;
  return this;
};
/**
 * Utility function appending KeyValue widget to Ui;
 * @param {HtmlElement} parent element to append to;
 * @return {HtmlElement} built widget;
 */


KeyValue.prototype.appendToUi = function (parent) {
  //access parameters;
  let action = this.action;
  const iconUrl = this.url;
  const icon = this.icon; //create row element;

  const widget = document.createElement('div');
  widget.className = 'row ' + this.className;
  parent.append(widget); //add event listener chain ( click -> callback );

  if (action) {
    //set refrence;
    setAction(widget, action); //set event listener to widget;

    widget.addEventListener('click',
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(event) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return actionCallback(this);

            case 2:
              result = _context.sent;
              return _context.abrupt("return", handleResponse(result));

            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  } //handle image creation;


  if (iconUrl || icon) {
    const wrapImg = document.createElement('div');
    wrapImg.className = 'column-icon';
    widget.append(wrapImg);
    const img = document.createElement('img');
    img.className = 'KeyValueImage';

    if (iconUrl) {
      img.src = iconUrl;
    } else {
      img.src = icon;
    }

    if (this.altText) {
      img.alt = this.altText;
    }

    wrapImg.append(img);
  } //handle label and content creation;


  const wrapText = document.createElement('div');
  wrapText.className = 'column-text';
  widget.append(wrapText);

  if (this.topLabel) {
    const label = document.createElement('label');
    label.className = 'ms-fontSize-s KeyValueTopLabel';
    label.textContent = this.topLabel;
    wrapText.append(label);
  }

  const contentText = document.createElement('span');
  contentText.className = 'ms-font-m-plus KeyValueText';
  wrapText.append(contentText); //create content text element;

  toDOM(contentText, this.content || '');

  if (this.bottomLabel) {
    const hint = document.createElement('label');
    hint.className = 'ms-fontSize-s KeyValueBottomLabel';
    hint.textContent = this.bottomLabel;
    wrapText.append(hint);
  } //handle button or switch creation;


  const btn = this.button;
  const sw = this.switchToSet;

  if (btn || sw) {
    const wrapButton = document.createElement('div');
    wrapButton.className = 'column-label';
    widget.append(wrapButton);

    if (btn) {
      btn.appendToUi(wrapButton, true);
    }

    if (sw) {
      sw.appendToUi(wrapButton);
    }
  }

  return widget;
};