function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Image widget constructor function;
 */
function Image() {
  this.className = 'Image';
  this.src;
  this.alt = '';
  this.action;
  this.authorizationAction;
  this.openLink;
  this.composedEmailType;
}
/**
 * Sets alternative text to display when image isn't available;
 * @returns {Image} this Image widget;
 */


Image.prototype.setAltText = function (altText) {
  this.alt = altText;
  return this;
};
/**
 * Sets AuthorizationAction to Image;
 * @param {Action} action action to set;
 * @returns {Image} this Image widget; 
 */


Image.prototype.setAuthorizationAction = function (action) {
  this.authorizationAction = JSON.stringify(action);
  return this;
};
/**
 * Sets ComposeAction to Image;
 * @param {Action} action action to set;
 * @param {composedEmailType} composedEmailType email type to compose;
 * @returns {Image} this Image widget;
 */


Image.prototype.setComposeAction = function (action, composedEmailType) {
  this.action = JSON.stringify(action);
  this.composedEmailType = composedEmailType;
  return this;
};
/**
 * Sets image URL to display;
 * @param {String} url URL of the image;
 * @returns {Image} this Image widget;
 */


Image.prototype.setImageUrl = function (url) {
  this.src = url;
  return this;
};
/**
 * Sets Action to Image;
 * @param {Action} action action to set;
 * @returns {Image} this Image widget;
 */


Image.prototype.setOnClickAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};
/**
 * Sets OpenLink Action with a callback to Image;
 * @param {Action} action action to set;
 * @returns {Image} this Image widget;
 */


Image.prototype.setOnClickOpenLinkAction = function (action) {
  this.action = JSON.stringify(action);
  return this;
};
/**
 * Sets OpenLink Action to Image;
 * @param {OpenLink} openLink openLink action to set;
 * @returns {Image} this Image widget;
 */


Image.prototype.setOpenLink = function (openLink) {
  this.openLink = JSON.stringify(openLink);
  return this;
};
/**
 * Utility function appending Image widget to Ui;
 * @param {HtmlElement} parent parent element to append to;
 */


Image.prototype.appendToUi = function (parent) {
  //access parameters;
  let source = this.src;
  let altText = this.alt;
  let action = this.action;
  let authAction = this.authorizationAction;
  let openAction = this.openLink; //create row element;

  const widget = document.createElement('div');
  widget.className = 'row ' + this.className;
  parent.append(widget); //create image display;

  if (source) {
    const image = document.createElement('img');
    image.alt = altText;
    image.src = source;
    widget.append(image);
  } //add event listener chain ( click -> callback );


  if (action || openAction) {
    //set refrence;
    if (openAction) {
      action = openAction;
    }

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
  }
};