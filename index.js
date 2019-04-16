// The initialize function must be run each time a new page is loaded;
Office.initialize = (reason) => {
	$(document).ready(function () {
		
		trigger();
		
		$('#home').click(function(){
			universalHome(e);
		});
		
		$('#settings').click(function(){
			universalSettings(e);
		});
		
		$('#help').click(function(){
			universalHelp(e);
		});
		
		$('#app-body').show();
	
		Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged,trigger);
	
	});
};

//===============================================CALLBACKS===============================================//

/**
 * Triggers cardOpen with global event object preserved (panel change issue);
 * @param {Object} obj event object containing curr message data;
 * @returns {Function}
 */
function trigger(obj) {
	return cardOpen(e);
}


/**
 * Creates an instance of Overlay;
 */
class Overlay {
	constructor() {
		this.element;
		this.className;
		this.color;
	}
	setColor(color) {
		this.color = color;
		return this;
	}
	show() {
		
		const doc = GLOBAL.document;
		
		const parent = doc.querySelector('#app-body');
		
		const overlay = doc.createElement('div');
		//if(this.color) { overlay.style.backgroundColor = this.color; }
		
		console.log(this);
		console.log(GLOBAL);		
		//let element = this.element;
		
		return this;
	}
	hide() {

		//parent.remove(this.element);
		return this;
	}
}


/**
 * Creates an instance of Spinner;
 */
class Spinner {
	constructor(element){
		this.parent    = parent;
		this.element   = element;
		this.className = 'spinner';
		this.size;
	}
	setSize(size) {
		this.size = 'spinner-'+size;
		return this;
	}
	build() {
		let element = this.element;
		let base    = this.className;
		let size    = this.size;
		
		element.className = [base,size].join(' ');
		return this;
	}
}


/**
 * Initiates callback function and updates Ui;
 * @param {Action} action object with action config (function name, load indicator and parameters);
 * @param {HtmlElement} element document markup element calling action;
 */
function actionCallback(action,element) {
	return async function() {
		//access action parameters;
		const functionName  = action.functionName;
		const loadIndicator = action.loadIndicator;
		const parameters    = action.parameters;
		
		//if provided, set load indicator;
		if(loadIndicator!=='NONE') {
			
			//const spinner = document.createElement('div');

			const o = new Overlay();
			o.setColor('black');
			o.show();
			/*
			const s = new Spinner(o,spinner);
			s.setSize('large');
			s.build();
			*/
	
			
		}

		//clear formInput and formInputs;
		e.formInput  = {};
		e.formInputs = {};
		
		//get form and access formInputs;
		const forms = document.getElementsByTagName('form');
		
		//if has forms -> set event objects formInput and formInputs params;
		if(forms.length>0) {
			
			for(let f=0; f<forms.length; f++) {
				let form = forms.item(f);
				
				//access form parameters;
				const inputs = form.elements;
				
				for(let i=0; i<inputs.length; i++) {
					let input = inputs.item(i);

					//access input parameter;
					let name  = input.name;
					let value = input.value;
					
					//set formInput and formInputs properties;
					if(name!=='') {
						
						//temp solution to check for Switches & Checkboxes;
						const cl = input.classList;
						
						const valueIndiff = cl.contains('ms-Toggle-input')||cl.contains('ms-CheckBox-input')||cl.contains('ms-RadioButton-input');
						if(valueIndiff) { 
							const isSelected = cl.contains('is-selected')||input.checked; 
							
							if(isSelected) {
								
								let exists = Object.keys(e.formInput).some((key) => { return key===name; });
								
								e.formInput[name] = value;
								if(!exists) { 
									e.formInputs[name] = [value];
								}else { 
									e.formInputs[name].push(value); 
								}
									
							}
							
						}else {
							e.formInput[name]  = value;	
							e.formInputs[name] = [value];
						}
					}
				}			
				
			}
			
		}
		
		//set parameters to event object;
		e.parameters = parameters;
		
		//invoke callback and await response;
		await GLOBAL[functionName](e,element);
		
		//$('#app-overlay').hide();
		
	}
}
//=========================================END CALLBACKS========================================//

//=======================================START GLOBAL OBJECTS===================================//
//emulate event object;
class e_EventObject {
	constructor() {
		this.messageMetadata = {
			accessToken : '',
			messageId : ''
		};
		this.formInput  = {};
		this.clientPlatform;
		this.formInputs = {};
		this.parameters = {};
		this.userLocale;
		this.userTimezone = {
			offset : '',
			id : ''
		}
	}
}

/**
 * Parses input into Boolean;
 * @param {*=} input input to parse;
 * @returns {Boolean}
 */
function toBoolean(input) {
	
	if(typeof input==='boolean') { return input; }
	
	const isString = typeof input==='string';
	
	if(!isString) { return Boolean(input); }else if(input==='false') { return false; }else { return true; }
}

const e = new e_EventObject();
const cardStack = [];
const GLOBAL    = this;