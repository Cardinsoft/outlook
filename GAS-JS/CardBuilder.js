//Emulate Class CardBuilder for CardService service;
class CardBuilder {
	constructor() {
		this.className = 'CardBuilder';
		this.actions   = [];
		this.sections  = [];
		this.cardHeader;
		this.name;
	}
}

/**
 * Adds Card action (multiple actions allowed);
 * @param {CardAction) action CardAction class instance;
 * @returns {CardBuilder} this CardBuilder;
 */
CardBuilder.prototype.addCardAction = function (action) {
	this.actions.push(action);
	return this;
};

/**
 * Adds Card section (multiple sections allowed);
 * @param {CardSection} section CardSection class instance;
 * @returns {CardBuilder} this CardBuilder;
 */
CardBuilder.prototype.addSection = function (section) {
	this.sections.push(section);
	return this;
};

/**
 * Sets Card header;
 * @params {CardHeader} cardHeader CardHeader class instance;
 * @returns {CardBuilder} this CardBuilder;
 */
CardBuilder.prototype.setHeader = function (cardHeader) {
	this.cardHeader = cardHeader;
	return this;
};

/**
 * Sets Card name;
 * @param {String} name name to reference Card by;
 * @returns {CardBuilder} this CardBuilder;
 */
CardBuilder.prototype.setName = function (name) {
	this.name = name;
	return this;
};

/**
 * Builds the Card;
 * @returns {CardBuilder} this CardBuilder;
 */
CardBuilder.prototype.build = async function () {
	const cardHeader   = this.cardHeader;
	const cardSections = this.sections;
	const cardActions   = this.actions;
	
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
	
	const sections = [];
	
	//if there is at least one section -> append;
	if(cardSections.length>0) {
		
		let serialize = true;
		if(cardSections.length===1) { serialize = false; }
		
		//append each CardSection to Card;
		for(let s=0; s<cardSections.length; s++) {
			let cardSection = cardSections[s];
			let numuncoll   = cardSection.numUncollapsibleWidgets;
			
			let section = await cardSection.appendToUi(wrap,serialize,s);
			
			sections.push({s:section,u:numuncoll});
		}
		
		//set collapsibility event listener on each CardSection;
		sections.forEach(function (obj) {
			
			let section   = obj.s;
			let numuncoll = obj.u;
			
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
			
		});
		
		
		//if CardActions provided, clear menu and set new items;
		const menu = menus[0];
		menu.clear(true);
		
		console.log(menu);
		
		console.log(cardActions);
		
		if(cardActions.length>0) {
			
			cardActions.reverse();
			
			cardActions.forEach(function (cardAction) {
			
				let params, cAction;
				if(cardAction.action) {
					cAction = cardAction.action;
				}else if(cardAction.authorizationAction) {
					cAction = cardAction.authorizationAction;
				}else if(cardAction.openLink) {
					cAction = cardAction.openLink;
				}
			
				let item = {
					icon       : 'ms-Icon--Forward',
					text       : cardAction.text,
					classList  : ['CardAction'],
					action     : cAction
				};
			
				menu.addItem(item,true);
				
			});
		}
		
	}
	
	cardStack.push(this);
	return this;
};