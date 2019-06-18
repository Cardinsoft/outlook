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
	const settings = this.documentProperties;
	return new Properties(settings,'document');	
}
e_PropertiesService.prototype.getScriptProperties = function () {
	const settings = this.scriptProperties;
	return new Properties(settings,'script');	
}
e_PropertiesService.prototype.getUserProperties = function () {
	const settings = this.userProperties;
	return new Properties(settings,'user');
}

//Emulate Class Properties for PropertiesService service;
class Properties {
	constructor(settings,type) {
		this.settings = settings;
		this.type     = type;
	}
}
//add new methods to the class;
Properties.prototype.deleteAllProperties = function () {
	//initiate settings storage;
	let settings = this.settings;
	
	//access configured keys;
	let keys = Object.keys(settings);
	
	//delete every key found;
	keys.forEach(function (key) { 
		//access settings props;
		let obj = settings[key];
		
		//remove every setting;
		if(obj!==null) {
			let props = Object.keys(obj);
			if(props.length>0) { 
				props.forEach(function(prop){
					settings.remove(prop);
				});
			}
		}
		
	});
	
	//persist changes;
	settings.saveAsync(); 
	
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}
Properties.prototype.deleteProperty = function (key) {
	let settings = this.settings;
		settings.remove(key);
		settings.saveAsync();
		
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;	
}

//Properties.prototype.getKeys = function () {} - not needed for initial release;
//Properties.prototype.getProperties = function () {} - not needed for initial release;
Properties.prototype.getProperty = function (key) {
	const settings = this.settings;
	let property = settings.get(key);
	if(property) { 
		return property; 
	}else { 
		return null; 
	}
}

Properties.prototype.setProperties = function (properties,deleteAllOthers) { //add delete others after initial release;
	let settings = this.settings;
	for(let key in properties) {
		let value = properties[key];
		settings.setProperty(key,value);
	}
	const type = this.type;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}

Properties.prototype.setProperty = function (key,value) {
	let settings = this.settings;
		settings.set(key,value);
		settings.saveAsync();
		
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}