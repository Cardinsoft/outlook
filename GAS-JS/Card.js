function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
} //Emulate Class Card for CardService service;


let Card = function Card() {
  _classCallCheck(this, Card);

  this.className = 'Card';
}; //add new methods to the class;


Card.prototype.printJSON = function () {
  return JSON.stringify(this);
};