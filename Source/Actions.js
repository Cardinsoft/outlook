/**
 * Saves ordering preferences to user properties;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function applySort(e) {
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


/**
 * Updates connector add / edit settings card on auth select change;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function chooseAuth(e) {
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
				
	await builder.setNavigation(CardService.newNavigation().updateCard(cardCreate(e)));
	builder.setStateChanged(true);
	return builder.build();
}

/**
 * Updates widget by provided index to generate form input instead of clickable field;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function editSectionAdvanced(e) {
  //create action response builder;
  var builder = CardService.newActionResponseBuilder();

  //access content;
  var connector = e.parameters;
  var content   = connector.content;
  
  //parse content;
  content = parseData(content);
  if(typeof content==='string') { content = JSON.parse(content) }

  //access form data and set contents;
  var formInput  = e.formInput;
  var formInputs = e.formInputs;
  content.forEach(function(section){
    section.widgets.forEach(function(widget){
      Object.keys(formInput).forEach(function(key){
        if(key===widget.name) {
          if(widget.type===globalEnumCheckbox||widget.type===globalEnumDropdown||widget.type===globalEnumRadio) {
            widget.content.forEach(function(option){
              if(formInputs[key].indexOf(option.value)!==-1) { 
                option.selected = true; 
              }else { 
                option.selected = false; 
              }
            });
          }else {
            widget.content = formInput[key];
          }
        }
      });
    });
  });
  
  //access section and widget index;
  var sectionIdx = +connector.sectionIdx;
  var widgetIdx  = +connector.widgetIdx;
  
  //check for editable widgets and process;
  var section  = content[sectionIdx];
  var widgets  = section.widgets;
  var editable = widgets[widgetIdx];
  var editMap  = editable.editMap;
  
  //make section uncollapsed;
  section.isCollapsible = false;
  
  if(editMap) {
    //filter out widget on which edit map is set;
    widgets = widgets.filter(function(widget,index){
      if(index!==widgetIdx) { return widget; }
    });
    
    //insert edit map widgets;
    editMap.forEach(function(ew,i){
      if(!ew.type)      { ew.type = 'TextInput'; }
      if(!ew.multiline) { ew.multiline = true; }
      widgets.splice(widgetIdx+i,0,ew);
    });
    
    //set widgets with updated schema;
    content[sectionIdx].widgets = widgets;
    
    /*
      //access property and index;
      var fName     = editMap[0].name;
      var split     = fName.split('&');
      var fNameProp = split[0].split('-')[0];
      var fNameIdx  = split[0].split('-')[1];
    */
    
  }else {
    editable.type = 'TextInput';
    editable.multiline = true;
    
    //check for array-like properties;
    var p = editable.name.split('&')[0];
    var i = p.split('-');
    if(i[1]) {
      widgets.forEach(function(widget){
        //check for editability and map;
        if(widget.state==='editable'&&!widget.editMap) {
          if(widget.name.split('&')) {
            if(widget.name.split('&')[0].split('-')[0]===i[0]) {
              widget.type      = 'TextInput';
              widget.multiline = true;
            } 
          }          
        }
      });
    }
  }
  
  //stringify content to send to event object;
  e.parameters.content = JSON.stringify(content);
  
  //set data state change and navigate to display card;
  await builder.setNavigation(CardService.newNavigation().updateCard(cardDisplay(e)));
  builder.setStateChanged(true);
  return builder.build();
}

/**
 * Updates data with form input values, performs request and calls display with updated response;
 * @param {Object} e event object;
 */
async function updateSectionAdvanced(e) {
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
              var isContained = false;
              try {
                isContained = forms[key].some(function(val){
                  if(val===option.value) { return val; }
                });
              }
              catch(error) { console.error(error); }
              if(isContained) { option.selected = true; }else { option.selected = false; }
            });
          }else if(type==='KeyValue') {
            if(form[key]) { widget.switchValue = true; }
          }else {
            widget.content = form[key];
          }
        }
      }

      //perform additional check for all inputs switched off;
      if(!Object.keys(form).some(function(key){ return key===widget.name; })) {
        if(type===globalEnumRadio||type===globalEnumCheckbox) {
          var content = widget.content;
          content.forEach(function(option){
            option.selected = false;
          });            
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
  
  
  
  //check if type has edit() method or use run() if none provided;
  var resp;
  if(cType.edit) {
    resp = await cType.edit(msg,connector,forms,data);
  }else {
    resp = await cType.run(msg,connector,data);
  }
  
  //override event object parameters with response data;
  e.parameters.code    = resp.code;
  e.parameters.content = resp.content;
  
  return actionShow(e);
}

/**
 * Checks if URL entered is valid and displays a warning if it is not;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function checkURL(e) {
	var regExp = /^http:\/\/\S+\.+\S+|^https:\/\/\S+\.+\S+/;
	var url = e.formInput.connectionURL;
	var test = regExp.test(url);
	if(!test) {
		var action = CardService.newActionResponseBuilder();
			action.setNotification(warning(globalInvalidURLnoMethod));
		return action.build();
	}
}

/**
 * Removes card from navigation and loads previous card in stack;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function goBack(e) {
	//create action response builder;
	var builder = CardService.newActionResponseBuilder();
		  
	//set data state change and pop card from stack;
	await builder.setNavigation(CardService.newNavigation().popCard());
	builder.setStateChanged(true);
	return builder.build();
}

/**
 * Removes all cards from navigation and loads root (first) card in stack;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function goRoot(e) {
	//create action response builder;
	var builder = CardService.newActionResponseBuilder();
		  
	//set data state change and navigate to main card;
	await builder.setNavigation(CardService.newNavigation().popCard().pushCard(cardOpen(e)));
	builder.setStateChanged(true);  
	return builder.build();
}

/**
 * Pushes settings card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function goSettings(e) {
		  //create action response builder;
		  var builder = CardService.newActionResponseBuilder();
		  
		  //set data state change and navigate to settings card;
		  builder.setNavigation(CardService.newNavigation().popCard().pushCard(cardSettings(e)));
		  builder.setStateChanged(true);  
		  return builder.build(); 
}

/**
 * Pushes confirmation card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function actionConfirm(e) {
	//create action response builder;
	var builder = CardService.newActionResponseBuilder();
		  
	//set data state change and navigate to confirmation card;
	await builder.setNavigation(CardService.newNavigation().pushCard(cardConfirm(e)));
	builder.setStateChanged(false);
	return builder.build();
}

/**
 * Pushes connector update card on stack top and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function actionEdit(e) {
	//create action response builder;
	var builder = CardService.newActionResponseBuilder();

	//set data state change and navigate to edit connector card;
	await builder.setNavigation(CardService.newNavigation().pushCard(cardUpdate(e)));    
	builder.setStateChanged(true);
	return builder.build();
}

/**
 * Pushes display card on stack top with data provided and loads it;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function actionShow(e) {
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

/**
 * Pushes display card on stack top after performing data fetch; 
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function actionManual(e) {
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
		  await builder.setNavigation(CardService.newNavigation().pushCard(cardDisplay(e)));
		  builder.setStateChanged(true);
		  return builder.build();
}

/**
 * Performs reset of every user preference;
 * @param {Object} e event object;
 * @returns {ActionResponse}
 */
async function performFullReset(e) {
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
		  await builder.setNavigation(CardService.newNavigation().updateCard(cardOpen(e)));
		  builder.setStateChanged(true);
		  return builder.build();
}