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
	this.authorizationAction = action;
	return this;
}
/**
 * Set compose action to Button;
 * @param {Action} action action to set;
 * @param {composedEmailType} composedEmailType email type to compose;
 * @returns {Button}
 */
Button.prototype.setComposeAction = function (action,composedEmailType) {
	this.action = action;
	this.composedEmailType = composedEmailType;
	return this;
}
/**
 * Set onclick action to Button;
 * @param {Action} action action to set;
 * @returns {Button}
 */
Button.prototype.setOnClickAction = function (action) {
	this.action = action;
	return this;
}
/**
 * Set OpenLink action to Button;
 * @param {Action} action action to set;
 * @returns {Button}
 */
Button.prototype.setOnClickOpenLinkAction = function (action) {
	this.action = action;
	return this;
}
/**
 * Set OpenLink to Button;
 * @param {OpenLink} openLink openLink action to set;
 * @returns {Button}
 */
Button.prototype.setOpenLink = function (openLink) {
	this.openLink = openLink;
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
	const backgroundColor = this.backgroundColor;
	const text            = this.text;
	const disabled        = this.disabled;
	const textButtonStyle = this.textButtonStyle;
	const action          = this.action;
	const openLink        = this.openLink;
	const authAction      = this.authorizationAction; 
	
	const btnRow = document.createElement('div');
	btnRow.className = 'row '+this.className;
	parent.append(btnRow);
	
	const wrapBtn = document.createElement('div');
	wrapBtn.className = 'column';
	btnRow.append(wrapBtn);
	
	const button = document.createElement('button');
	button.disabled = disabled;
	if(disabled) {
		button.className = 'ms-Button ms-Button--small '+this.className;
	}else {
		button.className = 'ms-Button ms-Button--small ms-Button--primary '+this.className;
	}
	wrapBtn.append(button);
		
	const btnContent = document.createElement('span');
	btnContent.className = 'ms-Button-label';
	btnContent.innerHTML = text;
	button.append(btnContent);
	
	if(!openLink&&!authAction) {
		new fabric['Button'](button, actionCallback(action,button) );	
	}else {
		new fabric['Button'](button, function(){
			Office.context.ui.displayDialogAsync(openLink.url);
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


//Emulate Class KeyValue extending base Class Button for CardService service;
class KeyValue extends Button {
	constructor() {
		super();
		this.className = 'KeyValue';
		this.button;
		this.content;
		this.icon;
		this.altText;
		this.url;
		this.multiline;
		this.switchToSet;
		this.topLabel;
	}
}
//Chain Class Image to Button base class;
KeyValue.prototype = Object.create(Button.prototype);
//add new methods to the class;
KeyValue.prototype.setButton = function (button) {
	this.button = button;
	return this;
}
KeyValue.prototype.setContent = function (text) {
	this.content = text;
	return this;
}
KeyValue.prototype.setIcon = function (icon) {
	this.icon = icon;
	return this;
}
KeyValue.prototype.setIconUrl = function (url) {
	this.url = url;
	return this;
}
KeyValue.prototype.setIconAltText = function (altText) {
	this.altText = altText;
	return this;
}
KeyValue.prototype.setMultiline = function (multiline) {
	this.multiline = multiline;
	return this;
}
KeyValue.prototype.setSwitch = function (switchToSet) {
	this.switchToSet = switchToSet;
	return this;
}
KeyValue.prototype.setTopLabel = function (text) {
	this.topLabel = text;
	return this;
}
KeyValue.prototype.appendToUi = function (parent,index) {
	const widget = document.createElement('div');
	widget.className = 'row '+this.className;
	widget.tabindex = index;
	parent.append(widget);
	
	if(this.action) {
		const action = this.action;
		widget.addEventListener('click',actionCallback(action));
	}
	
	//handle image creation;
	if(this.url) {
		const wrapImg = document.createElement('div');
		wrapImg.className = 'column-icon';
		widget.append(wrapImg);
		
		const img = document.createElement('img');
		img.className = 'KeyValueImage';
		img.src = this.url;
		if(this.altText!==undefined) { img.alt = this.altText; }
		wrapImg.append(img);
	}
	
	//handle label and content creation;
	const wrapText = document.createElement('div');
	wrapText.className = 'column-text';
	widget.append(wrapText);
	
	if(this.topLabel) {	
		const label = document.createElement('label');
		label.className = 'ms-fontSize-s KeyValueLabel';
		label.textContent = this.topLabel;
		wrapText.append(label);
	}
	const content = document.createElement('span');
	content.className = 'ms-font-m-plus KeyValueText';
	content.innerHTML = this.content;
	wrapText.append(content);
	
	//handle button or switch creation;
	const btn = this.button;
	const sw  = this.switchToSet;
	
	if(btn||sw) {
		const wrapButton = document.createElement('div');
		wrapButton.className = 'column';
		widget.append(wrapButton);	
	
		if(btn) {
			const backgroundColor = btn.backgroundColor;
			const text 			  = btn.text;
			const disabled 		  = btn.disabled;
			const textButtonStyle = btn.textButtonStyle;
			const action		  = btn.action;
			
			const button = document.createElement('button');
			button.disabled = disabled;
			if(disabled) {
				button.className = 'ms-Button ms-Button--small '+btn.className;
			}else {
				button.className = 'ms-Button ms-Button--small ms-Button--primary '+btn.className;
			}
			wrapButton.append(button);
				
			const btnContent = document.createElement('span');
			btnContent.className = 'ms-Button-label';
			btnContent.textContent = text;
			button.append(btnContent);
				
			new fabric['Button'](button, actionCallback(action,button) );
		}
		
		if(sw) {
			sw.appendToUi(wrapButton);
		}
		
	}
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