//initiate services to be able to access them;
const UrlFetchApp = new _UrlFetchApp();
const CardService = new _CardService();

//Emulate UrlFetchApp service;
class _UrlFetchApp {
	constructor() {
		this.className = 'UrlFetchApp';
	}
}
_UrlFetchApp.prototype.fetch = async function (url,params) {
	let promise = await makeRequest(url,params);
	return processFetch(promise);
}
function processFetch(result) {
	console.log('PROCESSED --- '+result);
	return result;
}
function makeRequest(url,params) {
	return new Promise(function (resolve,reject) {
		
		let request = new XMLHttpRequest();
			request.timeout = 29000;
			request.open(params.method.toUpperCase(),url);
		if(params.contentType!==undefined) { request.setRequestHeader('Content-Type',params.contentType); }
			
		request.onload = function () {
			let response   = request.response;
			let statusText = request.statusText; 
			if(status>=200&&status<300) {	
				resolve(response);
			}else {
				reject(statusText);
			}	
		}
			
		request.ontimeout = function () {
			let statusText = request.statusText; 
			resolve(statusText);
		}
			
		if(params.payload!==undefined) {
			request.send(params.payload);
		}else {
			request.send();
		}
		
	});
}

//Emulate CardService service;
class _CardService {
	constructor() {
		this.className = 'CardService';
		this.ComposedEmailType;
		this.ContentType;
		this.Icon;
		this.ImageStyle;
		this.LoadIndicator;
		this.NotificationType;
		this.OnClose;
		this.OpenAs;
		this.SelectionInputType;
		this.TextButtonStyle;
		this.UpdateDraftBodyType;
	}
}
_CardService.prototype.newAction = function () {
	return new Action();
}
_CardService.prototype.newActionResponseBuilder = function () {
	//return new ActionRes
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
	//return new 
}

//Emulate Class Card for CardService service;
class Card extends _CardService {
	constructor() {
		super();
		this.className = 'Card';
	}
}
//add new methods to the class;
Card.prototype.printJSON = function () {
	return JSON.stringify(this);
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
	
	const panel = document.createElement('div');
	panel.id = 'main-Ui';
	panel.className = 'ms-Panel';
	
	const wrap = document.createElement('div');
	wrap.id = 'main-Ui-wrap'
	wrap.className = 'ms-Panel-contentInner';
	
	const addInnHeader = document.createElement('div');
	addInnHeader.className = 'ms-CommandBar ms-CommandBar--navBar navbar';
	
	const header = document.createElement('p');
	header.id = 'main-Ui-header';
	header.className = 'ms-Panel-headerText';
	header.textContent = this.cardHeader.title;
	
	$('#tester').append(panel);
	$('#app-body').append(addInnHeader);
	$('#app-body').append(wrap);
	$('#main-Ui-wrap').append(header);
		
	if(cardSections.length!==0) {
		let serialize = true;
		if(cardSections.length!==1) { serialize = true; }else { serialize = false; }
		cardSections.forEach(function(cardSection){
			cardSection.appendToUi( $('#main-Ui-wrap'),serialize );
		});
	}
	
	new fabric['Panel'](panel);
	
	return this;
};

//sets load indicator if provided, executes function by its name when an event is registered, awaits for function to resolve then removes indicator;
function cardActionCallback(cardAction) {
	return function(e) {
		const functionName  = cardAction.functionName;
		const loadIndicator = cardAction.loadIndicator;
		const parameters    = cardAction.parameters;
		
		if(loadIndicator!=='NONE') {
			const indicator = document.createElement('div');
			indicator.id = 'main-Ui-spinner';
			indicator.className = 'ms-Spinner ms-Spinner--large';
			$('#main-Ui-wrap').append(indicator);
			new fabric['Spinner'](indicator);			
		}
		
		window[functionName](parameters)
		.then(function(){
			if(loadIndicator!=='NONE') { $('#main-Ui-spinner').remove(); }
		});
	}
}

//test function;
function blink(parameters) {
	return new Promise(
		function(resolve) {
			setTimeout(function() { resolve(); },3000);
		}
	);
}

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
CardHeader.prototype.setSubtitle = function (title) {
	this.title = title;
	return this;
};
CardHeader.prototype.setTitle = function (subtitle) {
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
		section.className = 'ms-Grid separated '+this.className;
	}else {
		section.className = 'ms-Grid '+this.className;
	}
	section.dir = 'ltr';

	if(this.header!==undefined) {
		const header = document.createElement('p');
		header.className = 'ms-font-m-plus sectionHeader';
		header.textContent = this.header;
		section.append(header);
	}	
	
	//add handling for collapse, header and uncollapsible widgets;
	
	const widgetsWrap = document.createElement('div');
	if(collapsible) { widgetsWrap.className = 'closed'; }
	section.append(widgetsWrap);
	
	const widgets = this.widgets;
	if(widgets.length!==0) {
		widgets.forEach(function(widget,index){
			widget.appendToUi(widgetsWrap,index);
		});
	}

	if(collapsible) {
		//const togglerWrap = document.
		
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

//Emulate Class Action for CardService service;
class Action extends _CardService {
	constructor() {
		super();
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

//sets load indicator if provided, executes function by its name when an event is registered, awaits for function to resolve then removes indicator;
function actionCallback(action) {
	return function(e) {
		const functionName  = action.functionName;
		const loadIndicator = action.loadIndicator;
		const parameters    = action.parameters;
		
		if(loadIndicator!=='NONE') {		
			const indicator = document.createElement('div');
			indicator.id = 'main-Ui-spinner';
			indicator.className = 'ms-Spinner ms-Spinner--large';
			$('#main-Ui-wrap').append(indicator);
			new fabric['Spinner'](indicator);	
		}
		
		window[functionName](parameters)
		.then(function(){
			if(loadIndicator!=='NONE') { $('#main-Ui-spinner').remove(); }
		});
	}
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
OpenLink.prototype.setOnClose = function (url) {
	this.url = url;
	return this;
}
OpenLink.prototype.setOpenAs = function (onClose) {
	this.onClose = onClose;
	return this;
}
OpenLink.prototype.setUrl = function (openAs) {
	this.openAs = openAs;
	return this;
}

//Emulate Class Notification for CardService service;
class Notification extends _CardService {
	constructor() {
		super();
		this.className = 'Notification';
		this.type;
		this.text;
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

//Emulate base Class Widget for CardService service;
class Widget extends _CardService {
	constructor() {
		super();
		this.className = 'Widget';
	}
}

//Emulate Class Switch for CardService service;
class Switch extends _CardService {
	constructor() {
		super();
		this.className = 'Switch';
		this.fieldName;
		this.action;
		this.selected;
		this.value;
	}
}
//add new methods to the class;
Switch.prototype.setFieldName = function (fieldName) {
	this.fieldName = fieldName;
	return this;
};
Switch.prototype.setOnChangeAction = function (action) {
	this.action = action;
	return this;	
};
Switch.prototype.setSelected = function (selected) {
	this.selected = selected;
	return this;	
};
Switch.prototype.setValue = function (value) {
	this.value = value;
	return this;	
};
Switch.prototype.appendToUi = function (parent) {
	const fieldName = this.fieldName;
	const action    = this.action;
	const selected  = this.selected;
	const value     = this.value;
	
	const pToggle = document.createElement('p');
	parent.append(pToggle);
	
	const wrapToggle = document.createElement('div');
	wrapToggle.className = 'ms-Toggle ms-font-m-plus '+this.className;
	pToggle.append(wrapToggle);
	if(action!==undefined) { wrapToggle.addEventListener('click',actionCallback(action)); }
	
	const input = document.createElement('input');
	input.type = 'checkbox';
	input.id = fieldName;
	input.className = 'ms-Toggle-input';
	wrapToggle.append(input);	
	
	const label = document.createElement('label');
	if(value) {
		label.className = 'ms-Toggle-field is-selected';
	}else {
		label.className = 'ms-Toggle-field';
	}
	wrapToggle.append(label);
	
	new fabric['Toggle'](wrapToggle);
}

class TextInput extends Widget {
	constructor() {
		super();
		this.className = 'TextInput';
		this.fieldName;
		this.hint;
		this.multiline;
		this.action;
		//this.suggestions;
		//this.suggestionsAction;
		this.title;
		this.value;
	}
}
//add new methods to the class;
TextInput.prototype.setFieldName = function (fieldName) {
	this.fieldName = fieldName;
	return this;
};
TextInput.prototype.setHint = function (hint) {
	this.hint = hint;
	return this;
}
TextInput.prototype.setMultiline = function (multiline) {
	this.multiline = multiline;
	return this;
}
TextInput.prototype.setOnChangeAction = function (action) {
	this.action = action;
	return this;
}
TextInput.prototype.setTitle = function (title) {
	this.title = title;
	return this;
}
TextInput.prototype.setValue = function (value) {
	this.value = value;
	return this;
};
TextInput.prototype.appendToUi = function (parent) {
	const fieldName = this.fieldName;
	const action    = this.action;
	const value     = this.value;
	const multiline = this.multiline;
	const title     = this.title;
	const hint      = this.hint;

	const widget = document.createElement('div');
	widget.className = 'ms-Grid-row '+this.className;
	parent.append(widget);
	
	const row = document.createElement('div');
	row.className = 'ms-Grid-col ms-sm12 ms-md12 ms-lg12';
	widget.append(row);
	
	const pRow = document.createElement('p');
	row.append(pRow);
	
	if(title!==undefined) {	
		const topLabel = document.createElement('label');
		topLabel.className = 'ms-fontSize-s TextInputTopLabel';
		topLabel.textContent = title;
		pRow.append(topLabel);
	}
	
	const inputWrap = document.createElement('div');
	inputWrap.className = 'ms-TextField ms-TextField--underlined';
	pRow.append(inputWrap);
	
	const label = document.createElement('label');
	label.className = 'ms-Label TextInputLabel';
	inputWrap.append(label);

	const input = document.createElement('input');
	input.type = 'text';
	input.className = 'ms-TextField-field TextInputInput';
	input.value = value;
	if(action!==undefined) { input.addEventListener('focusout',actionCallback(action)); }
	inputWrap.append(input);
	
	new fabric['TextField'](inputWrap);
	
	if(hint!==undefined) {
		const bottomLabel = document.createElement('label');
		bottomLabel.className = 'ms-fontSize-s TextInputBottomLabel';
		bottomLabel.textContent = hint;
		pRow.append(bottomLabel);
	}
}

//Emulate Class ButtonSet for CardService service;
class ButtonSet extends _CardService {
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
	btnRow.className = 'ms-Grid-row '+this.className;
	parent.append(btnRow);
	
	const wrapBtn = document.createElement('div');
	wrapBtn.className = 'ms-Grid-col ms-sm12 ms-md12 ms-lg12';
	btnRow.append(wrapBtn);
	
	const pBtn = document.createElement('p');
	wrapBtn.append(pBtn);
	
	buttons.forEach(function(button) {
		const backgroundColor = button.backgroundColor;
		const text = button.text;
		const disabled = button.disabled;
		const textButtonStyle = button.textButtonStyle;	
		const action = button.action;
		
		const btn = document.createElement('button');
		if(disabled) {
			btn.className = 'ms-Button ms-Button--small'+button.className;
		}else {
			btn.className = 'ms-Button ms-Button--small ms-Button--primary '+button.className;
		}
		btn.disabled = disabled;
		pBtn.append(btn);		
		
		const btnContent = document.createElement('span');
		btnContent.className = 'ms-Button-label';
		btnContent.textContent = text;
		btn.append(btnContent);

		new fabric['Button'](btn, actionCallback(action) );	
	});

}

//Emulate base Class Button for CardService service;
class Button extends _CardService {
	constructor() {
		super();
		this.className = 'Button';
		this.action;
		this.composedEmailType;
	}
}
//add new methods to the class;
Button.prototype.setAuthorizationAction = function (action) {
	this.action = action;
	return this;
}
Button.prototype.setComposeAction = function (action,composedEmailType) {
	this.action = action;
	this.composedEmailType = composedEmailType;
	return this;
}
Button.prototype.setOnClickAction = function (action) {
	this.action = action;
	return this;
}
Button.prototype.setOnClickOpenLinkAction = function (action) {
	this.action = action;
	return this;
}
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
	const text = this.text;
	const disabled = this.disabled;
	const textButtonStyle = this.textButtonStyle;
	const action = this.action;	
	
	const btnRow = document.createElement('div');
	btnRow.className = 'ms-Grid-row '+this.className;
	parent.append(btnRow);
	
	const wrapBtn = document.createElement('div');
	wrapBtn.className = 'ms-Grid-col ms-sm12 ms-md12 ms-lg12';
	btnRow.append(wrapBtn);
	
	const pButton = document.createElement('p');
	wrapBtn.append(pButton);	
	
	const button = document.createElement('button');
	button.disabled = disabled;
	if(disabled) {
		button.className = 'ms-Button ms-Button--small '+this.className;
	}else {
		button.className = 'ms-Button ms-Button--small ms-Button--primary '+this.className;
	}
	pButton.append(button);
		
	const btnContent = document.createElement('span');
	btnContent.className = 'ms-Button-label';
	btnContent.textContent = text;
	button.append(btnContent);
		
	new fabric['Button'](button, actionCallback(action) );	
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
	widget.className = 'ms-Grid-row '+this.className;
	widget.tabindex = index;
	parent.append(widget);
	
	//handle image creation;
	if(this.url!==undefined) {
		const wrapImg = document.createElement('div');
		wrapImg.className = 'ms-Grid-col ms-sm4 ms-md3 ms-lg2';
		widget.append(wrapImg);
		
		const pImg = document.createElement('p');
		wrapImg.append(pImg);
		
		const img = document.createElement('img');
		img.className = 'KeyValueImage';
		img.src = this.url;
		if(this.altText!==undefined) { img.alt = this.altText; }
		pImg.append(img);
	}
	
	//handle label and content creation;
	const wrapText = document.createElement('div');
	wrapText.className = 'ms-Grid-col ms-sm4 ms-md6 ms-lg8';
	widget.append(wrapText);
	
	const pText = document.createElement('p');
	wrapText.append(pText);
	
	if(this.topLabel!==undefined) {	
		const label = document.createElement('label');
		label.className = 'ms-fontSize-s KeyValueLabel';
		label.textContent = this.topLabel;
		pText.append(label);
	}
	const content = document.createElement('span');
	content.className = 'ms-font-m-plus KeyValueText';
	content.textContent = this.content;
	pText.append(content);
	
	//handle button or switch creation;
	const btn = this.button;
	const sw  = this.switchToSet;
	
	if(btn!==undefined||sw!==undefined) {
		const wrapButton = document.createElement('div');
		wrapButton.className = 'ms-Grid-col ms-sm4 ms-md3 ms-lg2';
		widget.append(wrapButton);	
	
		if(btn!==undefined) {
			const backgroundColor = btn.backgroundColor;
			const text = btn.text;
			const disabled = btn.disabled;
			const textButtonStyle = btn.textButtonStyle;
			
			const action = btn.action;	
			
			const pButton = document.createElement('p');
			wrapButton.append(pButton);	
			
			const button = document.createElement('button');
			button.disabled = disabled;
			if(disabled) {
				button.className = 'ms-Button ms-Button--small '+btn.className;
			}else {
				button.className = 'ms-Button ms-Button--small ms-Button--primary '+btn.className;
			}
			pButton.append(button);
				
			const btnContent = document.createElement('span');
			btnContent.className = 'ms-Button-label';
			btnContent.textContent = text;
			button.append(btnContent);
				
			new fabric['Button'](button, actionCallback(action) );
		}
		
		if(sw!==undefined) {
			sw.appendToUi(wrapButton);
		}
		
	}
}

class Notification extends _CardService {
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
Notification.prototype.appendToUi = function (parent) {
	const type = this.type;
	const text = this.text;
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
	},10000);
	
}

class Message {
	constructor(msgFrom,msgBcc,msgCc,msgDate,msgPlainBody,msgSubject) {
		this.msgFrom = msgFrom;
		this.msgBcc = msgBcc;
		this.msgCc = msgCc;
		this.msgDate = msgDate;
		this.msgPlainBody = msgPlainBody;
		this.msgSubject = msgSubject;
	}
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