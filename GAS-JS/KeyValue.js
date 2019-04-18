//Emulate Class KeyValue for CardService service;
class KeyValue {
	constructor() {
		this.className = 'KeyValue';
		this.button;
		this.content;
		this.icon;
		this.altText;
		this.url;
		this.multiline;
		this.switchToSet;
		this.topLabel;
		this.action;
		this.authorizationAction;
		this.openLink;
		this.composedEmailType;
	}
}
/**
 * Set authorization action to KeyValue;
 * @param {AuthorizationAction} action action to set;
 * @returns {KeyValue}
 */
KeyValue.prototype.setAuthorizationAction = function (action) {
	this.authorizationAction = action;
	return this;
}
/**
 * Set compose action to KeyValue;
 * @param {Action} action action to set;
 * @param {composedEmailType} composedEmailType email type to compose;
 * @returns {KeyValue}
 */
KeyValue.prototype.setComposeAction = function (action,composedEmailType) {
	this.action = action;
	this.composedEmailType = composedEmailType;
	return this;
}
/**
 * Set onclick action to KeyValue;
 * @param {Action} action action to set;
 * @returns {KeyValue}
 */
KeyValue.prototype.setOnClickAction = function (action) {
	this.action = action;
	return this;
}
/**
 * Set OpenLink action to KeyValue;
 * @param {Action} action action to set;
 * @returns {KeyValue}
 */
KeyValue.prototype.setOnClickOpenLinkAction = function (action) {
	this.action = action;
	return this;
}
/**
 * Set OpenLink to KeyValue;
 * @param {OpenLink} openLink openLink action to set;
 * @returns {KeyValue}
 */
KeyValue.prototype.setOpenLink = function (openLink) {
	this.openLink = openLink;
	return this;
}
//add new methods to the class;
KeyValue.prototype.setButton = function (button) {
	this.button = button;
	return this;
}
KeyValue.prototype.setContent = function (text) {
	this.content = text;
	return this;
}
/**
 * Sets one of the predefined icons from CardService Enum;
 * @param {String} icon icon name from CardService Enum;
 */
KeyValue.prototype.setIcon = function (icon) {
	
	//acces Icons Enum and check for match;
	const icons = new e_CardService().Icon;
	for(let key in icons) {
		if(icons[key]===icon) { this.icon = icons[key]; }
	}
	
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
KeyValue.prototype.appendToUi = function (parent) {
	
	//access parameters;
	const action  = this.action;
	const iconUrl = this.url;
	const icon    = this.icon;
	
	//create row element;
	const widget = document.createElement('div');
	widget.className = 'row '+this.className;
	parent.append(widget);
	
	//add event listener chain ( click -> callback );
	if(action) {
		
		widget.classList.add('pointer');
		
		//function curry(arg){
			
			//return async function(e) {
				
				//let self = this;
				
				//console.log(self)
				
				//await arg.addEventListener('dblclick',actionCallback(self));
				//await arg.dispatchEvent(new Event('dblclick'));
				//await arg.removeEventListener('dblclick',actionCallback);
			//}
		//}
		
		let binded = actionCallback.bind(action,widget);
		
		function curry() {
			console.log('!')
			//binded();
		}
		
		
		widget.addEventListener('click',curry);

	}
	
	//handle image creation;
	if(iconUrl||icon) {
		const wrapImg = document.createElement('div');
		wrapImg.className = 'column-icon';
		widget.append(wrapImg);
		
		const img = document.createElement('img');
		img.className = 'KeyValueImage';
		
		if(iconUrl) { img.src = iconUrl; }else { img.src = icon; } 
	
		if(this.altText) { img.alt = this.altText; }
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