//Emulate base Class Button for CardService service;
class Button extends e_CardService {
	constructor() {
		super();
		this.className = 'Button';
		this.action;
		this.authorizationAction;
		this.openLink;
		this.composedEmailType;
	}
}
/**
 * Set authorization action to Button;
 * @param {AuthorizationAction} action action to set;
 * @returns {Button}
 */
Button.prototype.setAuthorizationAction = function (action) {
	this.authorizationAction = JSON.stringify(action);
	return this;
}
/**
 * Set compose action to Button;
 * @param {Action} action action to set;
 * @param {composedEmailType} composedEmailType email type to compose;
 * @returns {Button}
 */
Button.prototype.setComposeAction = function (action,composedEmailType) {
	this.action = JSON.stringify(action);
	this.composedEmailType = composedEmailType;
	return this;
}
/**
 * Set onclick action to Button;
 * @param {Action} action action to set;
 * @returns {Button}
 */
Button.prototype.setOnClickAction = function (action) {
	this.action = JSON.stringify(action);
	return this;
}
/**
 * Set OpenLink action to Button;
 * @param {Action} action action to set;
 * @returns {Button}
 */
Button.prototype.setOnClickOpenLinkAction = function (action) {
	this.action = JSON.stringify(action);
	return this;
}
/**
 * Set OpenLink to Button;
 * @param {OpenLink} openLink openLink action to set;
 * @returns {Button}
 */
Button.prototype.setOpenLink = function (openLink) {
	this.openLink = JSON.stringify(openLink);
	return this;
}


//Emulate Class TextButton extending base Class Button for CardService service;
class TextButton extends Button {
	constructor() {
		super();
		this.className = 'TextButton';
		this.backgroundColor;
		this.text;
		this.disabled;
		this.textButtonStyle;
	}
}
//chain TextButton to Button base class;
TextButton.prototype = Object.create(Button.prototype);
//add new methods to the class;
TextButton.prototype.setDisabled = function (disabled) {
	this.disabled = disabled;
	return this;
};
TextButton.prototype.setText = function (text) {
	this.text = text;
	return this;
};
TextButton.prototype.setTextButtonStyle = function (textButtonStyle) {
	this.textButtonStyle = textButtonStyle;
	return this;
};
TextButton.prototype.appendToUi = function (parent) {
	
	let action            = this.action;
	const backgroundColor = this.backgroundColor;
	const text            = this.text;
	const disabled        = this.disabled;
	const textButtonStyle = this.textButtonStyle;
	const openLink        = this.openLink;
	const authAction      = this.authorizationAction; 
	
	
	
	const button     = document.createElement('button');
	button.disabled  = disabled;
	button.innerHTML = text;
	
	const st = button.style;
	const cl = button.classList;
	
	if(backgroundColor) {  }
	if(disabled) { cl.add('btn-disabled'); }else { cl.remove('btn-disabled'); }
	
	parent.append(button);
	
	if(!openLink&&!authAction&&action) {

		//parse action if found;
		action = JSON.parse(action);
		
		//change cursor to pointer on hover;
		button.classList.add('pointer');
		
		//get unique identifier;
		let id = getId();
		
		//set stringifyed action to global storage;
		e_actions[id] = JSON.stringify(action);
		
		//add action reference to widget;
		button.setAttribute('action',id);
		
		button.addEventListener('click',async function(){ await actionCallback(this); });
		
	}else if(openLink) {
		new fabric['Button'](button, function(){
			Office.context.ui.displayDialogAsync( JSON.parse(openLink).url );
		} );
	}else {
		new fabric['Button'](button, function(){
			Office.context.ui.displayDialogAsync( JSON.parse(authAction).url );
		} );		
	}
}


//Emulate Class Image extending base Class Button for CardService service;
class Image extends Button {	
	constructor() {
		super();
		this.className = 'Image';
		this.altText;
		this.url;
	}
}
//Chain Class Image to Button base class;
Image.prototype = Object.create(Button.prototype);
//add new methods to the class;
Image.prototype.setAltText = function (altText) {
	this.altText = altText;
	return this;
}
Image.prototype.setImageUrl = function (url) {
	this.url = url;
	return this;
}


//Emulate Class ImageButton extending base Class Button for CardService service;
class ImageButton extends Button {
	constructor() {
		super();
		this.altText;
		this.icon;
		this.url;
	}
}
//chain ImageButton to Button base class;
ImageButton.prototype = Object.create(Button.prototype);
//add new methods to the class;
ImageButton.prototype.setAltText = function (altText) {
	this.altText = altText;
	return this;
}
ImageButton.prototype.setIcon = function (icon) {
	this.icon = icon;
	return this;
}
ImageButton.prototype.setIconUrl = function (url) {
	this.url = url;
	return this;
}

//Emulate Class CardAction extending base Class Button for CardService service;
class CardAction extends Button {
	constructor() {
		super();
		this.className = 'CardAction';
		this.text;
	}
}
//chain TextButton to Button base class;
CardAction.prototype = Object.create(Button.prototype);
//add new methods to the class;
CardAction.prototype.setText = function (text) {
	this.text = text;
	return this;
};