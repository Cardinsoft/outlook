// The initialize function must be run each time a new page is loaded;
Office.initialize = (reason) => {
	$(document).ready(function () {
		
		trigger();
		
		$('#home').click(async function(){
			
			let o = new Overlay();
			o.setColor('white');
			o.setTone('dark');
			o.show('#app-overlay');
			
			let s = new Spinner();
			s.setSize('large');
			s.show();
			
			await universalHome(e);
			
			o.hide('#app-overlay');
			s.hide();
			
		});
		
		$('#settings').click(async function(){
			
			let o = new Overlay();
			o.setColor('white');
			o.setTone('dark');
			o.show('#app-overlay');			
			
			let s = new Spinner();
			s.setSize('large');
			s.show();			
			
			await universalSettings(e);
			
			o.hide('#app-overlay');
			s.hide();
			
		});
		
		$('#help').click(async function(){
			
			let o = new Overlay();
			o.setColor('white');
			o.setTone('dark');
			o.show('#app-overlay');		

			let s = new Spinner();
			s.setSize('large');
			s.show();			
			
			await universalHelp(e);
			
			o.hide('#app-overlay');
			s.hide();
			
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
		this.className;
		this.color;
		this.tone;
	}
	setColor(color) {
		this.color = color;
		return this;
	}
	setTone(tone) {
		this.tone = tone;
		return this;
	}
	show(selector) {
		let doc = GLOBAL.document;
		
		let p = doc.querySelector(selector);
		let c = doc.createElement('div');
		
		p.append(c);
		
		if(this.color) {
			let list = c.classList;
			list.add('overlay');
			if(this.tone) { 
				list.add('overlay-'+this.tone); 
			}else { 
				list.add('overlay-light'); 
			}
			c.style.backgroundColor = this.color;
		}
		
		return this;
	}
	hide(selector) {
		let d = GLOBAL.document;
		
		let par = d.querySelector(selector);
		let chd = par.children.item(0);
		
		chd.remove();

		return this;
	}
}


/**
 * Creates an instance of Spinner;
 */
class Spinner {
	constructor(){
		this.className = 'spinner';
		this.size;
	}
	setSize(size) {
		this.size = 'spinner-'+size;
		return this;
	}
	show() {
		let d = GLOBAL.document;
		let p = d.querySelector('#app-overlay');
		let c = d.createElement('div');
		
		p.append(c);
		
		let base    = this.className;
		let size    = this.size;
		
		c.className = [base,size].join(' ');
		return this;
	}
	hide() {
		let d = GLOBAL.document;
		let c = d.querySelector('.spinner');
		c.remove();
	}
}


/**
 * Initiates callback function and updates Ui;
 * @param {Action} action object with action config (function name, load indicator and parameters);
 * @param {HtmlElement} element document markup element calling action;
 */
function actionCallback(action,element) {
	return async function() {
		
		console.log(action);
		
		//access action parameters;
		const functionName  = action.functionName;
		const loadIndicator = action.loadIndicator;
		const parameters    = action.parameters;

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
		
		//if provided, set load indicator;
		if(loadIndicator&&loadIndicator!=='NONE') {
			
			const o = new Overlay();
			o.setColor('black');
			o.show('#app-overlay');
			
			//invoke callback and await response;
			await GLOBAL[functionName](e,element);
			
			o.hide('#app-overlay');
			
			/*
			const s = new Spinner(o,spinner);
			s.setSize('large');
			s.build();
			*/
			
		}else {
			await GLOBAL[functionName](e,element);
		}
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