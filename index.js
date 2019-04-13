// The initialize function must be run each time a new page is loaded;
Office.initialize = (reason) => {
	$(document).ready(function () {
		
		cardOpen(e);
		
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
	
		Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged,cardOpen);
		//Office.context.mailbox.getUserIdentityTokenAsync(callbackUI);
	
	});
};

//===============================================CALLBACKS===============================================//
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
			const overlay = $('#app-overlay');
			//overlay.show();
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
						
						//temp solution to check forSwitches;
						const cl = input.classList;
						const isSwitch = cl.contains('ms-Toggle-input');
						if(isSwitch) { 
							const isSelected = cl.contains('is-selected'); 
							
							if(isSelected) {
								e.formInput[name]  = value;	
								e.formInputs[name] = [value];								
							}
							
						}else {
							e.formInput[name]  = value;	
							e.formInputs[name] = [value];
						}
					}
				}			
				
			}
			
		}
		console.log(e);
		
		//set parameters to event object;
		e.parameters = parameters;
		
		//invoke callback and await response;
		//await GLOBAL[functionName](e,element);
		
		
		await function (e) { return new Promise ( function (resolve) { GLOBAL[functionName](e) } ); }
	
		
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
 * Callback function to asyncronous call to get User Identity Token
 * @param {Object} tokenObj async Office context call result;
 */
function callbackUI(tokenObj) {
	e.messageMetadata.accessToken = tokenObj.value;
}

/**
 * Parses input into Boolean;
 * @param {*=} input input to parse;
 * @returns {Boolean}
 */
function toBoolean(input) {
	const output = false;
	
	const isString = typeof input==='string';
	
	if(!isString) { return Boolean(input); }else if(input==='false') { return false; }else { return true; }
	
	return output;
}

const e = new e_EventObject();
const cardStack         = [];
const GLOBAL            = this;