//Emulate PropertiesService service;
class e_PropertiesService {
	constructor() {
		this.className = 'PropertiesService';
		
		this.initial = {
			DP : Office.context.roamingSettings,
			SP : Office.context.roamingSettings,
			UP : Office.context.roamingSettings			
		};
		
		this.current = {
			
		};
	}
}

/**
 * Access document properties;
 * @returns {Object} Properties instance;
 */
e_PropertiesService.prototype.getDocumentProperties = function () {
	let storage;
	
	if(!current.DP) {
		storage = this.initial.DP['_rawData$p$0'];
	}else {
		storage = this.current.DP;
	}
	
	return new Properties(storage,'DP');	
}

/**
 * Access script properties;
 * @returns {Object} Properties instance;
 */
e_PropertiesService.prototype.getScriptProperties = function () {
	let storage;
	
	if(!current.SP) {
		storage = this.initial.SP['_rawData$p$0'];
	}else {
		storage = this.current.SP;
	}
	
	return new Properties(storage,'SP');	
}

/**
 * Access user properties;
 * @returns {Object} Properties instance;
 */
e_PropertiesService.prototype.getUserProperties = function () {
	let storage;
	
	if(!this.current.UP) {
		storage = this.initial.UP['_rawData$p$0'];
	}else {
		storage = this.current.UP;
	}

	return new Properties(storage,'UP');
}

//Emulate Class Properties for PropertiesService service;
class Properties {
	constructor(storage,type) {
		this.type    = type;
		this.storage = storage;
	}
}

/**
 * Get property by key;
 * @param {String} key key to access property by;
 * @returns {Object|null} this property;
 */
Properties.prototype.getProperty = function (key) {
	let storage = this.storage;
	
	//access property;
	let property = storage[key];
	
	//switch to session settings;
	PropertiesService.current[this.type] = storage;
	
	//return property or null;
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
	let storage = this.storage;
	
	console.log(storage)
	
	console.log(key)
	
	console.log(value)
	
	console.log(PropertiesService.current)
	
	//set property and persist;
	PropertiesService.current[this.type][key] = value;
	PropertiesService.initial[this.type].set(key,value);
	PropertiesService.initial[this.type]saveAsync();
	
	return storage;
}

/**
 * Deletes property by key;
 * @param {String} key key to access property by;
 * @returns {Object} this settings;
 */
Properties.prototype.deleteProperty = function (key) {
	let storage = this.storage;
	
	//remove setting from storage and persist;
	delete storage[key];
	
	PropertiesService.current.userProperties = storage;
	
	//PropertiesService.persisted.userProperties.remove(key);
	//PropertiesService.persisted.userProperties.saveAsync();
	
		
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = JSON.stringify(settings); }
	return settings;	
}




/**
 * Sets multiple properties;
 * @param {Array} properties list of property keys;
 * @param {Boolean} deleteAllOthers delete all others or not;
 * @returns {Object} this settings;
 */
Properties.prototype.setProperties = function (properties,deleteAllOthers) { //add delete others after initial release;
	let settings = JSON.parse(this.settings);
	
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
	let settings = JSON.parse(this.settings);
	
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



//Properties.prototype.getKeys = function () {} - not needed for initial release;


//Properties.prototype.getProperties = function () {} - not needed for initial release;