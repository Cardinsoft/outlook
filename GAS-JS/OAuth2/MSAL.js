//Emulate OAuth2 object (instead of library call);
class e_OAuth2 {
	constructor() {}
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
		this.clientId;
		this.clientSecret;
		this.authorizationUrl;
		this.redirectUrl;
		this.tokenUrl;
		this.scope;
		this.callback;
		this.propertyStore;
		this.cache;
		this.lock;
		this.parameters;
	}
	build() {
		//access callback function name;
		const name = this.callback;
		
		//access callback function by name;
		const callback = GLOBAL[name];
		
		//access options to pass to service;
		const options = {
			validateAuthority         : true,
			cacheLocation             : this.cache,
			storeAuthStateInCookie    : false, 
			redirectUri               : this.redirectUrl,
			postLogoutRedirectUri     : 'redirectUri',
			loadFrameTimeout          : 29900,
			navigateToLoginRequestUrl : true,
			unprotectedResources      : null
			//protectedResourceMap    : 
			//state                   : 
			
		};
		
		const service = new Msal.UserAgentApplication(this.clientId,'https://login.microsoftonline.com/common',callback,options);
		return service;
	}
}

//sets authorization URL base;
Service.prototype.setAuthorizationBaseUrl = function(urlAuth) {
	this.authorizationUrl = urlAuth;
	return this;
};

//sets token URL base;
Service.prototype.setTokenUrl = function(urlToken) {
	this.tokenUrl = urlToken;
	return this;
};

//sets URL to redirect users;
Service.prototype.setRedirectUri = function(redirectUri) {
	this.redirectUrl = redirectUri;
	return this;
};

//sets client Id;
Service.prototype.setClientId = function(clientId) {
	this.clientId = clientId;
	return this;
};

//sets client secret;
Service.prototype.setClientSecret = function(secret) {
	this.clientSecret = secret;
	return this;
};

//sets request scopes to send with request;
Service.prototype.setScope = function(scope) {

	
	return this;
};

//sets callback function name to call;
Service.prototype.setCallbackFunction = function(callback) {
	this.callback = callback;
	return this;
};

//sets additional parameters to the service;
Service.prototype.setParam = function(key,value) {
	this.parameters[key] = value;
	return this;
};

//sets property store to persist tokens;
Service.prototype.setPropertyStore = function(userStore) {
	this.propertyStore = userStore;
	return this;
};

//sets cache to service;
Service.prototype.setCache = function(userCache) {
	this.cache = userCache;
	return this;
};

//sets Lock to service;
Service.prototype.setLock = function(userLock) {
	this.lock = userLock;
	return this;
};

Service.prototype.hasAccess = function() {

};

Service.prototype.getAuthorizationUrl = function(params) {

	return
};

Service.prototype.getAccessToken = function() {

};

Service.prototype.handleCallback = function(object) {
	
	
};

Service.prototype.reset = function() {


};

const OAuth2 = new e_OAuth2();