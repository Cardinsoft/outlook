function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate class Navigation for CardService service;
let Navigation = function Navigation() {
  _classCallCheck(this, Navigation);

  this.className = 'Navigation';
  this.card;
};

Navigation.prototype.popToNamedCard = function (cardName) {//future releases;
};

Navigation.prototype.popToRoot = function () {
  var length = cardStack.length;

  for (var i = 1; i < length; i++) {
    cardStack.pop();
  }

  return this;
};

Navigation.prototype.printJson = function () {
  return JSON.stringify(this);
};

Navigation.prototype.updateCard = function (card) {
  this.card = card;
  cardStack[cardStack.length - 1] = builtCard;
  return this;
};

Navigation.prototype.pushCard = function (card) {
  this.card = card;
  cardStack.push(builtCard);
  return this;
};

Navigation.prototype.popCard = function () {
  cardStack.pop();
  return this;
};