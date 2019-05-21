// The initialize function must be run each time a new page is loaded;
Office.initialize = (reason) => {
	$(document).ready(async () => {

		const homeAction = CardService.newAction();
			homeAction.setFunctionName('universalHome');
			homeAction.setLoadIndicator(CardService.LoadIndicator.SPINNER);
				
		const settingsAction = CardService.newAction();
			settingsAction.setFunctionName('universalSettings');
			settingsAction.setLoadIndicator(CardService.LoadIndicator.SPINNER);
			
		const advancedAction = CardService.newAction();
			advancedAction.setFunctionName('universalAdvanced');
			advancedAction.setLoadIndicator(CardService.LoadIndicator.SPINNER);		
				
		const helpAction = CardService.newAction();
			helpAction.setFunctionName('universalHelp');
			helpAction.setLoadIndicator(CardService.LoadIndicator.SPINNER);	

		const items = [
			{icon : 'ms-Icon--Home',       text : 'Home',     action : JSON.stringify(homeAction)},
			{icon : 'ms-Icon--Settings',   text : 'Settings', action : JSON.stringify(settingsAction)},
			{icon : 'ms-Icon--Processing', text : 'Advanced', action : JSON.stringify(advancedAction)},
			{icon : 'ms-Icon--Help',       text : 'Help',     action : JSON.stringify(helpAction)}
		];
		
		//initiate menu with universal actions;
		const menu = new Menu();
		menu.create(items);
		$('.navelem').click( (event) => {
			event.preventDefault();
			menu.switchShow();
		});
		
		$('#app-body').show();
		
		//close menu on out-of-boundaries click;
		$('#app-clickarea').click( (event) => {
			
			event.stopPropagation();
			
			let computed = window.getComputedStyle(menu.menu);
			let width    = trimPx(computed.width);
			let height   = trimPx(computed.height);

			if(width>0) {
				
				let cr = menu.menu.getBoundingClientRect();
				let t = cr.top;
				let l = cr.left;
				let r = cr.right;
				//let b = cr.bottom;
				let mx = event.clientX;
				let my = event.clientY;

				if(((mx<l||mx>width)&&my>=t&&my<=height)||my<t||my>height) {
					console.log('switching')
					console.log(cr)
					console.log(mx)
					console.log(my)
					menu.switchShow();
				}	
			}
		});
		
		//show app body overlay;
		const o = new Overlay();
		o.setColor('white');
		o.show('#app-overlay');
			
		//show spinner on overlay;
		const s = new Spinner();
		s.setSize('large');
		s.show();
		
		await trigger();
		
		o.hide('#app-overlay');
		s.hide();
		
	
		Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged,trigger);
	
	});
};

//=======================================START Ui Classes======================================//

/**
 * Creates an instance of Menu;
 */
class Menu {
	constructor() {
		this.className = 'Menu';
		this.menu;
		this.isOpen = false;
	}
	create(items) {
		const navbar = document.querySelector('.navbar');
		
		const menu = document.createElement('div');
		menu.classList.add(this.className,'singulared');
		navbar.append(menu);
		
		//set element reference
		this.menu = menu;		
		
		for(let i=0; i<items.length; i++) {
			let item = items[i];	
			this.addItem(item);
		}
		
		this.isOpen = true;
		menus.push(this);
	}
	addItem(item,toTop) {
		let self   = this;
		let menu   = this.menu;
		let action = item.action;
		
		//create menu item;
		let menuItem = document.createElement('div');
		if(item.classList) {
			item.classList.forEach((cl) => {
				menuItem.classList.add(cl);
			});
		}
		menuItem.classList.add('menuItem');
			
		if(toTop) { 
			menu.prepend(menuItem); 
		}else { 
			menu.append(menuItem); 
		}
		
		//set item's icon and text;
		let menuText = document.createElement('p');
			menuText.textContent = item.text;
		
		let cl = menuText.classList;
			cl.add('menuText');
		if(item.icon) { cl.add(item.icon); }
		
		menuItem.append(menuText);
		
		//set reference;
		setAction(menuItem,action);
			
		menuItem.addEventListener('click',async function(){	
			self.switchShow();
			await actionCallback(this);		
		});
	}
	removeItem(index) {
		let menu = menus[0].menu;
		menu.children.item(index).remove();
	}
	switchShow() {
		let menu = menus[0].menu;
		let cl = menu.classList;
		if(cl.contains('singulared')) { menus[0].isOpen = true; }else { menus[0].isOpen = false; }
		menu.classList.toggle('singulared');
	}
}

/**
 * Creates an instance of Selector;
 */
class Selector {
	constructor(){
        this.className = 'Select';
        this.element;
        this.options = [];
        this.isOpen = false;
    }
    create(parent,name) {
        //create displayed select wrapper;
        const wrap = document.createElement('div');
        wrap.classList.add(this.className/*,'singulared'*/);
        parent.append(wrap);

        //create select for form input;
        const input = document.createElement('select');
        input.name = name;
        input.hidden = true;
        wrap.append(input);
		  
        this.element = wrap;
          
        return this;
    }
    add(items) {
      	//add item to instance;
        const opt  = this.options;
        const elem = this.element;
        
        //add items to select;
        if(items instanceof Array) {
        	items.forEach( (item) => { opt.push(item); });
        }else {
        	opt.push(items);
		}
        
        //append options to select;
        opt.forEach( (o) => {      
            //create displayed option;
            const optionUi = document.createElement('div');
            optionUi.classList.add('selectItem');
            elem.append(optionUi);
            
            //create displayed text;
            const text = document.createElement('p');
            text.textContent = o.text;
            text.classList.add('selectText');
            optionUi.append(text);
            
            //create option for form input;
            const option = document.createElement('option');
            option.value = o.value;
            elem.children.item(0).append(option);  
        });
		
    return this;
	}
    remove(index) {
        //remove item from instance;
        const opt = this.options;
        opt.splice(index,1);
        this.element.children.item(index+1).remove();
          
        return this;
    }
    select(index) {
        //select option;
        const opt  = this.options;
        const elem = this.element;
          
        opt[index].selected = true;
        opt.forEach( (o,idx) => {
            if(o.selected&&idx!==index) { o.selected = false; }
        });
          
        //elem.children.item(0).children.item(index).selected = true;
		
		return this;
    }
    toggle() {
		
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
		this.overlay;
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
		let p = document.querySelector(selector);
		let c = document.createElement('div');
		
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
		
		this.overlay = c;
		return this;
	}
	hide() {		
		this.overlay.remove();
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

//=======================================START Ui Classes======================================//

//========================================START CALLBACKS======================================//

/**
 * Triggers cardOpen with global event object preserved (panel change issue);
 * @returns {Function}
 */
async function trigger() {
	const e = new e_EventObject();
	await cardOpen(e);
}


/**
 * Initiates callback function and updates Ui;
 * @param {HtmlElement} elem caller element;
 * @returns {Function}
 */
async function actionCallback(elem) {
	
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
				
		//if provided, set load indicator;
		if(!loadIndicator||loadIndicator!=='NONE') {
			
			const o = new Overlay();
			o.setColor('white');
			o.show('#app-overlay');
			
			let s = new Spinner();
			s.setSize('large');
			s.show();
			
			//invoke callback and await response;
			await GLOBAL[functionName](e);
			
			o.hide();
			s.hide();
			
		}else {
			await GLOBAL[functionName](e);
		}
		
	return;
}
//==========================================END CALLBACKS=======================================//

//=========================================START UTILITIES======================================//

/**
 * Matches input for missing target="_blank" attribute and adds it;
 * @param {String} input <a> html tag string to check;
 * @returns {String}
 */
function checkTarget(input) {
	const regexp = /(<a\s*?href=".+?"\s*?>.*?<\/a>)/g;
	const result = input.match(regexp);
	if(result&&result.length>0) {
		for(let r=0; r<result.length; r++) {
			let matched = result[r];
			if(!matched.includes('target="_blank"')) {
				let tmp = matched.split(' ');
              		tmp.splice(1,0,'target="_blank"');
				input = input.replace(matched,tmp.join(' '));
            }
		}
	}
	return input;
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
 * Gets base64-encoded "random" Id;
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
		let chProperty = 0, children = overlay.children, end = initial, change = increment;
		for(let i=0; i<children.length; i++) {
			let chcomp = window.getComputedStyle(children.item(i));
			chProperty += trimPx(chcomp[property]);
			if(property==='height') {
				let chMargin;
				if(i>0) { 
					chMargin = trimPx(chcomp.marginBottom); 
				}else { 
					chMargin = trimPx(chcomp.marginTop); 
				}
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

//===========================================END UTILITIES======================================//

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

const cardStack = [];
const menus     = [];
const GLOBAL    = this;
const e_actions = {};