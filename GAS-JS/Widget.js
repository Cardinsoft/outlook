//Emulate base Class Widget for CardService service;
function Widget() {
	this.className = 'Widget';
}

/**
 * TextParagraph constructor function;
 */
function TextParagraph() {
	Widget.call(this);
	this.className = 'TextParagraph';
	this.content;
}
TextParagraph.prototype = Object.create(Widget.prototype);

TextParagraph.prototype.setText = function (text) {
	this.content = text;
	return this;
}

TextParagraph.prototype.appendToUi = function (parent) {	
	//append row;
	const widget = document.createElement('div');
	widget.className = 'row '+this.className;
	parent.append(widget);

	//append column;
	const wrapText = document.createElement('div');
	wrapText.className = 'column-text';
	widget.append(wrapText);
	
	//set widget text;
	const content = document.createElement('span');
	content.className = 'ms-font-m-plus';
	content.innerHTML = this.content;
	wrapText.append(content);
}

//Emulate Class ButtonSet extending base Class Widget for CardService service;
class ButtonSet extends Widget {
	constructor() {
		super();
		this.className = 'ButtonSet';
		this.buttons = [];
	}
}
//add new methods to the class;
ButtonSet.prototype.addButton = function(button) {
	this.buttons.push(button);
	return this;
}
ButtonSet.prototype.appendToUi = function(parent) {
	const buttons = this.buttons;
	const length = buttons.length;
	
	const btnRow = document.createElement('div');
	btnRow.className = 'row '+this.className;
	parent.append(btnRow);
	
	const wrapBtn = document.createElement('div');
	wrapBtn.className = 'column';
	btnRow.append(wrapBtn);
	
	buttons.forEach(function(button) {
		const backgroundColor = button.backgroundColor;
		const text            = button.text;
		const disabled        = button.disabled;
		const textButtonStyle = button.textButtonStyle;	
		const action          = button.action;
		const openLink        = button.openLink;
		const authAction      = button.authorizationAction; 
		
		button.appendToUi(wrapBtn);
	});

}