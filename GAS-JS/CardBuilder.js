function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate Class CardBuilder for CardService service;
let CardBuilder = function CardBuilder() {
  _classCallCheck(this, CardBuilder);

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
 * Validates the Card;
 * @returns {Card} Card instance;
 */


CardBuilder.prototype.build = function () {
  const card = new Card(this); //TODO: add validation;

  return card;
};