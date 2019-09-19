function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//Emulate Class Card for CardService service;
let Card =
/*#__PURE__*/
function () {
  function Card() {
    _classCallCheck(this, Card);

    this.className = 'Card';
  }
  /**
   * Utility method for appending Card to Ui;
   */


  _createClass(Card, [{
    key: "appendToUi",
    value: function () {
      var _appendToUi = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var cardHeader, cardSections, cardActions, wrap, headerWrap, icon, header, sections, serialize, s, cardSection, numuncoll, section, menu;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));

      function appendToUi() {
        return _appendToUi.apply(this, arguments);
      }

      return appendToUi;
    }()
  }]);

  return Card;
}(); //add new methods to the class;


Card.prototype.printJSON = function () {
  return JSON.stringify(this);
};