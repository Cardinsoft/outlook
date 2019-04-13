//Emulate PropertiesService service;
class e_PropertiesService {
	constructor() {
		this.className = 'PropertiesService';
	}
}
e_PropertiesService.prototype.getDocumentProperties = function () {
	const settings = Office.context.roamingSettings;
	return new Properties(settings,'document');	
}
e_PropertiesService.prototype.getScriptProperties = function () {
	const settings = Office.context.roamingSettings;
	return new Properties(settings,'script');	
}
e_PropertiesService.prototype.getUserProperties = function () {
	const settings = Office.context.roamingSettings;
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
	const settings = this.settings;
	
	let keys = Object.keys(settings);
	
	keys.forEach( (key) => { console.log(settings[key]) });
	
}
Properties.prototype.deleteProperty = function (key) {
	let settings = this.settings;
	settings.remove(key);
	settings.saveAsync();
	const type = this.type;
	if(type==='user') { settings = Office.context.roamingSettings; }
	const updated = new Properties(settings);
	return updated;	
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
	const self = this;
	for(let key in properties) {
		let value = properties[key];
		self.setProperty(key,value);
	}
	const type = this.type;
	if(type==='user') { settings = Office.context.roamingSettings; }
	const updated = new Properties(settings);
	return updated;
}
Properties.prototype.setProperty = function (key,value) {
	let settings = this.settings;
	settings.set(key,value);
	settings.saveAsync();
	const type = this.type;
	if(type==='user') { settings = Office.context.roamingSettings; }
	const updated = new Properties(settings);
	return updated;
}

//initiate PropertiesService;
const PropertiesService = new e_PropertiesService();