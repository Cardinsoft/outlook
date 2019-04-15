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
						AIRPLANE 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						BOOKMARK 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',	
						BUS 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						CAR 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						CLOCK 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						CONFIRMATION_NUMBER_ICON : 'https://cardinsoft.github.io/outlook/assets/icons/',
						DOLLAR 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						DESCRIPTION 			 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						EMAIL 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						EVENT_PERFORMER 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						EVENT_SEAT 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						FLIGHT_ARRIVAL 			 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						FLIGHT_DEPARTURE 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						HOTEL 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						HOTEL_ROOM_TYPE 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						INVITE 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						MAP_PIN 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						MEMBERSHIP 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						MULTIPLE_PEOPLE 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						OFFER 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						PERSON 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						PHONE 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						RESTAURANT_ICON 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						SHOPPING_CART 			 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						STAR 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						STORE 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						TICKET 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						TRAIN 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						VIDEO_CAMERA 			 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						VIDEO_PLAY 				 : 'https://cardinsoft.github.io/outlook/assets/icons/'
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

const CardService = new e_CardService();