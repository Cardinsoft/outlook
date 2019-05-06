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
	const isStringText  = typeof text === 'string';
	const isStringValue = typeof value === 'string';
	
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
	this.action = JSON.stringify(action);
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
	let action      = this.action;
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
			options.forEach((option) => {
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
				
				if(action) {
					//set refrence;
					setAction(widget,action);
				}
				
				//set event listener to widget;
				function curry(widget,input,label){
					return async function () {
						if(!input.checked) { input.checked = true; }else { input.checked = false; }
						await label.classList.toggle('is-checked');
						if(action) { await actionCallback(widget); }
					}
				}
				inputWrap.addEventListener('click',curry(widget,input,label));
				
				//create label text;
				let labelTxt = document.createElement('span');
					labelTxt.className = 'ms-Label';
					labelTxt.textContent = text;
					label.append(labelTxt);
			});
			
			break;
		case 'RADIO_BUTTON':
			
			let inputs = [];
			let labels = [];
			
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
			options.forEach((option) => {
				
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
					input.value     = value;
					inputWrap.append(input);
					
				inputs.push(input);
				
				//set radio label;
				let label = document.createElement('label');
					label.className = 'ms-RadioButton-field';
					inputWrap.append(label);
				if(checked) { label.classList.add('is-checked'); }
				
				labels.push(label);
				
				if(action) {
					//set refrence;
					setAction(widget,action);
				}
				
				//set event listener to widget;
				function curry(widget,action,input,inputs,labels){
					return async function () {
					
						//check if every other radio button is switched off;
						const isLastChecked = input.checked&&inputs.every((i) => { 
							if(input!==i) { 
								return i.checked===false; 
							}else {
								return true;
							}
						});	

						if(!isLastChecked) {
							await inputs.forEach((i,index) => {
								if(input===i&&!input.checked) { 
									labels[index].classList.add('is-checked');
									i.checked = true;
								}else {
									labels[index].classList.remove('is-checked');
									i.checked = false;
								}
							});
						}

						if(action) { await actionCallback(widget); }					
					
					}
				}
				inputWrap.addEventListener('click',curry(widget,action,input,inputs,labels));
				
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
	
			//set class name and append to row;
			inputWrap = document.createElement('div');
			inputWrap.className = 'ms-Dropdown';
			widget.append(inputWrap);
			
			//append title text if provided;
			if(title) {	
				let label = document.createElement('label');
					label.className = 'ms-Label';
					inputWrap.append(label);
			}
			
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
			options.forEach((option) => {
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
			
			if(action) {
				//set refrence;
				setAction(widget,action);
					
				//set event listener to widget;
				input.addEventListener('change',async () => { await actionCallback(widget); });
			}
			
			new fabric['Dropdown'](inputWrap);
			
			//quick fix for dropdown Ui;
			inputWrap.querySelector('.ms-Dropdown-truncator').classList.add('hidden');
			
			break;
	}

}