//===========================================START OAUTH2.0========================================//
/**
 * Creates Ui for OAuth2 flow result;
 * @param {Boolean} isAuthed truthy value to determine which Ui to create;
 * @param {String} name name of the service being authorized;
 * @param {Object} obj authorization result object;
 * @returns {HtmlOutput}
 */
function createOAuth2ResultUi(isAuthed,name,obj) {
  
  //create authorization template;
  var template = HtmlService.createTemplateFromFile('OAuth2-result');
      template.name = name;
   
  //access authorization parameters;   
  var errors = obj.error;
  
  //set authorization result;
  if(isAuthed) {
     template.text = globalAuthSuccess;
     template.errors = false;
  }else {
     template.text  = globalAuthFailure;
     if(errors) { template.errors = errors; }
  }
  template.icon = '';
  template.logo = globalCardinIconUrl;
  
  //evaluate template and set parameters;
  var evaluated = template.evaluate();
      evaluated.setTitle(name+' authorization result');
      evaluated.setHeight(500);
      evaluated.setWidth(200);
  
  //return HtmlOutput;
  return evaluated;
}

/**
 * Creates OAuth2 service;
 * @param {Object} parameters custom auth data;
 * @returns {Object}
 */
function authService(parameters) {
  //access active user's email;
  //var active = Session.getActiveUser().getEmail();
  
  //access auth parameters;
  var name     = parameters.name;
  var urlAuth  = parameters.urlAuth;
  var urlToken = parameters.urlToken;
  var clientId = parameters.id;
  var secret   = parameters.secret;
  var scope    = parameters.scope;
  var hint     = toBoolean(parameters.hint);
  var offline  = toBoolean(parameters.offline);
  var prompt   = toBoolean(parameters.prompt);
  
  //access user properties, cache and lock services;
  var userStore = PropertiesService.getUserProperties();
  var userCache = {}//CacheService.getUserCache();
  var userLock  = {}//LockService.getUserLock();
  
  //set service parameters;
  var service = OAuth2.createService(name);
      service.setAuthorizationBaseUrl(urlAuth);
      service.setTokenUrl(urlToken);
      service.setClientId(clientId);
      service.setClientSecret(secret);
      service.setScope(scope);
      service.setCallbackFunction('callback');
      service.setPropertyStore(userStore);
      service.setCache(userCache);
      service.setLock(userLock);
  
  //set optional parameters;
  if(hint)    { service.setParam('login_hint',active); }
  if(offline) { service.setParam('access_type','offline'); }
  if(prompt)  { service.setParam('approval_prompt','force'); }
  
  //return service;
  return service;
}

/**
 * Handles OAuth2 flow result and creates Ui;
 * @param {Object} obj OAuth2 flow request object;
 * @returns {Function}
 */
function callback(obj) {
  //access parameter and parameters;
  var parameter  = obj.parameter;
  var parameters = obj.parameters;

  //create authorization service;
  var service  = authService(parameter);
  
  //handle response and check if authorized;
  var isAuthed = false;
  try {
    isAuthed = service.handleCallback(obj);
  }
  catch(error) {
    console.error(error);
  }
  
  //set parameter name;
  var name = parameter.serviceName + '_OAuth2Params';
  
  //access storage and set partameters;
  var storage = service.getStorage();
      storage.setValue(name,parameter);
  
  return createOAuth2ResultUi(isAuthed,parameter.name,parameters);
}

/**
 * Resets OAuth2 service;
 * @param {Object} e event object;
 * returns {ActionResponse}
 */
function revokeAuth(e) {
  var builder = CardService.newActionResponseBuilder();
  
  //access parameters;
  var parameters = e.parameters;
  
  //create authorization service;
  var service = authService(parameters);
  
  //check if service has access and notify user;
  var hasAccess = service.hasAccess();
  if(hasAccess) {
    service.reset();
    builder.setNotification(notification(globalRevokeAccessSuccess));
  }else {
    builder.setNotification(notification(globalAlreadyRevoked));
  }
  
  //set data state change and return response;
  builder.setStateChanged(true);
  builder.setNavigation(CardService.newNavigation().updateCard(cardUpdate(e)));
  return builder.build();
}
//===========================================END OAUTH2.0==========================================//