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
Properties.prototype.deleteAllProperties = async function () {
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
					await settings.remove(prop);
				});
			}
		}
		
	});
	
	//persist changes;
	await settings.saveAsync(); 
	
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}
Properties.prototype.deleteProperty = async function (key) {
	let settings = PropertiesService.userProperties;
		await settings.remove(key);
		await settings.saveAsync();
		
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;	
}

//Properties.prototype.getKeys = function () {} - not needed for initial release;
//Properties.prototype.getProperties = function () {} - not needed for initial release;
Properties.prototype.getProperty = async function (key) {
	let settings = PropertiesService.userProperties;
	let property = await settings.get(key);
	if(property) { 
		return property; 
	}else { 
		return null; 
	}
}

Properties.prototype.setProperties = async function (properties,deleteAllOthers) { //add delete others after initial release;
	let settings = PropertiesService.userProperties;
	for(let key in properties) {
		let value = properties[key];
		await settings.setProperty(key,value);
	}
	const type = this.type;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}

Properties.prototype.setProperty = async function (key,value) {
	let settings = PropertiesService.userProperties;
		await settings.set(key,value);
		await settings.saveAsync();
		
	const type = this.type;
	
	//update RoamingSettings in PropertiesService;
	if(type==='user') { PropertiesService.userProperties = settings; }
	return settings;
}