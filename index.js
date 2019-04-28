// The initialize function must be run each time a new page is loaded;
Office.initialize = (reason) => {
	$(document).ready(async function () {
		
		await trigger();
		
		
		const items = [
			{id : 'home',     icon : 'ms-Icon--Home',     text : 'Home', funcName : 'universalHome'},
			{id : 'settings', icon : 'ms-Icon--Settings', text : 'Settings', funcName : 'universalSettings'},
			{id : 'help',     icon : 'ms-Icon--Help',     text : 'Help', funcName : 'universalHelp'}
		];
		const menu = new Menu();
		menu.create(items);
		
		
		$('.navbar').click(function(){
			menu.switchShow();
		});
		
		$('#app-body').show();
	
		Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged,trigger);
	
	});
};

//===============================================CALLBACKS===============================================//

/**
 * Triggers cardOpen with global event object preserved (panel change issue);
 * @returns {Function}
 */
async function trigger() {
	const e = new e_EventObject();
	await cardOpen(e);
}


/**
 * Creates an instance of Menu;
 */
class Menu {
	constructor() {
		this.className = 'Menu';
	}
	create(items) {
		let doc = GLOBAL.document;
		
		const navbar = doc.querySelector('.navbar');
		
		const menu = doc.createElement('div');
		menu.classList.add(this.className,'singulared');
		navbar.append(menu);
		
		for(let i=0; i<items.length; i++) {
			let item = items[i];
			
			let menuItem = document.createElement('div');
			menuItem.classList.add('menuItem');
			menu.append(menuItem);
			
			let menuText = document.createElement('p');
			menuText.classList.add('menuText',item.icon);
			menuText.textContent = item.text;
			menuItem.append(menuText);
			
			menuItem.addEventListener('click',async function(){
				let o = new Overlay();
				o.setColor('white');
				o.setTone('dark');
				o.show('#app-overlay');		

				let s = new Spinner();
				s.setSize('large');
				s.show();		

				const e = new e_EventObject();
				
				await GLOBAL[item.funcName](e);
				
				o.hide('#app-overlay');
				s.hide();				
			});
			
		}
		
	}
	switchShow() {
		let doc = GLOBAL.document;
		const elem = doc.querySelector('.Menu');
		elem.classList.toggle('singulared');
	}
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
 * @param {HtmlElement} elem caller element;
 * @returns {Function}
 */
function actionCallback(elem) {
	
	//access action by its identifier;
	const action = e_actions[elem.getAttribute('action')];
	
	//construct event object;
	const e = new e_EventObject();

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
		
		//parse action object;
		const a = JSON.parse(action);

		//access action parameters;
		const functionName  = a.functionName;
		const loadIndicator = a.loadIndicator;
		const params        = a.parameters;
		
		//set parameters to event object;
		e.parameters = params;
		
		console.log(e)
		
		//if provided, set load indicator;
		if(loadIndicator&&loadIndicator!=='NONE') {
			
			const o = new Overlay();
			o.setColor('white');
			//o.show('#app-overlay');
			
			let s = new Spinner();
			s.setSize('large');
			//s.show();
			
			//invoke callback and await response;
			return GLOBAL[functionName](e);
			
			o.hide('#app-overlay');
			//s.hide();
			
		}else {
			return GLOBAL[functionName](e);
		}
}
//=========================================END CALLBACKS========================================//

/**
 * Trims property value of pixel measurements;
 * @param {String|*} input property value (expected type string);
 * @returns {Integer|undefined}
 */
function trimPx(input) {
	if(input&&typeof input==='string') { return +input.replace('px',''); }
}

/**
 * Set height to computed from number of uncollapsible widgets;
 * @param {Integer} numuncol number of widgets to show;
 * @param {HtmlElement} overlay wrapper element to uncollapse;
 */
function uncollapsible(numuncol,overlay) {		
		
	if(!numuncol) { return 0; }	
	
	//access children;
	const children = overlay.children;
	const chLength = children.length;
	let fullHeight = 0;
	for(let c=0; c<chLength; c++) {
		let child     = children.item(c);
		let computed  = window.getComputedStyle(child);
		let computedT = trimPx(computed.marginTop);
		let computedH = trimPx(computed.height);
		let computedB = trimPx(computed.marginBottom);
						
		if((c+1)<=numuncol) {
			if(c===0) { 
				fullHeight += computedT + computedH; 
			}else {
				fullHeight += computedB + computedH;
			}
		}	
	}			
	
	return fullHeight;
}

/**
 * Expands or collapses element;
 * @param {HtmlElement} trigger element trggering event;
 * @param {Htmlelement} overlay element to toggle;
 * @param {String} property property to animate;
 * @param {Integer} interval delay between incremenets;
 * @param {Integer} increment animation speed;
 * @param {Integer} initial initial value to start from;
 */			
function collapse(trigger,overlay,property,interval,increment,initial) {	
	return async function() {

		//compute child elems height;
		let chProperty = 0, margins = 0, children = overlay.children, end = initial, change = increment;
		for(var i=0; i<children.length; i++) {
			let chcomp = window.getComputedStyle(children.item(i));
			chProperty += trimPx(chcomp[property]);
			if(property==='height') {
				let chMargin;
				if(i>0) { 
					chMargin = trimPx(chcomp.marginBottom); 
				}else { 
					chMargin = trimPx(chcomp.marginTop); 
				}
				margins += chMargin;
				chProperty += chMargin;
			}
		}
					
		//compute and set height to element;
		const computed = trimPx(window.getComputedStyle(overlay)[property]);
		overlay.style[property] = computed+'px';
						
		//if element is collapsed -> inverse increment;
		if(computed===initial) { 
			change = -increment;
			end = chProperty; 
		}
					
		//set recursive timeout to change height;
		let t = setTimeout( function wait() {
			trigger.disabled = true;
			
			let newProp = trimPx(overlay.style[property])-change;
			
			if(newProp<initial)    { newProp = initial; }
			if(newProp>chProperty) { newProp = chProperty; }
			
			if(end>initial&&newProp>end) {  newProp = end; }
			
			overlay.style[property] = newProp+'px';
			
			let currProp = trimPx(overlay.style[property]);
			
			if(currProp===end) { 
				trigger.disabled = false
				return clearTimeout(t); 
			}
			t = setTimeout( wait, interval );
		}, interval );
	}
}

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


/**
 * Gets base64-encoded random Id;
 * @returns {String|Function}
 */
function getId() {
	let id = GLOBAL.btoa(Math.random().toString());
	
	const isUnique = function(a,i){ 
		let result =true;
		for(let p in a) {		
			if(a[p].id===i) { result = false; }
		}
		return result;
	}(e_actions,id);
	
	if(isUnique) { return id }else { return getId(); }
}

/**
 * Processes action and sets reference to widget;
 * @param {HtmlElement} element element on which to set reference;
 * @param {String} action stringifyed action object;
 */
function setAction(element,action) {
	//parse action if found;
	action = JSON.parse(action);
		
	//change cursor to pointer on hover;
	element.classList.add('pointer');
		
	//get unique identifier;
	let id = getId();
		
	//set stringifyed action to global storage;
	e_actions[id] = JSON.stringify(action);
		
	//add action reference to widget;
	element.setAttribute('action',id);	
}

const cardStack = [];
const GLOBAL    = this;
const e_actions = {};