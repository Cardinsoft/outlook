/**
 * Creates section promping user to authorize the Connector;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector object;
 * @param {String} error error message to set to title;
 * @returns {CardSection} this CardSection;
 */
function createNotAuthorizedSection(builder,isCollapsed,connector,error) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //access authorization parameters;
  var cAuth    = new this[connector.type]().auth;
  var authType = connector.auth;
  
  if(authType!=='none') {
    //explain that connector requires auth;
    createWidgetNotAuthorized(section,globalNotAuthorizedContent,error);
  
    //if auth data not provided by type -> invoke from connector;
    if(Object.keys(cAuth).length!==0) {
      cAuth.name = connector.name;
      createWidgetOpenAuth(section,globalOpenAuthText,cAuth);
    }else if(authType===globalOAuth2AuthType) {
      createWidgetOpenAuth(section,globalOpenAuthText,connector);
    }
  }else {
    //explain that there was a connector type mismatch;
    createWidgetAuthTypeErr(section,globalAuthTypeErrorContent);
  }
  
  //append section and return it;
  builder.addSection(section);  
  return section;
}

/**
 * Creates section with a ButtonSet of actionable TextButtons;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Array} actionsConfig an Array of objects with action config for TextButtons;
 * @returns {CardSection|undefined} this CardSection;
 */
function createActionsSection(builder,isCollapsed,actionsConfig) {

  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  var buttons = [];
  
  //createTextButtons;
  actionsConfig.forEach(function(action){
    var button = textButtonWidget(action.text,false,false,action.funcName,action.params);
    buttons.push(button);
  });
  
  if(buttons.length>0) {
  
	  //create ButtonSet and set TextButtons;
	  var set = buttonSet(buttons);
	  section.addWidget(set);
	  
	  //append section and return it;
	  builder.addSection(section);  
	  return section; 
  
  }
}

/**
 * Creates section with a list of configured Connectors to display;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @param {Array} config an array of Connector settings objects;
 * @param {GmailMessage} msg current meassge object;
 * @returns {CardSection} this CardSection;
 */
async function createConnectorListSection(builder,isCollapsed,header,config,msg) {

  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set additional parameters;
  if(header!=='') { section.setHeader(header); }
  if(isCollapsed) { section.setNumUncollapsibleWidgets(globalNumUncollapsibleList); }
  
  //sort configuration;
  sortConfig(config);
  
  //add Connectors representation;
  for(var key in config) {
    var connector = config[key];
	  
	//get required parameters;
    var type      = connector.type;
    var icon      = connector.icon;
    var name      = connector.name;
    var url       = connector.url;
    var manual    = connector.manual;
    var authType  = connector.auth;
    
    //default to empty url if nothing is in source;
    if(!url) { 
      url = ''; 
      connector.url===''; 
    }
    
    //load connector type and get authorization config;
    var cType = new this[type]();
    var cAuth = cType.auth;

    if(Object.keys(cAuth).length!==0) {
      
      //add properties for OAuth 2.0-based Connector;
      if(cAuth.type===globalOAuth2AuthType) {
        //set authorization properties from type;
        connector.urlAuth  = cAuth.urlAuth; 
        connector.urlToken = cAuth.urlToken;
        connector.id       = cAuth.id;
        connector.secret   = cAuth.secret;
        if(cAuth.hint)    { connector.hint = cAuth.hint; }
        if(cAuth.offline) { connector.offline = cAuth.offline; }
        if(cAuth.prompt)  { connector.prompt = cAuth.prompt; }
        
        //default to type's scope if none provided;
        if(connector.scope===''||!connector.scope) { 
          connector.scope = cAuth.scope;
        }
      }
      
    }
    
    if(!manual) {
      //perform request and parse response if connector is not manual;
      try { var response = await cType.run(msg,connector); }
      catch(error) {
		console.error('Encountered an error while trying to run Connector type: %s',error);
        //temporary solution for uncaught 401 error;
        var response = {headers:'', content:error.message};
        var isAuth = checkAgainstErrorTypes(error);
        if(!isAuth) { response.code = 0; }else { response.code = 401; }
      }
      var code     = response.code;
      var content  = response.content;
      var hasMatch = response.hasMatch;
      
      //initialize common varibales;
      var button, widget, label, actionName;
      
      //set response code to connector (display req);
      connector.code = code;   
      
      //function name to run;
      actionName = 'actionShow';
      
      if(code>=200&&code<300) {
      
        //handle successful requests;
        content = parseData(content);
        var length = content.length;
        
        if(hasMatch) {
          
          //access match properties;
          var matched = hasMatch.value;
          var text    = hasMatch.text;
          var colour  = hasMatch.colour;
          
          //if custom text is not provided -> default;
          if(!text) { text = 'Has match'; }
          
          //handle use cases;
          if(length>0&&matched) { label = text; }else if(length>0) { label = 'No match'; }else { label = globalNoData; }
          
          //set button colour if provided, else -> default to secondary colour;
          if(colour) { label = '<font color="'+colour+'">'+label+'</font>'; }
        
        }else {
          
          if(length>0) { label = 'Has match'; }else { label = globalNoData; }
          
        }
        
        connector.content = JSON.stringify(content);
        
      }else {
      
        //handle failed requests;
        label = globalError;
        connector.error = JSON.stringify(content);
        
      }
      
    }else {
      //set manual action function name and label;
      actionName = 'actionManual';
      label      = globalManual;
    }
	
    //stringify parameters to pass to action;
    connector = propertiesToString(connector);
    
    //set label and create widget representing connector;
    button = textButtonWidget(label,false,false,actionName,connector);
    widget = actionKeyValueWidgetButton(icon,'',name,button,actionName,connector);
	
    section.addWidget(widget);
  }
      
  //append section and return it;   
  builder.addSection(section);   
  return section;
}

/**
 * Creates section with a list of configured Connectors to edit;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Array} config an array of Connector settings objects;
 * @returns {CardSection} this CardSection;
 */
function createConfiguredConnectorsSection(builder,isCollapsed,config) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
      section.setHeader(globalConfigListHeader);
      
  //set additional parameters;
  if(isCollapsed) { section.setNumUncollapsibleWidgets(globalNumUncollapsible); }
      
  try {
    //sort configuration;
    sortConfig(config);
  
    config.forEach(function(connector) {
      var icon = connector.icon;
      var name = connector.name;
      var url  = connector.url;
      var type = connector.type;
      
      //default to empty url if nothing is in source;
      if(url===undefined) { 
        url = ''; 
        connector.url===''; 
      }
      
      //stringify connector parameters;
      connector = propertiesToString(connector);
      
      var widget = actionKeyValueWidget(icon,'',name,'actionEdit',connector);
      section.addWidget(widget);
    });
    
    builder.addSection(section);
    return section;
  }
  catch(error) {  
    console.error(error);
    //catch configuration error and create erro info section instead;
    createConfigErrorSection(builder,false,globalConfigErrorHeader,globalConfigErrorWidgetTitle,globalConfigErrorWidgetContent,globalResetWidgetSubmitText);
  }
}

/**
 * Creates section with configuration error info and reset button and prompt;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @param {String} title error prompt widget title;
 * @param {String} content error prompt widget content;
 * @returns {CardSection} this CardSection;
 */
function createConfigErrorSection(builder,isCollapsed,header,title,content) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);  
      section.setHeader(header); 
  
  //set additional parameters;
  if(isCollapsed) { section.setNumUncollapsibleWidgets(globalNumUncollapsible); }
        
  //create reset prompt widget;
  var resetText = simpleKeyValueWidget(title,content,true);
  section.addWidget(resetText); 
  
  //create TextButton widget for full reset;
  createWidgetResetSubmit(section);
  
  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section with partial data and navigation Ui for traversing full data (100 widgets cap handling);
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} end data element index to end on; 
 * @param {Integer} begin data element index to begin with;
 * @param {Integet} max maximum number of elements to show; 
 * @param {Array} data results array to traverse;
 * @param {Object} connector connector object;
 * @returns {CardSection} this CardSection;
 */
function createExtraDataSection(builder,isCollapsed,end,begin,max,data,connector) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
  
  //create widget prompting the user that there is more data to show;
  var restText = simpleKeyValueWidget(globalExtraDataTitle,globalExtraDataText,true);
  section.addWidget(restText);
  
  //set connector parameters;
  connector.data  = data;
  connector.start = max;
  
  //stringify Connector parameters;
  connector = propertiesToString(connector);
  
  //set action function name to run;
  var actionName = 'actionShow';
  
  var show = textButtonWidget(globalLoadExtraForwardText,false,false,actionName,connector);
  connector.start = begin.toString();
  var back = textButtonWidget(globalLoadExtraBackText,false,false,actionName,connector);
  
  //handle conditionally adding buttons "back" and "next" according to data part that is being parsed
  if(max<=end) {
    if(max>=(max-begin)) {
      var set = buttonSet([back,show]);
      section.addWidget(set);
    }else {
      section.addWidget(show);
    }
  }else {
    section.addWidget(back);
  }
  
  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section prompting use that there is no data to show;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector configuration object;
 * @param {GmailMessage} msg current meassge object;
 * @returns {CardSection} this CardSection;
 */
function createNoFieldsSection(builder,isCollapsed,connector,msg) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
      section.setHeader(globalNoDataWidgetTitle);
   
  //create KeyValue widget prompting user that no data is available;
  var trimmed = trimMessage(msg,true,true);
  var prompt  = globalNoDataWidgetContent+' '+trimmed.first+' '+trimmed.last+'\r<b>'+trimmed.email+'</b>';
  var noData = simpleKeyValueWidget('',prompt,true);
  section.addWidget(noData);
  
  //create TextButton for adding contact if config provides one;
  var addConfig = new this[connector.type]().addConfig;
  if(addConfig) {
    var add = textButtonWidget('Add contact',false,false,'configureContactAdd',addConfig(propertiesToString(connector),msg));
    section.addWidget(add);
  }
  
  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section containing buttons for going back and/or to root card;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} index connector index;
 * @returns {CardSection} this CardSection;
 */
function createSectionBack(builder,isCollapsed,index) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
  
  createWidgetsBackAndToRoot(section,index);
  
  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section containing promp to confirm action and set of buttons to proceed;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} e event object;
 * @returns {CardSection} this CardSection;
 */
function createSectionConfirm(builder,isCollapsed,e) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
  
  createWidgetsConfirm(section,e);

  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section containing error message and unparsed data;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} error error message to show;
 * @param {String} content unparsed content;
 * @returns {CardSection} this CardSection;
 */
function createUnparsedSection(builder,isCollapsed,error,content) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
      section.setHeader(globalUnparsedHeader);

  //create widget for unparsed error prompt;
  var errCode = simpleKeyValueWidget(globalUnparsedErrorWidgetTitle,error,true);
  section.addWidget(errCode);

  //create widget for unparsed data;
  var data = simpleKeyValueWidget(globalUnparsedDataWidgetTitle,content,true);
  section.addWidget(data);

  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section containing error code and error text;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} code response status code;
 * @param {String} error error message to show; 
 * @returns {CardSection} this CardSection;  
 */
function createErrorSection(builder,isCollapsed,code,error) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //initiate error title and content;
  var header = 'Connector error', content, errorDetails = '';
  
  //create user-friendly prompts for http errors;
  if(code!==0) {
    
    //set user-friendly messages for response errors; 
    switch(code) {
      case 404:
        header  = 'Not found';
        content = 'Seems like the endpoint resource you want the Connector to access cannot be found or does not exist';     
        break;
      case 405:
        header   = 'Method Not Allowed';
        content  = 'The method the Connector is using is not allowed by endpoint resource.\r';
        content += 'By default, our Add-on makes POST requests to external APIs - please, let us know if you need to be able to choose methods for this Connector type';
        break;
      case 500:
        header  = 'Internal Server Error';
        content = 'Connector endpoint resource responded with a generic error. Please, check the error details provided below for additional information';
        break;
      case 501:
        header   = 'Not Implemented';
        content  = 'The Connector\'s method is not supported. You are witnessing an error that should not be possible.';
        content += 'Please, do <a href="mailto:support@cardinsoft.com">contact us</a>!';
        break;
      case 503:
        header  = 'Service Unavailable';
        content = 'The endpoint resource is currently unavailable or is down for maintenance. Please, wait until it becomes available or contact service support';
        break;
    }
    
    errorDetails = error;
    
  }else {
    var custom;
    if(typeof error==='string') { 
      custom = {descr : globalGeneralErrorContent, additional : error}; 
    }
    custom = parseData(error);
    if(custom.descr) { content = custom.descr; }
    if(custom.additional) { errorDetails = custom.additional; }
  }

  //set section's header;
  section.setHeader(header);
  
  //create error description widget;
  if(content) {
    var description = simpleKeyValueWidget('',content,true);
    section.addWidget(description);
  }
  
  //create error information widget;
  if(errorDetails) {
    var additional = simpleKeyValueWidget(globalErrorWidgetTitle,errorDetails,true);
    section.addWidget(additional);
  }
  
  //create contact us widget;
  createWidgetGetSupport(section);

  //add section and return;
  builder.addSection(section);
  return section;
}

/**
 * Creates section with authorization and revoke buttons (for OAuth2.0-based Connectors);
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} connector connector configuration object;
 * @param {Object} auth section auth config object;
 * @returns {CardSection} this CardSection;
 */
function createSectionAuth(builder,connector,auth) {
  var section = CardService.newCardSection();
  
  var authText = textWidget(globalAuthTextWidgetContent);
  section.addWidget(authText);
  
  if(auth) {
    if(Object.keys(auth).length===0) { 
      var auth = {
        'urlAuth': connector.urlAuth,
        'urlToken': connector.urlToken,
        'id': connector.id,
        'secret': connector.secret,
        'scope': connector.scope
      };
      if(connector.hint)    { auth.hint = connector.hint; }
      if(connector.offline) { auth.offline = connector.offline; }
      if(connector.prompt)  { auth.prompt = connector.prompt; }      
    }
    
    //pass auth to connector;    
    mergeObjects(connector,auth);
    propertiesToString(connector);

    //create ButtonSet for login, auth and revoke buttons;
    var buttonSet = CardService.newButtonSet();
    
    //if connector provides login url -> create login button;
    if(connector.login) {
      createWidgetLogin(buttonSet,globalLoginText,connector.login);
    }
    
    //create widgets for initiating and revoking authorization flow;
    createWidgetOpenAuth(buttonSet,globalOpenAuthText,connector);
    createWidgetRevoke(buttonSet,globalRevokeAuthText,connector);
    
    section.addWidget(buttonSet);
  }
  
  //add section and return;
  builder.addSection(section);
  return section;
}

/**
 * Creates section from widgets config;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} config section config object;
 * @returns {CardSection} this CardSection;
 */ 
function createSectionConfig(builder,config) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
  
  //set optional parameters;
  if(config.header)           { section.setHeader(config.header); }
  if(config.isCollapsible)    { section.setCollapsible(config.isCollapsible); }
  if(config.numUncollapsible) { section.setNumUncollapsibleWidgets(config.numUncollapsible); }
  
  //access widgets and build them;
  var widgets = config.widgets;
  if(widgets&&widgets.length!==0) {
    widgets.forEach(function(widget,index) {
      var element;
      
      //access basic parameters;
      var type    = widget.type;
      var title   = widget.title;
      var name    = widget.name;
      var content = widget.content;
      
      //access type-specific params and build widget;
      switch(type) {
        case 'TextParagraph':
          element = textWidget(content);
          break;
        case globalTextButton:
          //access TextButton-specific params;
          var disabled   = widget.disabled;
          var filled     = widget.filled;
          var fullsized  = widget.fullsized;
          var reload     = widget.reload;
          var action     = widget.action;
          var colour     = widget.colour;
          
          //if colour is provided -> set button text colour;
          if(colour) { title = '<font colour="'+colour+'">'+title+'</font>'; }
          
          //build either a clickable or a linked button;
          if(action===globalActionClick) {
            element = textButtonWidget(title,disabled,filled,content);
          }else {
            element = textButtonWidgetLinked(title,disabled,filled,content,fullsized,reload);
          }
        
          break;
        case 'KeyValue':
          //access KeyValue-specific params;
          var iconUrl     = widget.icon;
          var isMultiline = widget.isMultiline;
          var switchValue = widget.switchValue;
          var buttonText  = widget.buttonText;
          var disabled    = widget.disabled;
          var filled      = widget.filled;
          
          //default to multiline if nothing is set;
          if(!isMultiline) { isMultiline = true; }
          
          //default to no icon if nothing is set;
          if(!iconUrl) { iconUrl = ''; }
          
          //set Switch or TextButton to widget if provided;
          if(switchValue) {
            element = switchWidget(iconUrl,title,content,name,switchValue,switchValue);
          }else if(buttonText) {
              if(disabled===undefined) { disabled = true; }
              if(!filled) { filled = false; }
              var button = textButtonWidget(buttonText,disabled,filled);
              element = simpleKeyValueWidget(title,content,isMultiline,iconUrl,button);
          }else {
              element = simpleKeyValueWidget(title,content,isMultiline,iconUrl);
          }
          
          break;
        case 'TextInput':
          //access TextInput-specific params;
          var hint      = widget.hint;
          var multiline = widget.multiline;
          
          element = textInputWidget(title,name,hint,content,multiline);
          break;
        case globalEnumRadio:
          element = selectionInputWidget(title,name,type,content);
          break;
        case globalEnumCheckbox:
          element = selectionInputWidget(title,name,type,content);
          break;
        case globalEnumDropdown:
          element = selectionInputWidget(title,name,type,content);
          break;
      }
      
      //add widget to section;
      section.addWidget(element);
    });
    builder.addSection(section);
  }
  
  return section;
}

/**
 * Handles sections generation if a simple json schema (an array of objects with key-value pairs) is provided;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Array} data a set of key-value pairs representing widgets; 
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} index result index to append to section header;
 * @returns {CardSection} this CardSection;
 */
function createSectionSimple(builder,data,isCollapsed,index) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(index) { section.setHeader(globalShowHeader+' '+(index+1)) }
 
  //create section if any widgets provided;
  if(Object.keys(data).length!==0) {
    //append wigets to section;
    for(var key in data) {
      var widget = simpleKeyValueWidget(key,data[key],true);
      section.addWidget(widget);
    }
  
    //append section and return it;
    builder.addSection(section);
    return section;  
  }
}

/**
 * Handles sections generation if a complex json schema is provided;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} obj data object element with section display settings;
 * @param {Integer} sectionIndex index of section currently created;
 * @param {Object} connector connector config object;
 * @param {Integer} max maximum number of widgets to create;
 * @returns {CardSection} this CardSection;
 */
function createSectionAdvanced(builder,obj,sectionIndex,connector,max) {
  //create section;
  var section = CardService.newCardSection();
  
  //access section parameters;
  var header           = obj.header;
  var isCollapsible    = obj.isCollapsible;
  var numUncollapsible = obj.numUncollapsible;
  var widgets          = obj.widgets;
  
  //set optional parameters;
  if(header) { section.setHeader(header); }
  if(isCollapsible) { 
    section.setCollapsible(isCollapsible);
    if(numUncollapsible>0) { section.setNumUncollapsibleWidgets(numUncollapsible); }else if(numUncollapsible) { section.setNumUncollapsibleWidgets(globalNumUncollapsible); }
  }
  
  //append widgets if there are any;
  if(widgets.length!==0) {
    widgets.forEach(function(widget,index) {
      
      if(index<=max) {
    
        var state = widget.state;
        if(state!=='hidden') { 
          var element;
		  
          var type    = widget.type;
          if(type) {
            var icon    = widget.icon;
            var title   = widget.title;
            var name    = widget.name;
            var content = widget.content;
          
			switch(type) {
				case 'TextP	aragraph':
				  element = textWidget(content);
				  break;
				case 'Image':
				  var alt = widget.alt;
				  element = imageWidget(content,alt); //expand on future UPD;
				  break;
				case globalTextButton:
				  //access TextButton-specific params;
				  var disabled   = widget.disabled;
				  var filled     = widget.filled;
				  var fullsized  = widget.fullsized;
				  var reload     = widget.reload;
				  var action     = widget.action;
				  var funcName   = widget.funcName;
				  var parameters = widget.parameters; 
				  var colour     = widget.colour;
				  
				  //set button text colour if provided;
				  if(colour) { title = '<font color="'+colour+'">'+title+'</font>'; }
				  
				  //set parameters if provided and default to connector;
				  if(!parameters) { parameters = connector; }
				
				  //build either a clickable or a linked button;
				  if(action===globalActionClick) {
					element = textButtonWidget(title,disabled,filled,funcName,parameters);
				  }else if(action===globalActionAction) {
					element = textButtonWidgetLinked(title,disabled,filled,content,fullsized,reload,true,funcName,parameters);
				  }else {
					element = textButtonWidgetLinked(title,disabled,filled,content,fullsized,reload);
				  }
			  
				  break;
				case globalKeyValue:
				  //access KeyValue-specific params;
				  var isMultiline = widget.isMultiline;
				  var switchValue = widget.switchValue;
				  var buttonText  = widget.buttonText;
				  var disabled    = widget.disabled;
				  var filled      = widget.filled;
				  
				  //default to multiline;
				  if(!isMultiline) { isMultiline = true; }
				 
				  //default to no icon;
				  if(!icon) { icon = ''; }
				  
				  //set Switch or TextButton to widget if provided;
				  if(switchValue) {
					element = switchWidget(icon,title,content,name,switchValue,switchValue);
				  }else {
				  
					//set section and widget index and stringify;
					connector.sectionIdx = sectionIndex;
					connector.widgetIdx  = index;
					connector = propertiesToString(connector);
				  
					if(buttonText) {
					  if(disabled===undefined) { disabled = true; }
					  if(!filled) { filled = false; }
					  var button = textButtonWidget(buttonText,disabled,filled);
					  if(state!=='editable') {
						element = simpleKeyValueWidget(title,content,isMultiline,icon,button);
					  }else {
						element = actionKeyValueWidgetButton(icon,title,content,button,'editSectionAdvanced',connector);
					  }
					}else {
					  if(state!=='editable') {
						element = simpleKeyValueWidget(title,content,isMultiline,icon);
					  }else {
						element = actionKeyValueWidget(icon,title,content,'editSectionAdvanced',connector);
					  }
					}
				  }
				  
				  break;
				case 'TextInput':
				  //access TextInput-specific params;
				  var hint      = widget.hint;
				  var multiline = widget.multiline;
				  
				  element = textInputWidget(title,name,hint,content,multiline);
				  break;
				case globalEnumRadio:
				  element = selectionInputWidget(title,name,type,content);
				  break;
				case globalEnumCheckbox:
				  element = selectionInputWidget(title,name,type,content);
				  break;
				case globalEnumDropdown:
				  element = selectionInputWidget(title,name,type,content);
				  break;
            }
            section.addWidget(element);
          } //end type check;
          
        } //end state check;
        
      } //end cap check;
      
    });
    //append section and return it;
    builder.addSection(section);
    return section;
    
  } //end non-empty check;
}

/**
 * Creates section containing widgets representing connector types;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String=} header section header text;
 * @returns {CardSection} this CardSection;
 */
function createSectionChooseType(builder,isCollapsed,header) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(header) { section.setHeader(header); }
  
  //create class instance to get config data;
  var flow       = new Flow();
  var lacrm      = new LessAnnoyingCRM();
  var pipedrive  = new Pipedrive();
    
  //create an array of used types;
  var types = getTypes();
  
  //create widgets for each type;
  types.forEach(function(type){ 
    createWidgetCreateType(section,type);
  });

  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section with manual and default switches + add connector button;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @param {Object} type connector type object;
 * @returns {CardSection} this CardSection;
 */
function createSectionAddConnector(builder,isCollapsed,header,type) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set required parameters;
  if(header&&header!=='') { section.setHeader(header); }
  
  //create Switch widgets for manual and default behaviour;
  createWidgetSwitchManual(section,type.manual);
  createWidgetSwitchDefault(section,type.isDefault);
  
  //create auth type choice if no auth data is provided by type;
  if(Object.keys(JSON.parse(type.auth)).length===0&&type.type===globalBaseClassName) { 
    if(type.authType===globalOAuth2AuthType) {
      createWidgetChooseAuth(section,false,type.authType);
      createWidgetCustomInput(section,globalUrlAuthFieldName,'Auth',globalAuthUrlInputHint,'');
      createWidgetCustomInput(section,globalUrlTokenFieldName,'Token',globalTokenUrlInputHint,'');
      createWidgetCustomInput(section,globalClientIdFieldName,'Client Id',globalClientIdInputHint,'');
      createWidgetCustomInput(section,globalSecretFieldName,'Client Secret',globalSecretInputHint,'');
      createWidgetCustomInput(section,globalScopeFieldName,'Scope',globalScopeInputHint,'');
    }else {
      createWidgetChooseAuth(section,false);
    }
  }
  
  //create TextButton with Connector creation action;
  createWidgetCreateConnector(section,globalCreateConnectorText,type);
  
  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section with manual and default switches + edit connector button and sets input values;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector configuration object;
 * @param {Boolean} isReloaded truthy value to derermine wheter it is invoked from input change;
 * @param {String} authType authorization type to set auth type choice group to;
 * @returns {CardSection} this CardSection;
 */
function createSectionUpdateConnector(builder,isCollapsed,connector,isReloaded,authType) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);

  //create Switch widgets for manual and default behaviour;
  createWidgetSwitchManual(section,connector.manual);
  createWidgetSwitchDefault(section,connector.isDefault);
  
  //get auth parameters from type and connector;
  var cAuth = new this[connector.type]().auth;
  var auth  = connector.auth;
  
  //create auth type choice if no auth data is provided by type;
  if(Object.keys(cAuth).length===0&&auth!=='none'&&auth!==undefined) {
    if(auth===globalOAuth2AuthType&&!isReloaded) {
      createWidgetChooseAuth(section,true,auth);
      createWidgetCustomInput(section,globalUrlAuthFieldName,'Auth',globalAuthUrlInputHint,connector.urlAuth);
      createWidgetCustomInput(section,globalUrlTokenFieldName,'Token',globalTokenUrlInputHint,connector.urlToken);
      createWidgetCustomInput(section,globalClientIdFieldName,'Client Id',globalClientIdInputHint,connector.id);
      createWidgetCustomInput(section,globalSecretFieldName,'Client Secret',globalSecretInputHint,connector.secret);
      createWidgetCustomInput(section,globalScopeFieldName,'Scope',globalScopeInputHint,connector.scope);
    }else if(!isReloaded) {
      createWidgetChooseAuth(section,true);
    }else if(auth===globalOAuth2AuthType||authType===globalOAuth2AuthType) {
      createWidgetChooseAuth(section,true,authType);
      
      if(connector.scope) { 
        createWidgetCustomInput(section,globalScopeFieldName,'Scope','Authorization scope',connector.scope);
      }else {
        createWidgetCustomInput(section,globalUrlAuthFieldName,'Auth',globalAuthUrlInputHint,'');
        createWidgetCustomInput(section,globalUrlTokenFieldName,'Token',globalTokenUrlInputHint,'');
        createWidgetCustomInput(section,globalClientIdFieldName,'Client Id',globalClientIdInputHint,'');
        createWidgetCustomInput(section,globalSecretFieldName,'Client Secret',globalSecretInputHint,'');
        createWidgetCustomInput(section,globalScopeFieldName,'Scope',globalScopeInputHint,'');
      }
    }else {
      createWidgetChooseAuth(section,true);  
    }
   
  } 
  
  //append update and remove ButtonSet;
  var buttonSet = CardService.newButtonSet();
  createWidgetUpdateConnector(buttonSet,globalUpdateConnectorText,connector);
  createWidgetRemoveConnector(buttonSet,globalRemoveConnectorText,connector);
  section.addWidget(buttonSet);
  
  //append section and return it;
  builder.addSection(section);
  return section;   
}

/**
 * Creates section for connector type description;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} short connector type description;
 * @param {String} header section header text;
 * @returns {CardSection} this CardSection;
 */
function createDescriptionSection(builder,isCollapsed,short,header) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(header) { section.setHeader(header); }  
  
  //create widget with short Connector desription;
  createWidgetShortText(section,'',short);
  
  //append section and return it;
  builder.addSection(section);
  return section; 
}

/**
 * Creates section for Connector custom icon input;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {String} content input content text;
 * @returns {CardSection} this CardSection;
 */
function createCustomIconsSection(builder,isCollapsed,content) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
      section.setHeader(globalCustomIconHeader);
  
  //set user prompt with a link to whitelisted domain URL;
  var prompt = 'This Connector type allows custom icons - simply provide the URL of the icon you want to use. ';
      prompt += 'Please, note that it must be <b>publicly hosted</b>';
  
  //create widgets with prompt and input for icon URL;
  createWidgetCustomIconPrompt(section,'',prompt);
  createWidgetCustomInput(section,globalIconFieldName,'Custom icon',globalCustomIconHint,content);
  
  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section for welcome info;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection} this CardSection;
 */
function createSectionWelcome(builder,isCollapsed,header) {
 
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(header) { section.setHeader(header); }
  
  //create FTU prompt widget;
  createWidgetWelcomeText(section);
  
  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section for settings;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection} this CardSection;
 */
async function createSectionSettings(builder,isCollapsed,header) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(header) { section.setHeader(header); }

  //create sorting widgets;
  await createWidgetSortBy(section); 
  
  //append section and return it;
  builder.addSection(section);
  return section;
}

/**
 * Creates section for advanced settings;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection} this CardSection;
 */
function createSectionAdvancedSettings(builder,isCollapsed,header) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(header) { section.setHeader(header); }

  //create reset prompt;
  createWidgetResetText(section);
  
  //create reset button with reset action;
  createWidgetResetSubmit(section);

  //append section and return it;
  builder.addSection(section);
  return section;  
}

/**
 * Creates section for help info;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection} this CardSection;
 */
function createSectionHelp(builder,isCollapsed,header) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(header) { section.setHeader(header); }
  
  //create help prompt widget;
  createWidgetHelpText(section);
  
  //create go to Cardin widget;
  createWidgetGoToCardin(section);
   
  //append section and return it;
  builder.addSection(section);
  return section;
}