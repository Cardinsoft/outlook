/**
 * PropertiesService constructor function;
 */
function e_PropertiesService {
	this.className = 'PropertiesService';
	this.documentProperties = Office.context.roamingSettings;
	this.scriptProperties   = Office.context.roamingSettings;
	this.userProperties     = Office.context.roamingSettings;
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
	const settings = this.userProperties;
	return new Properties(settings,'user');
}

//Emulate Class Properties for PropertiesService service;
function Properties (settings,type) {
	this.settings = settings;
	this.type     = type;
}

/**
 * Get property by key;
 * @param {String} key key to access property by;
 * @returns {Object|null} this property;
 */
Properties.prototype.getProperty = function (key) {
	const settings = this.settings;
	let property = settings.get(key);
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
Properties.prototype.setProperty = function (key,value) {
	let settings = this.settings;
		settings.set(key,value);
		settings.saveAsync();
		
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}

/**
 * Deletes property by key;
 * @param {String} key key to access property by;
 * @returns {Object} this settings;
 */
Properties.prototype.deleteProperty = function (key) {
	let settings = this.settings;
		settings.remove(key);
		settings.saveAsync();
		
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}

/**
 * Sets multiple properties;
 * @param {Array} properties list of property keys;
 * @param {Boolean} deleteAllOthers delete all others or not;
 * @returns {Object} this settings;
 */
Properties.prototype.setProperties = function (properties,deleteAllOthers) { //add delete others after initial release;
	let settings = this.settings;
	
	//set properties;
	for(let key in properties) {
		let value = properties[key];
		settings.setProperty(key,value);
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
Properties.prototype.deleteAllProperties = function () {
	//initiate settings storage;
	let settings = this.settings;
	
	//access configured keys;
	let keys = Object.keys(settings);
	
	//delete every key found;
	for(let p in keys) {
		let key = keys[p];
		
		//access settings props;
		let obj = settings[key];
		
		//remove every setting;
		if(obj!==null) {
			let props = Object.keys(obj);
			if(props.length>0) {
				for(let k in props) {
					let prop = props[k];
					settings.remove(prop);
				}
			}
		}		
	}
	
	//persist changes;
	settings.saveAsync(); 
	
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}



//Properties.prototype.getKeys = function () {} - not needed for initial release;


//Properties.prototype.getProperties = function () {} - not needed for initial release;
