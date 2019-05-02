//Emulate Class CardBuilder for CardService service;
class CardBuilder {
	constructor() {
		this.className = 'CardBuilder';
		this.action;
		this.sections = [];
		this.cardHeader;
		this.name;
	}
}
//add new methods to the class;
CardBuilder.prototype.addCardAction = function (action) {
	this.action = action;
	return this;
};
CardBuilder.prototype.addSection = function (section) {
	this.sections.push(section);
	return this;
};
CardBuilder.prototype.setHeader = function (cardHeader) {
	this.cardHeader = cardHeader;
	return this;
};
CardBuilder.prototype.setName = function (name) {
	this.name = name;
	return this;
};
CardBuilder.prototype.build = async function () {
	const cardHeader   = this.cardHeader;
	const cardSections = this.sections;
	const cardAction   = this.action;
	
	$('#main-Ui-header').empty();
	$('#app-body').empty();
	
	const wrap = document.createElement('div');
	wrap.className = 'Card';
	$('#app-body').append(wrap);
	
	if(this.cardHeader) {
		const headerWrap = document.createElement('div');
		headerWrap.className = [cardHeader.className,'separated-both'].join(' ');
		$('#app-body').prepend(headerWrap);
		
		if(this.cardHeader.imageUrl) {
			const icon = document.createElement('img');
			icon.src = this.cardHeader.imageUrl;
			icon.className = 'headerIcon';
			headerWrap.prepend(icon);
		}
		
		const header = document.createElement('p');
		header.className = 'ms-font-m-plus';
		header.textContent = this.cardHeader.title;
		headerWrap.append(header);
	}
		
	if(cardSections.length!==0) {
		
		let serialize = true;
		if(cardSections.length===1) { serialize = false; }
		
		for(let s=0; s<cardSections.length; s++) {
			let cardSection = cardSections[s];
			let numuncoll   = cardSection.numUncollapsibleWidgets;
			
			let section = await cardSection.appendToUi(wrap,serialize,s);
			
			let collapsible = section.querySelector('.collapsible');
			
			if(collapsible!==null) {
				let overlay = collapsible.querySelector('form');
				if(overlay===null) { overlay = collapsible; }
				let toggler = section.querySelector('.toggler');
				
				let initial = uncollapsible(numuncoll,overlay);
				overlay.style.height = initial+'px';

				if(toggler!==null) { 
					toggler.addEventListener('click',collapse(toggler,overlay,'height',1,4,initial));
				}
				
			}
			
		}
		
		//if card action provided -> set it on menu top and add event handler;
		const menu = menus[0];
		if(cardAction) {
			let fName, params, cAction;
			if(cardAction.action) {
				cAction = JSON.parse(cardAction.action);
				fName   = cAction.functionName;
				params  = cAction.parameters;
			}else if(cardAction.authorizationAction) {
				cAction = JSON.parse(cardAction.authorizationAction);
			}else if(cardAction.openLink) {
				cAction = JSON.parse(cardAction.openLink);
				fName   = cAction.functionName;
				params  = cAction.parameters;
			}
			
			let item = {
				icon       : 'ms-Icon--Forward',
				text       : cardAction.text,
				classList  : ['CardAction'],
				funcName   : fName,
				parameters : params
			};
			
			if(menu.menu.children.length>3) { menu.removeItem(0); } //make adjustable in future updates;
			menu.addItem(item,true);
		}else {
			if(menu.menu.children.length>3) { menu.removeItem(0); } //make adjustable in future updates;
		}
		

	}
	
	cardStack.push(this);
	return this;
};