function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * KeyValue class;
 */
let KeyValue = function KeyValue() {
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
};
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
 * Sets this widget's text content;
 * @param {String} text content to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setContent = function (text) {
  this.content = text;
  return this;
};
/**
 * Sets one of the predefined icons from CardService Enum;
 * @param {String} icon icon name from CardService Enum;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setIcon = function (icon) {
  //acces Icons Enum and check for match;
  const icons = new e_CardService().Icon;

  for (let key in icons) {
    if (icons[key] === icon) {
      this.icon = icons[key];
    }
  }

  return this;
};
/**
 * Sets image URL to append to widget as icon;
 * @param {String} url path to image;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setIconUrl = function (url) {
  this.url = url;
  return this;
};
/**
 * Sets alt text for image acting as widget icon;
 * @param {String} altText text to display on source fail;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setIconAltText = function (altText) {
  this.altText = altText;
  return this;
};
/**
 * Determines whether to display widget text as multiline or truncated single-line;
 * @param {Boolean} multiline truthy value to set multiline property to;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setMultiline = function (multiline) {
  this.multiline = multiline;
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
 * Sets this widget's title text to top;
 * @param {String} text title text to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setTopLabel = function (text) {
  this.topLabel = text;
  return this;
};
/**
 * Sets this widget's title text to bottom;
 * @param {String} text title text to set;
 * @return {KeyValue} this widget;
 */


KeyValue.prototype.setBottomLabel = function (text) {
  this.bottomLabel = text;
  return this;
};
/**
 * Utility function appending KeyValue widget to Ui;
 * @param {HtmlElement} parent parent element to append to;
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
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              event.stopPropagation();
              return _context.abrupt("return", actionCallback(this));

            case 2:
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

  let content = this.content;
  const matched = content.match(/<.+?>.+?<\/.+?>|.+?(?=<)|.+/g) || [];
  const freg = /<font color="(.+?)">(.+?)<\/font>/;
  const fbld = /<b>.+?<\/b>/;
  const fund = /<u>.+?<\/u>/;
  const fitl = /<i>.+?<\/i>/;
  const fstr = /<s>.+?<\/s>/;
  const fmail = /<a\s*?href="mailto:(.+?)"\s*?>.*?<\/a>/;
  const ftel = /<a\s*?href="tel:(.+?)"\s*?>.*?<\/a>/;
  const fancr = /<a\s*?href="(?!mailto:)(.+?)"\s*?>.*?<\/a>/;
  matched.forEach(function (ftag) {
    let mtext = ftag.match(/<.+?>(.+?)<\/.+?>/);
    let font = ftag.match(freg) || [];
    let mailto = ftag.match(fmail) || [];
    let tel = ftag.match(ftel) || [];
    let anchor = ftag.match(fancr) || [];
    let isB = fbld.test(ftag);
    let isU = fund.test(ftag);
    let isI = fitl.test(ftag);
    let isS = fstr.test(ftag);
    let subelem;

    switch (true) {
      case font.length > 0:
        subelem = document.createElement('span');
        subelem.style.color = font[1];
        break;

      case tel.length > 0:
        subelem = document.createElement('a');
        subelem.href = "tel:".concat(encodeURI(tel[1]));
        loadTel(subelem, tel[1]);
        break;

      case mailto.length > 0:
        subelem = document.createElement('a');
        subelem.href = "mailto:".concat(encodeURI(mailto[1]));
        loadMailto(subelem, mailto[1]);
        break;

      case anchor.length > 0:
        subelem = document.createElement('a');
        subelem.href = "".concat(encodeURI(anchor[1]));
        loadAnchor(subelem, anchor[1]);
        break;

      case isB:
        subelem = document.createElement('b');
        break;

      case isU:
        subelem = document.createElement('u');
        break;

      case isI:
        subelem = document.createElement('i');
        break;

      case isS:
        subelem = document.createElement('s');
        break;

      default:
        contentText.insertAdjacentText('beforeend', ftag);
    }

    if (font.length > 0 || isB || isU || isI || isS || mailto.length > 0 || anchor.length > 0) {
      subelem.innerText = mtext[1];
      contentText.append(subelem);
    }
  });

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