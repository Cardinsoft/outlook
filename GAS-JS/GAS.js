//Emulate Message class that is obtained from current message auth flow;
class Message {
	constructor(msgFrom,msgBcc,msgCc,msgDate,msgPlainBody,msgSubject,msgId,msgThread) {
		this.msgFrom      = msgFrom;
		this.msgBcc       = msgBcc;
		this.msgCc        = msgCc;
		this.msgDate      = msgDate;
		this.msgPlainBody = msgPlainBody;
		this.msgSubject   = msgSubject;
		this.msgId        = msgId;
		this.msgThread    = msgThread;
	}
}
Message.prototype.getId = function () {
	return this.msgId;
}
Message.prototype.getBcc = function () {
	return this.msgBcc;
}
Message.prototype.getCc = function () {
	return this.msgCc;
}
Message.prototype.getDate = function () {
	return this.msgDate;
}
Message.prototype.getFrom = function () {
	return this.msgFrom;
}
Message.prototype.getPlainBody = function () {
	return this.msgPlainBody;
}
Message.prototype.getSubject = function () {
	return this.msgSubject;
}
Message.prototype.getThread = function () {
	return new Thread(this.msgThread);
}

//Emulate GmailThread class (partially);
class Thread {
	constructor(msgThread) {
		this.id;
		this.labels;
		this.messages = [msgThread];
	}

}
Thread.prototype.getId = function () {
		//access current message;
		const curr = this.messages[0];
		
		//return conversation Id;
		return curr.conversationId;
	}
	
/**
 * Emulates getLabels method with Categories API (as categories are not in core yet);
 * @returns {Array}
 */
Thread.prototype.getLabels = async function () {
	//access current message;
	const curr = this.messages[0];
	
	//access current id;
	const id = curr.itemId;
	
	/*
	//get access token;
	const options = {isRest: true};
	Office.context.mailbox.getCallbackTokenAsync(options,async function(token){
		
		//build url;
		const url = 'https://graph.microsoft.com/v1.0/me/messages/'+id;
		
		//make request to Graph API;
		const parameters = {
			method : 'get',
			headers : {
				Authorization : 'Bearer '+token.value
			}
		};
		const message = await UrlFetchApp.fetch(url,parameters);
		console.log(message);		
		
	});
	*/
	
	return [];
}
Thread.prototype.removeLabel = function (label) {}


//Emulate class Navigation for CardService service;
class Navigation extends e_CardService {
	constructor() {
		super();
		this.className = 'Navigation';
	}
}
//add new methods to the class;
Navigation.prototype.popCard = function () {
	cardStack.pop();
	return this;
}
Navigation.prototype.popToNamedCard = function (cardName) {
	
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
Navigation.prototype.pushCard = function (card) {
	cardStack.push(card);
	return this;
}
Navigation.prototype.updateCard = function (card) {
	cardStack[cardStack.length-1] = card;
	return this;
}


//Emulate Class Card for CardService service;
class Card extends e_CardService {
	constructor() {
		super();
		this.className = 'Card';
	}
}
//add new methods to the class;
Card.prototype.printJSON = function () {
	return JSON.stringify(this);
}


//Emulate Class ButtonSet for CardService service;
class ButtonSet extends e_CardService {
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
			
		const btn = document.createElement('button');
		if(disabled) {
			btn.className = 'ms-Button ms-Button--small'+button.className;
		}else {
			btn.className = 'ms-Button ms-Button--small ms-Button--primary '+button.className;
		}
		btn.disabled = disabled;
		wrapBtn.append(btn);		
		
		const btnContent = document.createElement('span');
		btnContent.className = 'ms-Button-label';
		btnContent.textContent = text;
		btn.append(btnContent);

		if(!openLink&&!authAction) {
			new fabric['Button'](btn, actionCallback(action,btn) );	
		}else if(openLink) {
			new fabric['Button'](btn, function(){
				Office.context.ui.displayDialogAsync(openLink.url);
			} );
		}else {
			new fabric['Button'](btn, function(){
				Office.context.ui.displayDialogAsync(authAction.url);
			} );		
		}		
		
	});

}

//Emulate Class CardBuilder extending Class Card for CardService service;
class CardBuilder extends Card {
	constructor() {
		super();
		this.className = 'CardBuilder';
		this.action;
		this.sections = [];
		this.cardHeader;
		this.name;
	}
}
//add new methods to the class;
CardBuilder.prototype.addCardAction = function (action) {
	this.action = action;
	return this;
};
CardBuilder.prototype.addSection = function (section) {
	this.sections.push(section);
	return this;
};
CardBuilder.prototype.setHeader = function (cardHeader) {
	this.cardHeader = cardHeader;
	return this;
};
CardBuilder.prototype.setName = function (name) {
	this.name = name;
	return this;
};
CardBuilder.prototype.build = function () {
	const cardHeader   = this.cardHeader;
	const cardSections = this.sections;
	const cardAction   = this.action;
	
	$('#main-Ui-header').empty();
	$('#app-body').empty();
	
	const wrap = document.createElement('div');
	wrap.id = 'main-Ui-wrap'
	wrap.className = 'ms-Panel-contentInner';	
	$('#app-body').append(wrap);
	
	if(this.cardHeader) {
		const headerWrap = document.createElement('div');
		headerWrap.id = 'main-Ui-header';
		$('.ms-CommandBar-mainArea').prepend(headerWrap);
		
		if(this.cardHeader.imageUrl) {
			const icon = document.createElement('img');
			icon.src = this.cardHeader.imageUrl;
			icon.className = 'headerIcon';
			headerWrap.prepend(icon);
		}
		
		const header = document.createElement('p');
		header.className = 'ms-Panel-headerText';
		header.textContent = this.cardHeader.title;
		headerWrap.append(header);
	}
		
	if(cardSections.length!==0) {
		
		let serialize = true;
		if(cardSections.length===1) { serialize = false; }
		
		cardSections.forEach(function(cardSection){
			cardSection.appendToUi( $('#main-Ui-wrap'),serialize );
		});
	}
	
	cardStack.push(this);
	
	return this;
};

//Emulate Class CardHeader extending Class Card for CardService service;
class CardHeader extends Card {
	constructor() {
		super();
		this.className = 'CardHeader';
		this.imageAltText;
		this.imageStyle;
		this.imageUrl;
		this.title;
		this.subtitle;
	}
}
//add new methods to the class;
CardHeader.prototype.setImageAltText = function (imageAltText) {
	this.imageAltText = imageAltText;
	return this;
};
CardHeader.prototype.setImageStyle = function (imageStyle) {
	this.imageStyle = imageStyle;
	return this;
};
CardHeader.prototype.setImageUrl = function (imageUrl) {
	this.imageUrl = imageUrl;
	return this;
};
CardHeader.prototype.setTitle = function (title) {
	this.title = title;
	return this;
};
CardHeader.prototype.setSubtitle = function (subtitle) {
	this.subtitle = subtitle;
	return this;
};

//Emulate Class CardSection extending Class Card for CardService service;
class CardSection extends Card {
	constructor() {
		super();
		this.className = 'CardSection';
		this.widgets = [];
		this.collapsible = false;
		this.header;
		this.numUncollapsibleWidgets;
	}
}
//add new methods to the class;
CardSection.prototype.addWidget = function (widget) {
	this.widgets.push(widget);
	return this;
}
CardSection.prototype.setCollapsible = function (collapsible) {
	this.collapsible = collapsible;
	return this;
}
CardSection.prototype.setHeader = function (header) {
	this.header = header;
	return this;
}
CardSection.prototype.setNumUncollapsibleWidgets = function (numUncollapsibleWidgets) {
	this.numUncollapsibleWidgets = numUncollapsibleWidgets;
	return this;
}
CardSection.prototype.appendToUi = function (parent,serialize) {
	const collapsible = this.collapsible;
	
	const section = document.createElement('div');
	if(serialize) {
		section.className = 'separated '+this.className;
	}else {
		section.className = this.className;
	}
	section.dir = 'ltr';

	//access header text and set section header if provided;
	const headerText = this.header;
	if(headerText&&headerText!=='') {
		const header = document.createElement('p');
		header.className = 'ms-font-m-plus sectionHeader';
		header.textContent = headerText;
		section.append(header);
	}
	
	//append widgets wrapper and handle collapsed Ui;
	const widgetsWrap = document.createElement('div');
	if(collapsible) { widgetsWrap.className = 'closed'; }
	section.append(widgetsWrap);
	
	//set wrapper to widgets wrapper;
	let wrapper = widgetsWrap;
	
	//access widgets and append;
	const widgets = this.widgets;
	
	if(widgets.length!==0) {
		
		//check if at least one widget is a form input;
		const hasInput = widgets.some(function(widget){ 
			
			//access widget's parameters;
			let name      = widget.className;
			let hasSwitch = widget.switchToSet;
			
			//check if widget is a form element;
			let isFormElem = name==='TextInput'||name==='SelectionInput'||hasSwitch;
			
			//return true if found;
			if(isFormElem) {
				return widget;
			}
			
		});
		
		//if found form input -> append form element and set wrapper to form;
		if(hasInput) {
			const formElem = document.createElement('form');
			widgetsWrap.append(formElem);
			wrapper = formElem;
		}
		
		//append widgets to Ui;
		widgets.forEach(function(widget,index){
			widget.appendToUi(wrapper,index);
		});
	}

	if(collapsible) {
		const toggler = document.createElement('div');
		toggler.className = 'toggler centered ms-Icon ms-Icon--ChevronDown';
		section.append(toggler);
		
		toggler.addEventListener('click',function(e) {
			const classes = this.classList;			
			classes.toggle('ms-Icon--ChevronDown');
			classes.toggle('ms-Icon--ChevronUp');
			
			const widgetsClasses = widgetsWrap.classList;
			widgetsClasses.toggle('closed');
			widgetsClasses.toggle('opened');
			
		});
		
	}
			
	parent.append(section);
}

//Emulate base Class Widget for CardService service;
class Widget extends e_CardService {
	constructor() {
		super();
		this.className = 'Widget';
	}
}

//Emulate Class TextParagraph for base Class Widget for CacheService service;
class TextParagraph extends Widget {
	constructor() {
		super();
		this.className = 'TextParagraph';
		this.content;
	}
}
//add new methods to the class;
TextParagraph.prototype.setText = function (text) {
	this.content = text;
	return this;
}
TextParagraph.prototype.appendToUi = function(parent) {	
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


//Emulate Class Action for CardService service;
class Action {
	constructor() {
		this.className = 'Action';
		this.functionName;
		this.loadIndicator;
		this.parameters;
	}
}
//add new methods to the class;
Action.prototype.setFunctionName = function (functionName) {
	this.functionName = functionName;
	return this;
}
Action.prototype.setLoadIndicator = function (loadIndicator) {
	this.loadIndicator = loadIndicator;
	return this;
}
Action.prototype.setParameters = function (parameters) {
	this.parameters = parameters;
	return this;
}

//Emulate Class OpenLink extending Class Action for CardService service;
class OpenLink extends Action {
	constructor() {
		super();
		this.className = 'OpenLink';
		this.url;
		this.onClose;
		this.openAs;
	}
}
//add new methods to the class;
OpenLink.prototype.setUrl = function (url) {
	this.url = url;
	return this;	
}
OpenLink.prototype.setOnClose = function (onClose) {
	this.onClose = onClose;
	return this;
}
OpenLink.prototype.setOpenAs = function (openAs) {
	this.openAs = openAs;
	return this;
}

//Emulates class AuthorizationAction extending Action for CardService service;
class AuthorizationAction extends e_CardService {
	constructor() {
		super();
		this.className = 'AuthorizationAction';
		this.url;
	}
}
/**
 * Sets authorization url to action to open;
 * @param {String} authorizationUrl url string to set;
 * @returns {Object}
 */
AuthorizationAction.prototype.setAuthorizationUrl = function(authorizationUrl) {
	this.url = authorizationUrl;
	return this;
}

//Emulate Class ActionResponseBuilder extending _CardService service;
class ActionResponseBuilder extends e_CardService {
	constructor() {
		super();
		this.navigation;
		this.notification;
		this.openLink;
		this.stateChanged = false;
	}
}
//add new methods to the class;
ActionResponseBuilder.prototype.setNavigation = function (navigation) {
	this.navigation = navigation;
	return this;	
}
ActionResponseBuilder.prototype.setNotification = function (notification) {
	this.notification = notification;
	return this;	
}
ActionResponseBuilder.prototype.setOpenLink = function (openLink) {
	this.openLink = openLink;
	return this;	
}
ActionResponseBuilder.prototype.setStateChanged = function (stateChanged) {
	this.stateChanged = stateChanged;
	return this;	
}
ActionResponseBuilder.prototype.build = function () {
	const notif = this.notification;
	if(notif) {
		const ui = $('#main-Ui-wrap');
		notif.appendToUi(ui);
		return this;
	}
}

//Emulate Class Notification for CardService service;
class Notification extends e_CardService {
	constructor() {
		super();
		this.text;
		this.type;
	}
}
//add new methods to the class;
Notification.prototype.setText = function (text) {
	this.text = text;
	return this;
}
Notification.prototype.setType = function (type) {
	this.type = type;
	return this;
}
Notification.prototype.appendToUi = function (/*parent*/) {
	const type = this.type;
	const text = this.text;
	const parent = $('#app-notif');
	parent.empty();
	
	//message bar;
	const notification = document.createElement('div');
	notification.className = 'ms-MessageBar';
	parent.append(notification);
	
	//message bar content;
	const content = document.createElement('div');
	content.className = 'ms-MessageBar-content';
	notification.append(content);
	
	//message bar icon;
	const icon = document.createElement('div');
	icon.className = 'ms-MessageBar-icon';
	content.append(icon);
	
	//message bar icon content;
	const icontent = document.createElement('i');
	icontent.className = 'ms-Icon';
	icon.append(icontent);
	
	//message bar text;
	const txt = document.createElement('div');
	txt.className = 'ms-MessageBar-text';
	txt.textContent = text;
	content.append(txt);
	
	if(type==='INFO') {
		icontent.classList.add('ms-Icon--Info');		
	}else if(type==='ERROR') {
		notification.classList.add('ms-MessageBar--error');
		icontent.classList.add('ms-Icon--ErrorBadge');		
	}else if(type==='WARNING') {
		notification.classList.add('ms-MessageBar--warning');
		icontent.classList.add('ms-Icon--Info');
	}
	
	window.setTimeout(function(){
		notification.remove();
	},3000);
	
}


//initiate services to be able to access them;
const CardService       = new e_CardService();