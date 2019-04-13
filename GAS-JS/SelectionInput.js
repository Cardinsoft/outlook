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
	
	if(title) {	
		const topLabel = document.createElement('label');
		topLabel.className = 'ms-fontSize-s SelectionInputTopLabel';
		topLabel.textContent = title;
		row.append(topLabel);
	}
	
	//SelectionInput Ui
	switch(type) {
		case 'CHECK_BOX':
			
			break;
		case 'RADIO_BUTTON':
			
			break;
		case 'DROPDOWN':
			
			//create wrapper and append to row;
			const dropdown = document.createElement('div');
			dropdown.className = 'ms-Dropdown';
			row.append(dropdown);
			
			//create chevron;
			const chevron = document.createElement('i');
			chevron.className = 'ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown';
			dropdown.append(chevron);
			
			//create actual select;
			const select = document.createElement('select');
			select.className = 'ms-Dropdown-select';
			select.name      = fieldName;
			dropdown.append(select);
			
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
				select.append(opt);
			});
			
			new fabric['Dropdown'](dropdown);
			
			break;
	}

}