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
	const className = this.className;
	const fieldName = this.fieldName;
	const action    = this.action;
	const title     = this.title;
	const type      = this.type;
	const options   = this.options;

	let widget, row, inputWrap;
	
	//SelectionInput Ui
	switch(type) {
		case 'CHECK_BOX':
		
			//set row;
			widget = document.createElement('div');
			widget.className = 'row '+className;
			parent.append(widget);				
				
			//set column;
			row = document.createElement('div');
			row.className = 'column';
			widget.append(row);			
		
			//create inputs;
			options.forEach(function(option){
				//access option params;
				let text     = option.text;
				let value    = option.value;
				let checked  = option.selected;
				
				//set input;
				inputWrap = document.createElement('div');
				inputWrap.className = 'ms-CheckBox';
				row.append(inputWrap);

				//create input;
				let input = document.createElement('input');
					input.type      = 'checkbox';
					input.className = 'ms-CheckBox-input';
					input.checked   = checked;
					input.value     = value;
					input.name      = fieldName;
					inputWrap.append(input);
				
				//set label class name, append & check;
				let label       = document.createElement('label');
				label.className = 'ms-CheckBox-field';
				inputWrap.append(label);
				if(checked) { label.classList.add('is-checked'); }
					
				//add event listener chain ( check/uncheck -> callback );
				label.addEventListener('click',curry(action,input,label,checked),false);
				function curry(action,input,label,checked){
					return async function(e) { 
						if(!input.checked) { input.checked = true; }else { input.checked = false; }
						await label.classList.toggle('is-checked');
						
						if(action) {
							await label.addEventListener('dblclick',actionCallback(action,input));
							await label.dispatchEvent(new Event('dblclick'));
							await label.removeEventListener('dblclick',actionCallback);
						}
					}
				}				
				
				//create label text;
				let labelTxt = document.createElement('span');
					labelTxt.className = 'ms-Label';
					labelTxt.textContent = text;
					label.append(labelTxt);
			});
			
			break;
		case 'RADIO_BUTTON':
			
			let inputs = [];
			
			//set row;
			widget = document.createElement('div');
			widget.className = 'row '+className;
			parent.append(widget);		
			
			//set column;
			row = document.createElement('div');
			row.className = 'column';
			widget.append(row);			
		
			//create input group;
			const group = document.createElement('div');
			group.className = 'ms-ChoiceFieldGroup';
			row.append(group);
			
			//create input list;
			const list = document.createElement('ul');
			list.className = 'ms-ChoiceFieldGroup-list';
			group.append(list);
			
			//create inputs;
			options.forEach(function(option){
				
				//access option params;
				let text     = option.text;
				let value    = option.value;
				let checked  = option.selected;
				
				//set input;
				inputWrap = document.createElement('li');
				inputWrap.className = 'ms-RadioButton';
				list.append(inputWrap);				
				
				//set actual input;
				let input = document.createElement('input');
					input.type      = 'radio';
					input.className = 'ms-RadioButton-input';
					input.checked   = checked;
					input.name      = fieldName;
					inputWrap.append(input);
					
				inputs.push(input);
				
				//set radio label;
				let label = document.createElement('label');
					label.className = 'ms-RadioButton-field';
					inputWrap.append(label);
				if(checked) { label.classList.add('is-checked'); }
			
				//add event listener chain ( check/uncheck -> callback );
				label.addEventListener('click',curry(action,input,label,checked),false);
				function curry(action,input,label,checked){
					return async function(e) { 
						
						
					inputs.forEach(function(i){
						if(input===i&&!input.checked) { 
							await label.classList.add('is-checked');
							i.checked = true;
						}else {
							await label.classList.remove('is-checked');
							i.checked = false;
						}
					});
						
						
						if(action) {
							await label.addEventListener('dblclick',actionCallback(action,input));
							await label.dispatchEvent(new Event('dblclick'));
							await label.removeEventListener('dblclick',actionCallback);
						}
					}
				}	
			
				//create label text;
				let labelTxt = document.createElement('span');
					labelTxt.className = 'ms-Label';
					labelTxt.textContent = text;
					label.append(labelTxt);
			});
			
			break;
		case 'DROPDOWN':
			
			//set row;
			widget = document.createElement('div');
			widget.className = 'row '+this.className;
			parent.append(widget);				
				
			//set column;
			row = document.createElement('div');
			row.className = 'column';
			widget.append(row);				
	
			//append title text if provided;
			if(title) {	
				const topLabel = document.createElement('label');
				topLabel.className = 'ms-fontSize-s TextInputTopLabel';
				topLabel.textContent = title;
				row.append(topLabel);
			}
	
			//set class name and append to row;
			inputWrap = document.createElement('div');
			inputWrap.className = 'ms-Dropdown';
			row.append(inputWrap);
			
			//create chevron;
			const chevron = document.createElement('i');
			chevron.className = 'ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown';
			inputWrap.append(chevron);
			
			//create actual select;
			let input = document.createElement('select');
				input.className = 'ms-Dropdown-select';
				input.name      = fieldName;
				inputWrap.append(input);
			
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
				opt.selected    = selected;
				input.append(opt);
			});
		
			//add event listener chain ( check/uncheck -> callback );
			input.addEventListener('change',curry(action,input,options),false);
			function curry(action,input,label,checked){
				return async function(e) { 
				
					if(action) {
						await inputWrap.addEventListener('dblclick',actionCallback(action,input));
						await inputWrap.dispatchEvent(new Event('dblclick'));
						await inputWrap.removeEventListener('dblclick',actionCallback);
					}
				}
			}
			
			new fabric['Dropdown'](inputWrap);

			break;
	}

}