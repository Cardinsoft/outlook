//Emulate Class KeyValue for CardService service;
class KeyValue {
	constructor() {
		this.className = 'KeyValue';
		this.button;
		this.content;
		this.icon;
		this.altText;
		this.url;
		this.multiline = true;
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
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setAuthorizationAction = function (action) {
	this.authorizationAction = JSON.stringify(action);
	return this;
}

/**
 * Set compose action to KeyValue;
 * @param {Action} action action to set;
 * @param {composedEmailType} composedEmailType email type to compose;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setComposeAction = function (action,composedEmailType) {
	this.action = JSON.stringify(action);
	this.composedEmailType = composedEmailType;
	return this;
}

/**
 * Set onclick action to KeyValue;
 * @param {Action} action action to set;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setOnClickAction = function (action) {
	this.action = JSON.stringify(action);
	return this;
}

/**
 * Set OpenLink action to KeyValue;
 * @param {Action} action action to set;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setOnClickOpenLinkAction = function (action) {
	this.action = JSON.stringify(action);
	return this;
}

/**
 * Set OpenLink to KeyValue;
 * @param {OpenLink} openLink openLink action to set;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setOpenLink = function (openLink) {
	this.openLink = JSON.stringify(openLink);
	return this;
}

/**
 * Sets Button to this widget if provided;
 * @param {TextButton} button TextButton widget to set;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setButton = function (button) {
	this.button = button;
	return this;
}

/**
 * Sets this widget's text content;
 * @param {String} text content to set;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setContent = function (text) {
	this.content = text;
	return this;
}

/**
 * Sets one of the predefined icons from CardService Enum;
 * @param {String} icon icon name from CardService Enum;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setIcon = function (icon) {
	//acces Icons Enum and check for match;
	const icons = new e_CardService().Icon;
	for(let key in icons) {
		if(icons[key]===icon) { this.icon = icons[key]; }
	}
	return this;
}

/**
 * Sets image URL to append to widget as icon;
 * @param {String} url path to image;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setIconUrl = function (url) {
	this.url = url;
	return this;
}

/**
 * Sets alt text for image acting as widget icon;
 * @param {String} altText text to display on source fail;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setIconAltText = function (altText) {
	this.altText = altText;	
	return this;
}

/**
 * Determines whether to display widget text as multiline or truncated single-line;
 * @param {Boolean} multiline truthy value to set multiline property to;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setMultiline = function (multiline) {
	this.multiline = multiline;
	return this;
}

/**
 * Sets a Switch widget on this widget;
 * @param {Switch} switchToSet Switch widget to set;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setSwitch = function (switchToSet) {
	this.switchToSet = switchToSet;
	return this;
}

/**
 * Sets this widget's title text on top;
 * @param {String} text title text to set;
 * @returns {KeyValue} this widget;
 */
KeyValue.prototype.setTopLabel = function (text) {
	this.topLabel = text;
	return this;
}

/**
 * Utility function appending KeyValue widget to Ui;
 * @param {HtmlElement} parent parent element to append to;
 */
KeyValue.prototype.appendToUi = function (parent) {
	
	//access parameters;
	let action    = this.action;
	const iconUrl = this.url;
	const icon    = this.icon;
	let content   = this.content;
	
	//create row element;
	const widget = document.createElement('div');
	widget.className = 'row '+this.className;
	parent.append(widget);
	
	//add event listener chain ( click -> callback );
	if(action) {
		//set refrence;
		setAction(widget,action);
		
		//set event listener to widget;
		widget.addEventListener('click',async function(event){
			event.stopPropagation();
			return actionCallback(this);
		});
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
	
	//create content text element;
	const contentText = document.createElement('span');
	contentText.className = 'ms-font-m-plus KeyValueText';
	contentText.innerHTML = content;
	wrapText.append(contentText);

	if(content) { 
		let loadCompose = checkTarget(content); 
		console.log(loadCompose);
		
		if(loadCompose) {	
			contentText.children.item(0).addEventListener('click',function (event) {	
				event.stopPropagation();
				event.preventDefault();
				
				let mailParams = {
					toRecipients : [content]
				};
				
				console.log(mailParams);
				
				Office.context.mailbox.displayNewMessageForm(mailParams);
				return false;
			});
		}
		
	}
	
	//handle button or switch creation;
	const btn = this.button;
	const sw  = this.switchToSet;
	
	if(btn||sw) {
		const wrapButton = document.createElement('div');
		wrapButton.className = 'column-label';
		widget.append(wrapButton);	
	
		if(btn) { btn.appendToUi(wrapButton); }
		
		if(sw) { sw.appendToUi(wrapButton); }
		
	}
}