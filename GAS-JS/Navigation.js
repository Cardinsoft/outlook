//Emulate class Navigation for CardService service;
class Navigation {
	constructor() {
		this.className = 'Navigation';
	}
}
//add new methods to the class;
Navigation.prototype.popCard = function () {
	cardStack.pop();
	return this;
}
Navigation.prototype.popToNamedCard = function (cardName) {
	//future releases;
}
Navigation.prototype.popToRoot = function () {
	var length = cardStack.length;
	for(var i = 1; i<length; i++) {
		cardStack.pop();
	}
	return this;
}
Navigation.prototype.printJson = function () {
	return JSON.stringify(this);
}
Navigation.prototype.pushCard = async function (card) {
	let builtCard = await card;
	cardStack.push(builtCard);
	return this;
}
Navigation.prototype.updateCard = async function (card) {
	let builtCard = await card;
	cardStack[cardStack.length-1] = builtCard;
	return this;
}