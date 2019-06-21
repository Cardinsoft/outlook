"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

//Emulate Class CardBuilder for CardService service;
let CardBuilder = function CardBuilder() {
  (0, _classCallCheck2.default)(this, CardBuilder);
  this.className = 'CardBuilder';
  this.actions = [];
  this.sections = [];
  this.cardHeader;
  this.name;
};
/**
 * Adds Card action (multiple actions allowed);
 * @param {CardAction) action CardAction class instance;
 * @returns {CardBuilder} this CardBuilder;
 */


CardBuilder.prototype.addCardAction = function (action) {
  this.actions.push(action);
  return this;
};
/**
 * Adds Card section (multiple sections allowed);
 * @param {CardSection} section CardSection class instance;
 * @returns {CardBuilder} this CardBuilder;
 */


CardBuilder.prototype.addSection = function (section) {
  this.sections.push(section);
  return this;
};
/**
 * Sets Card header;
 * @params {CardHeader} cardHeader CardHeader class instance;
 * @returns {CardBuilder} this CardBuilder;
 */


CardBuilder.prototype.setHeader = function (cardHeader) {
  this.cardHeader = cardHeader;
  return this;
};
/**
 * Sets Card name;
 * @param {String} name name to reference Card by;
 * @returns {CardBuilder} this CardBuilder;
 */


CardBuilder.prototype.setName = function (name) {
  this.name = name;
  return this;
};
/**
 * Builds the Card;
 * @returns {CardBuilder} this CardBuilder;
 */


CardBuilder.prototype.build =
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var cardHeader, cardSections, cardActions, wrap, headerWrap, icon, header, sections, serialize, s, cardSection, numuncoll, section, menu;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        cardHeader = this.cardHeader;
        cardSections = this.sections;
        cardActions = this.actions;
        $('#main-Ui-header').empty();
        $('#app-body').empty();
        wrap = document.createElement('div');
        wrap.className = 'Card';
        $('#app-body').append(wrap);

        if (this.cardHeader) {
          headerWrap = document.createElement('div');
          headerWrap.className = [cardHeader.className, 'separated-both'].join(' ');
          $('#app-body').prepend(headerWrap);

          if (this.cardHeader.imageUrl) {
            icon = document.createElement('img');
            icon.src = this.cardHeader.imageUrl;
            icon.className = 'headerIcon';
            headerWrap.prepend(icon);
          }

          header = document.createElement('p');
          header.className = 'ms-font-m-plus';
          header.textContent = this.cardHeader.title;
          headerWrap.append(header);
        }

        sections = []; //if there is at least one section -> append;

        if (!(cardSections.length > 0)) {
          _context.next = 28;
          break;
        }

        serialize = true;

        if (cardSections.length === 1) {
          serialize = false;
        } //append each CardSection to Card;


        s = 0;

      case 14:
        if (!(s < cardSections.length)) {
          _context.next = 24;
          break;
        }

        cardSection = cardSections[s];
        numuncoll = cardSection.numUncollapsibleWidgets;
        _context.next = 19;
        return cardSection.appendToUi(wrap, serialize, s);

      case 19:
        section = _context.sent;
        sections.push({
          s: section,
          u: numuncoll
        });

      case 21:
        s++;
        _context.next = 14;
        break;

      case 24:
        //set collapsibility event listener on each CardSection;
        sections.forEach(function (obj) {
          let section = obj.s;
          let numuncoll = obj.u;
          let collapsible = section.querySelector('.collapsible');

          if (collapsible !== null) {
            let overlay = collapsible.querySelector('form');

            if (overlay === null) {
              overlay = collapsible;
            }

            let toggler = section.querySelector('.toggler');
            let initial = uncollapsible(numuncoll, overlay);
            overlay.style.height = initial + 'px';

            if (toggler !== null) {
              toggler.addEventListener('click', collapse(toggler, overlay, 'height', 1, 4, initial));
            }
          }
        }); //if CardActions provided, clear menu and set new items;

        menu = menus[0];
        menu.clear(true);

        if (cardActions.length > 0) {
          cardActions.reverse();
          cardActions.forEach(function (cardAction) {
            let params, cAction;

            if (cardAction.action) {
              cAction = cardAction.action;
            } else if (cardAction.authorizationAction) {
              cAction = cardAction.authorizationAction;
            } else if (cardAction.openLink) {
              cAction = cardAction.openLink;
            }

            let item = {
              text: cardAction.text,
              classList: [],
              action: cAction
            };
            menu.addItem(item, true);
          });
        }

      case 28:
        cardStack.push(this);
        return _context.abrupt("return", this);

      case 30:
      case "end":
        return _context.stop();
    }
  }, _callee, this);
}));