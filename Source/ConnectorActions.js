/**
 * Creates new connector and saves it to properties;
 * @param {Object} e event object;
 */
async function createConnector(e) {
  //create action response builder;
  var builder = CardService.newActionResponseBuilder();
  
  //access form input parameters;
  var data      = e.formInput;
  var multi     = e.formInputs;
  var isDefault = data.isDefault;
  var useManual = data.manual;
  
  //set to false if switched off;
  if(isDefault===undefined) { isDefault = false; }
  if(useManual===undefined) { useManual = false; }
  
  //initialize connector type;
  var type = e.parameters.type;
  var cType = new this[type]();
  
  //connector default properties;
  var connector = {type:type,isDefault:isDefault,manual:useManual};  
  
  //set connector properties;
  for(var key in data) {
    var value = data[key];
    
    //set multiple values if select input is present;
    var multivalue = multi[key];
    if(multivalue.length>1) { 
      connector[key] = multivalue; 
    }else { 
      connector[key] = value; 
    }
    
    //override stringifyed booleans;
    if(value==='true') { value = true; }
    if(value==='false') { value = false; }
    
    //default icon, name and url if custom connector and no content provided;
    if(value===''&&type===globalBaseClassName) {
      if(key===globalIconFieldName) { connector[key] = globalCustomIconUrl;  }
      if(key===globalNameFieldName) { connector[key] = globalCustomNameName; }
      if(key===globalURLfieldName)  { connector[key] = globalCustomUrlUrl;   }
    }
  }
  
  //set icon and url for typed connectors;
  if(type!==globalBaseClassName) {
    //handle connector icon creation;
    if(data.hasOwnProperty(globalIconFieldName)&&data[globalIconFieldName]!=='') { 
      connector[globalIconFieldName] = data[globalIconFieldName]; 
    }else { 
      connector[globalIconFieldName] = cType[globalIconFieldName]; 
    }
    //handle connector name creation;
    if(data[globalNameFieldName]==='') { 
      connector[globalNameFieldName] = cType[globalNameFieldName]; 
    }
    //handle connector url creation;
    if(data.hasOwnProperty(globalURLfieldName)) { 
      connector[globalURLfieldName] = data[globalURLfieldName]; 
    }else if(cType.hasOwnProperty(globalURLfieldName)) { 
      connector[globalURLfieldName] = cType[globalURLfieldName]; 
    }
  }  
     
  //add auth type property if connector type does not specify any;
  var cAuth = new this[type]().auth;
  if(Object.keys(cAuth).length===0) {
    var auth  = data.auth;
    if(data.auth===undefined) { auth = 'none'; }
    connector.auth = auth;
    if(auth==='OAuth2') { 
      var scope     = data.scope;
      var urlAuth   = data.urlAuth;
      var urlToken  = data.urlToken;
      var id        = data.id;
      var secret    = data.secret;
      var hint      = data.hint;
      var offline   = data.offline;
      var prompt    = data.prompt;
      connector.scope     = scope;
      connector.urlAuth   = urlAuth;
      connector.urlToken  = urlToken;
      connector.id        = id;
      connector.secret    = secret;
      if(hint)    { connector.hint = hint; }
      if(offline) { connector.offline = offline; }
      if(prompt)  { connector.prompt = prompt; }
    }
  }else {
    //build auth properties according to type;
    var authType = cAuth.type;
    connector.auth = authType;
    if(authType==='APItoken') {
      //access user input for auth;
      var usercode = data.usercode;
      var apitoken = data.apitoken;
      
      //set auth properties to connector;
      connector.usercode = usercode;
      connector.apitoken = apitoken;
    }
  }
  
  try {
    //get configuration or create a new one if none found;
    var config = await getProperty('config','user');
    if(config===null) { await createSettings(); }
    
    config = await getProperty('config','user');
    
    //reset default connectors if new one is default;
    if(connector.isDefault) {
      config.forEach(function(conn){
        if(conn.isDefault||conn.isDefault===undefined) { conn.isDefault = false; }
      });
    }
    
    //create connector and notify thwe user of success;
    config.push(connector);
    await setProperty('config',config,'user');
    builder.setNotification(notification(globalCreateSuccess));
  }
  catch(err) {
    //notify the user that connector creation failed;
    console.error(err);
    builder.setNotification(error(globalCreateFailure));  
  }
  
  //change data state and build settings card;
  builder.setStateChanged(true); 
  builder.setNavigation(CardService.newNavigation().updateCard(cardSettings(e)));
  return builder.build();
}

/**
 * Updates connector and saves it to properties;
 * @param {Object} e event object;
 */
async function updateConnector(e) {
  //create action response builder;
  var builder = CardService.newActionResponseBuilder();
  
  var data      = e.formInput;
  var multi     = e.formInputs;
  var icon      = data[globalIconFieldName];
  var name      = data[globalNameFieldName];
  var url       = data[globalURLfieldName];
  
  var isDefault = data.isDefault;
  var useManual = data.manual;
  
  if(isDefault!==undefined) { isDefault = true; }else { isDefault = false; }
  if(useManual!==undefined) { useManual = true; }else { useManual = false; }
  
  //initialize connector type;
  var type = e.parameters.type;
  var cType = new this[type](icon,name,url);

  //connector default properties;
  var connector = {type:type,isDefault:isDefault,manual:useManual};  
  
  //set connector properties;
  for(var key in data) {
    var value = data[key];
    
    //set multiple values if select input is present;
    var multivalue = multi[key];
    if(multivalue.length>1) { 
      connector[key] = multivalue; 
    }else { 
      connector[key] = value; 
    }
    
    //override stringifyed booleans;
    if(value==='true') { value = true; }
    if(value==='false') { value = false; }
    
    //default icon, name and url if custom connector and no content provided;
    if(value===''&&type===globalBaseClassName) {
      if(key===globalIconFieldName) { connector[key] = globalCustomIconUrl;  }
      if(key===globalNameFieldName) { connector[key] = globalCustomNameName; }
      if(key===globalURLfieldName)  { connector[key] = globalCustomUrlUrl;   }
    }
  }

  //set icon and url for typed connectors;
  if(type!==globalBaseClassName) {
    //handle connector icon creation;
    if(data.hasOwnProperty(globalIconFieldName)) { 
      connector[globalIconFieldName] = data[globalIconFieldName]; 
    }else { 
      connector[globalIconFieldName] = cType[globalIconFieldName]; 
    }
    //handle connector name creation;
    if(data[globalNameFieldName]==='') { 
      connector[globalNameFieldName] = cType[globalNameFieldName]; 
    }
    //handle connector url creation;
    if(data.hasOwnProperty(globalURLfieldName)) { 
      connector[globalURLfieldName] = data[globalURLfieldName]; 
    }else if(cType.hasOwnProperty(globalURLfieldName)) { 
      connector[globalURLfieldName] = cType[globalURLfieldName]; 
    }
  }  

  //add auth type property if connector type does not specify any;
  var cAuth = new this[type]().auth;
  if(Object.keys(cAuth).length===0) {
    var auth  = data.auth;
    if(data.auth===undefined) { auth = 'none'; }
    connector.auth = auth;
    if(auth==='OAuth2') { 
      var scope     = data.scope;
      var urlAuth   = data.urlAuth;
      var urlToken  = data.urlToken;
      var id        = data.id;
      var secret    = data.secret;
      var hint      = data.hint;
      var offline   = data.offline;
      var prompt    = data.prompt;
      connector.scope     = scope;
      connector.urlAuth   = urlAuth;
      connector.urlToken  = urlToken;
      connector.id        = id;
      connector.secret    = secret;
      if(hint)    { connector.hint = hint; }
      if(offline) { connector.offline = offline; }
      if(prompt)  { connector.prompt = prompt; }
    }
  }else {
    //build auth properties according to type;
    var authType = cAuth.type;
    connector.auth = authType;
    if(authType==='APItoken') {
      //access user input for auth;
      var usercode = data.usercode;
      var apitoken = data.apitoken;
      
      //set auth properties to connector;
      connector.usercode = usercode;
      connector.apitoken = apitoken;
    }
  }

  //connector index (for ease of flow);
  var config = await getProperty('config','user');
  var index  = getIndex(config,e.parameters);

  try {
    //get configuration;
    var config = await getProperty('config','user');

    //reset default connectors if updated one is default;
    if(connector.isDefault) {
      config.forEach(function(conn){
        if(conn.isDefault||conn.isDefault===undefined) { conn.isDefault = false; }
      });
    }
    
    //update connector and notify the user of success;
    config[index] = connector;
    await setProperty('config',config,'user');
    builder.setNotification(notification(globalUpdateSuccess));
  }
  catch(err) {
    //notify the user that connector update failed;
    builder.setNotification(error(globalUpdateFailure));
  }
  
  //change data state and build settings card;
  builder.setStateChanged(true);
  builder.setNavigation(CardService.newNavigation().updateCard(cardSettings(e)));
  return builder.build();
}

/**
 * Removes connector and saves properties;
 * @param {Object} e event object;
 */
async function removeConnector(e) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();

		  //connector index (for ease of flow);
		  var config = await getProperty('config','user');
		  var index  = getIndex(config,e.parameters);
		 
		  //access parameters and formInput;
		  var params = e.parameters;
		  var form   = e.formInput;
		  
		  
		  //uninstall Application from endpoint;
		  var uninstall = form.uninstall;
		  if(uninstall) { new this[params.type]().uninstall(params); }
		 
		  try {
			//get configuration;
			var src = await getProperty('config','user');
			
			//remove connector and notify the user of success;
			src = src.filter(function(connect,idx){
			  if(idx!==index) { return connect; }
			});
			await setProperty('config',src,'user');
			builder.setNotification(notification(globalRemoveSuccess));
		  }
		  catch(err) {
			//notify the user that connector removal failed;
			builder.setNotification(error(globalRemoveFailure));    
		  }
		  
		  
	//change data state and build settings card;
	builder.setStateChanged(true);
	builder.setNavigation(CardService.newNavigation().updateCard(cardSettings(e)));
	return builder.build();
}