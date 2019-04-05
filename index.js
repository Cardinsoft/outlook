// The initialize function must be run each time a new page is loaded;
Office.initialize = (reason) => {
	$(document).ready(function () {
		
		deleteProperty('config','user');
		
		cardOpen(e);
		
		$('#home').click(function(){
			universalHome(e);
		});
		
		$('#settings').click(function(){
			universalSettings(e);
		});
		
		$('#help').click(function(){
			universalHelp(e);
		});
		
		$('#app-body').show();
		
		Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged,cardOpen);
	
	});
};

//===========================================START CARD===========================================//
/**
 * Creates and shows card with Connector add form;
 * @param {Object} e event object; 
 * @returns {Card}
 */
function cardCreate(e) {
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
  if(type.short) {
    createDescriptionSection(builder,false,type.short);
  }
  
  //create section with custom icon URL input;
  if(type.allowCustomIcons==='true') {
    createCustomIconsSection(builder,false);
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
 * Creates and shows card with Connector update form;
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
    if(cType.login) { connector.login = cType.login(connector); }
    
    createSectionAuth(builder,connector,cAuth);
  }
  
  //access type's basic and advanced config;
  var widgets  = new Connector(icon,name,url).basic.widgets;
  var advanced = cType.config;
  
  //extend basic with advanced and create config section;
  advanced.forEach(function(c){
    mergeObjects(widgets,c.widgets);
  });

  //create section with custom icon URL input;
  if(cType.allowCustomIcons===true) {
    createCustomIconsSection(builder,false,connector.icon);
  }
  
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
async function cardDisplay(e) {
  var builder = CardService.newCardBuilder();

  //get required parameters;
  var connector  = e.parameters;
  var code       = +connector.code;
  var url        = connector.url;
  var content    = connector.content;
  var manual     = connector.manual;
  var isDefault  = connector.isDefault;
  var type       = connector.type;
  var authType   = connector.auth;
  
  //get optional parameters;
  var error      = connector.error;
  var start      = connector.start;
  
  //e.parameters accepts only strings;
  if(manual==='true')    { manual = true;    }else if(manual==='false')    { manual = false; }
  if(isDefault==='true') { isDefault = true; }else if(isDefault==='false') { isDefault = false; }
  
  //access current message object;
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

  //try to display content or show unparsed data if error;
  try {
    if(content.length!==0) {
      
      //check if there are any nested objects or not;
      var hasNested = checkNested(content);
      if(hasNested) {
      
        //get maximum number of widgets for each section;
        var layout = getLayout(content);
        
        for(var j=0; j<content.length; j++) {
      
          var section = content[j];
          if(typeof section==='string') { section = JSON.parse(section); }

          try {
            createSectionAdvanced(builder,section,j,connector,layout[j]); 
          }
          catch(er) {
            //try to handle nested objects that do not conform to our schema;
            createSectionSimple(builder,section,true,j);
          }
        }
       
        var hasEditable = checkEditable(content);
        if(hasEditable) {
        
          //stringify connector properties;
          connector = propertiesToString(connector); 
          
          var updateButton = textButtonWidget(globalUpdateShowText,false,false,'updateSectionAdvanced',connector);
          var updateSection = CardService.newCardSection();
              updateSection.addWidget(updateButton);
          builder.addSection(updateSection);
          
        }
 
      }else {
        
        //get parameters for extra data;
        var bm    = getBeginMax(content,start);
        var full  = bm.full;
        var begin = bm.begin;
        var max   = bm.max;
        var cap   = bm.cap;
        
        //create simple sections;
        for(var j=begin; j<content.length; j++) {        
          if(j===max) { break; }
          var result = content[j];
          if(content.length!==1) {
            createSectionSimple(builder,result,true,j);
          }else {
            createSectionSimple(builder,result,false,j);
          }
        }
        
        var length = content.length;
        var diff = max-begin;
        
        //if length is greater than cap, append extra data section;
        if(full>cap) {
          var end = length-1;
          if(length>max||length+diff-1===max) {
            var prev = (begin-diff);
            createExtraDataSection(builder,false,end,prev,max,content,connector);
          }
        }
        
        
      }
    }else if(!error) {
      createNoFieldsSection(builder,false,msg);
    }
  }
  catch(err) {
    //handle data that failed to comply to JSON schema;
    console.error(err);
    createUnparsedSection(builder,true,err.message,JSON.stringify(content));
  }
  
  //access Connector config and get its index;
  var config = await getProperty('config','user');
  var index  = getIndex(config,connector);
    
  //filter out current Connector;
  config = config.filter(function(c,i){ if(i!==+index) { return c; } });
    
  //create Connectors representation for those that are left;
  if(config.length!==0) {
    createConnectorListSection(builder,true,globalConnectorListHeader,config,msg);
  }
  
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
  
  //get message object;
  var msg = getToken(e);  
  
  try {
    var hasDefault = config.some(function(conn){ if(conn.isDefault===true||conn.isDefault==='true') { return conn; } });
    
    if(hasDefault) {
      //fetch default connector from config;
      var def = config.filter(function(conn){ if( conn.isDefault!==false && conn.isDefault ) { return conn; } })[0];
      
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
        if(cAuth.hint)    { params.hint = cAuth.hint; }
        if(cAuth.offline) { params.offline = cAuth.offline; }
        if(cAuth.prompt)  { params.prompt = cAuth.prompt; }
        
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
        if(def.hint)    { params.hint = def.hint; }
        if(def.offline) { params.offline = def.offline; }
        if(def.prompt)  { params.prompt = def.prompt; }
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
      //check if any Connectors configured;
      if(config.length===0) {
        
        //create card header and set icon and title on FTE;
        var header = CardService.newCardHeader();
            header.setImageUrl(globalCardinIconUrl);
            header.setTitle(globalWelcomeHeader);
            builder.setHeader(header);
        
        //build welcome, types and settings section on FTE;
        createSectionWelcome(builder,false);
        createSectionChooseType(builder,false,globalChooseTypeHeader);
        createSectionHelp(builder,false);
        
      }else {
      
        //build section with a list of configured Connectors;
        try {
          createConnectorListSection(builder,false,'',config,msg);
        }
        catch(er) {
          //log error to stackdriver and build Connectors list error section;
          console.error('An error occured during Connector list generation: %s', er);
          createConfigErrorSection(builder,false,globalErrorHeader,'',globalConnectorListErrorContent);
        }
        
      }
      
      return builder.build();
    }
  
  }
  catch(error) {
    //log error to stackdriver and build config error section;
    console.error(error);
    createConfigErrorSection(builder,false,globalConfigErrorHeader,globalConfigErrorWidgetTitle,globalConfigErrorWidgetContent);
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
 * Creates section promping user to authorize the Connector;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Object} connector connector object;
 * @param {String} error error message to set to title;
 * @returns {CardSection}
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
        if(connector.hint)    { custom.hint = connector.hint; }
        if(connector.offline) { custom.offline = connector.offline; }
        if(connector.prompt)  { custom.prompt = connector.prompt; }
        createWidgetOpenAuth(section,globalOpenAuthText,auth,custom);
      }
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
 * Creates section with a list of configured Connectors to display;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @param {Array} config an array of Connector settings objects;
 * @param {GmailMessage} msg current meassge object;
 * @returns {CardSection}
 */
function createConnectorListSection(builder,isCollapsed,header,config,msg) {

  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set additional parameters;
  if(header!=='') { section.setHeader(header); }
  if(isCollapsed) { section.setNumUncollapsibleWidgets(globalNumUncollapsibleList); }
  
  //add Connectors representation;
  config.forEach(function(connector){
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

    if(Object.keys(cAuth).length!==0) {
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
    
    if(!manual) {
      //perform request and parse response if connector is not manual;
      try { var response = cType.run(msg,connector); }
      catch(error) {
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
  });
      
  //append section and return it;   
  builder.addSection(section);   
  return section;
}


/**
 * Creates section with a list of configured Connectors to edit;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Array} config an array of Connector settings objects;
 * @returns {CardSection} 
 */
function createConfiguredConnectorsSection(builder,isCollapsed,config) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
      section.setHeader(globalConfigListHeader);
      
  //set additional parameters;
  if(isCollapsed) { section.setNumUncollapsibleWidgets(globalNumUncollapsible); }
      
  try {
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
 * @returns {CardSection}
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
 * @returns {CardSection}
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
 * @param {GmailMessage} msg current meassge object;
 * @returns {CardSection} 
 */
function createNoFieldsSection(builder,isCollapsed,msg) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
      section.setHeader(globalNoDataWidgetTitle);
   
  //create KeyValue widget prompting user that no data is available;
  var trimmed = trimMessage(msg,true,true);
  var prompt  = globalNoDataWidgetContent+' '+trimmed.first+' '+trimmed.last+'\r<b>'+trimmed.email+'</b>';
  
  var noData = simpleKeyValueWidget('',prompt,true);
  section.addWidget(noData);
  
  //append section and return it;
  builder.addSection(section);
  return section;
}


/**
 * Creates section containing buttons for going back and/or to root card;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} index connector index;
 * @returns {CardSection}  
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
 * @returns {CardSection}
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
 * @returns {CardSection} 
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
 * @returns {CardSection}  
 */
function createErrorSection(builder,isCollapsed,code,error) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
      section.setNumUncollapsibleWidgets(1);
  
  //initiate error title and content;
  var header = '', content = '';
  
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
    }
    
  
  }else {
    //extra error-specific info - for future release;
  }
  
  //set section's header;
  section.setHeader(header);
  
  //create error description widget;
  var description = simpleKeyValueWidget('',content,true);
  section.addWidget(description);
  
  //create error information widget;
  var additional = simpleKeyValueWidget(globalErrorWidgetTitle,error,true);
  section.addWidget(additional);

  //add section and return;
  builder.addSection(section);
  return section;
}


/**
 * Creates section with authorization and revoke buttons;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} connector connector configuration object;
 * @param {Object} auth section auth config object;
 * @returns {CardSection} 
 */
function createSectionAuth(builder,connector,auth) {
  var section = CardService.newCardSection();
  
  var authText = textWidget(globalAuthTextWidgetContent);
  section.addWidget(authText);
  
  if(auth!==undefined) {
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
 * Creates section with a number of custom field inputs;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {Integer} numFileds number of custom field inputs to create;
 * @param {Object} connector connector config object;
 * @returns {CardSection} 
 */
function createSectionFields(builder,isCollapsible,numFields,connector) {
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setHeader('Custom fields');
  
  //set optional parameters;
  if(isCollapsible) { section.setCollapsible(isCollapsible); }
  
  //create widget for custom fields prompt;
  createWidgetFieldsText(section,globalOptionalFieldsContent);
  
  //if number of fields not provided, default to 3;
  if(!numFields) { numFields = 3; }
  
  //create fields up to max number;
  for(var i=1; i<=numFields; i++) {
    var name = 'field'+i;
    
    var value;
    if(connector) {
     value = connector[name];
    }
    
    createWidgetCustomInput(section,name,name,'Custom connector fields',value);
  }
  
  //add section and return;
  builder.addSection(section);
  return section;
}


/**
 * Creates section from widgets config;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Object} config section config object;
 * @returns {CardSection}
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
        case 'TextButton':
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
          if(action===globalTextButtonActionClick) {
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
          
          //default to multiline if nothing is set;
          if(!isMultiline) { isMultiline = true; }
          
          //default to no icon if nothing is set;
          if(!iconUrl) { iconUrl = ''; }
          
          //set Switch or TextButton to widget if provided;
          if(switchValue) {
            element = switchWidget(title,content,name,switchValue,switchValue);
          }else if(buttonText) {
              var button = textButtonWidget(buttonText,true,false);
              element = simpleKeyValueWidget(title,content,isMultiline,iconUrl,button);
          }else {
              element = simpleKeyValueWidget(title,content,isMultiline,iconUrl);
          }
          
          break;
        case 'TextInput':
          //access TextInput-specific params;
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
 * @returns {CardSection} 
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
      var widget = simpleKeyValueWidget(key,data[key],false);
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
 * @returns {CardSection}
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
              //access TextButton-specific params;
              var disabled  = widget.disabled;
              var filled    = widget.filled;
              var fullsized = widget.fullsized;
              var reload    = widget.reload;
              var action    = widget.action;
              var funcName  = widget.funcName;
              var colour    = widget.colour;
              
              //set button text colour if provided;
              if(colour) { title = '<font color="'+colour+'">'+title+'</font>'; }
            
              //build either a clickable or a linked button;
              if(action===globalTextButtonActionClick) {
                element = textButtonWidget(title,disabled,filled,content);
              }else if(action===globalTextButtonActionAction) {
                element = textButtonWidgetLinked(title,disabled,filled,content,fullsized,reload,true,funcName);
              }else {
                element = textButtonWidgetLinked(title,disabled,filled,content,fullsized,reload);
              }
          
              break;
            case 'KeyValue':
              //access KeyValue-specific params;
              var isMultiline = widget.isMultiline;
              var switchValue = widget.switchValue;
              var buttonText  = widget.buttonText;
              
              //default to multiline;
              if(!isMultiline) { isMultiline = true; }
             
              //default to no icon;
              if(!icon) { icon = ''; }
              
              //set Switch or TextButton to widget if provided;
              if(switchValue) {
                element = switchWidget(title,content,name,switchValue,switchValue);
              }else {
              
                //set section and widget index and stringify;
                connector.sectionIdx = sectionIndex;
                connector.widgetIdx  = index;
                connector = propertiesToString(connector);
              
                if(buttonText) {
                  var button = textButtonWidget(buttonText,true,false);
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
      
      }
      
    });
    //append section and return it;
    builder.addSection(section);
    return section;
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
  
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(header) { section.setHeader(header); }
  
  //create class instance to get config data;
  //var quickbooks = new QB();
  var sheets     = new Sheets();
  var flow       = new Flow();
  var pipedrive  = new Pipedrive();
  
  //var infusion = new InfusionSoft(); //future release due to endpoint app approval issue;
  
  //create an array of used types;
  var types = [sheets,flow,pipedrive];
  
  //add github conn if in testing mode;
  if(globalIncludeGitHub) {
    var github = new GitHub();
    types.push(github);
  }
  
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
 * @returns {CardSection} 
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
 * @returns {CardSection} 
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
 * @returns {CardSection}
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
 * @returns {CardSection}
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
 * Creates section for advanced settings;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection}
 */
function createAdvanced(builder,isCollapsed,header) {
  
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
 * Creates section for welcome info;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection}
 */
function createSectionWelcome(builder,isCollapsed,header) {
 
  //create section and set required parameters;
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  
  //set optional parameters;
  if(header) { section.setHeader(header); }
  
  //create FTU prompt;
  createWidgetWelcomeText(section);
  
  //append section and return it;
  builder.addSection(section);
  return section;
}


/**
 * Creates section for help info;
 * @param {CardBuilder} builder card builder to append section to;
 * @param {Boolean} isCollapsed truthy value to determine whether to generate section as collapsible;
 * @param {String} header section header text;
 * @returns {CardSection} 
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
//=============================================END SECTIONS============================================//

//===============================================WIDGETS===============================================//
/**
 * Creates KeyValue widget with 401 code and text explaining further actions;
 * @param {CardSection} section section to append widget sets;
 * @param {String} content widget content or value;
 * @param {Integer} code response status code;
 * @returns {KeyValue}
 */
function createWidgetNotAuthorized(section,content,code) {
  //create widget;
  var widget = simpleKeyValueWidget(code,content,true);
  
  //append to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates KeyValue widget with text explaining auth type mismatch;
 * @param {CardSection} section section to append widget sets;
 * @param {String} content widget content or value;
 * @returns {KeyValue}
 */
function createWidgetAuthTypeErr(section,content) {
  //create widget with authorization error prompt;
  var widget = simpleKeyValueWidget(globalAuthTypeErrorTitle,content,true);
  
  //append to section and return;
  section.addWidget(widget);
  return widget;  
}


/**
 * Creates TextButton widget with action set to open Auth link;
 * @param {CardSection|ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} parameters authorization config object;
 * @returns {TextButton}
 */
function createWidgetOpenAuth(builder,text,parameters) { 
  //create auth service;
  var service = authService(parameters);
  
  //create widget for initiating authorization flow;
  var widget = textButtonWidgetAuth(text,false,false,service.getAuthorizationUrl(parameters));
  
  //append button or add to ButtonSet and return it;
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
  return widget;
}


/**
 * Creates TextButton widget with action set to revoke Auth;
 * @param {CardSection|ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} parameters authorization config object;
 * @returns {TextButton}
 */
function createWidgetRevoke(builder,text,parameters) {
  //create auth service;
  var service = authService(parameters);
  
  //check if service does not have access;
  var disableRevoke = !service.hasAccess();
 
  //create widget for revoking authorization;
  var widget  = textButtonWidget(text,disableRevoke,false,'revokeAuth',parameters);
  
  //append button or add to ButtonSet and return it;
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
  return widget;
}


/**
 * Creates TextButton widget with action set to open login link;
 * @param {CardSection|ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {String} url URL to open link text;
 * return {TextButton}
 */
function createWidgetLogin(builder,text,url) { 
  
  //create TextButton widget to open login link;
  var widget = textButtonWidgetLinked(text,false,false,url,false,false);
  
  //append button or add to ButtonSet and return;
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
  return widget;
}


/**
 * Creates KeyValue widget for prompting user that this is a first-time use;
 * @param {CardSection} section section to append widget sets;
 * @returns {KeyValue}
 */
function createWidgetWelcomeText(section) {
  
  //create KeyValue widget with welcome prompt;
  var widget = simpleKeyValueWidget(globalWelcomeWidgetTitle,globalWelcomeWidgetContent,true);
  
  //append widget to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates KeyValue widget for help card section;
 * @param {CardSection} section section to append widget sets;
 * @returns {KeyValue}
 */
function createWidgetHelpText(section) {

  //create KeyValue widget with help prompt;
  var widget = simpleKeyValueWidget(globalHelpWidgetTitle,globalHelpWidgetContent,true);
  
  //append widget to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates TextButton widget for Cardin homepage link open;
 * @param {CardSection} section section to append widget sets;
 * @returns {TextButton}
 */
function createWidgetGoToCardin(section) {

  //create TextButton widget with Cardinsoft authorized domain link;
  var widget = textButtonWidgetLinked(globalCardinUrlText,false,false,globalCardinUrl,false,false);
  
  //append widget to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates widget for diplaying hint for optional fields usage;
 * @param {CardSection} section section to append widget sets;
 * @param {String} text text to diplay on widget;
 * @returns {TextParagraph}
 */
function createWidgetFieldsText(section,text) {
  
  //create TextParagraph with teext provided;
  var widget = textWidget(text);
  
  //add widget to section and return it;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates widget for displaying prompt that Connector allows custom icons;
 * @param {CardSection} section section to append widget sets;
 * @param {String} title title text of the widget; 
 * @param {String} content content text to diplay;
 * @returns {TextParagraph}
 */
function createWidgetCustomIconPrompt(section,title,content) {
  
  //create KeyValue widget for prompt;
  var widget = simpleKeyValueWidget(title,content,true);
  
  //append widget to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates TextInput widget with custom field name and content;
 * @param {CardSection} section section to append widget sets;
 * @param {String} fieldName field name for the formInput to use;
 * @param {String} title title text of the widget; 
 * @param {String} hint text that appears on the input;
 * @param {String} content content text to diplay;
 * @returns {TextInput}
 */
function createWidgetCustomInput(section,fieldName,title,hint,content) {
  
  //default to empty content if none provided;
  if(!content) { content = ''; }
  
  //create TextInput 
  var widget = textInputWidget(title,fieldName,hint,content);
  
  //append widget to section and return;
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

  //access parameters in type;
  var params = {
    'basic': JSON.stringify(type.basic),
    'config': JSON.stringify(type.config),
    'type': type.name,
    'icon': type.icon,
    'name': type.name
  };
  if(type.short) { params.short = type.short; }
  
  //if type allows custom icons -> pass to params;
  if(type.allowCustomIcons) {
    params.allowCustomIcons = type.allowCustomIcons.toString();
  }
  
  //if type has authorization -> pass to params;
  if(type.auth) { params.auth = JSON.stringify(type.auth); }
  
  //create KeyValue widget with Connector creation card display action;
  var widget = actionKeyValueWidget(type.icon,'',type.name,'cardCreate',params);
  
  //append widget to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates TextButton widget for Connector creation;
 * @param {CardSection} section section to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} type Connector type object;
 * @returns {TextButton}
 */
function createWidgetCreateConnector(section,text,type) {
  
  //stringify type configuration;
  type = propertiesToString(type);

  //create TextButton widget with Connector creation action;
  var widget = textButtonWidget(text,false,false,'createConnector',type);
  
  //append widget to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates TextButton widget for Connector update;
 * @param {CardSection|ButtonSet} builder section or button set to append to;
 * @param {String} text text to appear on the button;
 * @param {Object} connector Connector object;
 * @returns {TextButton}
 */
function createWidgetUpdateConnector(builder,text,connector) {
  
  //stringify Connector configuration;
  connector = propertiesToString(connector);
  
  //create TextButton widget with Connector update action;
  var widget = textButtonWidget(globalUpdateConnectorText,false,false,'updateConnector',connector);
  
  //append button to section or to ButtonSet and return;
  try{ builder.addWidget(widget); }
  catch(error) { builder.addButton(widget); }
  return widget;
}


/**
 * Creates TextButton widget for connector removal;
 * @param {CardSection|ButtonSet} builder section or button set to append widget sets;
 * @param {String} text text to appear on the button;
 * @param {Object} connector connector object;
 * @returns {TextButton}
 */
function createWidgetRemoveConnector(builder,text,connector) {
  
  //stringify Connector configuration;
  connector = propertiesToString(connector);

  //set confirmation procedure;
  connector.cancelAction  = 'actionEdit';
  connector.confirmAction = 'removeConnector';
  connector.prompt        = globalConfirmRemoveWidgetContent;

  //create TextButton widget with Connector removal action;
  var widget = textButtonWidget(globalRemoveConnectorText,false,false,'actionConfirm',connector);
  
  //append button to section or to ButtonSet and return;
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
  
  //create KeyValue widget with type short description;
  var widget = simpleKeyValueWidget(title,content,true);
  
  //append to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates KeyValue widget with reset feature prompt;
 * @param {CardSection} section section to append widget sets;
 * @returns {KeyValue}
 */
function createWidgetResetText(section) {
  
  //create KeyValue widget with reset prompt;
  var widget = simpleKeyValueWidget(globalResetWidgetTitle,globalResetWidgetContent,true);
  
  //append to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates TextButton widget that performs full reset when clicked;
 * @param {CardSection} section section to append widget sets;
 * @returns {TextButton}
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
  
  //create TextButton widget with full reset action set;
  var widget = textButtonWidget(globalResetWidgetSubmitText,false,false,'actionConfirm',params);
  
  //append to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates SelectionInput widget for choosing authentication type (none and OAuth2 for now);
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isEdit truthy value to determine which card to reload;
 * @param {String} selected value that should be selected;
 * @returns {SelectionInput}
 */
function createWidgetChooseAuth(section,isEdit,selected) {
  
  //set auth options config;
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
  if(selected) {
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
  
  //create SelectionInput with Auth choice options;
  var widget = selectionInputWidget(globalCustomWidgetAuthText,'auth',globalEnumRadio,options,'chooseAuth',true,{'isEdit':isEdit.toString()});
  
  //append to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates Switch widget for setting connector to be invoked manually;
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isManual truthy value to determine invoking manually;
 * @returns {Switch} 
 */
function createWidgetSwitchManual(section,isManual) {
  
  //parse stringified boolean parameters;
  if(isManual===undefined||isManual==='true') { isManual = true; }else if(isManual==='false') { isManual = false; }
  
  //create Switch for manual / auto behaviour choice;
  var widget = switchWidget('',globalCustomWidgetSwitchText,globalManualFieldName,isManual,true);
  
  //append to section and return;
  section.addWidget(widget);
  return widget;
}


/**
 * Creates Switch widget for setting connector to be loaded by default;
 * @param {CardSection} section section to append widget sets;
 * @param {Boolean} isDefault truthy value to determine loading by default;
 * @returns {Switch}
 */
function createWidgetSwitchDefault(section,isDefault) {
  
  //parse stringified boolean parameters;
  if(isDefault===undefined||isDefault==='false') { isDefault = false; }else if(isDefault==='true') { isDefault = true; }
  
  //create Switch for default / listed behaviour choice;
  var widget = switchWidget('',globalIsDefaultWidgetSwitchText,globalDefaultFieldName,isDefault,true);
  
  //append to section and return;
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
  
  //set action parameters;
  var params = {'index':index};
  
  //create TextButton with go to root action;
  var root = textButtonWidget(globalRootText,false,false,'goRoot',params);
  
  //append widgets to ButtonSet;
  var widget = buttonSet([root]);
  
  //append to section and return;
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
 * Creates a TextParagraph widget
 * @param {String} text specifies a text to populate widget with
 * @returns {TextParagraph} 
 */
function textWidget(text) {
  var widget = CardService.newTextParagraph();
      widget.setText(text);
  return widget;
}

/**
 * Creates a TextInput widget;
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
  //check if value is an instanceof Date and format if so;
  if(value instanceof Date) { value = value.toLocaleDateString(); }
  
  //create widget and set required parameters;
  var widget = CardService.newTextInput();
      widget.setFieldName(name);
      widget.setHint(hint);
      widget.setValue(value);
  
  //set conditional parameters;
  if(title) { widget.setTitle(title); }
  
  if(changeFunc) { 
    var action = CardService.newAction();
        action.setFunctionName(changeFunc);
    if(hasSpinner===true) {
      action.setLoadIndicator(CardService.LoadIndicator.SPINNER);
    }else {
      action.setLoadIndicator(CardService.LoadIndicator.NONE);
    }
    if(params) {action.setParameters(params);}
    widget.setOnChangeAction(action);
  }
  return widget;
}

/**
 * Creates suggestions for a TextInput widget;
 * @param {textInput} textInputWidget text input to append suggestions to;
 * @param {Suggestions} suggestions list of suggestions to append;
 * @param {String} suggestFunc function name to fire on suggestion select;
 */
function suggestions(textInputWidget,suggestions,suggestFunc) {
    
  textInputWidget.setSuggestions(suggestions);
    
  if(suggestFunc) {
    var sAction = CardService.newAction();
        sAction.setFunctionName(suggestFunc);
    textInputWidget.setSuggestionsAction(sAction);
  }
  
}

/**
 * Creates Suggestions object for TextInput autocomplete handler;
 * @param {Array} suggestions an array of string values for creating options;
 * @returns {Suggestions}
 */
function suggestion(suggestions) {
  var list = CardService.newSuggestions();
      list.addSuggestions(suggestions);
  return list;
}

/**
 * Creates a ButtonSet widget and appends buttons if provided;
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
 * Creates a TextButton widget with text content;
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
  if(params) {action.setParameters(params);}
  widget.setOnClickAction(action);
  
  return widget;
}

/**
 * Creates a TextButton widget with authorization action to trigger Auth flow;
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
 * Creates a TextButton widget with link action set to it instead of an inbound action;
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
      
  //set button style (filled or default to text);
  if(isFilled) { widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED); }
      
  if(useAction) {
    //create action and set required parameters;
    var action = CardService.newAction();
        action.setFunctionName(clickFunc);
        
    //set parameters if provided;
    if(params) { 
      action.setParameters(params); 
    }else { 
      action.setParameters({url:url,fullsized:fullsized.toString(),reload:needsReload.toString()}); 
    }
        
    //set action to button;
    widget.setOnClickOpenLinkAction(action);
  }else {
    //create OpenLink action and set required parameters;
    var openLink = CardService.newOpenLink();
        openLink.setUrl(url);
            
    //set OpenAs and OnClose parameters;    
    if(fullsized) { openLink.setOpenAs(CardService.OpenAs.FULL_SIZE); }else { openLink.setOpenAs(CardService.OpenAs.OVERLAY); }
    if(needsReload) { openLink.setOnClose(CardService.OnClose.RELOAD_ADD_ON); }else { openLink.setOnClose(CardService.OnClose.NOTHING); }
        
    //set OpenLink action to button;
    widget.setOpenLink(openLink);        
  }
      
  return widget;
}

/*
 * Creates a ImageButton widget with icon content;
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
  if(params) {action.setParameters(params);}
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

  if(clickFunc) { 
    var action = CardService.newAction();
        action.setFunctionName(clickFunc);
    if(hasSpinner) { action.setLoadIndicator(CardService.LoadIndicator.SPINNER); }
    if(params) {action.setParameters(params);}
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
  if(top&&top!=='') { keyValue.setTopLabel(top); }
  
  //create Switch widget and set required parameters;
  var widget = CardService.newSwitch();
      widget.setFieldName(name);
      widget.setSelected(selected);
      widget.setValue(value);
  
  //set an onchange action;
  if(changeFunc) { 
    var action = CardService.newAction();
        action.setFunctionName(changeFunc);
    if(hasSpinner) { action.setLoadIndicator(CardService.LoadIndicator.SPINNER) }
    if(params) {action.setParameters(params);}
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
  if(top&&top!=='') { widget.setTopLabel(top); }
  
  //set button to widget;
  if(button) { widget.setButton(button); }
  
  //set icon if found or set icon url if not;
  if(icon&&icon!=='') { 
    var iconEnum = CardService.Icon[icon];
    if(iconEnum) {
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
  if(top&&top!=='') { widget.setTopLabel(top); }
      
  //set icon if found or set icon url if not;    
  if(icon&&icon!=='') { 
    var iconEnum = CardService.Icon[icon];
    if(iconEnum) {
      widget.setIcon(iconEnum);
    }else {
      widget.setIconUrl(icon);
    } 
  }

  //set onclick action and set parameters if provided;
  var action = CardService.newAction();
      action.setFunctionName(clickFunc);
  if(params) {action.setParameters(params);}
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
  if(top&&top!=='') { widget.setTopLabel(top); }
  
  //set icon if found or set icon url if not;
  if(icon&&icon!=='') {
    var iconEnum = CardService.Icon[icon];
    if(iconEnum) {
      widget.setIcon(iconEnum);
    }else {
      widget.setIconUrl(icon);
    } 
  }
  
  //set onclick action and set parameters if provided;
  var action = CardService.newAction();
      action.setFunctionName(clickFunc);
  if(params) {action.setParameters(params);}
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
  if(top&&top!=='') { widget.setTitle(top); }

  //set an onchange action;
  if(changeFunc) { 
    var action = CardService.newAction();
        action.setFunctionName(changeFunc);
    if(hasSpinner) { action.setLoadIndicator(CardService.LoadIndicator.SPINNER) }
    if(params) {action.setParameters(params);}
    widget.setOnChangeAction(action);
  }
  
  //set options to widget;
  options.forEach(function(option) { widget.addItem(option.text,option.value,option.selected); });
  
  return widget;
}
//============================================END TEMPLATES============================================//

//==============================================CONNECTOR==============================================//
//Basic Connector class;
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
    if(data) { payload.data = data; }
    
    //build authorization;
    if(connector.auth==='OAuth2') {
      var parameters  = {
        'name': connector.name,
        'scope': connector.scope,
        'urlAuth': connector.urlAuth,
        'urlToken': connector.urlToken,
        'id': connector.id,
        'secret': connector.secret
      };
      if(connector.hint)    { parameters.hint = connector.hint; }
      if(connector.offline) { parameters.offline = connector.offline; }
      if(connector.prompt)  { parameters.prompt = connector.prompt; }
      
      var service = authService(parameters);
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
/**
 * Initiates callback function and updates Ui;
 * @param {Action} action object with action config (function name, load indicator and parameters);
 * @param {HtmlElement} element document markup element calling action;
 */
function actionCallback(action,element) {
	return async function() {
		//access action parameters;
		const functionName  = action.functionName;
		const loadIndicator = action.loadIndicator;
		const parameters    = action.parameters;
		
		//if provided, set load indicator;
		if(loadIndicator!=='NONE') {
			const overlay = $('#app-overlay');
			//overlay.show();
		}

		//clear formInput and formInputs;
		e.formInput  = {};
		e.formInputs = {};
		
		//get form and access formInputs;
		const forms = document.getElementsByTagName('form');
		
		//if has forms -> set event objects formInput and formInputs params;
		if(forms.length>0) {
			
			for(let f=0; f<forms.length; f++) {
				let form = forms.item(f);
				
				//access form parameters;
				const inputs = form.elements;
				
				for(let i=0; i<inputs.length; i++) {
					let input = inputs.item(i);

					//access input parameter;
					let name  = input.name;
					let value = input.value;
					
					//set formInput and formInputs properties;
					if(name!=='') {
						
						//temp solution to check forSwitches;
						const cl = input.classList;
						const isSwitch = cl.contains('ms-Toggle-input');
						if(isSwitch) { 
							const isSelected = cl.contains('is-selected'); 
							
							if(isSelected) {
								e.formInput[name]  = value;	
								e.formInputs[name] = [value];								
							}
							
						}else {
							e.formInput[name]  = value;	
							e.formInputs[name] = [value];
						}
					}
				}			
				
			}
			
		}
		console.log(e);
		
		//set parameters to event object;
		e.parameters = parameters;
		
		//invoke callback and await response;
		await GLOBAL[functionName](e,element);
		
		//$('#app-overlay').hide();
		
	}
}
//=============================================END CALLBACKS=============================================//

//=============================================START ACTIONS=============================================//	
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
//=================================END ACTIONS=================================//
	
//==============================CONNECTOR ACTIONS==============================//
/**
 * Creates new connector and saves it to properties;
 * @param {Object} e event object;
 */	
function createConnector(e) {
	return new Promise(
		async function (resolve) {
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
				connector.auth = 'OAuth2'; //until added auth types - hardcoded;
			}
			  
			try {
				//throw new Error('TEST'); //debug error test - uncomment first one if needed;
			  
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
	);
}


/**
 * Updates connector and saves it to properties;
 * @param {Object} e event object;
 */
function updateConnector(e) {
	return new Promise(
		async function (resolve) {
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
				var auth = data.auth;
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
				connector.auth = 'OAuth2'; //until added auth types - hardcoded;
			}

			//connector index (for ease of flow);
			var config = await getProperty('config','user');
			var index  = getIndex(config,e.parameters);

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
				console.log(connector);
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
}


/**
 * Removes connector and saves properties;
 * @param {Object} e event object;
 */	
function removeConnector(e) {
	return new Promise(
		async function (resolve) {
			//create action response builder;
			var builder = CardService.newActionResponseBuilder();

			//connector index (for ease of flow);
			var config = await getProperty('config','user');
			var index  = getIndex(config,e.parameters);
			  
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
}
//============================END CONNECTOR ACTIONS============================//

//==============================UNIVERSAL ACTIONS==============================//
function universalHome(e) {
	return new Promise(
		function(resolve) {
			cardOpen(e);
		}
	);
};
function universalSettings(e) {
	return new Promise(
		function(resolve) {
			cardSettings(e);
		}
	);
};
function universalHelp(e) {
	return new Promise(
		function(resolve) {
			cardHelp(e);
		}
	);
};
//============================END UNIVERSAL ACTIONS============================//

//==================================START PROPERTIES=================================//
/**
 * Fetches user / script property value by key;
 * @param {String} key key of the property to find;
 * @param {String} type 'user' or 'script' to determine prop type to get;
 * @returns {String}
 */
function getProperty(key,type) {
  var props;
  
  //access corresponding store;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  
  //get property from store by key;
  var value = props.getProperty(key);
  
  //try to parse value or return as is;
  try { value = JSON.parse(value); }
  catch(e) { return value; }

  //return parsed value;
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
  
  //access corresponding store;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  
  //try to stringify value or set as is on failure;
  try { value = JSON.stringify(value); }
  catch(e) { props.setProperty(key,value); }  
  
  //set property with given key and value;
  props.setProperty(key,value);
}

/**
 * Deletes a user / script property by key;
 * @param {String} key key of the property to find;
 * @param {String} type 'user' or 'script' to determine prop type to get;
 */
function deleteProperty(key,type) {
  var props;
  
  //access corresponding store;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  
  //delete property from store by key;
  props.deleteProperty(key);
}

/**
 * Deletes every user / script property set;
 * @param {String} key key of the property to find
 * @param {String} type 'user' or 'script' to determine prop type to get 
 */
function deleteAllProperties(type) {
  var props;
  
  //access corresponding store;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  
  //delete all properties in store;
  props.deleteAllProperties(); 
}
//==================================END PROPERTIES=================================//

//=================================START BACKEND=================================//
/**
 * Checks if input ends with 1;
 * @param {Number|String} input input to check;
 * @returns {Boolean}
 */
function endsOnOne(input) {
  var result = false;
  
  var isNum = typeof input==='number';
  var isStr = typeof input==='string';
  
  if(isNum) {
    var arr = input.toString().split('');
    var li  = arr.lastIndexOf('1');
    if(li===arr.length-1) { result = true; }
  }else if(isStr) {
    return input.endsWith('1');
  }
  
  return result;
}

/**
 * Creates an object with extra data parameters;
 * @param {Array} content an array of sections with widgets;
 * @param {Integer} start index to start from (for extra data);
 * @returns {Object}
 */
function getBeginMax(content,start) {
  var cap = 0, full = 0;
        
  //handle full content length (including all fields)
  for(var i=0; i<content.length; i++) {
    try {var result = JSON.parse(content[i]);}
    catch(er) { result = content[i]; }
    for(var key in result) { full += 1; }      
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
     
  //construct output object and return it;
  var output = {
    full  : full,
    begin : begin,
    max   : max,
    cap   : cap
  };
  return output;
}

/**
 * Creates an array of widget caps for each content section;
 * @param {Array} content an array of sections with widgets;
 * @returns {Array}
 */
function getLayout(content) {
  //set maximum widgets in section to include all of them;
  var max = Math.floor( 100 / content.length );
      
  //count full number of widgets;
  var full = 0, layout = [];
  content.forEach(function(c){
    //access widgets;
    var widgets = c.widgets;
          
    //increment full length;
    for(var widget in widgets) { 
      full += 1;
    }
         
    //add number of widgets to layout;
    var length = widgets.length;
    if(length>max) { layout.push(max); }else { layout.push(widgets.length); }
  });

  return layout;
}


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
 * Fetches authorization token for current email
 * @param {Object} e event object;
 * @returns {Message}
 */
function getToken(e) {
  var accessToken = e.messageMetadata.accessToken;
  var messageId = e.messageMetadata.messageId;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  var msg = GmailApp.getMessageById(messageId);
  return msg;
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
 * @returns {Spreadsheet|null}
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
    var isMissing = error.message.indexOf('is missing')>=0;
    console.log('Could not find spreadsheet with filter set to "%s"',filter);
    if(isMissing) { return 404; }else { return null; }
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


function toStr(obj) {
  var isStr    = typeof obj==='string';
  var isObj    = typeof obj==='object';
  var isNumber = typeof obj==='number';
  var isBool   = typeof obj==='boolean';
  var isArr    = obj instanceof Array;
  var isNull   = obj===null;
  var isUndef  = obj===undefined; 
  
  if(isStr) { return obj; }
  if(isNumber||isBool) { return obj.toString(); }
  if(isNull) { return JSON.stringify(new Object(obj)); }
  
  if(isObj&&!isArr&&!isNull) {
    //is empty object ? return '{}'
    if(Object.keys(obj).length===0) { return '{}'; }
    
    //has no nested objects or arrays ?
    var hasObj = false;
    var hasArr = false;
    for(var key in obj) {
      if(typeof obj[key]==='object') { hasObj = true; }
      if(obj[key] instanceof Array) { hasArr = true; }
    }
    if(!hasObj&&!hasArr) { return JSON.stringify(obj); }
    
    for(var key in obj) {
      
      var sub = obj[key];
      if(sub===undefined) { 
        delete obj[key];
      }else {
        obj[key] = toStr(sub); 
      }
      
    }
    
    return JSON.stringify(obj);

  
  }else if(isArr) {
  
    obj.forEach(function(sub,key){
      obj[key] = toStr(sub);
    });
    
    return JSON.stringify(obj);
    
  }
  
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

  //if data is undefined return empty array;
  if(!data) { return []; }
  
  //try to parse content until recieved an array; 
  try {
    while(!(data instanceof Array)) {
      data = JSON.parse(data);
    }
    return data;
  }
  catch(err) { data = data; }
  
  
  if( (typeof data==='object')&&Object.keys(data).length===0 ) { return []; } 
  
  try {
    if(data===''||data==='[]'||data==='""') {
      data = []; 
    }else if(data!==[]) { 
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
  
  //if no other choice, return data;
  return data;
}

/**
 * Creates settings storage;
 * @param {String} content content to pass to JSON file;
 */
async function createSettings(content) {
  if(!content) { content = []; }
  await setProperty('config',content,'user');
}

/**
 * Trims sender info from name and '<' & '>' characters;
 * @param {String} input email string;
 * @return {String}
 */
function trimFrom(input) {
  var regEx1 = /\<.+@.+\>/;
  var regEx2 = /[^\<].*@.+[^\>]/;
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
 * @param {String} input email string;
 * @returns {String}
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

/**
 * Converts any input to Boolean;
 * @param {*} input any input to convert to boolean;
 * @returns {String}
 */
function toBoolean(input) {
  //check if input is a string or boolean;
  var isString  = typeof input==='string';
  var isBoolean = typeof input==='boolean';
  
  //if is boolean -> return unchanged;
  if(isBoolean) { return input; }
  
  //if is string -> change to boolean;
  if(isString) {
    if(input==='true') { return true; }
  }
  
  //if nothing is applicable -> return false;
  return false;
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
//========================================END PERFORM FETCH========================================//

//=======================================START GLOBAL OBJECTS===================================//
//emulate event object;
class e_EventObject {
	constructor() {
		this.messageMetadata = {
			accessToken : '',
			messageId : ''
		};
		this.formInput  = {};
		this.clientPlatform;
		this.formInputs = {};
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
//=========================================END GLOBAL OBJECTS=====================================//

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
		
		if(params.payload) {
			request.send(params.payload);
		}else {
			request.send();
		}	
	});
}
//===========================================END URL FETCH===========================================//
const cardStack         = [];
const GLOBAL            = this;