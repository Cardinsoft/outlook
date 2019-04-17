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

//Emulate CardService service;
class e_CardService {
	constructor() {
		this.className = 'CardService';
		this.ComposedEmailType = {
									REPLY_AS_DRAFT   : 'REPLY_AS_DRAFT',
									STANDALONE_DRAFT : 'STANDALONE_DRAFT'
								};
		this.ContentType = {
								TEXT           : 'TEXT',
								MUTABLE_HTML   : 'MUTABLE_HTML',
								IMMUTABLE_HTML : 'IMMUTABLE_HTML'
							};
		this.Icon = {
						NONE 					 : '',	
						AIRPLANE 				 : 'https://cardinsoft.github.io/outlook/Icons/Enum/AIRPLANE.png',
						BOOKMARK 				 : 'https://cardinsoft.github.io/outlook/Icons/Enum/BOOKMARK.png',	
						BUS 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/BUS.png',
						CAR 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/CAR.png',
						CLOCK 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/CLOCK.png',
						CONFIRMATION_NUMBER_ICON : 'https://cardinsoft.github.io/outlook/Icons/Enum/CONFIRMATION_NUMBER_ICON.png',
						DOLLAR 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/DOLLAR.png',
						DESCRIPTION 			 : 'https://cardinsoft.github.io/outlook/Icons/Enum/DESCRIPTION.png',
						EMAIL 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/EMAIL.png',
						EVENT_PERFORMER 		 : 'https://cardinsoft.github.io/outlook/Icons/Enum/EVENT_PERFORMER.png',
						EVENT_SEAT 				 : 'https://cardinsoft.github.io/outlook/Icons/Enum/EVENT_SEAT.png',
						FLIGHT_ARRIVAL 			 : 'https://cardinsoft.github.io/outlook/Icons/Enum/FLIGHT_ARRIVAL.png',
						FLIGHT_DEPARTURE 		 : 'https://cardinsoft.github.io/outlook/Icons/Enum/FLIGHT_DEPARTURE.png',
						HOTEL 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/HOTEL.png',
						HOTEL_ROOM_TYPE 		 : 'https://cardinsoft.github.io/outlook/Icons/Enum/HOTEL_ROOM_TYPE.png',
						INVITE 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/INVITE.png',
						MAP_PIN 				 : 'https://cardinsoft.github.io/outlook/Icons/Enum/MAP_PIN.png',
						MEMBERSHIP 				 : 'https://cardinsoft.github.io/outlook/Icons/Enum/MEMBERSHIP.png',
						MULTIPLE_PEOPLE 		 : 'https://cardinsoft.github.io/outlook/Icons/Enum/MULTIPLE_PEOPLE.png',
						OFFER 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/OFFER.png',
						PERSON 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/PERSON.png',
						PHONE 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/PHONE.png',
						RESTAURANT_ICON 		 : 'https://cardinsoft.github.io/outlook/Icons/Enum/RESTAURANT_ICON.png',
						SHOPPING_CART 			 : 'https://cardinsoft.github.io/outlook/Icons/Enum/SHOPPING_CART.png',
						STAR 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/STAR.png',
						STORE 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/STORE.png',
						TICKET 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/TICKET.png',
						TRAIN 					 : 'https://cardinsoft.github.io/outlook/Icons/Enum/TRAIN.png',
						VIDEO_CAMERA 			 : 'https://cardinsoft.github.io/outlook/Icons/Enum/VIDEO_CAMERA.png',
						VIDEO_PLAY 				 : 'https://cardinsoft.github.io/outlook/Icons/Enum/VIDEO_PLAY.png'
					};
		this.ImageStyle          = {
										SQUARE : 'SQUARE',
										CIRCLE : 'CIRCLE'
									};
		this.LoadIndicator       = {
										NONE    : 'NONE',
										SPINNER : 'SPINNER'
									};
		this.NotificationType    = {
										INFO    : 'INFO',
										WARNING : 'WARNING',
										ERROR   : 'ERROR'
									};
		this.OnClose             = {
										RELOAD_ADD_ON : 'RELOAD_ADD_ON',
										NOTHING       : 'NOTHING'
									};
		this.OpenAs              = {
										OVERLAY   : 'OVERLAY',
										FULL_SIZE : 'FULL_SIZE'
									};
		this.SelectionInputType  = {
										CHECK_BOX    : 'CHECK_BOX',
										RADIO_BUTTON : 'RADIO_BUTTON',
										DROPDOWN     : 'DROPDOWN'
									};
		this.TextButtonStyle     = {
										FILLED : 'FILLED'
									};
		this.UpdateDraftBodyType = {
										IN_PLACE_INSERT : 'IN_PLACE_INSERT'
									};
	}
}
//add new methods to the class;
e_CardService.prototype.newAction = function () {
	return new Action();
}
e_CardService.prototype.newAuthorizationAction = function () {
	return new AuthorizationAction();
}
e_CardService.prototype.newActionResponseBuilder = function () {
	return new ActionResponseBuilder();
}
e_CardService.prototype.newButtonSet = function () {
	return new ButtonSet();
}
e_CardService.prototype.newCardBuilder = function () {
	return new CardBuilder();
}
e_CardService.prototype.newCardHeader = function () {
	return new CardHeader();
}
e_CardService.prototype.newCardSection = function () {
	return new CardSection();
}
e_CardService.prototype.newKeyValue = function () {
	return new KeyValue();
}
e_CardService.prototype.newNavigation = function () {
	return new Navigation();
}
e_CardService.prototype.newNotification = function () {
	return new Notification();
}
e_CardService.prototype.newOpenLink = function () {
	return new OpenLink();
}
e_CardService.prototype.newSwitch = function () {
	return new Switch();
}
e_CardService.prototype.newTextButton = function () {
	return new TextButton();
}
e_CardService.prototype.newTextInput = function () {
	return new TextInput();
}
e_CardService.prototype.newSelectionInput = function () {
	return new SelectionInput();
}
e_CardService.prototype.newTextParagraph = function () {
	return new TextParagraph();
}
e_CardService.prototype.newUniversalActionResponseBuilder = function () {
	return new UniversalActionResponseBuilder(); 
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
		headerWrap.className = cardHeader.className;
		$('#app-body').prepend(headerWrap);
		
		if(this.cardHeader.imageUrl) {
			const icon = document.createElement('img');
			icon.src = this.cardHeader.imageUrl;
			icon.className = 'headerIcon';
			headerWrap.prepend(icon);
		}
		
		const header = document.createElement('p');
		header.className = 'ms-font-m-plus';
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


//initiate services to be able to access them;
const CardService = new e_CardService();