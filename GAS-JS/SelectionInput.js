//Emulate Class SelectionInput extending base Class Widget for CardService service;
class SelectionInput extends Widget {
	constructor() {
		super();
		this.className = 'SelectionInput';
		this.fieldName;
		this.options = [];
		this.action;
		this.title;
		this.type = CardService.SelectionInputType.CHECK_BOX;
	}
}
//chain SelectionInput to Widget base class;
SelectionInput.prototype = Object.create(Widget.prototype);
//add new methods to the class;

/**
 * Adds options to SelectInput;
 * @param {Object} text
 * @param {Object} value
 * @param {Boolean} selected 
 */
SelectionInput.prototype.addItem = function (text, value, selected) {
	//check if inputs are of string type;
	var isStringText  = typeof text === 'string';
	var isStringValue = typeof value === 'string';
	
	//convert non-string inputs to strings;
	if(!isStringText)  { text  = JSON.stringify(text);  }
	if(!isStringValue) { value = JSON.stringify(value); }
	
	//set option object;
	const option = {
		text:text,
		value:value,
		selected:selected
	};
	
	this.options.push(option);
	
	return this;
}
SelectionInput.prototype.setFieldName = function (fieldName) {
	this.fieldName = fieldName;
	return this;
}
SelectionInput.prototype.setOnChangeAction = function (action) {
	this.action = action;
	return this;
}
SelectionInput.prototype.setTitle = function (title) {
	this.title = title;
	return this;
}
SelectionInput.prototype.setType = function (type) {
	this.type = type;
	return this;
}
SelectionInput.prototype.appendToUi = function (parent) {
	const fieldName = this.fieldName;
	const action    = this.action;
	const title     = this.title;
	const type      = this.type;
	const options   = this.options;
	
	const widget = document.createElement('div');
	widget.className = 'row '+this.className;
	parent.append(widget);
	
	const row = document.createElement('div');
	row.className = 'column';
	widget.append(row);
	
	//create wrapper element;
	const inputWrap = document.createElement('div');
	
	
	//SelectionInput Ui
	switch(type) {
		case 'CHECK_BOX':
		
			//create inputs;
			options.forEach(function(option){
				//access option params;
				let text     = option.text;
				let value    = option.value;
				let checked  = option.selected;
				
				//set class name and append to row;
				inputWrap.className = 'ms-CheckBox';
				row.append(inputWrap);

				//create input;
				let input = document.createElement('input');
					input.type      = 'checkbox';
					input.className = 'ms-CheckBox-input';
					input.value     = value;
					input.name      = fieldName;
					inputWrap.append(input);
				
				let label = document.createElement('label');
					label.className = 'ms-CheckBox-field';
					inputWrap.append(label);
					
					if(checked) { label.classList.add('is-checked'); }
					
				
		
				
				inputWrap.addEventListener('click',curry(action,input,label),false);	

				function curry(action,input,label){
					return function(e) { 
						console.log(input); 
					}
				}				
				
				//create label text;
				let labelTxt = document.createElement('span');
					labelTxt.className = 'ms-Label';
					labelTxt.textContent = text;
					label.append(labelTxt);
			
				//initiate Fabric;
				//new fabric['CheckBox'](inputWrap);
			});
			
			break;
		case 'RADIO_BUTTON':
			
			break;
		case 'DROPDOWN':
			
			//set class name and append to row;
			inputWrap.className = 'ms-Dropdown';
			row.append(inputWrap);
			
			//create label;
			const label = document.createElement('label');
			label.className = 'ms-Label TextInputLabel';
			label.textContent = title;
			inputWrap.append(label);
			
			//create chevron;
			const chevron = document.createElement('i');
			chevron.className = 'ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown';
			inputWrap.append(chevron);
			
			//create actual select;
			let input = document.createElement('select');
			input.className = 'ms-Dropdown-select';
			input.name      = fieldName;
			
			//append options;
			options.forEach(function(option){
				//access option params;
				let text     = option.text;
				let value    = option.value;
				let selected = option.selected;
				
				//create option with params;
				let opt = document.createElement('option');
				opt.value       = value;
				opt.textContent = text;
				opt.selected    = toBoolean(selected);
				input.append(opt);
			});
			
			//set optional parameters to input;
			if(action) { input.addEventListener('change',actionCallback(action,input)); }
			
			//append input to wrapper;
			inputWrap.append(input);
			
			//initiate Fabric;
			new fabric['Dropdown'](inputWrap);

			break;
	}

}