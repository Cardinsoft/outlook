// The initialize function must be run each time a new page is loaded;
Office.initialize = (reason) => {
	$(document).ready(function () {
		cardOpen(e);
		
		$('#home').click(function(){
			cardOpen(e);
		});
		
		$('#settings').click(function(){
			cardSettings(e);
		});
		
		$('#help').click(function(){
			cardHelp(e);
		});
		
		$('#app-body').show();
		
		Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged,cardOpen);
	
	});
};

//===========================================START CARD===========================================//
/**
 * Creates and shows card with connector creation form;
 * @param {Object} e event object; 
 * @returns {Card}
 */
function addConnector(e) {
  var builder = CardService.newCardBuilder();

  var data    = e.formInput;
  var type    = e.parameters;
  
  //create and set card header;
  var header = CardService.newCardHeader();
      header.setTitle(type.name);
      header.setImageUrl(type.icon);
      builder.setHeader(header);
  
  //access type's basic and advanced config;
  var widgets  = JSON.parse(type.basic).widgets;
  var advanced = JSON.parse(type.config); 
 
  //create section with short type description;
  if(type.short!==undefined) {
    createDescriptionSection(builder,false,type.short);
  }
  
  //extend basic with advanced and create config section;
  advanced.forEach(function(c){
    mergeObjects(widgets,c.widgets);
  });
  
  //ensure input values are preserved;
  if(widgets.length!==0) {
    widgets.forEach(function(widget){
      var name    = widget.name;
      var content = widget.content; 
      
      for(var key in type) {
        //if field name is found;
        if(key===name) {
          //if content is array -> select options;
          if(content instanceof Array) {
            content.forEach(function(option){
              if(data[key].indexOf(option.value)!==-1) { 
                option.selected = true; 
              }else { 
                option.selected = false; 
              }
            });
          }else {
            widget.content = type[key];
          } 
        } 
      }          
    });
  }
  
  //create config object and section;
  var config = {
    header: globalConfigHeader,
    widgets: widgets
  };
  createSectionConfig(builder,config);
  
  //create fields 1-3 for custom connectors;
  if(type.name===globalBaseClassName) {
    createSectionFields(builder,false,3,type);
  }
  
  //create config for connector behaviour;
  createSectionAddConnector(builder,false,'',type);
  
  return builder.build();
}


/**
 * Creates and shows card with connector update form;
 * @param {Object} e event object;
 * @returns {Card}
 */
function cardUpdate(e) {
  var builder = CardService.newCardBuilder();
 
  var connector = e.parameters;
  var type      = connector.type;
  var icon      = connector.icon;
  var name      = connector.name;
  var url       = connector.url;
  var manual    = connector.manual;
  var isDefault = connector.isDefault;
  var authType  = connector.authType;
  if(authType==='OAuth2') { var isReloaded = true; }else { isReloaded = false; }
  
  //convert strings to boolean as e.parameters accepts only strings;
  if(manual==='true')     { manual = true;    }else { manual = false;    } 
  if(isDefault==='true')  { isDefault = true; }else { isDefault = false; }  
  connector.manual    = manual;
  connector.isDefault = isDefault;
  
  //create and set card header;
  var header = CardService.newCardHeader();
      header.setTitle(name);
      header.setImageUrl(icon);
      builder.setHeader(header);
  
  //access connector type;
  var cType = new this[type]();
  
  //create section with authorize / revoke;
  var cAuth = cType.auth;
  if(Object.keys(cAuth).length!==0||connector.auth==='OAuth2') {
    if(cType.login!==undefined) { connector.login = cType.login; }
    createSectionAuth(builder,connector,cAuth);
  }
  
  //access type's basic and advanced config;
  var widgets  = new Connector(icon,name,url).basic.widgets;
  var advanced = cType.config;
  
  //extend basic with advanced and create config section;
  advanced.forEach(function(c){
    mergeObjects(widgets,c.widgets);
  });  
  
  //ensure input values are preserved;
  if(widgets.length!==0) {
    widgets.forEach(function(widget){
      var name    = widget.name;
      var content = widget.content; 
      
      for(var key in connector) {
        //if field name is found;
        if(key===name) {
          //if content is array -> select options;
          if(content instanceof Array) {
            content.forEach(function(option){
              if(connector[key].indexOf(option.value)!==-1) { 
                option.selected = true; 
              }else { 
                option.selected = false; 
              }
            });
          }else {
            widget.content = connector[key];
          } 
        } 
      }          
    });
  }  
  
  //create config object and section;
  var config = {
    header: globalConfigHeader,
    widgets: widgets
  };
  createSectionConfig(builder,config);
  
  //create section with custom fields;
  if(connector.type===globalBaseClassName) {
    createSectionFields(builder,false,3,connector);
  }
  
  //create section with manual and default widgets + update button;
  createSectionUpdateConnector(builder,false,connector,true,isReloaded,authType);

  return builder.build();
}

/**
 * Creates and shows card with connector display according to data passed with event object;
 * @param {Object} e event object;
 * @returns {Card}
 */
function cardDisplay(e) {
  var builder = CardService.newCardBuilder();

  //get required parameters;
  var connector  = e.parameters;
  var index      = connector.index;
  var code       = +connector.code;
  var url        = connector.url;
  var content    = connector.content;
  var manual     = connector.manual;
  var type       = connector.type;
  var authType   = connector.auth;
  //get optional parameters;
  var error      = connector.error;
  var start      = connector.start;
  
  //e.parameters accepts only strings;
  if(manual==='true') { manual = true; }else if(manual==='false') { manual = false; }
  
  //perform parameters adjustments to prevent errors;
  if(index===undefined) { delete connector.index; }
  if(content!==undefined) { connector.content = JSON.stringify(content); }
  
  var msg = getToken(e);
  
  //create card header with connector properties;
  var header = CardService.newCardHeader();
      header.setImageUrl(connector.icon);
      header.setTitle(connector.name);
      builder.setHeader(header);
  
  //handle failed response codes;
  if((code<200||code>=300)&&code!==401) {
    createErrorSection(builder,true,code,error);
  }else if(code===401) {
    createNotAuthorizedSection(builder,false,connector,code);
    return builder.build();
  }
 
  //parse content;
  content = parseData(content);
 
  //if no content is passed - prompt user that there is no data to show;
  if(content.length===0&&error===undefined) { createNoFieldsSection(builder,false); }
  
  //try to display content or show unparsed data if error;
  try {
    if(content.length!==0) {
      
      //check if there are any nested objects or not;
      var hasNested = checkNested(content);
      if(hasNested) {
        
        for(var j=0; j<content.length; j++) {
      
          var result = content[j];
          
          var keys = Object.keys(result);
          var overrides = {};
          if(result.header!==undefined)           { overrides.header = result.header; }
          if(result.isCollapsible!==undefined)    { overrides.isCollapsible = Boolean(result.isCollapsible); }
          if(result.numUncollapsible!==undefined) { overrides.numUncollapsible = result.numUncollapsible; }



          try {
            createSectionsShow(builder,content,result,overrides,index,j,connector); 
          }
          catch(er) {
            //try to handle nested objects that do not conform to our schema;
            createSectionShow(builder,propertiesToString(result),true,j);
          }
        }
       
        var hasEditable = checkEditable(content);
        if(hasEditable) {
        
          //stringify connector properties;
          connector = propertiesToString(connector); 
        
          var updateButton = textButtonWidget(globalUpdateShowText,false,false,'updateSectionsShow',connector);
          var updateSection = CardService.newCardSection();
              updateSection.addWidget(updateButton);
          builder.addSection(updateSection);
          
        }
 
      }else {
        var cap = 0, fullLength = 0;
        
        //handle full content length (including all fields)
        for(var i=0; i<content.length; i++) {
          try {var result = JSON.parse(content[i]);}
          catch(er) { result = content[i]; }
          for(var key in result) { fullLength += 1; }      
        }
        
        //handle number of sections to display at one time
        for(var max=0; max<content.length; max++) {
          if(cap>=globalWidgetsCap) { break; }
          try {var result = JSON.parse(content[max]);}
          catch(er) { result = content[max]; }
          for(var key in result) { cap += 1; }
        }
        
        //shift begin and max parameters;
        if(start!==undefined) { 
          var begin = +start;
          max = max + begin;
        }else {
          begin = 0; 
        }

        for(var j=begin; j<content.length; j++) {        
          if(j===max) { break; }
          var result = content[j];
          if(content.length!==1) {
            createSectionShow(builder,result,true,j);
          }else {
            createSectionShow(builder,result,false,j);
          }
        }
        
      }
    }
  }
  catch(err) {
    //handle data that failed to comply to JSON schema;
    createUnparsedSection(builder,true,err.message,JSON.stringify(content));
  }

  var length = content.length;
  var diff = max-begin;
  
  if(fullLength>cap) {
    var end = length-1;
    if(length>max||length+diff-1===max) {
      var prev = (begin-diff);
      createExtraDataSection(builder,false,end,prev,max,200,index,content,connector);
    }
  }
  
  return builder.build();
}

/**
 * Generates display of connections card;
 * @param {Object} e event object;
 * @param {CardBuilder} builder card builder to append section to;
 * @returns {Card}
 */
async function cardsetDisplay(e,builder) {
  var msg = getToken(e);
  var config = await getProperty('config','user');
  
  var section = CardService.newCardSection();
  
  config.forEach(function(connector,index){
    //get required parameters;
    var type      = connector.type;
    var icon      = connector.icon;
    var name      = connector.name;
    var url       = connector.url;
    var manual    = connector.manual;
    var authType  = connector.auth;
    
    //default to empty url if nothing is in source;
    if(url===undefined) { 
      url = ''; 
      connector.url===''; 
    }
    
    //load connector type and get authorization config;
    var cType = new this[type]();
    var cAuth = cType.auth;
    
    //add connector index (display req);
    connector.index = index;

    if(Object.keys(cAuth).length!==0) {
      //set authorization properties from type;
      connector.urlAuth  = cAuth.urlAuth; 
      connector.urlToken = cAuth.urlToken;
      connector.id       = cAuth.id;
      connector.secret   = cAuth.secret;
      
      //default to type's scope if none provided;
      if(connector.scope===''||connector.scope===undefined) { 
        connector.scope = cAuth.scope;
      }
    }
    
    if(!manual) {
      //perform request and parse response if connector is not manual;
      try { var response = cType.run(msg,connector); }
      catch(error) {
        //temporary solution for uncaught 401 error;
        var response = {headers:'', content:error.message};
        var isAuth = checkAgainstErrorTypes(error);
        if(!isAuth) { response.code = 0; }else { response.code = 401; }
      }
      var code    = response.code;
      var content = response.content;
      
      //initialize common varibales;
      var button, widget, label, actionName;
      
      //set response code to connector (display req);
      connector.code = code;   
      
      actionName = 'actionShow';
      
      if(code>=200&&code<300) {
        //handle successful requests;
        content = parseData(content);
        var length = content.length;
        if(length!==0) { label = globalSuccess; }else { label = globalNoData; }
        connector.content = JSON.stringify(content);
      }else {
        //handle failed requests;
        label = globalError;
        connector.error = JSON.stringify(content);
      }
      
    }else {
      //create manual action function name and label;
      actionName = 'actionManual';
      label      = globalManual;
    }
    
    //stringify parameters to pass to action;
    connector = propertiesToString(connector);
    
    //set label and create widget representing connector;
    button = textButtonWidget(label,true,false,actionName);
    widget = actionKeyValueWidgetButton(icon,'',name,button,actionName,connector);
    section.addWidget(widget);
  });
  
  builder.addSection(section);
  return builder.build();
}

/**
 * Triggers either a welcome or display of connections card generators;
 * @param {Object} e event object;
 * @returns {Card}
 */
async function cardOpen(e) {  
  var builder = CardService.newCardBuilder();
  
  var src = await getProperty('config','user');
  var config;
  if(src!==null) {
    config = src;
  }else {
    config = [];
  }
  
  try {
    var hasDefault = config.some(function(conn){ if( Boolean(conn.isDefault)===true ) { return conn; } });
    
    if(hasDefault) {
      //fetch default connector from config;
      var def = config.filter(function(conn){ if( conn.isDefault!==false && conn.isDefault!==undefined ) { return conn; } })[0];
      
      //get message object;
      var msg = getToken(e);
      
      //get required parameters;
      var type      = def.type;
      var icon      = def.icon;
      var name      = def.name;
      var url       = def.url;
      var manual    = def.manual;
      var isDefault = def.isDefault;
      var authType  = def.auth;
      
      //find connector's index in config;
      var index = getIndex(config,def);
      
      //default to empty url if nothing is in source;
      if(url===undefined) { 
        url = ''; 
        def.url===''; 
      }
      
      //load connector type and get authorization config;
      var cType = new this[type]();
      var cAuth = cType.auth;
      
      //initialize and set common parameters;
      var params = {
        'type': type,
        'icon': icon,
        'name': name,
        'url': url, 
        'manual': manual.toString(),
        'isDefault':isDefault.toString(),
        'index': index.toString(),
        'auth': authType
      };
      
      if(Object.keys(cAuth).length!==0) {
        params.urlAuth  = cAuth.urlAuth; 
        params.urlToken = cAuth.urlToken;
        params.id       = cAuth.id;
        params.secret   = cAuth.secret;
        
        //default to type's scope if none provided;
        if(def.scope===''||def.scope===undefined) { 
          params.scope = cAuth.scope;
          def.scope    = cAuth.scope;
        }else { 
          params.scope = def.scope; 
        }  
        
      }else if(authType==='OAuth2') { 
        params.urlAuth  = def.urlAuth; 
        params.urlToken = def.urlToken;
        params.id       = def.id;
        params.secret   = def.secret;
        params.scope    = def.scope; 
      }
    
      //perform request and parse response if connector is not manual;
      try { var response = cType.run(msg,def); }
      catch(error) {
        //temporary solution for uncaught 401 error;
        var response = {headers:'', content:error.message};
        var isAuth = checkAgainstErrorTypes(error);
        if(!isAuth) { response.code = 0; }else { response.code = 401; }
      }
      var code    = response.code;
      var content = response.content;
      
      //set response code to parameters;
      params.code = code;
    
      //handle response codes;
      if(code>=200&&code<300) {
        var len = content.length;
        if(len!==0) { params.content = content; }
      }else {
        params.content  = '[]';
        params.error = content;
      }
      
      //assign parameters to event object;
      e.parameters = params;
      
      return cardDisplay(e);
      
    }else {
      
      if(config.length===0) {
        //build welcome, types and settings section on first-time use;
        var header = CardService.newCardHeader();
            header.setImageUrl(globalCardinIconUrl);
            header.setTitle(globalWelcomeHeader);
            builder.setHeader(header);
        
        createSectionWelcome(builder,false);
        
        createSectionChooseType(builder,false,globalChooseTypeHeader);
        
        createSectionHelp(builder,false);
      }else {
        //build display card if at least one connector exists;
        cardsetDisplay(e,builder,index);
      }
      return builder.build();
      
    }
  
  }
  catch(error) {
    //catch configuration error and create erro info section instead;
    createConfigErrorSection(builder,false,globalConfigErrorHeader,globalConfigErrorWidgetTitle,globalConfigErrorWidgetContent,globalResetWidgetSubmitText);
    return builder.build();
  }
}

/**
 * Generates settings card according to configuration;
 * @param {Object} e event object;
 */
async function cardSettings(e) {
  var builder = CardService.newCardBuilder();
      
  var src = await getProperty('config','user');
  var config;
  if(src!==null) {
    config = src;
  }else {
    config = [];
  }
  
  if(config.length!==0) {
    createConfiguredConnectorsSection(builder,false,config);
  }
  
  createSectionChooseType(builder,false,globalChooseTypeHeader);
  createAdvanced(builder,false,globalAdvancedHeader);
  
  return builder.build();
}

/**
 * Generates help card;
 * @param {Object} e event object;
 */
function cardHelp(e) {
  var builder = CardService.newCardBuilder();
      builder.setHeader(CardService.newCardHeader().setTitle(globalHelpHeader));
      
  createSectionHelp(builder,false);

  return builder.build();
}

/**
 * Generates card for confirming or cancelling action;
 * @param {Object} e event object;
 */
function cardConfirm(e) {
  //create card builder and set required params;
  var builder = CardService.newCardBuilder();
  
  //create and set card header;
  var header = CardService.newCardHeader();
      header.setTitle(globalConfirmHeader);
  builder.setHeader(header);
  
  createSectionConfirm(builder,false,e);
  
  return builder.build();
}
//===========================================END CARD===========================================//

//===============================================SECTIONS===============================================//
/**
 * Creates section with code 401 and authentication widget;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector object;
 * @param {String} error error message to set to title;
 */
function createNotAuthorizedSection(builder,isCollapsed,connector,error) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  var cAuth    = new this[connector.type]().auth;
  var authType = connector.auth;
  
  if(authType!=='none') {
    //explain that connector requires auth;
    createWidgetNotAuthorized(section,globalNotAuthorizedContent,error);
  
    //if auth data not provided by type -> invoke from connector;
    if(Object.keys(cAuth).length!==0) {
      createWidgetOpenAuth(section,globalOpenAuthText,cAuth);
    }else {
      var auth   = {};
      var custom = {};
      if(authType==='OAuth2') {
        custom.name     = connector.name;
        custom.scope    = connector.scope;
        custom.urlAuth  = connector.urlAuth;
        custom.urlToken = connector.urlToken;
        custom.id       = connector.id;
        custom.secret   = connector.secret;
        createWidgetOpenAuth(section,globalOpenAuthText,auth,custom);
      }
    }
  }else {
    //explain that there was a connector type mismatch;
    createWidgetAuthTypeErr(section,globalAuthTypeErrorContent);
  }
 
  builder.addSection(section);  
}

/**
 * Creates section with a list of configured connectors;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Array} config an array of connector settings objects;
 */
function createConfiguredConnectorsSection(builder,isCollapsed,config) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);   
      if(isCollapsed) { section.setNumUncollapsibleWidgets(globalNumUncollapsible); }
      section.setHeader(globalConfiguredHeader);
  try {
    config.forEach(function(connector,index) {
      var icon = connector.icon;
      var name = connector.name;
      var url  = connector.url;
      
      //default to empty url if nothing is in source;
      if(url===undefined) { 
        url = ''; 
        connector.url===''; 
      }      
      
      //set connector index (display card req);
      connector.index = index;
      
      //stringify connector parameters;
      connector = propertiesToString(connector);
      
      var widget = actionKeyValueWidget(icon,'',name,'actionEdit',connector);
      section.addWidget(widget);
    });
    
    builder.addSection(section);
  }
  catch(error) {  
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
 * @param {String} text reset button text;
 * @returns {CardSection}
 */
function createConfigErrorSection(builder,isCollapsed,header,title,content,text) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);   
      if(isCollapsed) { section.setNumUncollapsibleWidgets(globalNumUncollapsible); }
      section.setHeader(header);  
      
  //create reset prompt widget;
  var resetText = simpleKeyValueWidget(title,content,true);
  section.addWidget(resetText); 
  
  //create TextButton widget for full reset;
  createWidgetResetSubmit(section);
  
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
 * @param {Integer} code response status code;
 * @param {Integer} index connector index;
 * @param {Array} data results array to traverse;
 * @param {Object} connector connector object;
 */
function createExtraDataSection(builder,isCollapsed,end,begin,max,code,index,data,connector) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
  
  //create widget prompting the user that there is more data to show;
  var restText = simpleKeyValueWidget(globalExtraDataTitle,globalExtraDataText,true);
  section.addWidget(restText);
  
  //set connector parameters;
  connector.code  = code;
  connector.index = index;
  connector.data  = data;
  connector.start = max;
  
  //stringify connector parameters;
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
  
  builder.addSection(section);
}

/**
 * Creates section containing information message that data there is no data to show;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 */
function createNoFieldsSection(builder,isCollapsed) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
      
  var noData = simpleKeyValueWidget(globalNoDataWidgetTitle,globalNoDataWidgetText,true);
  section.addWidget(noData);
  
  builder.addSection(section);
}

/**
 * Creates section containing buttons for going back and/or to root card;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} index connector index;
 */
function createSectionBack(builder,isCollapsed,index) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
  
  createWidgetsBackAndToRoot(section,index);
  
  builder.addSection(section);
}

/**
 * Creates section containing promp to confirm action and set of buttons to proceed;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} e event object;
 * @returns {CardSection}
 */
function createSectionConfirm(builder,isCollapsed,e) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
  
  createWidgetsConfirm(section,e);

  builder.addSection(section);
  return section;
}

/**
 * Creates section containing error message and unparsed data;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} error error message to show;
 * @param {String} content unparsed content;
 */
function createUnparsedSection(builder,isCollapsed,error,content) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
      section.setHeader(globalUnparsedHeader);

  var errCode = simpleKeyValueWidget(globalUnparsedErrorWidgetTitle,error,true);
  section.addWidget(errCode);

  var data = simpleKeyValueWidget(globalUnparsedDataWidgetTitle,content,true);
  section.addWidget(data);

  builder.addSection(section);
}

/**
 * Creates section containing error code and error text;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} code response status code;
 * @param {String} error error message to show; 
 */
function createErrorSection(builder,isCollapsed,code,error) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
      section.setNumUncollapsibleWidgets(1);

  if(code!==0) {
    //initiate error title and content;
    var title, content;
    
    //set user-friendly messages for different responses;
    
    switch(code) {
      case 404:
        title   = 'Not found';
        content = 'Seems like the endpoint resource you want the connector to access cannot be found or does not exist';     
        break;
      case 405:
        title   = 'Method Not Allowed';
        content = 'The method the connector is using is not allowed by endpoint resource.\rBy default, our Add-on makes POST requests to external APIs - please, let us know if you need to be able to choose methods for this connector type';
    }
  
    var description = simpleKeyValueWidget(title,content,true);
    section.addWidget(description);
  }

  var additional = simpleKeyValueWidget(globalErrorWidgetTitle,error,true);
  section.addWidget(additional);

  builder.addSection(section);
}

/**
 * Creates section with authorization and revoke buttons;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} connector connector configuration object;
 * @param {Object} auth section auth config object;
 */
function createSectionAuth(builder,connector,auth) {
  var section = CardService.newCardSection();
  
  var authText = textWidget(globalAuthTextWidgetContent);
  section.addWidget(authText);
  
  if(auth!==undefined) {
    if(Object.keys(auth).length===0) { 
      auth = {
        'name': connector.type
      };
      var custom = {
        'name': connector.name,
        'urlAuth': connector.urlAuth,
        'urlToken': connector.urlToken,
        'id': connector.id,
        'secret': connector.secret,
        'scope': connector.scope
      };
      auth.scope = connector.scope;
    }

    var buttonSet = CardService.newButtonSet();
    if(connector.login!==undefined) {
      createWidgetLogin(buttonSet,globalLoginText,connector.login());
    }
    createWidgetOpenAuth(buttonSet,globalOpenAuthText,auth,custom);
    createWidgetRevoke(buttonSet,globalRevokeAuthText,auth,custom);
    section.addWidget(buttonSet);
  }
  
  builder.addSection(section);
}

/**
 * Creates section with a number of custom field inputs;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} numFileds number of custom field inputs to create;
 * @param {Object} connector connector config object;
 */
function createSectionFields(builder,isCollapsible,numFields,connector) {
  var section = CardService.newCardSection();
      section.setHeader('Custom fields');
      if(isCollapsible) { section.setCollapsible(isCollapsible); }
  
  createWidgetFieldsText(section,globalOptionalFieldsContent);
  
  if(numFields===undefined) { numFields = 3; }
  for(var i=1; i<=numFields; i++) {
    var name = 'field'+i;
    
    var value;
    if(connector!==undefined) {
     value = connector[name];
    }
    
    createWidgetCustomInput(section,name,name,'Custom connector fields',value);
  }
  
  builder.addSection(section);
}

/**
 * Creates section from widgets config;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} config section config object;
 */ 
function createSectionConfig(builder,config) {
  var section = CardService.newCardSection();
  if(config.header!==undefined)           { section.setHeader(config.header); }
  if(config.isCollapsible!==undefined)    { section.setCollapsible(config.isCollapsible); }
  if(config.numUncollapsible!==undefined) { section.setNumUncollapsibleWidgets(config.numUncollapsible); }
  
  var widgets = config.widgets;
  if(widgets!==undefined&&widgets.length!==0) {
    widgets.forEach(function(widget,index) {
      var element;
      var type    = widget.type;
      var title   = widget.title;
      var name    = widget.name;
      var content = widget.content;
      switch(type) {
        case 'TextParagraph':
          element = textWidget(content);
          break;
        case 'TextButton':
          //access button-specific params;
          var disabled   = widget.disabled;
          var filled     = widget.filled;
          var fullsized  = widget.fullsized;
          var reload     = widget.reload;
          var action     = widget.action;
          
          //build either a clickable or linked button;
          if(action===globalTextButtonActionClick) {
            element = textButtonWidget(title,disabled,filled,content);
          }else {
            element = textButtonWidgetLinked(title,disabled,filled,content,fullsized,reload);
          }
        
          break;
        case 'KeyValue':
          var isMultiline = widget.isMultiline;
          if(isMultiline===undefined) { isMultiline = true; }
          
          var iconUrl = widget.icon;
          if(iconUrl===undefined) { iconUrl = ''; }
          
          var switchValue = widget.switchValue;
          var buttonText = widget.buttonText;
          if(switchValue!==undefined) {
            element = switchWidget(title,content,name,switchValue,switchValue);
          }else {            
            if(buttonText!==undefined) {
              var button = textButtonWidget(buttonText,true,false);
              element = simpleKeyValueWidget(title,content,isMultiline,iconUrl,button);
            }else {
              element = simpleKeyValueWidget(title,content,isMultiline,iconUrl);
            }
          }
          break;
        case 'TextInput':
          var hint = widget.hint;
          element = textInputWidget(title,name,hint,content);
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
    });
  builder.addSection(section);
  }  
}

/**
 * Handles sections generation if a simple json schema (an array of objects with key-value pairs) is provided;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Array} data a set of key-value pairs representing widgets; 
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} index result index to append to section header;
 */
function createSectionShow(builder,data,isCollapsed,index) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(index!==undefined) { section.setHeader(globalShowHeader+' '+(index+1)) }

  try { data = JSON.parse(data); }
  catch(er) { data = data; }
  
  for(var key in data) {
    var widget = simpleKeyValueWidget(key,data[key],false);
    section.addWidget(widget);
  }
    
  builder.addSection(section); 
}

/**
 * Handles sections generation if a complex json schema is provided;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} data full data array with card display settings;
 * @param {Object} obj data object element with section display settings;
 * @param {Object} overrides a set of settings to override defaults with;
 * @param {Integer} paramIdx;
 * @param {Integer} idx;
 * @param {Object} connector connector config object;
 */
function createSectionsShow(builder,data,obj,overrides,paramIdx,idx,connector) {
  var header           = overrides.header;
  var isCollapsible    = overrides.isCollapsible;
  var numUncollapsible = overrides.numUncollapsible;
  
  var widgets = obj.widgets;
  
  var section = CardService.newCardSection();
  if(header!==undefined)           { section.setHeader(header); }
  if(isCollapsible!==undefined)    { section.setCollapsible(isCollapsible); }
  if(numUncollapsible!==undefined) { section.setNumUncollapsibleWidgets(numUncollapsible); }else if(isCollapsible!==undefined) { section.setNumUncollapsibleWidgets(globalNumUncollapsible); }
  
  try { widgets = JSON.parse(widgets); }
  catch(er) { widgets = widgets; }  
  
  if(widgets.length!==0) {
    widgets.forEach(function(widget,index) {
      var state = widget.state;
      if(state!=='hidden') { 
        var element;
        var icon    = widget.icon;
        var type    = widget.type;
        var title   = widget.title;
        var name    = widget.name;
        var content = widget.content;
        
        switch(type) {
          case 'TextParagraph':
            element = textWidget(content);
            break;
          case 'TextButton':
            //access button-specific params;
            var disabled   = widget.disabled;
            var filled     = widget.filled;
            var fullsized  = widget.fullsized;
            var reload     = widget.reload;
            var action     = widget.action;
          
            //build either a clickable or linked button;
            if(action===globalTextButtonActionClick) {
              element = textButtonWidget(title,disabled,filled,content);
            }else {
              element = textButtonWidgetLinked(title,disabled,filled,content,fullsized,reload);
            }
        
            break;
          case 'KeyValue':
            var isMultiline = widget.isMultiline;
            if(isMultiline===undefined) { isMultiline = true; }
           
            if(icon===undefined) { icon = ''; }
            
            var switchValue = widget.switchValue;
            var buttonText = widget.buttonText;
            if(switchValue!==undefined) {
              element = switchWidget(title,content,name,switchValue,switchValue);
            }else {
            
              connector.sectionIdx = idx;
              connector.widgetIdx  = index;
              if(paramIdx!==undefined) { connector.paramIdx = paramIdx; }
            
              connector = propertiesToString(connector);
            
              if(buttonText!==undefined) {
                var button = textButtonWidget(buttonText,true,false);
                if(state!=='editable') {
                  element = simpleKeyValueWidget(title,content,isMultiline,icon,button);
                }else {
                  element = actionKeyValueWidgetButton(icon,title,content,button,'editSectionsShow',connector);
                }
              }else {
                if(state!=='editable') {
                  element = simpleKeyValueWidget(title,content,isMultiline,icon);
                }else {
                  element = actionKeyValueWidget(icon,title,content,'editSectionsShow',connector);
                }
              }
            }
            break;
          case 'TextInput':
            var hint = widget.hint;
            element = textInputWidget(title,name,hint,content);
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
      }
      section.addWidget(element);
    });
  builder.addSection(section);
  }
 
}

/**
 * Creates section containing widgets representing connector types;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection}
 */
function createSectionChooseType(builder,isCollapsed,header) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined) { section.setHeader(header); }
  
  //create class instance to get config data;
  var sheets     = new Sheets();
  var flow       = new Flow();
  
  //create widgets representing types;
  var types = [sheets,flow];
  types.forEach(function(type){ 
    createWidgetCreateType(section,type);
  });

  builder.addSection(section);
  return section;
}

/**
 * Creates section with manual and default switches + add connector button;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @param {Object} type connector type object;
 */
function createSectionAddConnector(builder,isCollapsed,header,type) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined&&header!=='') { section.setHeader(header); }
  
  //create switches for manual and default and handle reloading;
  createWidgetSwitchManual(section,type.manual);
  createWidgetSwitchDefault(section,type.isDefault);
  
  //create auth type choice if no auth data is provided by type;
  if(Object.keys(JSON.parse(type.auth)).length===0&&type.type===globalBaseClassName) { 
    if(type.authType==='OAuth2') {
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
  
  createWidgetCreateConnector(section,globalCreateConnectorText,type);
  
  builder.addSection(section);
}

/**
 * Creates section with manual and default switches + edit connector button and sets input values;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector configuration object;
 * @param {Boolean} isReloaded truthy value to derermine wheter it is invoked from input change;
 * @param {String} authType authorization type to set auth type choice group to;
 */
function createSectionUpdateConnector(builder,isCollapsed,connector,isReloaded,authType) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
 
  var index  = connector.index;

  //create switches for manual and default and handle reloading;
  createWidgetSwitchManual(section,connector.manual);
  createWidgetSwitchDefault(section,connector.isDefault);
  
  //get auth parameters from type and connector;
  var cAuth = new this[connector.type]().auth;
  var auth  = connector.auth;
  
  //create auth type choice if no auth data is provided by type;
  if(Object.keys(cAuth).length===0&&auth!=='none'&&auth!==undefined) {
    if(auth==='OAuth2'&&!isReloaded) {
      createWidgetChooseAuth(section,true,auth);
      createWidgetCustomInput(section,globalUrlAuthFieldName,'Auth','Authorization URL',connector.urlAuth);
      createWidgetCustomInput(section,globalUrlTokenFieldName,'Token','Token URL',connector.urlToken);
      createWidgetCustomInput(section,globalClientIdFieldName,'Client Id','Obtained from API',connector.id);
      createWidgetCustomInput(section,globalSecretFieldName,'Client Secret','Obtained from API',connector.secret);
      createWidgetCustomInput(section,globalScopeFieldName,'Scope','Obtained from API',connector.scope);
    }else if(!isReloaded) {
      createWidgetChooseAuth(section,true);
    }else if(auth==='OAuth2'||authType==='OAuth2') {
      createWidgetChooseAuth(section,true,authType);
      
      if(connector.scope!==undefined) { 
        createWidgetCustomInput(section,globalScopeFieldName,'Scope','Authorization scope',connector.scope);
      }else {
        createWidgetCustomInput(section,globalUrlAuthFieldName,'Auth','Authorization URL','');
        createWidgetCustomInput(section,globalUrlTokenFieldName,'Token','Token URL','');
        createWidgetCustomInput(section,globalClientIdFieldName,'Client Id','Obtained from API','');
        createWidgetCustomInput(section,globalSecretFieldName,'Client Secret','Obtained from API','');
        createWidgetCustomInput(section,globalScopeFieldName,'Scope','Obtained from API','');
      }
    }else {
      createWidgetChooseAuth(section,true);  
    }
   
  } 
  
  var buttonSet = CardService.newButtonSet();
  createWidgetUpdateConnector(buttonSet,globalUpdateConnectorText,connector);
  createWidgetRemoveConnector(buttonSet,globalRemoveConnectorText,connector);
  section.addWidget(buttonSet);
  
  builder.addSection(section);   
}

/**
 * Creates section for connector type description;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} short connector type description;
 * @param {String} header section header text;
 * @returns {CardSection}
 */
function createDescriptionSection(builder,isCollapsed,short,header) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined) { section.setHeader(header); }  
  
  createWidgetShortText(section,'',short);
  
  builder.addSection(section);
  return section;
}


/**
 * Creates section for advanced settings;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 */
function createAdvanced(builder,isCollapsed,header) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined) { section.setHeader(header); }

  createWidgetResetText(section);
  
  createWidgetResetSubmit(section);

  builder.addSection(section);  
}


/**
 * Creates section for welcome info;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 */
function createSectionWelcome(builder,isCollapsed,header) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined) { section.setHeader(header); }
  
  createWidgetWelcomeText(section);
  
  builder.addSection(section);
}

/**
 * Creates section for help info;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 */
function createSectionHelp(builder,isCollapsed,header) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined) { section.setHeader(header); }
  
  createWidgetHelpText(section);
  
  createWidgetGoToCardin(section);
   
  builder.addSection(section);
}
//=============================================END SECTIONS============================================//

//===============================================WIDGETS===============================================//
/**
 * Creates KeyValue widget with projects redirect URL;
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isSimple truthy value to determine whether to invoke simple or consructed url;
 * @param {Object} custom custom authorization config;
 */ 
function createWidgetShowRedirectUrl(section,isSimple,params) {
  var url;
  if(isSimple) {
    url = returnSimpleRedirectUrl();
  }else {
    //url = returnCustomRedirectUrl(funcName,scope,custom);
  }
  var widget = textInputWidget('Redirect URL',globalRedirectFieldName,'Project redirect URL',url);
  section.addWidget(widget);
}

/**
 * Creates KeyValue widget with 401 code and text explaining further actions;
 * @param {CardSection} section section to append widget sets;
 * @param {String} content widget content or value;
 * @param {Integer} code response status code;
 */
function createWidgetNotAuthorized(section,content,code) {
  var widget = simpleKeyValueWidget(code,content,true);
  section.addWidget(widget);
}

/**
 * Creates KeyValue widget with text explaining auth type mismatch;
 * @param {CardSection} section section to append widget sets;
 * @param {String} content widget content or value;
 */
function createWidgetAuthTypeErr(section,content) {
  var widget = simpleKeyValueWidget(globalAuthTypeErrorTitle,content,true);
  section.addWidget(widget);  
}

/**
 * Creates TextButton widget with action set to open login link;
 * @param {CardSection} || {ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {String} url URL to open link text;
 * return {TextButton}
 */
function createWidgetLogin(builder,text,url) { 
  var widget = textButtonWidgetLinked(text,false,false,url,false,false);
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
  return widget;
}

/**
 * Creates TextButton widget with action set to open Auth link;
 * @param {CardSection} || {ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} auth authorization config object;
 * @param {Object} custom custom authorization config;
 */
function createWidgetOpenAuth(builder,text,auth,custom) { 
  var service = authService(auth.name,auth.scope,custom);
  var params  = {'funcName':auth.name,'scope':auth.scope};
  if(custom!==undefined) { params.custom = JSON.stringify(custom); }
  var widget = textButtonWidgetAuth(text,false,false,service.getAuthorizationUrl(params));
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
}

/**
 * Creates TextButton widget with action set to revoke Auth;
 * @param {CardSection} || {ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} auth authorization config object;
 * @param {Object} custom custom authorization config; 
 */
function createWidgetRevoke(builder,text,auth,custom) {
  var service = authService(auth.name,auth.scope,custom);
  var params  = {'funcName':auth.name,'scope':auth.scope};
  if(custom!==undefined) { params.custom = JSON.stringify(custom); }
  var widget  = textButtonWidget(text,false,false,'revokeAuth',params);
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
}

/**
 * Creates KeyValue widget for prompting user that this is a first-time use;
 * @param {CardSection} section section to append widget sets;
 */
function createWidgetWelcomeText(section) {
  var widget = simpleKeyValueWidget(globalWelcomeWidgetTitle,globalWelcomeWidgetContent,true);
  section.addWidget(widget);
}

/**
 * Creates KeyValue widget for help card section;
 * @param {CardSection} section section to append widget sets;
 */
function createWidgetHelpText(section) {
  var widget = simpleKeyValueWidget(globalHelpWidgetTitle,globalHelpWidgetContent,true);
  section.addWidget(widget);
}

/**
 * Creates TextButton widget for Cardin homepage link open;
 * @param {CardSection} section section to append widget sets;
 */
function createWidgetGoToCardin(section) {
  var widget = textButtonWidgetLinked(globalCardinUrlText,false,false,globalCardinUrl,false,false);
  section.addWidget(widget);
}

/**
 * Creates widget for diplaying hint for optional fields usage;
 * @param {CardSection} section section to append widget sets;
 * @param {TextParagraph}
 */
function createWidgetFieldsText(section,text) {
  var widget = textWidget(text);
  section.addWidget(widget);
  return widget;
}

/**
 * Creates TextInput widget with custom field name and content;
 * @param {CardSection} section section to append widget sets;
 * @param {String} fieldName field name for the formInput to use;
 * @param {String} title title text of the widget; 
 * @param {String} hint text that appears on the input;
 * @param {String} custom custom content to set;
 * @returns {TextInput}
 */
function createWidgetCustomInput(section,fieldName,title,hint,custom) {
  if(custom!==undefined) { var content = custom; }else { content = ''; }
  var widget = textInputWidget(title,fieldName,hint,content);
  section.addWidget(widget);
  return widget;
}

/**
 * Creates KeyValue widget for accessing connector config;
 * @param {CardSection} section section to append widget sets;
 * @param {Object} type connector class instance;
 * @returns {KeyValue}
 */
function createWidgetCreateType(section,type) {
  
  /*
  try {
    var str = propertiesToString(type);
    Logger.log(str);
  }
  catch(e) {
    Logger.log(e)
  }
  */

  var params = {
    'basic': JSON.stringify(type.basic),
    'config': JSON.stringify(type.config),
    'type': type.name,
    'icon': type.icon,
    'name': type.name
  };
  if(type.short!==undefined) { params.short = type.short; }
  
  if(type.auth!==undefined) { params.auth = JSON.stringify(type.auth); }
  var widget = actionKeyValueWidget(type.icon,'',type.name,'addConnector',params);
  section.addWidget(widget);
  return widget;
}

/**
 * Creates TextButton widget for connector creation;
 * @param {CardSection} section section to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} type connector type object;
 * @returns {TextButton}
 */
function createWidgetCreateConnector(section,text,type) {
  type = propertiesToString(type);

  var widget = textButtonWidget(text,false,false,'createConnector',type);
  section.addWidget(widget);
  return widget;
}

/**
 * Creates TextButton widget for connector update;
 * @param {String} text text to appear on the button;
 * @param {Object} connector connector object;
 * @returns {TextButton}
 */
function createWidgetUpdateConnector(builder,text,connector) {
  connector = propertiesToString(connector);
  
  var widget = textButtonWidget(globalUpdateConnectorText,false,false,'updateConnector',connector);
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
  return widget;
}

/**
 * Creates TextButton widget for connector removal;
 * @param {CardSection} || {ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} connector connector object;
 * @returns {TextButton}
 */
function createWidgetRemoveConnector(builder,text,connector) {
  
  connector = propertiesToString(connector);

  //set confirmation procedure;
  connector.cancelAction  = 'actionEdit',
  connector.confirmAction = 'removeConnector',
  connector.prompt        = globalConfirmRemoveWidgetContent 
  
  Logger.log(connector)

  var widget = textButtonWidget(globalRemoveConnectorText,false,false,'actionConfirm',connector);
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
  return widget;  
}

/**
 * Creates KeyValue widget with reset feature description;
 * @param {CardSection} section section to append widget sets;
 * @param {String} title widget title;
 * @param {String} content widget content;
 * @returns {KeyValue}
 */
function createWidgetShortText(section,title,content) {
  var widget = simpleKeyValueWidget(title,content,true);
  section.addWidget(widget);  
  
  return widget;
}

/**
 * Creates KeyValue widget with reset feature description;
 * @param {CardSection} section section to append widget sets;
 * @returns {KeyValue}
 */
function createWidgetResetText(section) {
  var widget = simpleKeyValueWidget(globalResetWidgetTitle,globalResetWidgetContent,true);
  section.addWidget(widget);
  
  return widget;
}

/**
 * Creates TextButton widget that performs full reset when clicked;
 * @param {CardSection} section section to append widget sets;
 */
function createWidgetResetSubmit(section) {
  
  //set confirmation params;
  var params = {
    confirmAction : 'performFullReset',
    cancelAction : 'goSettings',
    prompt : globalConfirmResetWidgetContent,
    success : globalResetSuccess,
    failure : globalResetFailure
  };
  
  var widget = textButtonWidget(globalResetWidgetSubmitText,false,false,'actionConfirm',params);
  section.addWidget(widget);
}

/**
 * Creates SelectionInput widget for choosing authentication type (none and OAuth2 for now);
 * @param {CardSection} section -> section to append widget sets;
 * @param {Boolean} isEdit -> truthy value to determine which card to reload;
 * @param {String} selected -> value that should be selected;
 */
function createWidgetChooseAuth(section,isEdit,selected) {
  var options = [
    {
      'text': 'None',
      'value': 'none',
      'selected': true
    },
    {
      'text': 'OAuth 2.0',
      'value': 'OAuth2',
      'selected': false
    }
  ];
  
  //if selected value param is provided, select this option;
  if(selected!==undefined) {
    options.forEach(function(option){
      if(option.value===selected) {
        option.selected = true;
        options.forEach(function(opt){
          if(opt.value!==selected) {
            opt.selected = false;
          }
        });
      }
    });
  }
  
  var widget = selectionInputWidget(globalCustomWidgetAuthText,'auth','RADIO_BUTTON',options,'chooseAuth',true,{'isEdit':isEdit.toString()});
  section.addWidget(widget);
}

/**
 * Creates Switch widget for setting connector to be invoked manually;
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isManual truthy value to determine invoking manually;
 */
function createWidgetSwitchManual(section,isManual) {
  if(isManual===undefined||isManual==='true') { isManual = true; }  
  var widget = switchWidget('',globalCustomWidgetSwitchText,globalManualFieldName,isManual,true);
  section.addWidget(widget);
}

/**
 * Creates Switch widget for setting connector to be loaded by default;
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isDefault truthy value to determine loading by default;
 * @returns {Switch}
 */
function createWidgetSwitchDefault(section,isDefault) {
  if(isDefault===undefined||isDefault==='false') { isDefault = false; }else if(isDefault==='true') { isDefault = true; }
  var widget = switchWidget('',globalIsDefaultWidgetSwitchText,globalDefaultFieldName,isDefault,true);
  section.addWidget(widget);
  return widget;
}

/**
 * Creates ButtonSet for going to root card;
 * @param {CardSection} section section to append widget sets;
 * @param {String} index index to use when going back;
 * @returns {ButtonSet}
 */
function createWidgetsBackAndToRoot(section,index) {
  var params = {'index':index};
  var root = textButtonWidget(globalRootText,false,false,'goRoot',params);
  var widget = buttonSet([root]);
  section.addWidget(widget);
  return widget;
}

/**
 * Create ButtonSet for confirming and cancelling;
 * @param {CardSection} section section to append widget sets;
 * @param {Object} e event object;
 * @returns {ButtonSet}
 */
function createWidgetsConfirm(section,e) {
  //access parameters;
  var params = e.parameters;

  //create KeyValue widget to prompt user of action;
  var userPrompt = simpleKeyValueWidget(globalConfirmWidgetTitle,params.prompt,true);
  section.addWidget(userPrompt);
  
  //create TextButton widgets to confirm or cancel;
  var btnConfirm = textButtonWidget(globalConfirmText,false,false,params.confirmAction,params);
  var btnCancel  = textButtonWidget(globalCancelText,false,false,params.cancelAction,params);
  
  //create ButtonSet with confirm and cancel buttons;
  var widget = buttonSet([btnConfirm,btnCancel]);
  section.addWidget(widget);
  return widget;
}
//==============================================END WIDGETS==============================================//

//===============================================TEMPLATES===============================================//
/**
 * Creates a simple paragraph widget
 * @param {String} text specifies a text to populate widget with
 * @returns {TextParagraph} 
 */
function textWidget(text) {
  var widget = CardService.newTextParagraph();
      widget.setText(text);
  return widget;
}

/**
 * Creates an input widget;
 * @param {String} title title of the input;
 * @param {String} name fieldname of the input;
 * @param {String} hint text that appears on the input;
 * @param {String} value value that is passed to widget by default;
 * @param {String} changeFunc name of the function fired on user change;
 * @param {Boolean} hasSpinner truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params parameters to pass to function;
 * @returns {TextInput} 
 */
function textInputWidget(title,name,hint,value,changeFunc,hasSpinner,params) {
  if(value instanceof Date) { value = value.toLocaleDateString(); }
  var widget = CardService.newTextInput();
      widget.setFieldName(name);
      widget.setHint(hint);
      widget.setTitle(title);
      widget.setValue(value);
      
  if(changeFunc!==undefined) { 
    var action = CardService.newAction();
        action.setFunctionName(changeFunc);
    if(hasSpinner===true) {
      action.setLoadIndicator(CardService.LoadIndicator.SPINNER);
    }else {
      action.setLoadIndicator(CardService.LoadIndicator.NONE);
    }
    if(params!==undefined) {action.setParameters(params);}
    widget.setOnChangeAction(action);
  }
  return widget;
}

/**
 * Creates suggestions for a textInput widget;
 * @param {textInput} textInputWidget text input to append suggestions to;
 * @param {Suggestions} suggestions list of suggestions to append;
 * @param {String} suggestFunc function name to fire on suggestion select;
 */
function suggestions(textInputWidget,suggestions,suggestFunc) {
    
  textInputWidget.setSuggestions(suggestions);
    
  if(suggestFunc!==undefined) {
    var sAction = CardService.newAction();
        sAction.setFunctionName(suggestFunc);
    textInputWidget.setSuggestionsAction(sAction);
  }
  
}

/**
 * Creates suggestion object for textInput autocomplete handler;
 * @param {Array} suggestions an array of string values for creating options;
 * @returns {Suggestions}
 */
function suggestion(suggestions) {
  var list = CardService.newSuggestions();
      list.addSuggestions(suggestions);
  return list;
}

/**
 * Creates a set of buttons for chaining;
 * @param {Array} buttons an array of button widgets to add to button set;
 * @returns {ButtonSet}
 */
function buttonSet(buttons) {
  var widget = CardService.newButtonSet();
  
  if(buttons.length!==0) {
    buttons.forEach(function(button){
      widget.addButton(button);
    });
  }
  
  return widget;
}

/**
 * Creates a button widget with text content;
 * @param {String} text text to appear on the button;
 * @param {Boolean} disabled truthy value to disable / enable click event;
 * @param {Boolean} isFilled sets buttons style to filled if true;
 * @param {String} clickFunc name of the function fired on user click;
 * @param {Object} params parameters to pass to function;
 * @returns {TextButton} 
 */
function textButtonWidget(text,disabled,isFilled,clickFunc,params) {
  var widget = CardService.newTextButton();
      widget.setText(text);
      widget.setDisabled(disabled);
      
  if(isFilled) { widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED); }
  
  var action = CardService.newAction();
      action.setFunctionName(clickFunc);
  if(params!==undefined) {action.setParameters(params);}
  widget.setOnClickAction(action);
  
  return widget;
}

/**
 * Creates a button widget with authorization action to trigger Auth flow;
 * @param {String} text text to appear on the button;
 * @param {Boolean} disabled truthy value to disable / enable click event;
 * @param {Boolean} isFilled sets buttons style to filled if true;
 * @param {String} url authorization url; 
 */
function textButtonWidgetAuth(text,disabled,isFilled,url) {
  var widget = CardService.newTextButton();
      widget.setText(text);
      widget.setDisabled(disabled);
      
  if(isFilled) { widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED); }
  
  var action = CardService.newAuthorizationAction();
      action.setAuthorizationUrl(url);
      
  widget.setAuthorizationAction(action);
  
  return widget;
}

/**
 * Creates a button widget with link action set to it instead of an inbound action;
 * @param {String} text text to appear on the button;
 * @param {Boolean} disabled truthy value to disable / enable click event;
 * @param {Boolean} isFilled sets buttons style to filled if true;
 * @param {String} url URL being opened on user button click;
 * @param {Boolean} fullsized truthy value to detemine whether to open link as fullsized or overlayed;
 * @param {Boolean} needsReload truthy value to determine whether it needs to reload the Add-on on link close;
 * @param {Boolean} useAction truthy value to determine whether to set OpenLink or link builder;
 * @param {String} clickFunc name of the function fired on user click;
 * @param {Object} params parameters to pass to function;
 * @returns {TextButton} 
 */
function textButtonWidgetLinked(text,disabled,isFilled,url,fullsized,needsReload,useAction,clickFunc,params) {
  var widget = CardService.newTextButton();
      widget.setText(text);
      widget.setDisabled(disabled);
      
      if(isFilled) { widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED); }
      
      if(useAction&&(useAction!==undefined)) {
        var action = CardService.newAction().setFunctionName(clickFunc);
        if(params!==undefined) { action.setParameters(params); }
        widget.setOnClickOpenLinkAction(action);
      }else {
        var openLink = CardService.newOpenLink();
            openLink.setUrl(url);
        if(fullsized) { openLink.setOpenAs(CardService.OpenAs.FULL_SIZE); }else { openLink.setOpenAs(CardService.OpenAs.OVERLAY); }
        if(needsReload) { openLink.setOnClose(CardService.OnClose.RELOAD_ADD_ON); }else { openLink.setOnClose(CardService.OnClose.NOTHING); }
        widget.setOpenLink(openLink);        
      }
      
  return widget;
}

/*
 * Creates a button widget with icon content;
 * @param {Icon} icon icon object to appear on the button;
 * @param {String} changeFunc name of the function fired on user click;
 * @param {Object} params parameters to pass to function;
 * @returns {ImageButton} 
 */
function imageButtonWidget(icon,clickFunc,params) {
  var widget = CardService.newImageButton();
      widget.setIcon(icon);
      
  var action = CardService.newAction();
      action.setFunctionName(clickFunc);
  if(params!==undefined) {action.setParameters(params);}
  widget.setOnClickAction(action);

  return widget;
}

/**
 * Creates an Image widget;
 * @param {String} src string url of publicly deployed image;
 * @param {String} alt text to display if image cannot be loaded or denied access;
 * @param {String} clickFunc name of the function fired on user click;
 * @param {Boolean} hasSpinner truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params parameters to pass to function;
 * @returns {Image}
 */
function imageWidget(src,alt,clickFunc,hasSpinner,params) {
  var widget = CardService.newImage();
      widget.setImageUrl(src);
      widget.setAltText(alt);

  if(clickFunc!==undefined) { 
    var action = CardService.newAction();
        action.setFunctionName(clickFunc);
    if(hasSpinner) { action.setLoadIndicator(CardService.LoadIndicator.SPINNER); }
    if(params!==undefined) {action.setParameters(params);}
    widget.setOnChangeAction(action);
  }

  return widget;
}

/**
 * Creates a Switch widget (KeyValue is used as base constructor);
 * @param {String} top label text;
 * @param {String} content content text;
 * @param {String} name unique fieldname (non-unique if multi-switch widget);
 * @param {Boolean} selected truthy value to set on / off click event;
 * @param {String} value value to pass to handler if selected;
 * @param {String} changeFunc name of the function fired on user change;
 * @param {Boolean} hasSpinner truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params parameters to pass to function;
 * @returns {KeyValue} 
 */
function switchWidget(top,content,name,selected,value,changeFunc,hasSpinner,params) {  
  //create base KeyValue widget and set required parameters;
  var keyValue = CardService.newKeyValue();
      keyValue.setContent(content);
  
  //set top title if found;
  if(top!==undefined&&top!=='') { keyValue.setTopLabel(top); }
  
  //create Switch widget and set required parameters;
  var widget = CardService.newSwitch();
      widget.setFieldName(name);
      widget.setSelected(selected);
      widget.setValue(value);
  
  //set an onchange action;
  if(changeFunc!==undefined) { 
    var action = CardService.newAction();
        action.setFunctionName(changeFunc);
    if(hasSpinner) { action.setLoadIndicator(CardService.LoadIndicator.SPINNER) }
    if(params!==undefined) {action.setParameters(params);}
    widget.setOnChangeAction(action);
  }
  
  //set switch and return widget;
  keyValue.setSwitch(widget);
  return keyValue;
}

/** 
 * Creates a simple KeyValue widget;
 * @param {String} icon url or enum of icon to use;
 * @param {String} top label text;
 * @param {String} content content text;
 * @param {Boolean} isMultiline truthy value for determining multiline feature;
 * @param {TextButton} button a button object to add on the right; 
 * @returns {KeyValue}
 */
function simpleKeyValueWidget(top,content,isMultiline,icon,button) {
  //check if content is a Date and format to locale to avoid errors;
  if(content instanceof Date) { content = content.toLocaleDateString(); }
  
  //create widget and set required parameters;
  var widget = CardService.newKeyValue();
      widget.setContent(content);
      widget.setMultiline(isMultiline);
  
  //set top title if found;
  if(top!==undefined&&top!=='') { widget.setTopLabel(top); }
  
  //set button to widget;
  if(button!==undefined) { widget.setButton(button); }
  
  //set icon if found or set icon url if not;
  if(icon!==undefined&&icon!=='') { 
    var iconEnum = CardService.Icon[icon];
    if(iconEnum!==undefined) {
      widget.setIcon(iconEnum);
    }else {
      widget.setIconUrl(icon);
    } 
  }
  
  return widget;
}

/** 
 * Creates a KeyValue widget with action set on it;
 * @param {String} icon url or enum of icon to use;
 * @param {String} top label text;
 * @param {String} content content text;
 * @param {String} clickFunc name of the function fired on user click;
 * @param {Object} params parameters to pass to function;
 * @returns {KeyValue} 
 */
function actionKeyValueWidget(icon,top,content,clickFunc,params) {
  //check if content is a Date and format to locale to avoid errors;
  if(content instanceof Date) { content = content.toLocaleDateString(); }
  
  //create widget and set required parameters;
  var widget = CardService.newKeyValue();
      widget.setContent(content);
  
  //set top title if found;
  if(top!==undefined&&top!=='') { widget.setTopLabel(top); }
      
  //set icon if found or set icon url if not;    
  if(icon!==undefined&&icon!=='') { 
    var iconEnum = CardService.Icon[icon];
    if(iconEnum!==undefined) {
      widget.setIcon(iconEnum);
    }else {
      widget.setIconUrl(icon);
    } 
  }

  //set onclick action and set parameters if provided;
  var action = CardService.newAction();
      action.setFunctionName(clickFunc);
  if(params!==undefined) {action.setParameters(params);}
  widget.setOnClickAction(action);
      
  return widget;
}

/** 
 * Creates a keyValue widget with button on the right;
 * @param {String} icon url or enum of icon to use;
 * @param {String} top widget title;
 * @param {String} content content text;
 * @param {TextButton} button a button object to add on the right; 
 * @param {String} clickFunc name of the function fired on user click;
 * @param {Object} params parameters to pass to function;
 * @returns {KeyValue} 
 */
function actionKeyValueWidgetButton(icon,top,content,button,clickFunc,params) {
  //check if content is a Date and format to locale to avoid errors;
  if(content instanceof Date) { content = content.toLocaleDateString(); }
  
  //create widget and set required parameters;
  var widget = CardService.newKeyValue();
      widget.setContent(content);
      widget.setButton(button);
   
  //set top title if found;
  if(top!==undefined&&top!=='') { widget.setTopLabel(top); }
  
  //set icon if found or set icon url if not;
  if(icon!==undefined&&icon!=='') {
    var iconEnum = CardService.Icon[icon];
    if(iconEnum!==undefined) {
      widget.setIcon(iconEnum);
    }else {
      widget.setIconUrl(icon);
    } 
  }
  
  //set onclick action and set parameters if provided;
  var action = CardService.newAction();
      action.setFunctionName(clickFunc);
  if(params!==undefined) {action.setParameters(params);}
  widget.setOnClickAction(action);
      
  return widget;  
}

/**
 * Creates a selection widget with specified options;
 * @param {String} top widget title;
 * @param {String} name fieldname of the input;
 * @param {String} type type of select to render: checkboxes / radio btns / dropdown list;
 * @param {Array} options an array of objects representing selection options;
 * @param {String} changeFunc name of the function fired on value change;
 * @param {Boolean} hasSpinner truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params parameters to pass to function;
 * @returns {SelectionInput}
 */
function selectionInputWidget(top,name,type,options,changeFunc,hasSpinner,params) {
  //create widget and set required parameters;
  var widget = CardService.newSelectionInput();
      widget.setFieldName(name);
  
  //set widget's type accordingly [rewrite];
  widget.setType(CardService.SelectionInputType[type]);
  
  //set top title if found;
  if(top!==undefined&&top!=='') { widget.setTitle(top); }

  //set an onchange action;
  if(changeFunc!==undefined) { 
    var action = CardService.newAction();
        action.setFunctionName(changeFunc);
    if(hasSpinner) { action.setLoadIndicator(CardService.LoadIndicator.SPINNER) }
    if(params!==undefined) {action.setParameters(params);}
    widget.setOnChangeAction(action);
  }
  
  //set options to widget;
  options.forEach(function(option) { widget.addItem(option.text,option.value,option.selected); });
  
  return widget;
}
//============================================END TEMPLATES============================================//

//==============================================CONNECTOR==============================================//
//Sheets connector class;
function Connector(icon,name,url) {
  if(icon===undefined) { icon = ''; }
  if(name===undefined) { name = ''; }
  if(url===undefined)  { url = ''; }
  this.icon = globalCustomIconUrl;
  this.name = 'Connector';
  this.basic = {
      'header': 'Basic config',
      'isCollapsible': false,
      'widgets': [
        {
          'name': globalNameFieldName,
          'type': 'TextInput',
          'title': globalCustomWidgetNameTitle,
          'content': name,
          'hint': globalCustomWidgetNameHint
        }
      ]
    };
  this.config = [];
  this.auth   = {};
  this.run = async function (msg,connector,data) {
    //set method for url fetch ('get' or 'post' for now);
    var method = 'post';

    //set headers for url fetch;
    var headers = {};
    
    //set payload in case POST request will be triggered;
    var trimmed = trimMessage(msg,true,true);
    var labels = msg.getThread().getLabels().map(function(label){ return label.getName(); });
    var payload = {
      'Bcc': msg.getBcc(),
      'Cc': msg.getCc(),
      'date': msg.getDate(),
      'sender': trimmed.name,
      'from': trimmed.email,
      'id': msg.getId(),
      'subject': msg.getSubject(),
      'labels': labels
    };
    if(data!==undefined) { payload.data = data; }
    
    //build authorization;
    if(connector.auth==='OAuth2') {
      var custom  = {
        'name': connector.name,
        'scope': connector.scope,
        'urlAuth': connector.urlAuth,
        'urlToken': connector.urlToken,
        'id': connector.id,
        'secret': connector.secret
      };
      var service = authService(connector.type,connector.scope,custom);
      var bearer  = 'Bearer '+service.getAccessToken();
      headers.Authorization = bearer;
      payload.Authorization = bearer;
    }
    
    //initiate request;
    return await performFetch(connector.url,method,headers,payload);
  }
}
//============================================END CONNECTOR============================================//

//============================================NOTIFICATIONS============================================//
/**
 * Creates a notification to show;
 * @param {String} text text to display when fired;
 * @returns {Notification}
 */
function notification(text) {
  var notification = CardService.newNotification();
      notification.setType(CardService.NotificationType.INFO);
      notification.setText(text);  
  return notification;
}

/**
 * Creates a warning to show;
 * @param {String} text text to display when fired;
 * @returns {Notification}
 */
function warning(text) {
  var notification = CardService.newNotification();
      notification.setType(CardService.NotificationType.WARNING);
      notification.setText(text);  
  return notification;  
}

/**
 * Creates an error to show;
 * @param {String} text text to display when fired;
 * @returns {Notification}
 */
function error(text) {
  var error = CardService.newNotification();
      error.setType(CardService.NotificationType.ERROR);
      error.setText(text);
  return error;
}
//===========================================END NOTIFICATIONS===========================================//

//===============================================CALLBACKS===============================================//

//sets load indicator if provided, executes function by its name when an event is registered, awaits for function to resolve then removes indicator;
function cardActionCallback(cardAction) {
	return function(e) {
		const functionName  = cardAction.functionName;
		const loadIndicator = cardAction.loadIndicator;
		const parameters    = cardAction.parameters;
		
		if(loadIndicator!=='NONE') {
			const overlay = $('#app-overlay');
			overlay.show();
			
			const indicator = document.createElement('div');
			indicator.id = 'main-Ui-spinner';
			indicator.className = 'ms-Spinner ms-Spinner--large';
			$('#main-Ui-wrap').append(indicator);
			new fabric['Spinner'](indicator);			
		}
		
		window[functionName](parameters)
		.then(function(){
			if(loadIndicator!=='NONE') { 
				//overlay.hide();
				//$('#main-Ui-spinner').remove(); 
			}
		});
	}
}

//sets load indicator if provided, executes function by its name when an event is registered, awaits for function to resolve then removes indicator;
function actionCallback(action,element) {
	return async function() {
		const functionName  = action.functionName;
		const loadIndicator = action.loadIndicator;
		const parameters    = action.parameters;
		
		if(loadIndicator!=='NONE') {
			const overlay = $('#app-overlay');
			//overlay.show();
		}
		
		e.parameters = parameters;
		
		await callbacks[functionName](e,element)
		
		//$('#app-overlay').hide();
		
	}
}
//=============================================END CALLBACKS=============================================//

//=============================================START ACTIONS=============================================//
const callbacks = {
	
	blink : function (parameters) { //blink is a debug function and is not used outside testing environment!
		return new Promise(
			function(resolve) {
				setTimeout(function() { resolve(); },3000);
			}
		);
	},
	/**
	 * Updates connector add / edit settings card on auth select change;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	chooseAuth : function chooseAuth(e) {
		return new Promise(
			function (resolve) {
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
				if(data.scope!==undefined) {
				  e.parameters.urlAuth  = data.urlAuth; 
				  e.parameters.urlToken = data.urlToken;
				  e.parameters.id       = data.id;
				  e.parameters.secret   = data.secret;
				  e.parameters.scope    = data.scope; 
				}
				e.parameters.index = getIndex(getProperty('config','user'),e.parameters).toString();
				builder.setNavigation(CardService.newNavigation().updateCard(cardUpdate(e)));
			  }else {
				builder.setNavigation(CardService.newNavigation().updateCard(addConnector(e)));
			  }
			  
			  builder.setStateChanged(true);
			  return builder.build();
			}
		);
	},
	/**
	 * Updates widget by provided index to generate form input instead of clickable field;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */
	editSectionsShow : function editSectionsShow(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();

			  var connector = e.parameters;
			  var content   = connector.content;
			  
			  //try to parse content until recieved an array; 
			  try {
				while(!(content instanceof Array)) {
				  content = JSON.parse(content);
				}
			  }
			  catch(err) { content = content; }
			  
			  var sectionIdx = +connector.sectionIdx;
			  var widgetIdx  = +connector.widgetIdx;
			  
			  content[sectionIdx].widgets[widgetIdx].type = 'TextInput';
			  
			  e.parameters.index   = connector.paramIdx;
			  e.parameters.content = JSON.stringify(content);
			  
			  //set data state change and navigate to display card;
			  builder.setNavigation(CardService.newNavigation().updateCard(cardDisplay(e)));
			  builder.setStateChanged(true);
			  return builder.build();				
			}
		);
	},
	/**
	 * Updates data with form input values, performs request and calls display with updated response;
	 * @param {Object} e event object;
	 */
	updateSectionsShow : function updateSectionsShow(e) {
		return new Promise(
			function (resolve) {
			  var connector = e.parameters;
			  var data      = connector.content;
			  
			  //try to parse content until recieved an array; 
			  try {
				while(!(data instanceof Array)) {
				  data = JSON.parse(data);
				}
			  }
			  catch(err) { data = data; }
			  
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
						if(form[key]!==undefined) { widget.switchValue = true; }
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
				  if(type==='KeyValue'&&widget.switchValue!==undefined&&noInput) {
					widget.switchValue = false;
				  }
				  
				});
			  });
			 
			  var msg   = getToken(e);
			  var cType = new this[connector.type]();
			  var resp  = cType.run(msg,connector,data);
			  
			  //override event object parameters with response data;
			  e.parameters.code    = resp.code;
			  e.parameters.content = resp.content;
			  
			  return actionShow(e);				
			}
		);
	},
	/**
	 * Checks if URL entered is valid and displays a warning if it is not;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */
	checkURL : function checkURL(e) {
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
	},
	/**
	 * Removes card from navigation and loads previous card in stack;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	goBack : function goBack(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
			  
			  //set data state change and pop card from stack;
			  builder.setNavigation(CardService.newNavigation().popCard());
			  builder.setStateChanged(true);
			  return builder.build();				
			}
		);
	},
	/**
	 * Removes all cards from navigation and loads root (first) card in stack;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	goRoot : function goRoot(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();

			  var index = +e.parameters.index; 
			  
			  //set data state change and navigate to main card;
			  builder.setNavigation(CardService.newNavigation().popCard().pushCard(cardOpen(e,index)));
			  builder.setStateChanged(true);  
			  return builder.build();			
			}
		);
	},
	/**
	 * Pushes settings card on stack top and loads it;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	goSettings : function goSettings(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
			  
			  //set data state change and navigate to settings card;
			  builder.setNavigation(CardService.newNavigation().popCard().pushCard(cardSettings(e)));
			  builder.setStateChanged(true);  
			  return builder.build();				
			}
		);
	},
	/**
	 * Pushes confirmation card on stack top and loads it;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	actionConfirm : function actionConfirm(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
			  
			  //set data state change and navigate to confirmation card;
			  builder.setNavigation(CardService.newNavigation().pushCard(cardConfirm(e)));
			  builder.setStateChanged(false);
			  return builder.build();				
			}
		);
	},
	/**
	 * Pushes connector update card on stack top and loads it;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	actionEdit : function actionEdit(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
			  
			  //set data state change and navigate to edit connector card;
			  builder.setNavigation(CardService.newNavigation().pushCard(cardUpdate(e)));    
			  builder.setStateChanged(true);
			  return builder.build();				
			}
		);
	},
	/**
	 * Pushes display card on stack top with data provided and loads it;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	actionShow : function actionShow(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
				  
			  var code = +e.parameters.code;
			  
			  //handle failed responses;
			  if(code<200||code>=300) {
				e.parameters.content  = '[]';
				builder.setNotification(warning(globalIncorrectURL));
			  }
			  
			  //set data state change and navigate to display card;
			  builder.setNavigation(CardService.newNavigation().pushCard(cardDisplay(e)));
			  builder.setStateChanged(true);
			  return builder.build();				
			}
		);
	},
	/**
	 * Pushes display card on stack top after performing data fetch; 
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	actionManual : function actionManual(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
			  
			  var msg       = getToken(e); 
			  var connector = e.parameters;

			  var cType = new this[connector.type]();
			  var cAuth = cType.auth;
				
			  //try to perform request;
			  var response;
			  
			  try { 
				response = cType.run(msg,connector); 
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
			  
			  var code    = response.code;
			  var content = response.content;
			  
			  e.parameters.code = code;
			  
			  if(code>=200&&code<300) {
				//handle successful requests;
				var len = content.length;
				if(len!==0) {
				  e.parameters.content = content;
				}
			  }else {
				//handle failed requests;
				e.parameters.content  = '[]';
				e.parameters.error    = content;
				builder.setNotification(warning(globalIncorrectURL));
			  }
			  
			  //set data state change and navigate to display card;
			  builder.setNavigation(CardService.newNavigation().pushCard(cardDisplay(e)));
			  builder.setStateChanged(true);
			  return builder.build();				
			}
		);
	},
	/**
	 * Performs reset of every user preference;
	 * @param {Object} e event object;
	 * @returns {ActionResponse}
	 */	
	performFullReset : function performFullReset(e) {
		return new Promise(
			async function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
			  
			  var onSuccessText = e.parameters.success;
			  var onFailureText = e.parameters.failure;
			  
			  try {
				var src = await getProperty('config','user');
				await deleteAllProperties('user');
				builder.setNotification(notification(onSuccessText));
			  }
			  catch(err) {
				builder.setNotification(error(onFailureText));
			  }
			  
			  //set data state change and navigate to main card;
			  builder.setNavigation(CardService.newNavigation().popCard().pushCard(cardOpen(e)));
			  builder.setStateChanged(true);
			  return builder.build();				
			}
		);
	},
	//=================================END ACTIONS=================================//
	
	//==============================CONNECTOR ACTIONS==============================//
	/**
	 * Creates new connector and saves it to properties;
	 * @param {Object} e event object;
	 */	
	createConnector : function createConnector(e) {
		return new Promise(
			function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
			  
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
				  connector.scope     = scope;
				  connector.urlAuth   = urlAuth;
				  connector.urlToken  = urlToken;
				  connector.id        = id;
				  connector.secret    = secret;
				}
			  }else {
				connector.auth = 'OAuth2'; //until added auth types - hardcoded;
			  }
			  
			  try {
				//throw new Error('TEST'); //debug error test - uncomment first one if needed;
			  
				//get configuration or create a new one if none found;
				var config = getProperty('config','user');
				if(config===null) { createSettings(); }
				config = getProperty('config','user');
				
				//reset default connectors if new one is default;
				if(connector.isDefault) {
				  config.forEach(function(conn){
					if(conn.isDefault||conn.isDefault===undefined) { conn.isDefault = false; }
				  });
				}
				
				//create connector and notify thwe user of success;
				config.push(connector);
				setProperty('config',config,'user');
				builder.setNotification(notification(globalCreateSuccess));
			  }
			  catch(err) {
				//notify the user that connector creation failed;
				builder.setNotification(error(globalCreateFailure));  
			  }
			  
			  //change data state and build settings card;
			  builder.setStateChanged(true); 
			  builder.setNavigation(CardService.newNavigation().updateCard(cardSettings(e)));
			  return builder.build();				
			}
		);
	},
	/**
	 * Updates connector and saves it to properties;
	 * @param {Object} e event object;
	 */
	updateConnector : function updateConnector(e) {
		return new Promise(
			async function (resolve) {
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
				var auth = data.auth;
				if(data.auth===undefined) { auth = 'none'; }
				connector.auth = auth;
				if(auth==='OAuth2') { 
				  var scope     = data.scope;
				  var urlAuth   = data.urlAuth;
				  var urlToken  = data.urlToken;
				  var id        = data.id;
				  var secret    = data.secret;
				  connector.scope     = scope;
				  connector.urlAuth   = urlAuth;
				  connector.urlToken  = urlToken;
				  connector.id        = id;
				  connector.secret    = secret;
				}
			  }else {
				connector.auth = 'OAuth2'; //until added auth types - hardcoded;
			  }

			  //connector index (for ease of flow);
			  var index = e.parameters.index;

			  try {
				//throw new Error('TEST'); //debug error test - uncomment first one if needed;
			  
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
		);
	},
	/**
	 * Removes connector and saves properties;
	 * @param {Object} e event object;
	 */	
	removeConnector : function removeConnector(e) {
		return new Promise(
			async function (resolve) {
			  var builder = CardService.newActionResponseBuilder();
			  
			  //connector index (for ease of flow);
			  var index = +e.parameters.index;
			  
			  try {
				//throw new Error('TEST'); //debug error test - uncomment first one if needed;
			  
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
		);
	},
	//============================END CONNECTOR ACTIONS============================//
	
	//==============================UNIVERSAL ACTIONS==============================//
	invokeCardSettings : function invokeCardSettings(e) {
		return new Promise(
			function(resolve) {
				cardSettings(e);
			}
		);
	}
	//============================END UNIVERSAL ACTIONS============================//
}
//===================================END ACTIONS===================================//

//==================================START PROPERTY=================================//
/**
 * Fetches user / script property value by key;
 * @param {String} key key of the property to find;
 * @param {String} type 'user' or 'script' to determine prop type to get;
 * @returns {String}
 */
function getProperty(key,type) {
  var props;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  var value = props.getProperty(key);
  try { value = JSON.parse(value); }
  catch(e) { return value; }
 
  return value;
}

/**
 * Fetches an sets user / script property by key;
 * @param {String} key key of the property to find;
 * @param {String} value new value of the property;
 * @param {String} type 'user' or 'script' to determine prop type to get;
 */
function setProperty(key,value,type) {
  var props;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  try { value = JSON.stringify(value); }
  catch(e) { props.setProperty(key,value); }  
  
  props.setProperty(key,value);
}

/**
 * Deletes a user / script property by key;
 * @param {String} key key of the property to find;
 * @param {String} type 'user' or 'script' to determine prop type to get;
 */
function deleteProperty(key,type) {
  var props;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  props.deleteProperty(key);
}

/**
 * Deletes every user / script property set;
 * @param {String} key key of the property to find
 * @param {String} type 'user' or 'script' to determine prop type to get 
 */
function deleteAllProperties(type) {
  var props;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  props.deleteAllProperties(); 
}
//==================================END PROPERTY=================================//

//=================================START BACKEND=================================//
/**
 * Creates an object for generating timeframes;
 * @param {Date} start instance of Date (starting);
 * @param {Date} end instance of Date (ending);
 * @returns {Object}
 */
function getTimeframe(start,end) {
  //calc milliseconds between dates;
  var between = end.valueOf()-start.valueOf();
  
  //create timeframe object;
  var timeframe = {
    between : between,
    minutes : 0,
    hours   : 0,
    days    : 0,
    months  : 0,
    years   : 0
  };
  
  //count timeframe values;
  var minutes = end.getMinutes()  - start.getMinutes();
  var hours   = end.getHours()    - start.getHours();
  var days    = end.getDate()     - start.getDate();
  var months  = end.getMonth()    - start.getMonth();
  var years   = end.getFullYear() - start.getFullYear();
  
  //update timeframe parameters;
  timeframe.minutes = minutes,
  timeframe.hours   = hours,
  timeframe.days    = days,
  timeframe.months  = months,
  timeframe.years   = years
  
  return timeframe;
}

/**
 * Checks whether a sheet has any data that matches email regExp;
 * @param {Sheet} sheet sheet currently being looped through;
 * @returns {Boolean}
 */
function hasEmail(sheet) {
  var data = sheet.getDataRange().getValues();
  var regExp = /[^\<].+@.+[^\>]/;
  var hasEmailData = data.some(function(d){ return (regExp).test(d); });
  return hasEmailData;
}

/**
 * Fetches spreadsheet by URL or Id;
 * @param {String} filter spreadsheet URL or Id;
 * @param {Boolean} isId truthy value to determine fetching by Id;
 * @returns {Spreadsheet} || {null}
 */
function getSpreadsheet(filter,isId) {
  try {
    var spreadsheet;
    if(isId) {
      spreadsheet = SpreadsheetApp.openById(filter);
    }else {
      spreadsheet = SpreadsheetApp.openByUrl(filter);
    }
    return spreadsheet;
  }
  catch(error) {
    return null;
  }
}

/**
 * Checks error type against common error types;
 * @param {Object} error error object;
 * @returns {Boolean}
 */
function checkAgainstErrorTypes(error) {
  var isEval   = error instanceof EvalError;
  var isRange  = error instanceof RangeError;
  var isRef    = error instanceof ReferenceError;
  var isSyntax = error instanceof SyntaxError;
  var isType   = error instanceof TypeError;
  var isURI    = error instanceof URIError;
  
  var notTyped = !isEval&&!isRange&&!isRef&&!isSyntax&&!isType&&!isURI;

  return notTyped;
}

/**
 * Stringifies every object property that is not of type String;
 * @param {Object} object object to change;
 * @returns {Object}
 */
function propertiesToString(object) {
  var length = Object.keys(object).length;
  if(length!==0) {
    
    for(var key in object) {
      var value = object[key];

      //check normal types;
      var isObject  = typeof value==='object';
      var isBoolean = typeof value==='boolean';
      var isNumber  = typeof value==='number';
      //check unique situations;
      var isNull    = value===null;
      var isArray   = value instanceof Array;
      var isNotNum  = isNaN(value);
      
      if(isArray) {
        value.forEach(function(element,index,array){ 
          //check normal types;
          var elemIsObject  = typeof element==='object';
          var elemIsBoolean = typeof element==='boolean';
          var elemIsNumber  = typeof element==='number';
          //check unique situations;
          var elemIsNull    = element===null;
          var elemIsArray   = element instanceof Array;
          var elemIsNotNum  = isNaN(element);
          //modify values according to checks;
          if(!elemIsNull&&elemIsObject&&!elemIsArray) { array[index] = JSON.stringify(element); }
          if(elemIsBoolean) { array[index] = element.toString(); }
          if(elemIsNull) { array[index] = JSON.stringify(new Object(element)); }
        });
        object[key] = value.join(',');
      } //handle arrays (only plain ones);
      if(!isNull&&isObject&&!isArray) {     
        object[key] = JSON.stringify(value); 
      } //handle proper objects;
      if(isBoolean||isNumber||isNotNum) { object[key] = value.toString(); } //handle booleans, numbers and NaNs (same behaviour);
      if(isNull) { object[key] = JSON.stringify(new Object(value)); } //handle null;
      
    }
    
  }
  return object;
}

/**
 * Finds connector index in config;
 * @param {Array} config array of connector config objects;
 * @param {Object} connector connector config object;
 */
function getIndex(config,connector) {
  var index = -1;
  var name = connector.name;
  
  if(config instanceof Array) {
    if(config.length!==0) {
      config.forEach(function(conn,idx){
        if(conn.name===name) { index = idx; }
      });
    }
  }
  
  return index;
}

/**
 * Extends object with all properties of another;
 * @param {Object} extended object to extend;
 * @param {Object} extender object which properties to use;
 * @returns {Object}
 */
function mergeObjects(extended,extender) {
  //check if extended and extender are arrays;
  var isArrExd = extended instanceof Array;
  var isArrExr = extender instanceof Array;
  
  //perform merging;
  if(isArrExd&&isArrExr) {
    //if both are arrays -> extend length;
    extender.forEach(function(prop){
      extended[extended.length] = prop;
    });
    return extended;
  }else if(!isArrExd&&!isArrExr) {
    //if both are objects -> extend props;
    for(var key in extender) {
      var prop = extender[key];
      if(prop===undefined) { continue; }
      if(!extended.hasOwnProperty(key)) { extended[key] = prop; }
    }
    return extended;
  }else if(isArrExd) {
    //if extended is array -> append extender;
    extended[extended.length] = extender;
    return extended;
  }else {
    //if extender is array -> append extended;
    extender[extender.length] = extended;
    return extender;
  }
  
}

/**
 * Extends object provided with data except for default fields;
 * @param {Object} object object to extend with custom fields;
 * @param {Object} inputs object containing custom data;
 * @returns {Object}
 */
function extendCustom(object,inputs) {
  for(var key in inputs) {
    var notIcon    = key!==globalIconFieldName;
    var notName    = key!==globalNameFieldName;
    var notURL     = key!==globalURLfieldName;
    var notManual  = key!== globalManualFieldName;
    var notDefault = key!==globalDefaultFieldName;
    if(notIcon&&notName&&notURL&&notManual&&notDefault) {
      object[key] = inputs[key];
    }
  }
  return object;
}

/**
 * Trims message properties that can be trimmed and returns modified object;
 * @param {GmailMessage} msg Apps Script class representing current message;
 * @param {Boolean} trimFromToFrom truthy value to determine whether to trim from property to email address;
 * @param {Boolean} trimFromToSender truthy value to determine whether to trim from property to sender info;
 * @returns {Object}
 */
function trimMessage(msg,trimFromToFrom,trimFromToSender) {
  if(trimFromToFrom||trimFromToSender) {
    var from = msg.getFrom();
  }
  var trimmed = {};
  if(trimFromToFrom) { trimmed.email = trimFrom(from); }
  if(trimFromToSender) { 
    trimmed.name = trimSender(from);
    
    //split sender's name by spaces (rudimental guessing);
    var split = trimmed.name.split(' ');
    
    //access possible first name, lowercase it and set default first name index;
    var first = split[0];
    var lwd   = first.toLowerCase();
    var start = 0;
    
    //check if sender's name starts with "the" or "a";
    if(lwd==='the'||lwd==='a') { 
      first += ' '+split[1]; 
      start = 1; 
    }
    
    //set first name and initiate last;
    trimmed.first = first;
    trimmed.last  = '';
    if(split.length>1) {
      split.forEach(function(part,idx){
        var spacer = '';
        if(idx!==(start+1)) { spacer = ' '; }
        if(idx>start) { trimmed.last += spacer+part; }
      });
    }
    
  }
  return trimmed;
}

/**
 * Checks if data contains widgets in "editable" state;
 * @param {Array} data an array of objects to check;
 * @returns {Boolean}
 */
function checkEditable(data) {
  if(!(data instanceof Array)) { return false; }
  var hasEditable = data.some(function(elem){
    var widgets = elem.widgets;
    if(widgets instanceof Array) {
      var elemHasEditable = widgets.some(function(widget){
        var state = widget.state;
        if(state==='editable') { return widget; }
      });
    }else { elemHasEditable = false; }
    if(elemHasEditable) { return elem; }
  });
  return hasEditable;
}

/**
 * Checks if data contains nested objects to determine which Ui to load;
 * @param {Array} data an array of objects to check;
 * @returns {Boolean}
 */
function checkNested(data) {
  if(!(data instanceof Array)) { return false; }
  var hasNested = data.some(function(elem){ 
    var hasSecondLevelObject = false;
    for(var key in elem) {
      var val = elem[key];
      if(typeof val === 'object') { 
        hasSecondLevelObject = true; break; 
      }
    }
    return hasSecondLevelObject;
  });
  return hasNested;
}

/**
 * Attempts to pre-parse data;
 * @param {String} data data string to be parsed;
 * @returns {Array}
 */
function parseData(data) {

  //try to parse content until recieved an array; 
  try {
    while(!(data instanceof Array)) {
      data = JSON.parse(data);
    }
    return data;
  }
  catch(err) { data = data; }

  try {
    if(data===''||data==='[]'||data==='""') {
      data = []; 
    }else { 
      data = JSON.parse(data);
    }
    if(!(data instanceof Array)&&!(typeof data==='string')) {
      data = [data]; 
    }else if(typeof data==='string') {
      data = JSON.parse(data);
    }
    if(!(data instanceof Array)&&(typeof data==='object')) {
      data = [data];
    }
  }
  catch(e) {
    return data;
  }
  return data;
}

/**
 * Creates settings storage;
 * @param {String} content content to pass to JSON file;
 */
async function createSettings(content) {
  if(content===undefined) { content = []; }
  await setProperty('config',content,'user');
}

/**
 * Trims sender info from name and '<' & '>' characters;
 * @param {String} input sender info to trim;
 * @return {String}
 */
function trimFrom(input) {
  var regEx1 = /\<.+@.+\>/;
  var regEx2 = /[^\<].+@.+[^\>]/;
  try {
    var r = input.match(regEx1)[0];
  } catch(e) {
    return input;
  }
  var email = r.match(regEx2)[0];
  return email;
}

/**
 * Trims sender name from "name <email>" input;
 * @return {String}
 */
function trimSender(input) {
  try {
    var index = input.indexOf(' <');
    if(index===-1) {
      return '';
    }else {
      return input.replace(input.slice(index),'');
    }
  }
  catch(e) {
    return '';
  }
}
//====================================END BACKEND====================================//

//================================START PERFORM FETCH================================//
/**
 * Performs URL fetch with payload to external service;
 * @param {String} url url to be passed to request;
 * @param {Object} headers headers to be passed to request;
 * @param {Object} payload payload to be passed to request;
 * @returns {Object}
 */
async function performFetch(url,method,headers,payload) {
  try {    
    var params = {
      'method':method,
      'muteHttpExceptions':true,
      'contentType':'application/json',
      'headers':headers
    };
    if(method!=='get') { params.payload = JSON.stringify(payload); }
    
    var response = await UrlFetchApp.fetch(url,params);
    var code     = response.getResponseCode();
    var headers  = response.getHeaders();
    var content  = response.getContentText();
   
    var isValid = content!==null&&content!==undefined;
    if(!isValid) { content = '[]'; }
    return {code:code,headers:headers,content:content};
  }
  catch(e) {
    //handles request exceptions not caught by muteHttpExceptions;
    return {code:0,headers:'',content:e.message}
  }
}
//=================================END PERFORM FETCH=================================//









/**
 * Trims sender info from name and '<' & '>' characters;
 * @param {String} input -> sender info to trim
 * @return {String}
 */
function trimFrom(input) {
	var regEx1 = /\<.+@.+\>/;
	var regEx2 = /[^\<].+@.+[^\>]/;
	try {
		var r = input.match(regEx1)[0];
	} catch(e) {
		return input;
	}
	var email = r.match(regEx2)[0];
	return email;
}

/**
 * Trims sender name from "name <email>" input;
 * @return {String}
 */
function trimSender(input) {
  try {
    var index = input.indexOf(' <');
    if(index===-1) {
      return '';
    }else {
      return input.replace(input.slice(index),'');
    }
  }
  catch(e) {
    return '';
  }
}
//===========================================END BACKEND===========================================//

//==========================================START GLOBALS==========================================//
//headers;
var globalWelcomeHeader          = 'Welcome to Cardin for Gmail!';
var globalConfigHeader           = 'Connector configuration';
var globalSettingsHeader         = 'Settings';
var globalAdvancedHeader         = 'Advanced settings';
var globalHelpHeader             = 'Help';
var globalConfirmHeader          = 'Confirm action';
var globalExistingConnectsHeader = 'Configured Connectors';
var globalManualHeader           = 'Manual fetch';
var globalAutoHeader             = 'Auto fetch';
var globalShowHeader             = 'Record';
var globalUnparsedHeader         = 'Unparsed data';
var globalConfiguredHeader       = 'Configured Connectors';
var globalChooseTypeHeader       = 'Available Connector types';
var globalConfigErrorHeader      = 'Configuration error';

//titles;
var globalWelcomeWidgetTitle        = '';
var globalHelpWidgetTitle           = '';
var globalInstallWidgetTitle        = '';
var globalCustomWidgetTitle         = '';
var globalConfirmWidgetTitle        = '';
var globalCustomWidgetNameTitle     = 'Connector name';
var globalResetWidgetTitle          = 'Reset';
var globalClearWidgetTitle          = 'Cache';
var globalCodeWidgetTitle           = 'Code';
var globalErrorWidgetTitle          = 'Error description';
var globalUnparsedErrorWidgetTitle  = 'Parse failure reason';
var globalUnparsedDataWidgetTitle   = 'Unparsed data';
var globalNoDataWidgetTitle         = '';
var globalExtraDataTitle            = '';
var globalCustomWidgetFieldTitle    = 'Field';
var globalConfigErrorWidgetTitle    = '';
var globalAuthTypeErrorTitle        = 'Auth type mismatch';

//content - errors;
var globalConfigErrorWidgetContent   = 'Seems like you have a configuration issue! Please, reset the Add-on if this is the only section you see. Otherwise, try removing any malformed Connectors before resetting';
var globalAuthTypeErrorContent       = 'The Connector seems to require OAuth 2.0 authorization to work, but you set auth type to "none". Please configure OAuth properties in Settings';
//content - others;
var globalAuthTextWidgetContent      = 'This Connector requires authorization to an external service. You can revoke authorization any time by clicking "revoke". Note that either action will trigger a refresh';
var globalWelcomeWidgetContent       = 'Click on a Connector from the list below to get started';
var globalConfirmResetWidgetContent  = 'Every configured Connector will be permanently deleted. Are you sure?';
var globalConfirmRemoveWidgetContent = 'The Connector will be permanently removed. Are you sure?';
var globalHelpWidgetContent          = 'Visit our website for setup instructions and other support resources';
var globalCustomWidgetContent        = 'You can create a custom Connector by completing the form below';
var globalResetWidgetContent         = 'Every user preference will be reset, and Connector configurations will be deleted';
var globalCustomWidgetSwitchText     = 'Manually invoke Connector';
var globalCustomWidgetAuthText       = 'Authorization type';
var globalIsDefaultWidgetSwitchText  = 'Run and display by default';
var globalNoDataWidgetText           = 'The Connector returned with no data to be displayed';
var globalExtraDataText              = 'More data is available, but we trimmed it to avoid hitting the 100 field limit';
var globalGoToSettings               = 'Go to settings';
var globalSheetsContent              = 'Google Sheets';
var globalFlowContent                = 'Microsoft flow';
var globalZapierContent              = 'Zapier';
var globalIftttContent               = 'IFTTT';
var globalCustomTypeContent          = 'Custom';
var globalNotAuthorizedContent       = 'Seems like the Connector you built requires authentication but no credentials were provided';
var globalOptionalFieldsContent      = 'These fields are optional and can be left blank';

//hints;
var globalCustomWidgetNameHint      = 'Name to display in list of Connectors';

//button as labels texts;
var globalSuccess                   = 'Success';
var globalError                     = 'Error';
var globalNoData                    = 'No data';
var globalAuto                      = 'Auto';
var globalManual                    = 'Manual';

//button texts;
var globalResetWidgetSubmitText     = 'Reset';
var globalClearWidgetSubmitText     = 'Clear';
var globalCreateConnectorText       = 'Create';
var globalUpdateConnectorText       = 'Update';
var globalRemoveConnectorText       = 'Remove';
var globalUpdateShowText            = 'Update';
var globalLoadExtraForwardText      = 'Next';
var globalLoadExtraBackText         = 'Back';
var globalRootText                  = 'Go back';
var globalCardinUrlText             = 'cardinsoft.com';
var globalYouTubeUrlText            = 'YouTube instructions';
var globalOpenAuthText              = 'Authorize';
var globalRevokeAuthText            = 'Revoke';
var globalLoginText                 = 'Login';
var globalConfirmText               = 'Confirm';
var globalCancelText                = 'Cancel';

//URLs;
var globalInfusionIconUrl = 'https://cardinsoft.github.io/outlook/assets/infusionsoft.png';
var globalCardinUrl       = 'https://cardinsoft.com/cardin-gmail/';
var globalYouTubeUrl      = 'https://youtube.com/';
var globalCardinIconUrl   = 'https://cardinsoft.github.io/outlook/assets/cardin-logo.png';
var globalGitHubIconUrl   = 'https://cardinsoft.github.io/outlook/assets/github.png';
var globalSheetsIconUrl   = 'https://cardinsoft.github.io/outlook/assets/sheets.png';
var globalFlowIconUrl     = 'https://cardinsoft.github.io/outlook/assets/flow.png';
var globalZapierIconUrl   = 'https://cardinsoft.github.io/outlook/assets/zapier.png';
var globalIftttIconUrl    = 'https://cardinsoft.github.io/outlook/assets/ifttt.jpg';
var globalCustomIconUrl   = 'https://cardinsoft.github.io/outlook/assets/custom.png';
var globalTypesConfigUrl  = 'https://cardinsoft.github.io/outlook/types.json';
 

//notifications, warnings and error messages
var globalCreateSuccess       = 'Connector successfully created!';
var globalCreateFailure       = 'Connector creation failed';
var globalUpdateSuccess       = 'Connector successfully updated!';
var globalUpdateFailure       = 'Connector update failed';
var globalRemoveSuccess       = 'Connector successfully removed!';
var globalRemoveFailure       = 'Connector removal failed';
var globalClearSuccess        = 'Cache successfully cleared!';
var globalIncorrectURL        = 'Please reconfigure the Connectors listed below as their URLs returned with an error';
var globalInvalidURLnoMethod  = 'URLs should include http or https and a domain';
var globalRevokeAccessSuccess = 'Access token successfully revoked!';
var globalResetSuccess        = 'Add-on configuration successfully reset!';
var globalResetFailure        = 'Add-on configuration reset failed!';

//field names and global parameters;
var globalEnumRadio             = 'RADIO_BUTTON';
var globalEnumCheckbox          = 'CHECK_BOX';
var globalEnumDropdown          = 'DROPDOWN';
var globalCustomUrlUrl          = '';
var globalCustomNameName        = 'custom';
var globalBaseClassName         = 'Connector';
var globalIconFieldName         = 'icon';
var globalNameFieldName         = 'name';
var globalURLfieldName          = 'url';
var globalManualFieldName       = 'manual';
var globalDefaultFieldName      = 'isDefault';
var globalUrlAuthFieldName      = 'urlAuth';
var globalUrlTokenFieldName     = 'urlToken';
var globalClientIdFieldName     = 'id';
var globalSecretFieldName       = 'secret';
var globalScopeFieldName        = 'scope';
var globalRedirectFieldName     = 'redirect';
var globalConfigName            = 'config';
var globalTextButtonActionClick = 'click';
var globalTextButtonActionLink  = 'link';
var globalNumUncollapsible      = 5;
var globalWidgetsCap            = 50;
var globalInfusionsoftApptsCap  = 5;
var globalInfusionsoftTasksCap  = 5;

//OAuth2 flow;
var globalAlreadyAuthorized = 'Connector previously authorized!';
var globalAlreadyRevoked    = 'Connector revoked or does not have access!';
var globalRevokeAccess      = 'Revoke access';
var globalAuthorize         = 'Please authorize the Connector';
var globalAuthSuccess       = 'Successfully authorized! You can close the window now';
var globalAuthFailure       = 'Authorization failed! You can close the window now';
var globalAuthUrlInputHint  = 'Authorization URL';
var globalTokenUrlInputHint = 'Token URL';
var globalClientIdInputHint = 'Obtained from API';
var globalSecretInputHint   = 'Obtained from API';
var globalScopeInputHint    = 'Obtained from API';

//connector types specific globals;
var globalInfusionShort = 'Fetches sales and marketing information from Infusionsoft by Keap CRM & marketing automation platform';
var globalSheetsShort   = 'Fetches and displays data from a Google Sheet. Please, make sure that you have access rights to view it';
var globalFlowShort     = 'Sends and recieves data from Microsoft Flow - this Connector type can work with iterative data updating';
var globalQBShortDesc   = 'Fetches customer or supplier invoice or bill detail from connected QB company. Please authenticate to QB';
//==========================================END GLOBALS==========================================//

//==========================================START GITHUB==========================================//
//sample GitHub connector class;
function GitHub() {
  Connector.call(this);
  this.icon = globalGitHubIconUrl;
  this.name = 'GitHub';
  this.url  = 'https://api.github.com/user';
  this.config = [
    {
      'header': 'Additional config',
      'isCollapsible': false,
      'widgets': [
        {
          'type': 'KeyValue',
          'title': 'GitHub',
          'content': 'Retrieves user info data from GitHub'
        }
      ]
    }
  ];
  this.auth = {
    name: 'GitHub',
    urlAuth: 'https://github.com/login/oauth/authorize',
    urlToken: 'https://github.com/login/oauth/access_token',
    id: 'e6c7b5e9866ad262b1c8',
    secret: 'd53fe70345b269e96477a1559d844a29c0061251',
    scope: 'malformed'
  };
  
  /**
   * method for performing fetch to external service;
   * @param {Object} msg -> message object;
   * @param {Object} connector -> connector config object;
   * @param {Object} data -> custom data object to pass to payload;
   * @return {Function}
   */
  this.run = async function (msg,connector,data) { 
    //initiate authorization service;
    var service = authService(connector.type,connector.scope);

    //set method for url fetch ('get' or 'post' for now);
    var method = 'get';
  
    //set headers for url fetch;
    var headers = {
      'Authorization' : 'Bearer '+service.getAccessToken()
    };
  
    //set payload in case POST request will be triggered;
    var trimmed = trimMessage(msg,true,true);
    var labels = msg.getThread().getLabels().map(function(label){ return label.getName(); });
    var payload = {
      'Bcc': msg.getBcc(),
      'Cc': msg.getCc(),
      'date': msg.getDate(),
      'sender': trimmed.name,
      'from': trimmed.email,
      'id': msg.getId(),
      'subject': msg.getSubject(),
      'labels': labels
    };
    if(data!==undefined) { payload.data = data; }
  
    //initiate request;
    var response = await performFetch(connector.url,method,headers,payload);
    
    //initialize result without content;
    var parsed;
    
    //perform some parsing;
    if(!(response instanceof Array)) {
      //change content into array and parse all nested objects;
      parsed = new Array(parseData(response.content));
    }
    //add custom key-value pair;
    parsed[0].custom = 'CUSTOM ADDITION';
    //filter out empty strings, undefined and nulls from array elements;
    parsed.forEach(function(elem){
      for(var key in elem) {
        var value = elem[key];
        if(value===''||value===undefined||value===null) { delete elem[key]; }
      }
    });
    
    //make some parsing;
    return {'code':response.code,'headers':response.headers,'content':parsed};    
  }
}
//chain custom connector to base class;
GitHub.prototype = Object.create(Connector.prototype);
//===========================================END GITHUB===========================================//

//===========================================START FLOW===========================================//
//Flow connector class;
function Flow() {
  Connector.call(this);
  this.icon  = globalFlowIconUrl;
  this.name  = 'Flow';
  this.short = globalFlowShort;
  this.config = [
    {
      'header': 'Flow config',
      'isCollapsible': false,
      'widgets': [
        {
          'name': globalURLfieldName,
          'type': 'TextInput',
          'title': 'Flow URL',
          'content': '',
          'hint': 'e.g. Http get or post URL'
        }
      ]
    }  
  ];
  this.auth = {};
  this.run = async function (msg,connector,data) {
    //set method for url fetch ('get' or 'post' for now);
    var method = 'post';

    //set headers for url fetch;
    var headers = {};
    
    //set payload in case POST request will be triggered;
    var trimmed = trimMessage(msg,true,true);
    var labels = msg.getThread().getLabels().map(function(label){ return label.getName(); });
    var payload = {
      'Bcc': msg.getBcc(),
      'Cc': msg.getCc(),
      'date': msg.getDate(),
      'sender': trimmed.name,
      'from': trimmed.email,
      'id': msg.getId(),
      'subject': msg.getSubject(),
      'labels': labels
    };
    if(data!==undefined) { payload.data = data; }
    
    //perform data fetch and return result;
    var result = await performFetch(connector.url,method,headers,payload);
    return result;
  }
}
//chain custom connector to base class;
Flow.prototype = Object.create(Connector.prototype);
//============================================END FLOW============================================//

//============================================START SHEETS========================================//
//sample Sheets connector class;
function Sheets() {
  Connector.call(this);
  this.icon  = globalSheetsIconUrl;
  this.name  = 'Sheets';
  this.short = globalSheetsShort;
  this.config = [
    {
      'header': 'Additional config',
      'isCollapsible': false,
      'widgets': [
        {
          'name': globalURLfieldName,
          'type': 'TextInput',
          'title': 'Spreadsheet URL',
          'content': '',
          'hint': 'https://docs.google.com/spreadsheets/d/{id}/edit'
        },
        {
          'name': 'numcol',
          'type': 'TextInput',
          'title': 'Number of columns',
          'content': '',
          'hint': 'Max number of columns to lookup'
        },
        {
          'name': 'numrow',
          'type': 'TextInput',
          'title': 'Number of rows',
          'content': '',
          'hint': 'Max number of rows to lookup'
        }
      ]
    }
  ];
  this.auth = {};
  this.run = function (msg,connector,data) { 
    //unpack connector settings;
    var maxcol = +connector.numcol;
    var maxrow = +connector.numrow;
    
    //set initial result object properties;
    var result = {code:200,headers:{},content:[]};
    
    //perform trimming and assign values to variables;
    var trimmed = trimMessage(msg,true,true);  
    var name  = trimmed.name;
    var email = trimmed.email;
    
    //get spreadsheet and start fetching data;
    var spread = getSpreadsheet(connector.url,false);
    if(spread===null) { 
      result.code = 404;
      result.content = 'The spreadsheet with url < '+connector.url+' > could not be found or you do not have access to it';
      return result; 
    }
    
    try {//temp for dev

    if(spread!==null) {
      var sheets = spread.getSheets();
      var numsh  = sheets.length;

      //loop through each sheet and perform fetching;
      for(var i=0; i<numsh; i++) {
        //check if sheet has email data in it;
        var cursh        = sheets[i];
        var shname       = cursh.getName();
        var hasEmailData = hasEmail(cursh);
        if(hasEmailData) {
          
          //get data dimentions and range;
          var numrow = cursh.getLastRow();
          var numcol = cursh.getLastColumn();
          if(maxcol!==0) { numcol = maxcol; }
          if(maxrow!==0) { numrow = maxrow+1; }

          var dataRange = cursh.getRange(1,1,numrow,numcol);
          
          //get values and data validations;
          var dataValues   = dataRange.getValues();
          var dataValids   = dataRange.getDataValidations();
          var dataFormats  = dataRange.getNumberFormats();
          var dataDisplays = dataRange.getDisplayValues(); 
          
          //get headers;
          var dataHeaders = dataValues[0];
          
          //loop through each values row;
          for(var j=1; j<dataValues.length; j++) {
            
            //get values, validations, formats and display values for current row; 
            var values   = dataValues[j];
            var valids   = dataValids[j];
            var formats  = dataFormats[j];
            var displays = dataDisplays[j]; 
            
            //check if values row has match to an email;
            var hasMatch = values.some(function(value) { return value===email; });
            if(hasMatch) {
              
              //create section for each email match;
              var section = {
                header: '"'+shname+'", matched on row '+j,
                isCollapsible: true,
                numUncollapsible: globalNumUncollapsible,
                widgets: []
              };             
              
              //create widgets for each field;
              values.forEach(function(value,index){
                
                //get validations, formats and display values for current value;
                var valid   = valids[index];
                var format  = formats[index];
                var display = displays[index];
                
                //create widget to display data;
                var widget = {
                  type: 'KeyValue',
                  title: dataHeaders[index],
                  content: display
                };
                
                section.widgets.push(widget);
              });
              
              result.content.push(section);
            }
            
          }
          
          
        }else { continue; }
        
      }
      
    }
    
    }
    catch(er) {}
    
    if(result.content.length===0) { result.content = '[]'; }
    
    return result;
  }
}
//chain custom connector to base class;
Sheets.prototype = Object.create(Connector.prototype);
//============================================END SHEETS========================================//

//emulate event object;
class e_EventObject {
	constructor() {
		this.messageMetadata = {
			accessToken : '',
			messageId : ''
		};
		this.formInput;
		this.clientPlatform;
		this.formInputs;
		this.parameters = {};
		this.userLocale;
		this.userTimezone = {
			offset : '',
			id : ''
		}
	}
}

//Emulate Message class that is obtained from current message auth flow;
class Message {
	constructor(msgFrom,msgBcc,msgCc,msgDate,msgPlainBody,msgSubject,msgId,msgThread) {
		this.msgFrom      = msgFrom;
		this.msgBcc       = msgBcc;
		this.msgCc        = msgCc;
		this.msgDate      = msgDate;
		this.msgPlainBody = msgPlainBody;
		this.msgSubject   = msgSubject;
		this.msgId        = msgId;
		this.msgThread    = msgThread;
	}
}
Message.prototype.getId = function () {
	return this.msgId;
}
Message.prototype.getBcc = function () {
	return this.msgBcc;
}
Message.prototype.getCc = function () {
	return this.msgCc;
}
Message.prototype.getDate = function () {
	return this.msgDate;
}
Message.prototype.getFrom = function () {
	return this.msgFrom;
}
Message.prototype.getPlainBody = function () {
	return this.msgPlainBody;
}
Message.prototype.getSubject = function () {
	return this.msgSubject;
}
Message.prototype.getThread = function () {
	return this.msgThread;
}

/**
 * Fetches authorization token for current email
 * @param {Object} e -> event object;
 * @returns {Message}
 */
function getToken(e) {
	const item = Office.context.mailbox.item;
	
	const name = Office.context.mailbox.item.sender.displayName;
	const email = Office.context.mailbox.item.sender.emailAddress;
	const msgFrom = `${name} <${email}>`;
	
	const msg = new Message( msgFrom,'',item.cc,item.dateTimeCreated.toUTCString(),item.body,item.subject, item.itemId );
	return msg;
}

//===========================================START APPS SCRIPT===========================================//
//Emulate CardService service;
class e_CardService {
	constructor() {
		this.className = 'CardService';
		this.ComposedEmailType = {REPLY_AS_DRAFT:'REPLY_AS_DRAFT',STANDALONE_DRAFT:'STANDALONE_DRAFT'};
		this.ContentType;
		this.Icon;
		this.ImageStyle = {SQUARE:'SQUARE',CIRCLE:'CIRCLE'};
		this.LoadIndicator = {NONE:'NONE',SPINNER:'SPINNER'};
		this.NotificationType = {INFO:'INFO',WARNING:'WARNING',ERROR:'ERROR'};
		this.OnClose = {RELOAD_ADD_ON:'RELOAD_ADD_ON',NOTHING:'NOTHING'};
		this.OpenAs = {OVERLAY:'OVERLAY',FULL_SIZE:'FULL_SIZE'};
		this.SelectionInputType = {CHECK_BOX:'CHECK_BOX',RADIO_BUTTON:'RADIO_BUTTON',DROPDOWN:'DROPDOWN'};
		this.TextButtonStyle = {FILLED:'FILLED'};
		this.UpdateDraftBodyType = {IN_PLACE_INSERT:'IN_PLACE_INSERT'};
	}
}
//add new methods to the class;
e_CardService.prototype.newAction = function () {
	return new Action();
}
e_CardService.prototype.newActionResponseBuilder = function () {
	return new ActionResponseBuilder();
}
e_CardService.prototype.newButtonSet = function () {
	return new ButtonSet();
}
e_CardService.prototype.newCardBuilder = function () {
	return new CardBuilder();
}
e_CardService.prototype.newCardHeader = function () {
	return new CardHeader();
}
e_CardService.prototype.newCardSection = function () {
	return new CardSection();
}
e_CardService.prototype.newKeyValue = function () {
	return new KeyValue();
}
e_CardService.prototype.newNavigation = function () {
	return new Navigation();
}
e_CardService.prototype.newNotification = function () {
	return new Notification();
}
e_CardService.prototype.newOpenLink = function () {
	return new OpenLink();
}
e_CardService.prototype.newSwitch = function () {
	return new Switch();
}
e_CardService.prototype.newTextButton = function () {
	return new TextButton();
}
e_CardService.prototype.newTextInput = function () {
	return new TextInput();
}
e_CardService.prototype.newSelectionInput = function () {
	return new SelectionInput();
}
e_CardService.prototype.newTextParagraph = function () {
	return new TextParagraph();
}
e_CardService.prototype.newUniversalActionResponseBuilder = function () {
	return new UniversalActionResponseBuilder(); 
}

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

//Emulate Clas Properties for PropertiesService service;
class Properties {
	constructor(settings,type) {
		this.settings = settings;
		this.type     = type;
	}
}
//add new methods to the class;
Properties.prototype.deleteAllProperties = function () {
	const settings = this.settings;
	
	console.log(Object.keys(typeof settings));
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
	if(property!==undefined) { 
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

//Emulate class Navigation for CardService service;
class Navigation extends e_CardService {
	constructor() {
		super();
		this.className = 'Navigation';
	}
}
//add new methods to the class;
Card.prototype.popCard = function () {
	
}
Card.prototype.popToNamedCard = function (cardName) {
	
}
Card.prototype.popToRoot = function () {
	
}
Card.prototype.printJson = function () {
	return JSON.stringify(this);
}
Card.prototype.pushCard = function (card) {
	
}
Card.prototype.updateCard = function (card) {
	
}






//Emulate Class Card for CardService service;
class Card extends e_CardService {
	constructor() {
		super();
		this.className = 'Card';
	}
}
//add new methods to the class;
Card.prototype.printJSON = function () {
	return JSON.stringify(this);
}

//Emulate Class Switch for CardService service;
class Switch extends e_CardService {
	constructor() {
		super();
		this.className = 'Switch';
		this.fieldName;
		this.action;
		this.selected;
		this.value;
	}
}
//add new methods to the class;
Switch.prototype.setFieldName = function (fieldName) {
	this.fieldName = fieldName;
	return this;
};
Switch.prototype.setOnChangeAction = function (action) {
	this.action = action;
	return this;	
};
Switch.prototype.setSelected = function (selected) {
	this.selected = selected;
	return this;	
};
Switch.prototype.setValue = function (value) {
	this.value = value;
	return this;	
};
Switch.prototype.appendToUi = function (parent) {
	const fieldName = this.fieldName;
	const action    = this.action;
	const selected  = this.selected;
	const value     = this.value;
	
	const pToggle = document.createElement('p');
	parent.append(pToggle);
	
	const wrapToggle = document.createElement('div');
	wrapToggle.className = 'ms-Toggle ms-font-m-plus '+this.className;
	pToggle.append(wrapToggle);
	
	const input = document.createElement('input');
	input.type = 'checkbox';
	input.id = fieldName;
	input.className = 'ms-Toggle-input';
	input.value = value;
	wrapToggle.append(input);	
	wrapToggle.addEventListener('click',function(e){
		let val = input.value;
		if(val==='true') {
			input.value = 'false'; 
		}else {
			input.value = 'true'; 
		}
	});
	
	if(action!==undefined) { 
		wrapToggle.addEventListener('click',actionCallback(action,input)); 
	}
	
	const label = document.createElement('label');
	if(value==='true') {
		label.className = 'ms-Toggle-field is-selected';
	}else {
		label.className = 'ms-Toggle-field';
	}
	wrapToggle.append(label);
	
	new fabric['Toggle'](wrapToggle);
}

//Emulate base Class Button for CardService service;
class Button extends e_CardService {
	constructor() {
		super();
		this.className = 'Button';
		this.action;
		this.openLink;
		this.composedEmailType;
	}
}
//add new methods to the class;
Button.prototype.setAuthorizationAction = function (action) {
	this.action = action;
	return this;
}
Button.prototype.setComposeAction = function (action,composedEmailType) {
	this.action = action;
	this.composedEmailType = composedEmailType;
	return this;
}
Button.prototype.setOnClickAction = function (action) {
	this.action = action;
	return this;
}
Button.prototype.setOnClickOpenLinkAction = function (action) {
	this.action = action;
	return this;
}
Button.prototype.setOpenLink = function (openLink) {
	this.openLink = openLink;
	return this;
}

//Emulate Class ButtonSet for CardService service;
class ButtonSet extends e_CardService {
	constructor() {
		super();
		this.className = 'ButtonSet';
		this.buttons = [];
	}
}
//add new methods to the class;
ButtonSet.prototype.addButton = function(button) {
	this.buttons.push(button);
	return this;
}
ButtonSet.prototype.appendToUi = function(parent) {
	const buttons = this.buttons;
	const length = buttons.length;
	
	const btnRow = document.createElement('div');
	btnRow.className = 'row '+this.className;
	parent.append(btnRow);
	
	const wrapBtn = document.createElement('div');
	wrapBtn.className = 'column';
	btnRow.append(wrapBtn);
	
	buttons.forEach(function(button) {
		const backgroundColor = button.backgroundColor;
		const text = button.text;
		const disabled = button.disabled;
		const textButtonStyle = button.textButtonStyle;	
		const action = button.action;
		
		const btn = document.createElement('button');
		if(disabled) {
			btn.className = 'ms-Button ms-Button--small'+button.className;
		}else {
			btn.className = 'ms-Button ms-Button--small ms-Button--primary '+button.className;
		}
		btn.disabled = disabled;
		wrapBtn.append(btn);		
		
		const btnContent = document.createElement('span');
		btnContent.className = 'ms-Button-label';
		btnContent.textContent = text;
		btn.append(btnContent);

		new fabric['Button'](btn, actionCallback(action,btn) );	
	});

}

//Emulate Class CardBuilder extending Class Card for CardService service;
class CardBuilder extends Card {
	constructor() {
		super();
		this.className = 'CardBuilder';
		this.action;
		this.sections = [];
		this.cardHeader;
		this.name;
	}
}
//add new methods to the class;
CardBuilder.prototype.addCardAction = function (action) {
	this.action = action;
	return this;
};
CardBuilder.prototype.addSection = function (section) {
	this.sections.push(section);
	return this;
};
CardBuilder.prototype.setHeader = function (cardHeader) {
	this.cardHeader = cardHeader;
	return this;
};
CardBuilder.prototype.setName = function (name) {
	this.name = name;
	return this;
};
CardBuilder.prototype.build = function () {
	const cardHeader   = this.cardHeader;
	const cardSections = this.sections;
	const cardAction   = this.action;
	
	$('#main-Ui-header').empty();
	$('#app-body').empty();
	
	const wrap = document.createElement('div');
	wrap.id = 'main-Ui-wrap'
	wrap.className = 'ms-Panel-contentInner';	
	$('#app-body').append(wrap);
	
	if(this.cardHeader!==undefined) {
		const headerWrap = document.createElement('div');
		headerWrap.id = 'main-Ui-header';
		$('.ms-CommandBar-mainArea').prepend(headerWrap);
		
		if(this.cardHeader.imageUrl!==undefined) {
			const icon = document.createElement('img');
			icon.src = this.cardHeader.imageUrl;
			icon.className = 'headerIcon';
			headerWrap.prepend(icon);
		}
		
		const header = document.createElement('p');
		header.className = 'ms-Panel-headerText';
		header.textContent = this.cardHeader.title;
		headerWrap.append(header);
	}
		
	if(cardSections.length!==0) {
		let serialize = true;
		if(cardSections.length!==1) { serialize = true; }else { serialize = false; }
		cardSections.forEach(function(cardSection){
			cardSection.appendToUi( $('#main-Ui-wrap'),serialize );
		});
	}
	
	return this;
};

//Emulate Class CardHeader extending Class Card for CardService service;
class CardHeader extends Card {
	constructor() {
		super();
		this.className = 'CardHeader';
		this.imageAltText;
		this.imageStyle;
		this.imageUrl;
		this.title;
		this.subtitle;
	}
}
//add new methods to the class;
CardHeader.prototype.setImageAltText = function (imageAltText) {
	this.imageAltText = imageAltText;
	return this;
};
CardHeader.prototype.setImageStyle = function (imageStyle) {
	this.imageStyle = imageStyle;
	return this;
};
CardHeader.prototype.setImageUrl = function (imageUrl) {
	this.imageUrl = imageUrl;
	return this;
};
CardHeader.prototype.setTitle = function (title) {
	this.title = title;
	return this;
};
CardHeader.prototype.setSubtitle = function (subtitle) {
	this.subtitle = subtitle;
	return this;
};

//Emulate Class CardSection extending Class Card for CardService service;
class CardSection extends Card {
	constructor() {
		super();
		this.className = 'CardSection';
		this.widgets = [];
		this.collapsible = false;
		this.header;
		this.numUncollapsibleWidgets;
	}
}
//add new methods to the class;
CardSection.prototype.addWidget = function (widget) {
	this.widgets.push(widget);
	return this;
}
CardSection.prototype.setCollapsible = function (collapsible) {
	this.collapsible = collapsible;
	return this;
}
CardSection.prototype.setHeader = function (header) {
	this.header = header;
	return this;
}
CardSection.prototype.setNumUncollapsibleWidgets = function (numUncollapsibleWidgets) {
	this.numUncollapsibleWidgets = numUncollapsibleWidgets;
	return this;
}
CardSection.prototype.appendToUi = function (parent,serialize) {
	const collapsible = this.collapsible;
	
	const section = document.createElement('div');
	if(serialize) {
		section.className = 'separated '+this.className;
	}else {
		section.className = this.className;
	}
	section.dir = 'ltr';

	const headerText = this.header;
	console.log(headerText);
	if(headerText!==undefined&&headerText!=='') {
		const header = document.createElement('p');
		header.className = 'ms-font-m-plus sectionHeader';
		header.textContent = headerText;
		section.append(header);
	}
	
	const widgetsWrap = document.createElement('div');
	if(collapsible) { widgetsWrap.className = 'closed'; }
	section.append(widgetsWrap);
	
	const widgets = this.widgets;
	if(widgets.length!==0) {
		widgets.forEach(function(widget,index){
			widget.appendToUi(widgetsWrap,index);
		});
	}

	if(collapsible) {
		const toggler = document.createElement('div');
		toggler.className = 'toggler centered ms-Icon ms-Icon--ChevronDown';
		section.append(toggler);
		
		toggler.addEventListener('click',function(e) {
			const classes = this.classList;			
			classes.toggle('ms-Icon--ChevronDown');
			classes.toggle('ms-Icon--ChevronUp');
			
			const widgetsClasses = widgetsWrap.classList;
			widgetsClasses.toggle('closed');
			widgetsClasses.toggle('opened');
			
		});
		
	}
			
	parent.append(section);
}

//Emulate base Class Widget for CardService service;
class Widget extends e_CardService {
	constructor() {
		super();
		this.className = 'Widget';
	}
}

//Emulate Class TextInput for base Class Widget for CacheService service;
class TextInput extends Widget {
	constructor() {
		super();
		this.className = 'TextInput';
		this.fieldName;
		this.hint;
		this.multiline;
		this.action;
		//this.suggestions;
		//this.suggestionsAction;
		this.title;
		this.value;
	}
}
//add new methods to the class;
TextInput.prototype.setFieldName = function (fieldName) {
	this.fieldName = fieldName;
	return this;
};
TextInput.prototype.setHint = function (hint) {
	this.hint = hint;
	return this;
}
TextInput.prototype.setMultiline = function (multiline) {
	this.multiline = multiline;
	return this;
}
TextInput.prototype.setOnChangeAction = function (action) {
	this.action = action;
	return this;
}
TextInput.prototype.setTitle = function (title) {
	this.title = title;
	return this;
}
TextInput.prototype.setValue = function (value) {
	this.value = value;
	return this;
};
TextInput.prototype.appendToUi = function (parent) {
	const fieldName = this.fieldName;
	const action    = this.action;
	const value     = this.value;
	const multiline = this.multiline;
	const title     = this.title;
	const hint      = this.hint;

	const widget = document.createElement('div');
	widget.className = 'row '+this.className;
	parent.append(widget);
	
	const row = document.createElement('div');
	row.className = 'column';
	widget.append(row);
	
	if(title!==undefined) {	
		const topLabel = document.createElement('label');
		topLabel.className = 'ms-fontSize-s TextInputTopLabel';
		topLabel.textContent = title;
		row.append(topLabel);
	}
	
	const inputWrap = document.createElement('div');
	inputWrap.className = 'ms-TextField ms-TextField--underlined';
	row.append(inputWrap);
	
	const label = document.createElement('label');
	label.className = 'ms-Label TextInputLabel';
	inputWrap.append(label);

	const input = document.createElement('input');
	input.type = 'text';
	input.className = 'ms-TextField-field TextInputInput';
	input.value = value;
	if(action!==undefined) { input.addEventListener('focusout',actionCallback(action,input)); }
	inputWrap.append(input);
	
	new fabric['TextField'](inputWrap);
	
	if(hint!==undefined) {
		const bottomLabel = document.createElement('label');
		bottomLabel.className = 'ms-fontSize-s TextInputBottomLabel';
		bottomLabel.textContent = hint;
		row.append(bottomLabel);
	}
}

//Emulate Class SelectionInput extending base Class Widget for CardService service;
class SelectionInput extends Widget {
	constructor() {
		super();
		this.className = 'SelectionInput';
		this.fieldName;
		this.action;
		this.title;
		this.type = CardService.SelectionInputType.CHECK_BOX;
	}
}
//chain SelectionInput to Widget base class;
SelectionInput.prototype = Object.create(Widget.prototype);
//add new methods to the class;
SelectionInput.prototype.addItem = function (text, value, selected) {
	
}
SelectionInput.prototype.setFieldName = function (fieldName) {
	this.fieldName = fieldName;
	return this;
}
SelectionInput.prototype.setOnChangeAction = function (action) {
	this.action = action;
	return this;
}
SelectionInput.prototype.setTitle = function (title) {
	this.title = title;
	return this;
}
SelectionInput.prototype.setType = function (type) {
	this.type = type;
	return this;
}
SelectionInput.prototype.appendToUi = function (parent) {
	const fieldName = this.fieldName;
	const action    = this.action;
	const title     = this.title;
	const type      = this.type;
	
	const widget = document.createElement('div');
	widget.className = 'row '+this.className;
	parent.append(widget);
	
	const row = document.createElement('div');
	row.className = 'column';
	widget.append(row);
	
	if(title!==undefined) {	
		const topLabel = document.createElement('label');
		topLabel.className = 'ms-fontSize-s SelectionInputTopLabel';
		topLabel.textContent = title;
		row.append(topLabel);
	}
	
	//SelectionInput Ui
	switch(type) {
		case 'CHECK_BOX':
			
			break;
		case 'RADIO_BUTTON':
			
			break;
		case 'DROPDOWN':
			
			break;
	}

}

//Emulate Class TextButton extending base Class Button for CardService service;
class TextButton extends Button {
	constructor() {
		super();
		this.className = 'TextButton';
		this.backgroundColor;
		this.text;
		this.disabled;
		this.textButtonStyle;
	}
}
//chain TextButton to Button base class;
TextButton.prototype = Object.create(Button.prototype);
//add new methods to the class;
TextButton.prototype.setDisabled = function (disabled) {
	this.disabled = disabled;
	return this;
};
TextButton.prototype.setText = function (text) {
	this.text = text;
	return this;
};
TextButton.prototype.setTextButtonStyle = function (textButtonStyle) {
	this.textButtonStyle = textButtonStyle;
	return this;
};
TextButton.prototype.appendToUi = function (parent) {
	const backgroundColor = this.backgroundColor;
	const text = this.text;
	const disabled = this.disabled;
	const textButtonStyle = this.textButtonStyle;
	const action = this.action;	
	const openLink = this.openLink;
	
	const btnRow = document.createElement('div');
	btnRow.className = 'row '+this.className;
	parent.append(btnRow);
	
	const wrapBtn = document.createElement('div');
	wrapBtn.className = 'column';
	btnRow.append(wrapBtn);
	
	const button = document.createElement('button');
	button.disabled = disabled;
	if(disabled) {
		button.className = 'ms-Button ms-Button--small '+this.className;
	}else {
		button.className = 'ms-Button ms-Button--small ms-Button--primary '+this.className;
	}
	wrapBtn.append(button);
		
	const btnContent = document.createElement('span');
	btnContent.className = 'ms-Button-label';
	btnContent.textContent = text;
	button.append(btnContent);
	
	if(openLink===undefined) {
		new fabric['Button'](button, actionCallback(action,button) );	
	}else {
		new fabric['Button'](button, function(){
			Office.context.ui.displayDialogAsync(openLink.url);
		} );
	}
}

//Emulate Class Image extending base Class Button for CardService service;
class Image extends Button {	
	constructor() {
		super();
		this.className = 'Image';
		this.altText;
		this.url;
	}
}
//Chain Class Image to Button base class;
Image.prototype = Object.create(Button.prototype);
//add new methods to the class;
Image.prototype.setAltText = function (altText) {
	this.altText = altText;
	return this;
}
Image.prototype.setImageUrl = function (url) {
	this.url = url;
	return this;
}

//Emulate Class ImageButton extending base Class Button for CardService service;
class ImageButton extends Button {
	constructor() {
		super();
		this.altText;
		this.icon;
		this.url;
	}
}
//chain ImageButton to Button base class;
ImageButton.prototype = Object.create(Button.prototype);
//add new methods to the class;
ImageButton.prototype.setAltText = function (altText) {
	this.altText = altText;
	return this;
}
ImageButton.prototype.setIcon = function (icon) {
	this.icon = icon;
	return this;
}
ImageButton.prototype.setIconUrl = function (url) {
	this.url = url;
	return this;
}

//Emulate Class KeyValue extending base Class Button for CardService service;
class KeyValue extends Button {
	constructor() {
		super();
		this.className = 'KeyValue';
		this.button;
		this.content;
		this.icon;
		this.altText;
		this.url;
		this.multiline;
		this.switchToSet;
		this.topLabel;
	}
}
//Chain Class Image to Button base class;
KeyValue.prototype = Object.create(Button.prototype);
//add new methods to the class;
KeyValue.prototype.setButton = function (button) {
	this.button = button;
	return this;
}
KeyValue.prototype.setContent = function (text) {
	this.content = text;
	return this;
}
KeyValue.prototype.setIcon = function (icon) {
	this.icon = icon;
	return this;
}
KeyValue.prototype.setIconUrl = function (url) {
	this.url = url;
	return this;
}
KeyValue.prototype.setIconAltText = function (altText) {
	this.altText = altText;
	return this;
}
KeyValue.prototype.setMultiline = function (multiline) {
	this.multiline = multiline;
	return this;
}
KeyValue.prototype.setSwitch = function (switchToSet) {
	this.switchToSet = switchToSet;
	return this;
}
KeyValue.prototype.setTopLabel = function (text) {
	this.topLabel = text;
	return this;
}
KeyValue.prototype.appendToUi = function (parent,index) {
	const widget = document.createElement('div');
	widget.className = 'row '+this.className;
	widget.tabindex = index;
	parent.append(widget);
	
	if(this.action!==undefined) {
		const action = this.action;
		widget.addEventListener('click',actionCallback(action));
	}
	
	//handle image creation;
	if(this.url!==undefined) {
		const wrapImg = document.createElement('div');
		wrapImg.className = 'column-icon';
		widget.append(wrapImg);
		
		const img = document.createElement('img');
		img.className = 'KeyValueImage';
		img.src = this.url;
		if(this.altText!==undefined) { img.alt = this.altText; }
		wrapImg.append(img);
	}
	
	//handle label and content creation;
	const wrapText = document.createElement('div');
	wrapText.className = 'column-text';
	widget.append(wrapText);
	
	if(this.topLabel!==undefined) {	
		const label = document.createElement('label');
		label.className = 'ms-fontSize-s KeyValueLabel';
		label.textContent = this.topLabel;
		wrapText.append(label);
	}
	const content = document.createElement('span');
	content.className = 'ms-font-m-plus KeyValueText';
	content.textContent = this.content;
	wrapText.append(content);
	
	//handle button or switch creation;
	const btn = this.button;
	const sw  = this.switchToSet;
	
	if(btn!==undefined||sw!==undefined) {
		const wrapButton = document.createElement('div');
		wrapButton.className = 'column';
		widget.append(wrapButton);	
	
		if(btn!==undefined) {
			const backgroundColor = btn.backgroundColor;
			const text 			  = btn.text;
			const disabled 		  = btn.disabled;
			const textButtonStyle = btn.textButtonStyle;
			const action		  = btn.action;
			
			const button = document.createElement('button');
			button.disabled = disabled;
			if(disabled) {
				button.className = 'ms-Button ms-Button--small '+btn.className;
			}else {
				button.className = 'ms-Button ms-Button--small ms-Button--primary '+btn.className;
			}
			wrapButton.append(button);
				
			const btnContent = document.createElement('span');
			btnContent.className = 'ms-Button-label';
			btnContent.textContent = text;
			button.append(btnContent);
				
			new fabric['Button'](button, actionCallback(action,button) );
		}
		
		if(sw!==undefined) {
			sw.appendToUi(wrapButton);
		}
		
	}
}

//Emulate Class CardAction extending base Class Button for CardService service;
class CardAction extends Button {
	constructor() {
		super();
		this.className = 'CardAction';
		this.text;
	}
}
//chain TextButton to Button base class;
CardAction.prototype = Object.create(Button.prototype);
//add new methods to the class;
CardAction.prototype.setText = function (text) {
	this.text = text;
	return this;
};

//Emulate Class Action for CardService service;
class Action extends e_CardService {
	constructor() {
		super();
		this.className = 'Action';
		this.functionName;
		this.loadIndicator;
		this.parameters;
	}
}
//add new methods to the class;
Action.prototype.setFunctionName = function (functionName) {
	this.functionName = functionName;
	return this;
}
Action.prototype.setLoadIndicator = function (loadIndicator) {
	this.loadIndicator = loadIndicator;
	return this;
}
Action.prototype.setParameters = function (parameters) {
	this.parameters = parameters;
	return this;
}

//Emulate Class OpenLink extending Class Action for CardService service;
class OpenLink extends Action {
	constructor() {
		super();
		this.className = 'OpenLink';
		this.url;
		this.onClose;
		this.openAs;
	}
}
//add new methods to the class;
OpenLink.prototype.setUrl = function (url) {
	this.url = url;
	return this;	
}
OpenLink.prototype.setOnClose = function (onClose) {
	this.onClose = onClose;
	return this;
}
OpenLink.prototype.setOpenAs = function (openAs) {
	this.openAs = openAs;
	return this;
}

//Emulate Class ActionResponseBuilder extending _CardService service;
class ActionResponseBuilder extends e_CardService {
	constructor() {
		super();
		this.navigation;
		this.notification;
		this.openLink;
		this.stateChanged = false;
	}
}
//add new methods to the class;
ActionResponseBuilder.prototype.setNavigation = function (navigation) {
	this.navigation = navigation;
	return this;	
}
ActionResponseBuilder.prototype.setNotification = function (notification) {
	this.notification = notification;
	return this;	
}
ActionResponseBuilder.prototype.setOpenLink = function (openLink) {
	this.openLink = openLink;
	return this;	
}
ActionResponseBuilder.prototype.setStateChanged = function (stateChanged) {
	this.stateChanged = stateChanged;
	return this;	
}
ActionResponseBuilder.prototype.build = function () {
	const notif = this.notification;
	if(notif!==undefined) {
		const ui = $('#main-Ui-wrap');
		notif.appendToUi(ui);
		return this;
	}
}

//Emulate Class Notification for CardService service;
class Notification extends e_CardService {
	constructor() {
		super();
		this.text;
		this.type;
	}
}
//add new methods to the class;
Notification.prototype.setText = function (text) {
	this.text = text;
	return this;
}
Notification.prototype.setType = function (type) {
	this.type = type;
	return this;
}
Notification.prototype.appendToUi = function (/*parent*/) {
	const type = this.type;
	const text = this.text;
	const parent = $('#app-notif');
	parent.empty();
	//message bar;
	const notification = document.createElement('div');
	notification.className = 'ms-MessageBar';
	parent.append(notification);
	//message bar content;
	const content = document.createElement('div');
	content.className = 'ms-MessageBar-content';
	notification.append(content);
	//message bar icon;
	const icon = document.createElement('div');
	icon.className = 'ms-MessageBar-icon';
	content.append(icon);
	//message bar icon content;
	const icontent = document.createElement('i');
	icontent.className = 'ms-Icon';
	icon.append(icontent);
	//message bar text;
	const txt = document.createElement('div');
	txt.className = 'ms-MessageBar-text';
	txt.textContent = text;
	content.append(txt);
	
	if(type==='INFO') {
		icontent.classList.add('ms-Icon--Info');		
	}else if(type==='ERROR') {
		notification.classList.add('ms-MessageBar--error');
		icontent.classList.add('ms-Icon--ErrorBadge');		
	}else if(type==='WARNING') {
		notification.classList.add('ms-MessageBar--warning');
		icontent.classList.add('ms-Icon--Info');
	}
	
	window.setTimeout(function(){
		notification.remove();
	},3000);
	
}

//Emulate CacheService service;
class e_CacheService {
	constructor() {
		this.className = 'CacheService';
	}
}
//add new methods to the class;
e_CacheService.prototype.getDocumentCache = function () {
	//future releases;
	return this;
}
e_CacheService.prototype.getScriptCache = function () {
	const storage = window.sessionStorage;
	return storage;
}
e_CacheService.prototype.getUserCache = function () {
	//future releases;
	return this;
}
//===========================================END APPS SCRIPT===========================================//

//===========================================START URL FETCH===========================================//
//Emulate HTTPResponse class;
class HTTPResponse {
	constructor(headers,content,code) {
		this.className = 'HTTPResponse';
		this.headers = headers;
		this.content = content;
		this.code    = code;
	}
}
//add new methods to the class;
HTTPResponse.prototype.getHeaders = function () {
	return this.headers;
}
HTTPResponse.prototype.getAs = function (contentType) {
	//future release;
}
HTTPResponse.prototype.getContentText = function () {
	return this.content.toString();
}
HTTPResponse.prototype.getResponseCode = function () {
	return this.code;
}

//Emulate UrlFetchApp service;
class e_UrlFetchApp {
	constructor() {
		this.className = 'UrlFetchApp';
	}
}
e_UrlFetchApp.prototype.fetch = function (url,params) {
	let promise = makeRequest(url,params);
	return promise;
}

function makeRequest(url,params) {
	return new Promise(function (resolve,reject) {
		let request = new XMLHttpRequest();
			request.timeout = 29000;
			request.open(params.method.toUpperCase(),url);
		if(params.contentType!==undefined) { request.setRequestHeader('Content-Type',params.contentType); }
			
		request.onload = function () {
			let status     = request.status;
			let response   = request.response;
			let headers    = request.getAllResponseHeaders().trim().split(/[\r\n]+/);
			let map = {};
			headers.forEach(function (header) {
			  let data = header.split(': ');
			  let name = data.shift();
			  let value = data.join(': ');
			  map[name] = value;
			});
			let obj = {
				code: status,
				content: response,
				headers: map
			};
			
			if(status>=200&&status<300) {	
				resolve(obj);
			}else {
				reject(obj);
			}
		}
			
		request.ontimeout = function () {
			let statusText = request.statusText; 
			resolve(statusText);
		}
		
		if(params.payload!==undefined) {
			request.send(params.payload);
		}else {
			request.send();
		}	
	});
}
//===========================================END URL FETCH===========================================//

//initiate services to be able to access them;
const UrlFetchApp       = new e_UrlFetchApp();
const CardService       = new e_CardService();
const PropertiesService = new e_PropertiesService();
const CacheService      = new e_CacheService();
const e                 = new e_EventObject();
