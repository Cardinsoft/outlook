//Emulate Class Switch for CardService service;
class Switch extends e_CardService {
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
	this.action = JSON.stringify(action);
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
	//access Switch parameters;
	const fieldName = this.fieldName;
	const action    = this.action;
	const selected  = this.selected;
	const value     = this.value;
	
	//create toggler paragraph;
	const pToggle = document.createElement('p');
	parent.append(pToggle);
	
	//create toggler wrapper and set required parameters;
	const wrapToggle = document.createElement('div');
	wrapToggle.className = 'ms-Toggle ms-font-m-plus '+this.className;
	pToggle.append(wrapToggle);
	
	//create input and set required parameters;
	const input     = document.createElement('input');
	input.id        = fieldName;
	input.className = 'ms-Toggle-input';
	input.type      = 'checkbox';
	input.name      = fieldName;	
	input.value     = value;
	
	//append toggler wrap;
	wrapToggle.append(input);	

	//set action if provided;
	if(action) { 
		//parse action if found;
		action = JSON.parse(action);
		
		//change cursor to pointer on hover;
		widget.classList.add('pointer');
		
		//get unique identifier;
		let id = getId();
		
		//set stringifyed action to global storage;
		e_actions[id] = JSON.stringify(action);
		
		//add action reference to widget;
		widget.setAttribute('action',id);
		
		//set event listener to widget;
		widget.addEventListener('click',async function(){ await actionCallback(this); });
	}
	
	const label = document.createElement('label');
	if(selected===true||selected==='true') {
		input.className = 'ms-Toggle-input is-selected';
		label.className = 'ms-Toggle-field is-selected';
	}else {
		input.className = 'ms-Toggle-input';
		label.className = 'ms-Toggle-field';
	}
	
	//set state listener;
	wrapToggle.addEventListener('click',function(e){
		input.classList.toggle('is-selected');
	});	
	
	//append toggle label to wrapper;
	wrapToggle.append(label);
	
	new fabric['Toggle'](wrapToggle);
}