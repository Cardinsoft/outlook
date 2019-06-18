//Emulate PropertiesService service;
class e_PropertiesService {
	constructor() {
		this.className = 'PropertiesService';
		this.documentProperties = Office.context.roamingSettings;
		this.scriptProperties   = Office.context.roamingSettings;
		this.userProperties     = Office.context.roamingSettings;
	}
}
e_PropertiesService.prototype.getDocumentProperties = function () {
	return new Properties(JSON.stringify(this.documentProperties),'document');	
}
e_PropertiesService.prototype.getScriptProperties = function () {
	return new Properties(JSON.stringify(this.scriptProperties),'script');	
}
e_PropertiesService.prototype.getUserProperties = function () {
	return new Properties(JSON.stringify(this.userProperties),'user');
}

//Emulate Class Properties for PropertiesService service;
class Properties {
	constructor(settings,type) {
		this.type     = type;
		this.settings = JSON.parse(settings);
	}
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
					delete this.settings[p];
					PropertiesService.userProperties.remove(prop);
				}
			}
		}		
	}
	
	//persist changes;
	settings.saveAsync(); 
	
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = JSON.stringify(settings); }
	return settings;
}

/**
 * Deletes property by key;
 * @param {String} key key to access property by;
 * @returns {Object} this settings;
 */
Properties.prototype.deleteProperty = function (key) {
	let settings = this.settings;
	
	//remove setting from storage;
	delete this.settings[key];
	PropertiesService.userProperties.remove(key);
	
	//persist changes;
	PropertiesService.userProperties.saveAsync();
		
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = JSON.stringify(settings); }
	return settings;	
}

//Properties.prototype.getKeys = function () {} - not needed for initial release;

/**
 * Get property by key;
 * @param {String} key key to access property by;
 * @returns {Object} this settings;
 */
Properties.prototype.getProperty = function (key) {
	let settings = this.settings;
	let property = settings[key];
	
	if(property) { 
		return property; 
	}else { 
		return null; 
	}
}
//Properties.prototype.getProperties = function () {} - not needed for initial release;

/**
 * Set property by key;
 * @param {String} key key to access property by;
 * @param {String} value stringified representation of value;
 * @returns {Object} this settings;
 */
Properties.prototype.setProperty = function (key,value) {
	let settings = this.settings;
	
	//set property;
	settings[key] = value;
	PropertiesService.userProperties.set(key,value);
	
	//persist changes;
	PropertiesService.userProperties.saveAsync();
	
	//acess storage type;
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = JSON.stringify(settings); }
	return settings;
}

Properties.prototype.setProperties = function (properties,deleteAllOthers) { //add delete others after initial release;
	let settings = this.settings;
	for(let key in properties) {
		let value = properties[key];
		settings.setProperty(key,value);
	}
	const type = this.type;
	if(type==='user') { PropertiesService.userProperties = JSON.stringify(settings); }
	return settings;
}

