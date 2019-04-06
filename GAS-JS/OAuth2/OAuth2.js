//Emulate OAuth2 object (instead of library call);
class e_OAuth2 {
	constructor() {
		this.service;
	}
}
/**
 * Create OAuth2 service object;
 * @param {String} name service name to set;
 * @returns {Object}
 */
e_OAuth2.prototype.createService = function (name) {
	//initiate Service;
	this.service = new Service(name);
	
	console.log(this.service);
	
	//return Service;
	return this.service;
}

//emulate service object creation;
class Service {
	constructor(name) {
		this.params = {
			providerID : name
		};
	}
	build() {
		const service = new jso.JSO(this.params);
		return service;
	}
}
//add new methods to the class - FOR NOW WITH NO OPTIONAL PARAMETERS;
Service.prototype.getAuthorizationUrl = function(params) {
	
	/*
	//initiate parameters;
	const parameters = {
		client_id: this.client_id,
		response_type: 'code',
		redirect_uri: 'https://cardinsoft.github.io/outlook/OAuth2-result.html' //redirect Uri for Outlook is always https://{Domain}/OAuth2-result.html
	};
	*/
	
	//initiate params;
	const params = this.params;
	
	/*
	https://github.com/login/oauth/authorize?
	response_type=id_token%20token
	&state=cc3766b4-2eff-4fbb-a705-1ae381db21e3
	&client_id=346b6610e8ebf7dd79b8
	&scope=malformed
	*/
	
	const url = params.authorization;
	
	return url;
};

Service.prototype.setAuthorizationBaseUrl = function(urlAuth) {
	//access parameters;
	let params = this.params;	
	params.authorization = urlAuth;
	return this;
};

Service.prototype.setRedirectUri = function(redirectUri) {
	//access parameters;
	let params = this.params;
	params.redirect_uri = redirectUri;
	return this;
};

Service.prototype.setTokenUrl = function(urlToken) {
	//access parameters;
	let params = this.params;
	params.token = urlToken;
	return this;
};  
 
Service.prototype.setClientId = function(clientId) {
	//access parameters;
	let params = this.params;
	params.client_id = clientId;
	return this;
};

Service.prototype.setClientSecret = function(secret) {
	//access parameters;
	let params = this.params;
	params.client_secret = secret;
	return this;
};

Service.prototype.setScope = function(scope) {
	//access parameters;
	let params = this.params;
	params.scopes = {};
	
	//access scopes;
	let scopes = params.scopes;
	scopes.request = [];
	scopes.require = [];
	
	//access request & require;
	let request = scopes.request;
	let require = scopes.require;
	
	//add scope to scopes list;
	request.push(scope);
	require.push(scope);
	
	return this;
};
Service.prototype.setCallbackFunction = function(callback) {
	
};

Service.prototype.setParam = function(key,value) {
	//access parameters;
	let params = this.params;
	params[key] = value;
	return this;
};

Service.prototype.setPropertyStore = function(userStore) {
	this
};
Service.prototype.setCache = function(userCache) {};
Service.prototype.setLock = function(userLock) {};
Service.prototype.hasAccess = async function() {
	//initiate JSO with set parameters;
	const service = this.build();
	
	//await for token;
	let token = await service.checkToken();
	
	if(token!==null) { return true; }else { return false; }
};
Service.prototype.getAccessToken = async function() {
	//initiate JSO with set parameters;
	const service = this.build();
	
	//obtain token;
	const token = await service.getToken();
	return token;
}
Service.prototype.reset = async function() {
	//initiate JSO with set parameters;
	const service = this.build();	
	
	await service.wipeTokens();
};



const OAuth2 = new e_OAuth2();