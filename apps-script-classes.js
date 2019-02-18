document.ready(function(){
	console.log(new __CardService());
});

//Emulate CardService service;
class __CardService {
	constructor() {
		this.className = 'CardService';
		this.ComposedEmailType = {REPLY_AS_DRAFT:'REPLY_AS_DRAFT',STANDALONE_DRAFT:'STANDALONE_DRAFT'};
		this.ContentType;
		this.Icon;
		this.ImageStyle = {SQUARE:'SQUARE',CIRCLE:'CIRCLE'};
		this.LoadIndicator = {NONE:'NONE',SPINNER:'SPINNER'};
		this.NotificationType = {INFO:'INFO',WARNING:'WARNING',ERROR:'ERROR'};
		this.OnClose = {RELOAD_ADD_ON:'RELOAD_ADD_ON',NOTHING:'NOTHING'};
		this.OpenAs = {OVERLAY:'OVERLAY',FULL_SIZE:'FULL_SIZE'};
		this.SelectionInputType = {CHECK_BOX:'CHECK_BOX',RADIO_BUTTON:'RADIO_BUTTON',DROPDOWN:'DROPDOWN'};
		this.TextButtonStyle = {FILLED:'FILLED'};
		this.UpdateDraftBodyType = {IN_PLACE_INSERT:'IN_PLACE_INSERT'};
	}
}
_CardService.prototype.newAction = function () {
	return new Action();
}
_CardService.prototype.newActionResponseBuilder = function () {
	return new ActionResponseBuilder();
}
_CardService.prototype.newButtonSet = function () {
	return new ButtonSet();
}
_CardService.prototype.newCardBuilder = function () {
	return new CardBuilder();
}
_CardService.prototype.newCardHeader = function () {
	return new CardHeader();
}
_CardService.prototype.newCardSection = function () {
	return new CardSection();
}
_CardService.prototype.newKeyValue = function () {
	return new KeyValue();
}
_CardService.prototype.newNavigation = function () {
	return new Navigation();
}
_CardService.prototype.newNotification = function () {
	return new Notification();
}
_CardService.prototype.newOpenLink = function () {
	return new OpenLink();
}
_CardService.prototype.newSwitch = function () {
	return new Switch();
}
_CardService.prototype.newTextButton = function () {
	return new TextButton();
}
_CardService.prototype.newTextInput = function () {
	return new TextInput();
}
_CardService.prototype.newTextParagraph = function () {
	return new TextParagraph();
}
_CardService.prototype.newUniversalActionResponseBuilder = function () {
	return new UniversalActionResponseBuilder(); 
}
