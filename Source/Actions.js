/**
 * Saves ordering preferences to user properties;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function applySort(e) {
	return new Promise(
		async function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  //access settings form;
		  var data = e.formInput;
		  
		  //access reverse input;
		  var isReverse = data.reverse;
		  if(!isReverse) { isReverse = false; }
		  
		  //save ordering preference;
		  await setProperty('order',data.order,'user');
		  await setProperty('reverse',isReverse,'user');
		  
		  //set data state change and navigate to settings card;
		  builder.setNavigation(CardService.newNavigation().updateCard(cardSettings(e)));
		  builder.setStateChanged(true);
		  return builder.build(); 
		}
	);
}


/**
 * Updates connector add / edit settings card on auth select change;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function chooseAuth(e) {
	return new Promise(
		function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  var data       = e.formInput;
		  var authType   = data.auth;
		  var parameters = e.parameters;
		  var isEdit     = parameters.isEdit;
		  
		  var custom = new Connector();
		  
		  e.parameters.icon = data[globalIconFieldName];
		  e.parameters.name = data[globalNameFieldName];
		  e.parameters.url  = data[globalURLfieldName];
		  
		  for(var input in data) {
			var val = data[input];
			e.parameters[input] = val;
		  }
		  if(data.manual===undefined)    { e.parameters.manual = false;    }
		  if(data.isDefault===undefined) { e.parameters.isDefault = false; }
		  
		  e.parameters.authType = authType;
		  
		  e.parameters.auth     = JSON.stringify({});
		  e.parameters.basic    = JSON.stringify(custom.basic);
		  e.parameters.config   = JSON.stringify(custom.config);
		  e.parameters.type     = custom.name;
		  
		  if(isEdit==='true') {  
			if(data.scope) {
			  e.parameters.urlAuth  = data.urlAuth; 
			  e.parameters.urlToken = data.urlToken;
			  e.parameters.id       = data.id;
			  e.parameters.secret   = data.secret;
			  e.parameters.scope    = data.scope; 
			}
		  }
		  
		  builder.setNavigation(CardService.newNavigation().updateCard(cardCreate(e)));
		  builder.setStateChanged(true);
		  return builder.build();
		}
	);
}

/**
 * Updates widget by provided index to generate form input instead of clickable field;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function editSectionAdvanced(e) {
	return new Promise(
		function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();

		  //access content;
		  var connector = e.parameters;
		  var content   = connector.content;
		  
		  //parse content;
		  content = parseData(content);
		  
		  //access section and widget index;
		  var sectionIdx = +connector.sectionIdx;
		  var widgetIdx  = +connector.widgetIdx;
		  
		  //change widget being edited to input;
		  content[sectionIdx].widgets[widgetIdx].type = 'TextInput';
		  
		  //stringify content to send to event object;
		  e.parameters.content = JSON.stringify(content);
		  
		  //set data state change and navigate to display card;
		  builder.setNavigation(CardService.newNavigation().updateCard(cardDisplay(e)));
		  builder.setStateChanged(true);
		  return builder.build();
		}
	);
}

/**
 * Updates data with form input values, performs request and calls display with updated response;
 * @param {Object} e event object;
 */
function updateSectionAdvanced(e) {
	return new Promise(
		async function (resolve) {
		  var connector = e.parameters;
		  var data      = connector.content;
		  
		  //parse content; 
		  data = parseData(data);
		  
		  //access form inputs;
		  var form  = e.formInput;
		  var forms = e.formInputs;
		  
		  data.forEach(function(elem){
			var widgets = elem.widgets;
			widgets.forEach(function(widget){
			  var type = widget.type;
			  
			  for(var key in form) {
				if(key===widget.name) {
				  if(type===globalEnumRadio||type===globalEnumCheckbox||type===globalEnumDropdown) {
					var content = widget.content;
					content.forEach(function(option){
					  try {
						var isContained = forms[key].some(function(val){
						  if(val===option.value) { return val; }
						});
					  }
					  catch(error) { isContained = false; }
					  if(isContained) { option.selected = true; }else { option.selected = false; }
					});
				  }else if(type==='KeyValue') {
					if(form[key]) { widget.switchValue = true; }
				  }else {
					widget.content = form[key];
				  }
				}
			  }
			  
			  if(type==='TextInput') {
				widget.state = 'editable';
				widget.type  = 'KeyValue';
			  }
			  
			  //handle widgets with switches that are toggled off after load;
			  try {
				var noInput = !Object.keys(form).some(function(key){ return key===widget.name; });
			  }
			  catch (error) { noInput = false; }
			  if(type==='KeyValue'&&widget.switchValue&&noInput) {
				widget.switchValue = false;
			  }
			  
			});
		  });
		 
		  var msg   = getToken(e);
		  var cType = new this[connector.type]();
		  var resp  = await cType.run(msg,connector,data);
		  
		  //override event object parameters with response data;
		  e.parameters.code    = resp.code;
		  e.parameters.content = resp.content;
		  
		  return actionShow(e);
		}
	);
}

/**
 * Checks if URL entered is valid and displays a warning if it is not;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function checkURL(e) {
	return new Promise(
		function (resolve) {
		  var regExp = /^http:\/\/\S+\.+\S+|^https:\/\/\S+\.+\S+/;
		  var url = e.formInput.connectionURL;
		  var test = regExp.test(url);
		  if(!test) {
			var action = CardService.newActionResponseBuilder();
				action.setNotification(warning(globalInvalidURLnoMethod));
			return action.build();
		  }
		}
	);
}

/**
 * Removes card from navigation and loads previous card in stack;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function goBack(e) {
	return new Promise(
		function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  //set data state change and pop card from stack;
		  builder.setNavigation(CardService.newNavigation().popCard());
		  builder.setStateChanged(true);
		  return builder.build();  
		}
	);
}

/**
 * Removes all cards from navigation and loads root (first) card in stack;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function goRoot(e) {
	return new Promise(
		function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  //set data state change and navigate to main card;
		  builder.setNavigation(CardService.newNavigation().popCard().pushCard(cardOpen(e)));
		  builder.setStateChanged(true);  
		  return builder.build();  
		}
	);
}

/**
 * Pushes settings card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function goSettings(e) {
	return new Promise(
		function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  //set data state change and navigate to settings card;
		  builder.setNavigation(CardService.newNavigation().popCard().pushCard(cardSettings(e)));
		  builder.setStateChanged(true);  
		  return builder.build(); 
		}
	);  
}

/**
 * Pushes confirmation card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function actionConfirm(e) {
	return new Promise(
		function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  //set data state change and navigate to confirmation card;
		  builder.setNavigation(CardService.newNavigation().pushCard(cardConfirm(e)));
		  builder.setStateChanged(false);
		  return builder.build();
		}
	);
}

/**
 * Pushes connector update card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function actionEdit(e) {
	return new Promise(
		function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  //set data state change and navigate to edit connector card;
		  builder.setNavigation(CardService.newNavigation().pushCard(cardUpdate(e)));    
		  builder.setStateChanged(true);
		  return builder.build();
		}
	);
}

/**
 * Pushes display card on stack top with data provided and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function actionShow(e) {
	return new Promise(
		function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
			  
		  var code = +e.parameters.code;
		  
		  //handle failed responses;
		  if(code<200||code>=300) {
			e.parameters.content  = '[]';
		  }
		  
		  //set data state change and navigate to display card;
		  builder.setNavigation(CardService.newNavigation().pushCard(cardDisplay(e)));
		  builder.setStateChanged(true);
		  return builder.build();
		}
	);
}

/**
 * Pushes display card on stack top after performing data fetch; 
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function actionManual(e) {
	return new Promise(
		async function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  var msg       = getToken(e); 
		  var connector = e.parameters;

		  var cType = new this[connector.type]();
		  var cAuth = cType.auth;
			
		  //try to perform request;
		  var response;
		  
		  try { 
			response = await cType.run(msg,connector); 
		  }
		  catch(error) { 
			//set empty response headers and content to error message;
			response = {headers:'',content:error.message}; 
			
			//check if error is caused by code or fetch fail;
			var isAuthError = checkAgainstErrorTypes(error);
			if(isAuthError) {
			  response.code = 401;
			}else {
			  response.code = 0;
			}
		  }
		  
		  //access response code and content;
		  var code    = response.code;
		  var content = response.content;
		  
		  e.parameters.code = code;
		  
		  //handle responses;
		  if(code>=200&&code<300) {
			
			//if content has data in it -> check for length;
			if(content&&content!==null) { var len = content.length; }
			
			//if content has one or more data items -> pass to params;
			if(len>0) { e.parameters.content = content; }
			
		  }else {
		  
			e.parameters.content  = '[]';
			e.parameters.error    = content;
			
		  }
		  
		  //set data state change and navigate to display card;
		  builder.setNavigation(CardService.newNavigation().pushCard(cardDisplay(e)));
		  builder.setStateChanged(true);
		  return builder.build();
		}
	);
}

/**
 * Performs reset of every user preference;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
function performFullReset(e) {
	return new Promise(
		async function (resolve) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  //custom text ot pass to notifications;
		  var onSuccessText = e.parameters.success;
		  var onFailureText = e.parameters.failure;
		  
		  //try to delete all OAuth2.0 specific properties;
		  try {
			var config = await getProperty('config','user');
			if(config.length!==0) {
			  config.forEach(function(connector){
				var auth = new this[connector.type]().auth;
				if(Object.keys(auth).length!==0) {
				  var service = authService(auth);
				  service.reset();
				}
			  });
			}
		  }
		  catch(err) {
			//log error to stackdriver;
			console.log(err);
		  }  
		 
		  //try to delete all user properties and notify;
		  try {
			await deleteAllProperties('user');
			builder.setNotification(notification(onSuccessText));
		  }
		  catch(err) {
			builder.setNotification(error(onFailureText));
		  }
		  
		  //set data state change and navigate to main card;
		  builder.setNavigation(CardService.newNavigation().updateCard(cardOpen(e)));
		  builder.setStateChanged(true);
		  return builder.build();
		}
	);
}