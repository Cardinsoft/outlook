/**
 * PropertiesService constructor function;
 */
function e_PropertiesService () {
	this.className          = 'PropertiesService';
	this.settings           = Office.context.roamingSettings;
	this.documentProperties = null;
	this.scriptProperties   = null;
	this.userProperties     = null;
	this.updated            = false;
}

/**
 * Access document properties;
 * @returns {Object} Properties instance;
 */
e_PropertiesService.prototype.getDocumentProperties = function () {
	const settings = this.documentProperties;
	return new Properties(settings,'document');	
}

/**
 * Access script properties;
 * @returns {Object} Properties instance;
 */
e_PropertiesService.prototype.getScriptProperties = function () {
	const settings = this.scriptProperties;
	return new Properties(settings,'script');	
}

/**
 * Access user properties;
 * @returns {Object} Properties instance;
 */
e_PropertiesService.prototype.getUserProperties = function () {	
	const settings = Office.context.roamingSettings;
	return new Properties(settings,'user');
}

/**
 * Properties class constructor function;
 */
function Properties (type) {
	this.className = 'Properties';
	this.type      = type;
}

/**
 * Get property by key;
 * @param {String} key key to access property by;
 * @returns {Object|null} this property;
 */
Properties.prototype.getProperty = async function (key) {
	
	let settings;
	
	if(!PropertiesService.updated) {
		settings = Object.create(PropertiesService.settings); //copy settings to in-memory Object;
		PropertiesService.userProperties = settings; //set settings to in-memory Object;
		PropertiesService.updated = true; //prompt service to use in-memory Object;
	}else {
		settings = PropertiesService.userProperties; //user UP storage; TODO: different types;
	}
	
	let property = await settings.get(key);
	
	if(property) { 
		return property; 
	}else { 
		return null; 
	}
}

/**
 * Set property by key;
 * @param {String} key key to access property by;
 * @param {String} value stringified representation of value;
 * @returns {Object} this settings;
 */
Properties.prototype.setProperty = async function (key,value) {

	let settings;
	
	if(!PropertiesService.updated) {
		settings = Object.create(PropertiesService.settings); //copy settings to in-memory Object;
		PropertiesService.userProperties = settings; //set settings to in-memory Object;
		PropertiesService.updated = true; //prompt service to use in-memory Object;		
	}else {
		settings = PropertiesService.userProperties; //user UP storage; TODO: different types;
	}
	
	await settings.set(key,value);
	await PropertiesService.settings.set(key,value);
	
	console.log(JSON.parse(PropertiesService.userProperties.get(key)).ID)
	
	await PropertiesService.settings.saveAsync();
	return settings;
}

/**
 * Deletes property by key;
 * @param {String} key key to access property by;
 * @returns {Object} this settings;
 */
Properties.prototype.deleteProperty = async function (key) {

	let settings;
	
	if(!PropertiesService.updated) {
		settings = Object.create(PropertiesService.settings); //copy settings to in-memory Object;
		PropertiesService.userProperties = settings; //set settings to in-memory Object;
		PropertiesService.updated = true; //prompt service to use in-memory Object;		
	}else {
		settings = PropertiesService.userProperties; //user UP storage; TODO: different types;
	}
	
	await settings.remove(key);
	await PropertiesService.settings.remove(key);
	
	console.log(JSON.parse(PropertiesService.userProperties.get(key)).ID)
	
	await PropertiesService.settings.saveAsync();	
	return settings;
}

/**
 * Sets multiple properties;
 * @param {Array} properties list of property keys;
 * @param {Boolean} deleteAllOthers delete all others or not;
 * @returns {Object} this settings;
 */
Properties.prototype.setProperties = async function (properties,deleteAllOthers) { //add delete others after initial release;
	let settings = this.settings;
	
	//set properties;
	for(let key in properties) {
		let value = properties[key];
		await settings.setProperty(key,value);
	}
	
	//persist changes;
	this.settings = JSON.stringify(settings);
	PropertiesService.userProperties.saveAsync();
	
	//acess storage type;
	const type = this.type;
	
	//update RoamingSettings in PropertiesService and return;
	if(type==='user') { PropertiesService.userProperties = JSON.stringify(settings); }
	return settings;
}




/**
 * Deletes all properties from storage;
 * @returns {Object} this settings;
 */
Properties.prototype.deleteAllProperties = async function () {
	//initiate settings storage;
	let settings;
	
	if(!PropertiesService.updated) {
		settings = Object.create(PropertiesService.settings); //copy settings to in-memory Object;
		PropertiesService.userProperties = settings; //set settings to in-memory Object;
		PropertiesService.updated = true; //prompt service to use in-memory Object;		
	}else {
		settings = PropertiesService.userProperties; //user UP storage; TODO: different types;
	}
	
	//access configured keys;
	let keys = Object.keys(settings);
	
	//delete every key found;
	for(let p in keys) {
		let key = keys[p];
		
		//access settings props;
		let obj = settings.get(key);
		
		//remove every setting;
		if(obj!==null) {
			let props = Object.keys(obj);
			if(props.length>0) {
				for(let k in props) {
					let prop = props[k];
					await settings.remove(key);
					await PropertiesService.settings.remove(key);
				}
			}
		}		
	}
	
	//persist changes;
	await PropertiesService.settings.saveAsync();
	
	return settings;
}



//Properties.prototype.getKeys = function () {} - not needed for initial release;


//Properties.prototype.getProperties = function () {} - not needed for initial release;
