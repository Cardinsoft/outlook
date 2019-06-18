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
	return new Properties('document');	
}
e_PropertiesService.prototype.getScriptProperties = function () {
	return new Properties('script');	
}
e_PropertiesService.prototype.getUserProperties = function () {
	return new Properties('user');
}

//Emulate Class Properties for PropertiesService service;
class Properties {
	constructor(type) {
		this.type = type;
	}
}
//add new methods to the class;
Properties.prototype.deleteAllProperties = function () {
	//initiate settings storage;
	let settings = PropertiesService.userProperties;
	
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
	let settings = PropertiesService.userProperties;
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
	let settings = PropertiesService.userProperties;
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