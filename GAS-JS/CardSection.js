//Emulate Class CardSection for CardService service;
class CardSection {
	constructor() {
		this.className = 'CardSection';
		this.widgets = [];
		this.collapsible = false;
		this.header;
		this.numUncollapsibleWidgets;
	}
}
//add new methods to the class;
CardSection.prototype.addWidget = function (widget) {
	this.widgets.push(widget);
	return this;
}
CardSection.prototype.setCollapsible = function (collapsible) {
	this.collapsible = collapsible;
	return this;
}
CardSection.prototype.setHeader = function (header) {
	this.header = header;
	return this;
}
CardSection.prototype.setNumUncollapsibleWidgets = function (numUncollapsibleWidgets) {
	this.numUncollapsibleWidgets = numUncollapsibleWidgets;
	return this;
}
CardSection.prototype.appendToUi = async function (parent,serialize,sI) {
	
	//access parameters;
	const collapsible = this.collapsible;
	const uncollapse  = this.numUncollapsibleWidgets;
	if(uncollapse&&typeof uncollapse!=='number') { uncollapse = +uncollapse; }
	
	//create section and set its Id number;
	const section = document.createElement('div');
		  section.id        = 'section'+sI;
		  section.className = this.className;
	
	//if multiple sections -> add separators;
	if(serialize) { section.classList.add('separated'); }
	
	//access header text and set section header if provided;
	const headerText = this.header;
	if(headerText&&headerText!=='') {
		const header = document.createElement('p');
		header.className = 'ms-font-m-plus sectionHeader';
		header.textContent = headerText;
		section.append(header);
	}

	//append widgets wrapper and handle collapsed Ui;
	const widgetsWrap = document.createElement('div');
	if(collapsible) { widgetsWrap.className = 'collapsible'; }
	section.append(widgetsWrap);
	
	//set wrapper to widgets wrapper;
	let wrapper = widgetsWrap;

	//access widgets and append;
	const widgets = this.widgets;
	
	if(widgets.length!==0) {

		//check if at least one widget is a form input;
		const hasInput = widgets.some(function(widget){ 
			
			//access widget's parameters;
			let name      = widget.className;
			let hasSwitch = widget.switchToSet;
			
			//check if widget is a form element;
			let isFormElem = name==='TextInput'||name==='SelectionInput'||hasSwitch;
			
			//return true if found;
			if(isFormElem) {
				return widget;
			}
			
		});
		
		//if found form input -> append form element and set wrapper to form;
		if(hasInput) {
			const formElem = document.createElement('form');
			widgetsWrap.append(formElem);
			wrapper = formElem;
		}
		
		//append widgets to Ui;	
		async function appendWidgetsAsync(warr,wrapper) {
			for(let i=0; i<warr.length; i++) {
				let widget = warr[i];
				await widget.appendToUi(wrapper);
			}
		}
		await appendWidgetsAsync(widgets,wrapper);

		
	}

	//handle collapsible sections;
	if(collapsible) {
		//create toggler element;
		const toggler = document.createElement('div');
		toggler.className = 'toggler centered ms-Icon ms-Icon--ChevronDown pointer';
		section.append(toggler);
		
		console.log('number of widgets to show: '+uncollapse);
		
		//add event handler for toggling collapsed state;
		toggler.addEventListener('click',collapse(toggler,wrapper,'height',1,2));
		
		//add event handler for toggling target element's state;
		toggler.addEventListener('click',function(){
			this.classList.toggle('toggler-up');
		});
		
		
	}
			
	parent.append(section);
}