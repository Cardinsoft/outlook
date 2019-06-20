//Emulate base Class Button for CardService service;
class Button {
	constructor() {
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
		this.textButtonStyle = 'TEXT';
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
	
	//access button properties;
	let action            = this.action;
	const backgroundColor = this.backgroundColor;
	const text            = this.text;
	const disabled        = this.disabled;
	const textButtonStyle = this.textButtonStyle;
	const openLink        = this.openLink;
	const authAction      = this.authorizationAction; 
	
	//initiate button;
	const button = document.createElement('button');
	button.className = this.className;
	button.disabled  = disabled;
	button.innerHTML = text;
	
	//access button style and class list;
	const st = button.style;
	const cl = button.classList;
	
	if(textButtonStyle==='FILLED') { st.backgroundColor = backgroundColor; }else { cl.add('btn-text'); }
	if(disabled) { cl.add('btn-disabled'); }else { cl.remove('btn-disabled'); }
	
	parent.append(button);
	
	if(!openLink&&!authAction&&action) {
	
		//set refrence;
		setAction(button,action);
		
		//add event listener to button;
		button.addEventListener('click', async function(){ 
			return actionCallback(this); 
		});
		
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