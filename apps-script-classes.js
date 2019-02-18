//Emulate CardService service;
class W_CardService {
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
W_CardService.prototype.newAction = function () {
	return new Action();
}
W_CardService.prototype.newActionResponseBuilder = function () {
	return new ActionResponseBuilder();
}
W_CardService.prototype.newButtonSet = function () {
	return new ButtonSet();
}
W_CardService.prototype.newCardBuilder = function () {
	return new CardBuilder();
}
W_CardService.prototype.newCardHeader = function () {
	return new CardHeader();
}
W_CardService.prototype.newCardSection = function () {
	return new CardSection();
}
W_CardService.prototype.newKeyValue = function () {
	return new KeyValue();
}
W_CardService.prototype.newNavigation = function () {
	return new Navigation();
}
W_CardService.prototype.newNotification = function () {
	return new Notification();
}
W_CardService.prototype.newOpenLink = function () {
	return new OpenLink();
}
W_CardService.prototype.newSwitch = function () {
	return new Switch();
}
W_CardService.prototype.newTextButton = function () {
	return new TextButton();
}
W_CardService.prototype.newTextInput = function () {
	return new TextInput();
}
W_CardService.prototype.newTextParagraph = function () {
	return new TextParagraph();
}
W_CardService.prototype.newUniversalActionResponseBuilder = function () {
	return new UniversalActionResponseBuilder(); 
}

console.log(new W_CardService());
