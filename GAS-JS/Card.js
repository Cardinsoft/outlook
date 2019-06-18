//Emulate Class Card for CardService service;
class Card {
	constructor() {
		this.className = 'Card';
	}
}
//add new methods to the class;
Card.prototype.printJSON = function () {
	return JSON.stringify(this);
}