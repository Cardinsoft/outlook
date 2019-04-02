// The initialize function must be run each time a new page is loaded;
Office.initialize = (reason) => {
	$(document).ready(function () {
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
  var quickbooks = new QB();
  var sheets     = new Sheets();
  var flow       = new Flow();
  var pipedrive  = new Pipedrive();
  
  //var infusion = new InfusionSoft(); //future release due to endpoint app approval issue;
  
  //create an array of used types;
  var types = [quickbooks,sheets,flow,pipedrive];
  
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
  if(!isManual||isManual==='true') { isManual = true; }else if(isManual==='false') { isManual = false; }
  
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
  if(!isDefault||isDefault==='false') { isDefault = false; }else if(isDefault==='true') { isDefault = true; }
  
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
		
		//get form and access formInputs;
		const forms = document.getElementsByTagName('form');
		
		//if has forms -> set event objects formInput and formInputs params;
		if(forms) {
			
			for(let f=0; f<forms.length; f++) {
				let form = forms.item(f);
				
				//access form parameters;
				const inputs = form.elements;
				
				for(let i=0; i<inputs.length; i++) {
					let input = inputs.item(i);

					//access input parameter;
					let name  = input.name;
					let value = input.value;
					
					//set formInput parameters;
					e.formInput.name = value;
					
					//set formInputs parameters - for now, just add an Array;
					e.formInputs.name = [value];
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

//==========================================START GLOBALS==========================================//
//card and section headers;
var globalAdvancedHeader             = 'Advanced settings';
var globalChooseTypeHeader           = 'Available Connector types';
var globalConfigErrorHeader          = 'Configuration error';
var globalConfigHeader               = 'Connector configuration';
var globalConfigListHeader           = 'Configured Connectors';
var globalConfirmHeader              = 'Confirm action';
var globalConnectorListHeader        = 'Other Connectors';
var globalCustomIconHeader           = 'Connector icon';
var globalErrorHeader                = 'Config error';
var globalHelpHeader                 = 'Help';
var globalSettingsHeader             = 'Settings';
var globalShowHeader                 = 'Record';
var globalUnparsedHeader             = 'Unparsed content';
var globalWelcomeHeader              = 'Welcome to Cardin for Gmail!';

//titles;
var globalAuthTypeErrorTitle         = 'Auth type mismatch';
var globalConfigErrorWidgetTitle     = '';
var globalConfirmWidgetTitle         = '';
var globalCustomWidgetFieldTitle     = 'Field';
var globalCustomWidgetIconTitle      = 'Connector icon';
var globalCustomWidgetNameTitle      = 'Connector name';
var globalErrorWidgetTitle           = 'Error description';
var globalExtraDataTitle             = '';
var globalHelpWidgetTitle            = '';
var globalNoDataWidgetTitle          = 'No content';
var globalResetWidgetTitle           = 'Reset';
var globalUnparsedDataWidgetTitle    = 'Unparsed content';
var globalUnparsedErrorWidgetTitle   = 'Parse failure reason';
var globalWelcomeWidgetTitle         = '';

//content - errors;
var globalAuthTypeErrorContent       = 'The Connector seems to require OAuth 2.0 authorization to work, but you set auth type to "none". Please configure OAuth properties in Settings';
var globalConfigErrorWidgetContent   = 'Seems like you have a configuration issue! Please, reset the Add-on if this is the only section you see. Otherwise, try removing any malformed Connectors before resetting';
var globalConnectorListErrorContent  = 'An error occured during Connector list generation';

//content;
var globalAuthTextWidgetContent      = 'The Connector requires authorization to an external service. You can revoke authorization any time by clicking "revoke". Note that either action will trigger a refresh';
var globalConfirmRemoveWidgetContent = 'The Connector will be permanently removed. Are you sure?';
var globalConfirmResetWidgetContent  = 'Every configured Connector will be permanently deleted. Are you sure?';
var globalCustomWidgetAuthText       = 'Authorization type';
var globalCustomWidgetSwitchText     = 'Manually invoke Connector';
var globalExtraDataText              = 'More data is available, but we trimmed it to avoid hitting the 100 field limit';
var globalHelpWidgetContent          = 'Visit our website for setup instructions and other support resources';
var globalIsDefaultWidgetSwitchText  = 'Run and display by default';
var globalNoDataWidgetContent        = 'The Connector response has no content to display for';
var globalNotAuthorizedContent       = 'Seems like the Connector you built has to be authorized or there was a change in required permissions and you need to reauthorize or you lost access to the API';
var globalOptionalFieldsContent      = 'These fields are optional and can be left blank';
var globalResetWidgetContent         = 'Every user preference will be reset, and Connector configurations will be deleted';
var globalWelcomeWidgetContent       = 'Click on a Connector from the list below to get started';

//hints;
var globalCustomWidgetNameHint       = 'Name to display in list of Connectors';
var globalCustomIconHint             = 'Icon URL (public) to set to Connector';

//button as labels texts;
var globalAuto                       = 'Auto';
var globalError                      = 'Error';
var globalManual                     = 'Manual';
var globalNoData                     = 'No data';
var globalSuccess                    = 'Success';

//button texts;
var globalCancelText                 = 'Cancel';
var globalCardinUrlText              = 'cardinsoft.com';
var globalClearWidgetSubmitText      = 'Clear';
var globalConfirmText                = 'Confirm';
var globalCreateConnectorText        = 'Create';
var globalLoadExtraBackText          = 'Back';
var globalLoadExtraForwardText       = 'Next';
var globalLoginText                  = 'Login';
var globalOpenAuthText               = 'Authorize';
var globalRemoveConnectorText        = 'Remove';
var globalResetWidgetSubmitText      = 'Reset';
var globalRevokeAuthText             = 'Revoke';
var globalRootText                   = 'Go back';
var globalUpdateConnectorText        = 'Update';
var globalUpdateShowText             = 'Update';

//URLs;
var globalCardinUrl                  = 'https://cardinsoft.com/cardin-gmail/';
var globalCardinIconUrl              = 'https://cardinsoft.com/wp-content/uploads/2019/03/cardin-logo.png';
var globalCustomIconUrl              = 'https://cardinsoft.com/wp-content/uploads/2019/03/custom.png';
var globalFlowIconUrl                = 'https://cardinsoft.com/wp-content/uploads/2019/03/flow.png';
var globalGitHubIconUrl              = 'https://cardinsoft.com/wp-content/uploads/2019/03/github.png';
var globalInfusionIconUrl            = 'https://cardinsoft.com/wp-content/uploads/2019/03/infusionsoft.png';
var globalPipedriveIconUrl           = 'https://cardinsoft.com/wp-content/uploads/2019/03/pipedrive.png';
var globalSheetsIconUrl              = 'https://cardinsoft.com/wp-content/uploads/2019/03/sheets.png';
var globalYouTubeUrl                 = 'https://youtube.com/';

//notifications, warnings and error messages
var globalClearSuccess               = 'Cache successfully cleared!';
var globalCreateFailure              = 'Connector creation failed';
var globalCreateSuccess              = 'Connector successfully created!';
var globalInvalidURLnoMethod         = 'URLs should include http or https and a domain';
var globalRemoveFailure              = 'Connector removal failed';
var globalRemoveSuccess              = 'Connector successfully removed!';
var globalResetFailure               = 'Add-on configuration reset failed!';
var globalResetSuccess               = 'Add-on configuration successfully reset!';
var globalRevokeAccessSuccess        = 'Access token successfully revoked!';
var globalUpdateFailure              = 'Connector update failed';
var globalUpdateSuccess              = 'Connector successfully updated!';

//field names;
var globalBaseClassName              = 'Connector';
var globalClientIdFieldName          = 'id';
var globalCustomNameName             = 'custom';
var globalCustomUrlUrl               = '';
var globalDefaultFieldName           = 'isDefault';
var globalEnumCheckbox               = 'CHECK_BOX';
var globalEnumDropdown               = 'DROPDOWN';
var globalEnumRadio                  = 'RADIO_BUTTON';
var globalIconFieldName              = 'icon';
var globalManualFieldName            = 'manual';
var globalNameFieldName              = 'name';
var globalRedirectFieldName          = 'redirect';
var globalScopeFieldName             = 'scope';
var globalSecretFieldName            = 'secret';
var globalUrlAuthFieldName           = 'urlAuth';
var globalURLfieldName               = 'url';
var globalUrlTokenFieldName          = 'urlToken';

//parameters;
var globalIncludeGitHub              = true;
var globalInfusionsoftApptsCap       = 5;
var globalInfusionsoftTasksCap       = 5;
var globalNumUncollapsible           = 5;
var globalNumUncollapsibleList       = 3;
var globalTextButtonActionAction     = 'action';
var globalTextButtonActionClick      = 'click';
var globalTextButtonActionLink       = 'link';
var globalWidgetsCap                 = 50;

//OAuth2 flow;
var globalAlreadyAuthorized          = 'Connector previously authorized!';
var globalAlreadyRevoked             = 'Connector revoked or does not have access!';
var globalAuthFailure                = 'Authorization failed!';
var globalAuthorize                  = 'Please authorize the Connector';
var globalAuthSuccess                = 'Successfully authorized!';
var globalAuthUrlInputHint           = 'Authorization URL';
var globalClientIdInputHint          = 'Obtained from API';
var globalRevokeAccess               = 'Revoke access';
var globalScopeInputHint             = 'Obtained from API';
var globalSecretInputHint            = 'Obtained from API';
var globalTokenUrlInputHint          = 'Token URL';

//connector types specific globals;
var globalFlowShort                  = 'Sends and recieves data from Microsoft Flow - this Connector type can work with iterative data updating';
var globalInfusionShort              = 'Fetches sales and marketing information from Infusionsoft by Keap CRM & marketing automation platform';
var globalPipedriveShort             = 'Fetches sales and marketing data from Pipedrive Sales CRM & Pipeline Management';
var globalSheetsShort                = 'Fetches and displays data from a Google Sheet. Please, make sure that you have access rights to view it';
var globalQBShortDesc                = 'Fetches customer or supplier invoice or bill detail from connected QB company. Please authenticate to QB';
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
    scope: 'malformed',
    prompt: true
  };
  
  /**
   * method for performing fetch to external service;
   * @param {Object} msg message object;
   * @param {Object} connector connector config object;
   * @param {Object} data custom data object to pass to payload;
   * @return {Function}
   */
  this.run = async function (msg,connector,data) { 
    //initiate authorization service;
    var parameters = this.auth;
        parameters.name = connector.name;
    
    
    var service = authService(parameters);
    
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
    
    //button colour test;
    parsed = [
      {
        header:'Button test',
        widgets:[
          {
            type:'TextButton',
            title:'Coloured button',
            colour:'#DE009B',
            action:'click',
            content:'actionManual',
            disabled:false
          }
        ]
      }
    ];
    
    //build return object;
    var returned = {
      code     : response.code,
      headers  : response.headers,
      content  : parsed,
      hasMatch : {
        value  : true,
        text   : 'found',
        colour : '#DE009B'
      }
    };
    
    return returned;
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
    }else if(spread===404) {
      //access content;
      var content = result.content;
      
      //create denied auth section;
      var section = {
        header: '',
        isCollapsible: false,
        widgets: []
      };
      
      //access widgets;
      var widgets = section.widgets;
      
      //create prompt widget;
      var prompt = {
        title: 'Spreadsheet missing',
        type: 'KeyValue',
        content: 'Seems like the spreadsheet you are trying to access is missing or you do not have access to it'
      };
      widgets.push(prompt);
      
      //create tip widget;
      var tip = {
        type: 'KeyValue',
        content: 'You can try requesting access from the spreadsheet owner (if using multiple accounts, note that one of them might have access and you will be redericted to the spreadsheet instead)'
      };
      widgets.push(tip);
      
      
      //create request auth widget;
      var auth = {
        type      : 'TextButton',
        title     : 'Request access',
        content   : connector.url,
        action    : 'link',
        disabled  : false,
        filled    : false,
        fullsized : false,
        reload    : true
      };
      widgets.push(auth);
      
      //append section to result content;
      content.push(section);
    }
    
    try {//temp for dev

      if(spread!==null&&spread!==404) {
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
    
    //access content and check if no recods matched;
    var content = result.content;
    if(result.content.length===0) { 
      
      //create no contacts section;
      var section = {
        header        : 'No matches',
        isCollapsible : false,
        widgets       : []
      };
      
      //access widgets;
      var widgets = section.widgets;
      
      //create no record prompt;
      var prompt = {
        title   : '',
        type    : 'KeyValue',
        content : 'Seems like none of your records in the spreadsheet match!\rWould you like to create one?'
      };
      widgets.push(prompt);
      
      //create add record button;
      var button = {
        type  : 'TextButton',
        title : 'Add',
        content: connector.url,
        action: 'link',
        disabled: false,
        filled: false,
        fullsized: false,
        reload: true        
      };
      widgets.push(button);
      
      content.push(section);
    }
    
    //log result and return it;
    console.log(result);
    return result;
  }
}
//chain custom connector to base class;
Sheets.prototype = Object.create(Connector.prototype);
//============================================END SHEETS========================================//

//==========================================START PIPEDRIVE=====================================//
function Pipedrive() {
  Connector.call(this);
  this.icon = globalPipedriveIconUrl;
  this.name = 'Pipedrive';
  this.url  = 'https://api-proxy.pipedrive.com/';
  this.short = globalPipedriveShort;
  this.config = [
    
  ];
  this.auth = {
    name: 'Pipedrive',
    urlAuth: 'https://oauth.pipedrive.com/oauth/authorize',
    urlToken: 'https://oauth.pipedrive.com/oauth/token',
    id: '12cefab496cfcb98',
    secret: 'c4842d0956b6188431e300ca311a8d3832def793',
    scope: 'contacts:read'
  };
  this.login = function(connector) {
    var base = 'https://www.pipedrive.com/en/login';
    var url = base;
    return url;
  }
  this.run = async function(msg,connector,data) {
    //set method for url fetch ('get' or 'post' for now);
    var method = 'get';

    //set headers for url fetch;
    var headers = {};
    
    //set payload in case POST request will be triggered;
    var trimmed = trimMessage(msg,true,true);    
    
    //access authoorization parameters and set service name;
    var parameters      = this.auth;
        parameters.name = connector.name;
        
    //create service and set authorization header;
    var service = authService(parameters);
    var bearer  = 'Bearer '+service.getAccessToken();
    headers.Authorization = bearer;
    
    //initiate access endpoints;
    var personsEP = '/persons';
    var activsEP  = '/activities';
    var dealsEP   = '/deals';
    
    //initate requests;
    var responsePersons = await performFetch(this.url+personsEP,method,headers);
    var responseActivs  = await performFetch(this.url+activsEP,method,headers);
    var responseDeals   = await performFetch(this.url+dealsEP,method,headers);
    
    //access response codes;
    var codePersons = responsePersons.code;
    var codeActivs  = responseActivs.code;
    var codeDeals   = responseDeals.code;
    
    //access and parse response contents;
    var contentPersons = JSON.parse(responsePersons.content);
    var contentActivs  = JSON.parse(responseActivs.content);
    var contentDeals   = JSON.parse(responseDeals.content);
    
    //initialize info parsing on successful fetch;
    if(codePersons>=200&&codePersons<300) {
    
      //initiate result array, sections and set required params;
      var result = [];   
    
      //access content and check if it is not null;
      var persons = contentPersons.data;
      if(persons!==null) {
        //set section show to false by default;
        var matching = false;
        
        //access each person and create widgets;
        persons.forEach(function(person){
          //access person email addresses;
          var emailLabels = [], emailAddresses = [];
          var emails = person.email; 
          emails.forEach(function(email){
            var emailLabel   = email.label;
            var emailAddress = email.value;
            emailLabels.push(emailLabel);
            emailAddresses.push(emailAddress);
          });
              
          //check if there is email match;
          var hasMatch = emailAddresses.some(function(email){
            if(email===trimmed.email) { return email; }
          });
          
          if(hasMatch) {
          
            //create separator;
            var separator = {
              type: 'KeyValue',
              content: '\r'
            };
            
            //create section persons;
            var sectionPersons = {
              header: 'Person info',
              isCollapsible: true,
              widgets: []
            }; 
            
            //access widgets;
            var widgetsPerson = sectionPersons.widgets;            
          
            //access person properties;
            var company   = person.org_id;
            var owner     = person.owner_id;
            var first     = person.first_name;
            var last      = person.last_name;
            var phones    = person.phone;
            var created   = person.add_time;
            var updated   = person.update_time;
            var label     = person.label;
            var numOpen   = person.open_deals_count;
            var numClosed = person.closed_deals_count;
            var numWon    = person.won_deals_count;
            var numLost   = person.lost_deals_count;
            var numActiv  = person.activities_count;
            var nextDate  = person.next_activity_date;
            var nextTime  = person.next_activity_time;
            
            //create person name widget;
            var fullname = '';
            if(first!==null) { fullname += first; }
            if(last!==null)  { fullname += ' '+last; }
            var personName = {
              icon    : 'PERSON',
              title   : 'Full Name',
              type    : 'KeyValue',
              content : fullname
            };
            widgetsPerson.push(personName);
            
            //create person label widget;
            if(label!==null) {
              //set start and end tags and default color;
              var sText = '<b><font color="';
              var eText = '</font></b>';
              var color = '#000000';
              
              //set label text and color;
              if(label===1) { label = 'Customer';  color = '#007A00'; }
              if(label===2) { label = 'Hot lead';  color = '#ff0000'; }
              if(label===3) { label = 'Warm lead'; color = '#FFCE00'; }
              if(label===4) { label = 'Cold lead'; color = '#4285F4'; }
            
              var personLabel = {
                icon    : 'BOOKMARK',
                type    : 'KeyValue',
                content : sText+color+'">'+label+eText
              };
              widgetsPerson.push(personLabel);
            }
            
            //create person email widgets;
            if(emails!==null) {
              emails.forEach(function(email){
                var label     = email.label;
                var value     = '<a href="mailto:'+email.value+'">'+email.value+'</a>';
                var isPrimary = email.primary;
                
                var personEmail = {
                  icon       : 'EMAIL',
                  title      : label,
                  type       : 'KeyValue',
                  content    : value
                };
                if(isPrimary) { personEmail.buttonText = 'Primary'; }
                widgetsPerson.push(personEmail);
                
              });
            }
            
            //create person phone widgets;
            if(phones!==null) {
              phones.forEach(function(phone){
                var label     = phone.label;
                var value     = phone.value;
                var isPrimary = phone.primary;
                
                var personPhone = {
                  icon    : 'PHONE',
                  title   : label,
                  type    : 'KeyValue',
                  content : value
                };
                if(isPrimary) { personPhone.buttonText = 'Primary'; }
                widgetsPerson.push(personPhone);
              }); 
            }
            
            //create is active widget;
            var active = 'Inactive', color = '#ff0000';
            if(person.active_flag) { 
              active = 'Active';
              color  = '#007A00';
            }
            var personActive = {
              type    : 'KeyValue',
              content : '<font color="'+color+'">'+active.toString()+'</font>'     
            };
            widgetsPerson.push(personActive);            
            
            //set number of uncollapsible widgets to main info;
            sectionPersons.numUncollapsible = widgetsPerson.length;
            
            //append separator;
            widgetsPerson.push(separator);
            
            //create creation date widget;
            var personCreated = {
              icon    : 'INVITE',
              title   : 'Created on',
              type    : 'KeyValue',
              content : created
            };
            widgetsPerson.push(personCreated);
            
            //create update date widget;
            if(updated!==null) {
              var pesronUpdated = {
                icon    : 'INVITE',
                title   : 'Updated on',
                type    : 'KeyValue',
                content : updated
              };
              widgetsPerson.push(pesronUpdated);
            }
            
            //create deals section and widgets if are or were any;
            if(numOpen>0||numClosed>0) {
              //set single / multiple ending;
              var modOpen = '', modClosed = '';
              if(!endsOnOne(numOpen))   { modOpen   = 's'; }
              if(!endsOnOne(numClosed)) { modClosed = 's'; }
              
              //create deals section;
              var sectionDeals = {
                header        : 'Deals',
                isCollapsible : true,
                widgets       : []
              };
              
              //access section widgets;
              var dealsWidgets = sectionDeals.widgets;
              
              //create number of won deals widget;
              var won = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_thumbs_up_down_black_18dp.png',
                type    : 'KeyValue',
                content : numWon+' won | '+numLost+' lost'
              };
              dealsWidgets.push(won);
              
              //create number of open deals widget;
              var open = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_work_outline_black_18dp.png',
                type    : 'KeyValue',
                content : numOpen + ' open deal' + modOpen
              };
              dealsWidgets.push(open);
              
              //create number of closed deals widget;
              var closed = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_work_black_18dp.png',
                type    : 'KeyValue',
                content : numClosed + ' closed deal' + modClosed
              };
              dealsWidgets.push(closed);
              
            }//end deals section;
            
            //create activities section and widgets if are or were any;
            if(numActiv>0) {
              //create deals section;
              var sectionActivs = {
                header           : 'Activities',
                isCollapsible    : true,
                widgets          : []
              };  
              
              //access section widgets;
              var activsWidgets = sectionActivs.widgets;

              //create number of activities widget;
              var activsMod = 'ies';
              if(endsOnOne(numActiv)) { activsMod = 'y'; }
              var activs = {
                icon    : 'EVENT_PERFORMER',
                type    : 'KeyValue',
                content : numActiv+' activit'+activsMod
              };
              activsWidgets.push(activs);
              
              //create next activity date;
              if(nextDate!==null) {
                var nextD = {
                  icon    : 'INVITE',
                  title   : 'Next activity on',
                  type    : 'KeyValue',
                  content : nextDate
                };
                activsWidgets.push(nextD);
              }
              
              //create widgets for activities;
              if(codeActivs>=200&&codeActivs<300) {
                //access activities info;
                var activities = contentActivs.data;
                
                //loop through activities;
                activities.forEach(function(activity){
                  //access properties;
                  var personId = activity.person_id;
                  var orgId    = activity.org_id;
                  var dealName = activity.deal_title;
                  var subject  = activity.subject;
                  var type     = activity.type;
                  var duration = activity.duration;
                  var isDone   = activity.done;
                  var note     = activity.note;
                  var dueDate  = activity.due_date;
                  var dueTime  = activity.due_time;
                  
                  //create separator widget;
                  activsWidgets.push(separator);
                  
                  //create subject widget;
                  var activSubject = {
                    icon    : 'EVENT_PERFORMER',
                    title   : 'Subject',
                    type    : 'KeyValue',
                    content : subject
                  };
                  activsWidgets.push(activSubject);
                  
                  //create notes widget;
                  var activNotes = {
                    icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_speaker_notes_black_18dp.png',
                    title   : 'Notes',
                    type    : 'KeyValue',
                    content : note
                  };
                  activsWidgets.push(activNotes);
                  
                  //create due date and time widget;
                  var activDue = {
                    icon    : 'INVITE',
                    title   : 'Due to',
                    type    : 'KeyValue',
                    content : dueDate+' '+dueTime
                  };
                  activsWidgets.push(activDue);
                  
                  //create duration widget;
                  var activDur = {
                    icon    : 'CLOCK',
                    title   : 'Duration',
                    type    : 'KeyValue',
                    content : duration
                  };
                  activsWidgets.push(activDur);
                  
                  
                });
              
              }//end actives success;
              
              /*
			rec_master_activity_id = null,
			reference_id = null,
			active_flag = true,
			source_timezone = null,
			assigned_to_user_id = 8658926,
			participants = [{
				primary_flag = true,
				person_id = 1
			}],
			rec_rule_extension = null,
			reference_type = null,
			rec_rule = null,
			marked_as_done_time = ,
			series = null,
              */
               
              
            }
        
            /*[{
              email_messages_count = 0,
              last_outgoing_mail_time = null,
              last_activity_id = null,
              last_incoming_mail_time = null,
              undone_activities_count = 0,
              last_activity_date = null,
              next_activity_id = null,
              notes_count = 0,
              done_activities_count = 0
            }]*/
            
            //create organization section and widgets;
            if(company!==null) {
              
              //create organization section;
              var sectionCompany = {
                header        : 'Organization',
                isCollapsible : false,
                widgets       : []              
              };
              
              //access widgets;
              var widgetsCompany = sectionCompany.widgets;              
              
              //create organization name widget;
              var companyName = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_business_black_18dp.png',
                title   : 'Name',
                type    : 'KeyValue',
                content : company.name
              };
              widgetsCompany.push(companyName);
              
              //create organization address widget;
              if(company.address!==null) {
                var companyAddress = {
                  icon    : 'MAP_PIN',
                  title   : 'Address',
                  type    : 'KeyValue',
                  content : company.address
                };
                widgetsCompany.push(companyAddress);
              }
              
            }//end company section; 
            
            //create person owner section and widgets;
            if(owner!==null) {
              
              //create owner section;
              var sectionOwner = {
                header           : 'Contact owner',
                isCollapsible    : true,
                widgets          : []              
              };
              
              //access widgets;
              var widgetsOwner = sectionOwner.widgets;      
              
              //create owner name widget;
              var ownerName = {
                icon    : 'PERSON',
                title   : 'Name',
                type    : 'KeyValue',
                content : owner.name
              };
              widgetsOwner.push(ownerName);
              
              //create owner email widget;
              var ownerEmail = {
                icon    : 'EMAIL',
                title   : 'Email',
                type    : 'KeyValue',
                content : '<a href="mailto:'+owner.email+'">'+owner.email+'</a>'
              };
              widgetsOwner.push(ownerEmail);
              
              //create is active widget;
              var active = 'Inactive', color = '#ff0000';
              if(owner.active_flag) { 
                active = 'Active';
                color  = '#007A00';
              }
              var ownerActive = {
                type    : 'KeyValue',
                content : '<font color="'+color+'">'+active.toString()+'</font>'     
              };
              widgetsOwner.push(ownerActive);
                            
            }//end owner section;
            
            //append sections;
            result.push(sectionPersons);
            if(sectionCompany) { result.push(sectionCompany); }
            if(sectionDeals)   { result.push(sectionDeals);   }
            if(sectionActivs)  { result.push(sectionActivs);  }
            if(sectionOwner)   { result.push(sectionOwner);   }        
          
          }//end has match;
          
        });//end persons loop;
      
      }//end persons not null;
    
    }//end on response success;
    
    //set content to return;
    var returned = {
      code    : codePersons,
      headers : '',
      content : JSON.stringify(result)
    };    
    
    //print debug info;
    console.log(returned); 
    
    //return parsed info;
    return returned;
  }
}
Pipedrive.prototype = Object.create(Connector.prototype);
//===========================================END PIPEDRIVE======================================//

//===========================================START QB======================================//
// control sandbox mode here, at a code level
var sbMode = false;

//QB connector class;
function QB() {
  Connector.call(this);
  this.icon = "https://quickbooks.intuit.com/content/dam/intuit/quickbooks/common/qb_thumb.png";
  this.name = 'QB';
  this.short = globalQBShortDesc;
  
  // allow power users to copy the icon URL from QB to uniquely ID multiple QB companies by logo
  this.allowCustomIcons = true;  

  // Authentication detail for 'Cardin for QB' app in Intuit store
  this.auth = {
    name: 'QB',
    urlAuth: 'https://appcenter.intuit.com/connect/oauth2',
    urlToken: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    id: (sbMode ? 'L0ZlJyFPZoBCRHSAQsLFjDMwKBURLH4uemB4dadwYiSbxRdDfu' : 'L0iTDowDGWB0YnpdBTwsyX2CoA1n8iKqd1Kqdc00UBcuey7ylS'),
    secret: (sbMode ? '4TK5iwkLFEFbo4zlPFQ9AS0RCezt8GYeFZg29XgY': 'eCukdtng3KMd0zKH0TQcPUGp8fd1dCecCPIyEL5W'),
    scope: 'com.intuit.quickbooks.accounting'
  };
  
  // return the login URL 
  this.login = function(type) {
    
    //set parameters and create authorization service;
    var parameters      = this.auth;
        parameters.name = type.name;
    var service = authService(parameters);

    // retrieve realmID (QuickBooks companyID), which was persisted by the OAuth2 callback function on authentication;
    var OAuth2Params = service.getStorage().getValue(type.name + '_OAuth2Params');
    
    if (OAuth2Params) {

      // deeplink / directlink to company login.
      return ('https://' + (sbMode ? 'sandbox.qbo.intuit.com' : 'qbo.intuit.com') + '/login?deeplinkcompanyid=' + OAuth2Params.realmId);
      
           
    }
    else {
      return ('https://' + (sbMode ? 'app.sandbox.' : '') + 'qbo.intuit.com/app/login');
    }
      
  };
  
  
  /**
   * method for performing fetch to external service;
   * @param {Object} msg message object;
   * @param {Object} connector connector config object;
   * @param {Object} data custom data object to pass to payload;
   * @return {Function}
   */
  this.run = async function (msg,connector,data) {
 
    //set parameters and create authorization service;
    var parameters      = this.auth;
        parameters.name = connector.name;
    var service = authService(parameters);

    //set method for url fetch ('get' or 'post' for now)
    var method = 'get';
    
    // initially, assume we won't find data
    var foundDataResp = false;
   
    //set payload in case POST request will be triggered
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
    
    // retrieve realmID (QuickBooks companyID), which was persisted by the OAuth2 callback function on authentication;
    var OAuth2Params = service.getStorage().getValue(connector.name + '_OAuth2Params');

    // realmID is the QB company ID
    var realmID = '';

    if (OAuth2Params) {
      // retrieve realmID (QuickBooks companyID), which was persisted by the OAuth2 callback function on authentication 
      var realmId = service.getStorage().getValue(connector.name + '_OAuth2Params').realmId;
    }
    
    // initialize our Card response to assume that no Customers or Vendors will be found
    // cs index tracks which Card section we are building
    var cs = 0;
    var cardReply = [];
    cardReply[cs] = {};
    cardReply[cs].header = 'QB Customer / Vendor Query Status';
    cardReply[cs].isCollapsible = true;
    cardReply[cs].numUncollapsible = 3;
    cardReply[cs].widgets = [];
    
    // build out default first section in case we get no results from customer/vendor query
    // this will be overwritten on success.
    cardReply[cs].widgets = [
      {
        'type': 'TextParagraph',
        'name': 'Status',
        'content': 'No Customers or Vendors match the sender of the currently-open email.'
      },
      {
        type: 'TextButton',
        title: 'Edit Customers',
        content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'customers',
        action: 'link',
        disabled: false,
        filled: false,
        fullsized: true,
        reload: true      
        
      },
      {
        type: 'TextButton',
        title: 'Edit Vendors',
        content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'vendors',
        action: 'link',
        disabled: false,
        filled: false,
        fullsized: true,
        reload: true      
        
      }

    ]
      
    // build QB query URL to find the company ID associated with this customer email address
    var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId + "/query?query=" + encodeURIComponent("select * from Customer where PrimaryEmailAddr = '" + payload.from + "'");
    
    //set headers for url fetch;
    var fetchHeaders = {
      'Authorization' : 'Bearer '+ service.getAccessToken(),
      'Accept': 'application/json'

    };

    //initiate QB customer lookup request with helper function
    var response = await performFetch(url,method,fetchHeaders);
    
    // Parse response
    var result = JSON.parse(response.content);
    
    // if a customer matches the sender email, then isolate 'Customer' portion of QueryResponse 
    if (result.QueryResponse.Customer) {
      
      // note that we found at least one matching customer in QB
      foundDataResp = 'CUSTOMER';
      
      var customer = result.QueryResponse.Customer[0];
      
      cardReply[cs] = buildCustomerVendorSection(customer, true);

      // increment to next Card section
      cs++;
      
      // now we've identified customer by QB Id, query invoices
      var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId + "/query?query=" + encodeURIComponent("select * from Invoice where CustomerRef = '" + customer.Id + "'");
      
      //initiate QB invoice lookup request with helper function
      var response = await performFetch(url,method,fetchHeaders);
      
      // Parse response
      var result = JSON.parse(response.content);
      
      // isolate invoices from queryResult if invoices found, else return helpful message
      if (result.QueryResponse.Invoice) {
        var invoices = result.QueryResponse.Invoice;
   
        foundDataResp = '<font color="#007A00">INVOICE(S)</font>';
        
        // iterate invoices and create widgets for display in card
        for (var i in invoices) {
          
          if (invoices[i].Balance) {
            cardReply[cs] = buildInvoiceBillSection (invoices[i],true);
          
            // advance to next Card section (one section per Invoice)
            cs++;
          }
        }
        
      }
      else {
        
        // Add Card section indicating no invoices outstanding
        cardReply[cs] = {};
        cardReply[cs].header = 'Invoice Status';
        cardReply[cs].isCollapsible = true;
        cardReply[cs].numUncollapsible = 2;
        cardReply[cs].widgets = [];
        
        cardReply[cs].widgets = [
          {
            'type': 'KeyValue',
            'title': '',
            'content': 'No invoices outstanding'
          },
          {
            type: 'TextButton',
            title: 'Add New Invoice',
            content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'invoice',
            action: 'link',
            disabled: false,
            filled: false,
            fullsized: true,
            reload: true      
            
          }

          
        ]
      }  
    }
   
    // setup to handle QB Bills, here.
    
    lastName = payload.sender.split(' ').slice(-1);
    
    // build QB query URL to find the Vendor ID associated with the last name indicated in this email address
    var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId + "/query?query=" + encodeURIComponent("select * from vendor where FamilyName = '" + lastName + "'");

    //initiate QB Vendor lookup request with helper function
    var response = await performFetch(url,method,fetchHeaders);
    
    // Parse response
    var result = JSON.parse(response.content);
    
    // if a single Vendor matches on FamilyName, then isolate 'Vendor' portion of QueryResponse 
    if (result.QueryResponse.Vendor) {
     
      // note that we found at least one matching Vendor in QB
      foundDataResp = 'VENDOR';

      var vendor = result.QueryResponse.Vendor;

      // if there is more than one vendor that matches on last name, then provide the user with the capacity to select from drop down which they wish to see
      if (vendor.length > 1) {
        
        // add this handling in future; for now, assume single vendor match
      }        
      else {

        // assume array of length 1 as single match
        vendor = vendor[0];
        
        // add vendor detail section
        cardReply[cs] = buildCustomerVendorSection(vendor, false);
        
        // increment to next Card section
        cs++;
        
        // now we've identified vendor by QB Id, query bills
        var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId + "/query?query=" + encodeURIComponent("select * from bill where VendorRef = '" + vendor.Id + "'");
        
        //initiate QB bill lookup request with helper function
        var response = await performFetch(url,method,fetchHeaders);
        
        // Parse response
        var result = JSON.parse(response.content);

        // isolate invoices from queryResult if invoices found, else return helpful message
        if (result.QueryResponse.Bill) {
          var bills = result.QueryResponse.Bill;
          
          foundDataResp = 'BILL(S)';   
          
          // iterate bills and create widgets for display in card
          for (var i in bills) {
            
            if (bills[i].Balance) {
              cardReply[cs] = buildInvoiceBillSection (bills[i],false);
              
              // advance to next Card section (one section per Bill)
              cs++;
            }
          }
        
        }
        else {
          
          // Add Card section indicating no bills outstanding
          cardReply[cs] = {};
          cardReply[cs].header = 'Bill Status';
          cardReply[cs].isCollapsible = true;
          cardReply[cs].numUncollapsible = 3;
          cardReply[cs].widgets = [];
          
          cardReply[cs].widgets = [
            {
              'type': 'KeyValue',
              'title': '',
              'content': 'No bills outstanding'
            },
            {
              type: 'TextButton',
              title: 'Add New Bill',
              content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'bill',
              action: 'link',
              disabled: false,
              filled: false,
              fullsized: true,
              reload: true      
              
            },
            {
              type: 'TextButton',
              title: 'Add New Expense',
              content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'expense',
              action: 'link',
              disabled: false,
              filled: false,
              fullsized: true,
              reload: true      
              
            }
            
          ]
        }  

        
      }
    }  
    
    // Add login button, here
    cs = cardReply.push(Object());

    // .push retruns new length, so index of tail element is returnvalue - 1
    cs--;
    
    cardReply[cs].header = 'Login to edit this company';
    cardReply[cs].isCollapsible = false;
    cardReply[cs].numUncollapsible = 1;
    cardReply[cs].widgets = [];
        
    cardReply[cs].widgets[0] = 
      {
        type: 'TextButton',
        title: 'Login',
        content: this.login(connector),
        action: 'link',
        disabled: false,
        filled: false,
        fullsized: false,
        reload: true      
        
      }
    
    cs++;
/*    
    var returnValue = {
      code : response.code,
      headers : response.headers,
      content : cardReply };
    
    if foundDataResp {
      returnValue.hasMatch = {
        value : true,
        text : foundDataResp
    
 */   
    // return result
    return {code:response.code,headers:response.headers,content:cardReply, hasMatch : {value : (foundDataResp != false), text : foundDataResp}};    
  }
}
//chain custom connector to base class;
QB.prototype = Object.create(Connector.prototype);

// Helper function for formatting dollar values received from QB API
function formatMoney(n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

// Helper function to caclulate the number of days between two Date objects
function daysBetween (firstDate, secondDate) {
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  
  return (Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))));
}

// Helper function which builds the card section detailing either a Vendor or a Customer and returns a Section object
// Sections have a few header fields and conclude with an array of widgets
function buildCustomerVendorSection (QBrecord,custOrvendor) {

  // Build card section detailing Customer or Vendor info
  section = {};
  section.header = (custOrvendor) ? 'Customer Detail' : 'Vendor Detail';
  section.isCollapsible = true;
  
  // Create date object reflecting date customer was created in QB
  var createdDate = new Date(QBrecord.MetaData.CreateTime);

  // check to see if email address field is defined; othewise set to indicate not found
  if (QBrecord.PrimaryEmailAddr) { var emailResult = QBrecord.PrimaryEmailAddr.Address } else { emailResult = 'no email in QB' }; 
  
  section.widgets = [
    {
      'type': 'KeyValue',
      'title': 'Name',
      'content': QBrecord.DisplayName,
      "icon": "PERSON"

    },
    {
      icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_business_black_18dp.png',
      title   : 'Company',
      type    : 'KeyValue',
      content : QBrecord.CompanyName ? QBrecord.CompanyName : ''
    },
    {
      'type': 'KeyValue',
      'title': 'Outstanding unpaid balance',
      'content': '$' + formatMoney(QBrecord.Balance),
      'icon' : 'DOLLAR'
    },
    {
      'type': 'KeyValue',
      'title': 'Currency',
      'content': QBrecord.CurrencyRef.value,
      'icon' : 'DOLLAR'
    },
    {
      'type': 'KeyValue',
      'title': 'First created in QB',
      'content': createdDate.toDateString(),
      'icon' : 'INVITE'
    },
    {
      'type': 'KeyValue',
      'title': 'Email in QB',
      'content': emailResult,
      'icon' : 'EMAIL'
    },
    {
      type: 'TextButton',
      title: 'Edit in QB',
      content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + (custOrvendor ? 'customerdetail' : 'vendordetail') + '?nameId=' + QBrecord.Id,
      action: 'link',
      disabled: false,
      filled: false,
      fullsized: true,
      reload: true      
      
    }
    
  ];             

  
  
  // set to expand fully
  section.numUncollapsible = section.widgets.length;
 
  return section;
}

// Helper function which builds the card section detailing either an Invoice and or Bill and returns a section object
// custOrvendor == true for Customer and false for Vendor
function buildInvoiceBillSection (QBrecord,custOrvendor) {

  // parse dates
  var txnDate = new Date(QBrecord.TxnDate);
  var dueDate = new Date(QBrecord.DueDate);
  var currentDate = new Date();
  var dueDays = daysBetween(dueDate, currentDate);
  
  //console.log( {message: 'dates', data: [dueDate, emailDate, daysBetween(emailDate, dueDate)]});
  
  // Build out invoice / bill detail
  var section = {};
  section.header = 'Outstanding ' + (custOrvendor ? ('Invoice Number ' + QBrecord.DocNumber) : 'Bill');
  section.isCollapsible = true;
  section.numUncollapsible = 3;
  section.widgets = [];
  
  // track current widget
  var cw = 0;

  // Balance outstanding and date created
  section.widgets[cw] =
    {
      'type': 'KeyValue',
      'title': 'Created '+ txnDate.toDateString(),
      'icon' : 'DOLLAR',
      'content': 'Balance $' + formatMoney(QBrecord.Balance)
    };
  cw++; // next widget

  // Due date: insert date and number of days until due or overdue
  section.widgets[cw] =
    {
      'type': 'KeyValue',
      'title': 'Due '+ dueDate.toDateString(),
      'icon' : 'INVITE',
      'content': currentDate < dueDate ? 'Due in ' + dueDays + ' days' : 'Overdue for ' + dueDays + ' days'
    };

/*
  cw++; // next widget

  // Balance outstanding and date created
  section.widgets[cw] =
    {
      'type': 'KeyValue',
      'title': (custOrvendor ? 'Invoice ' : 'Bill ') + 'detail',
      'icon' : 'DESCRIPTION',
      'content': 'click below to expand line items:'
    };
    
 */   
  
/*  
  cw++; // next widget

  // present individual invoice detail as a Dropdown widget with each line represented by an option for drill-down
  section.widgets[cw] = {};
  section.widgets[cw].type = 'DROPDOWN';
  section.widgets[cw].content = [];
  section.widgets[cw].name = 'record' + QBrecord.Id;

  // for each invoice, get line item detail for reference
  for (var j in QBrecord.Line) {
    if (QBrecord.Line[j].DetailType == 'SalesItemLineDetail' || QBrecord.Line[j].DetailType == 'AccountBasedExpenseLineDetail') {
      section.widgets[cw].content[j] = {};
      section.widgets[cw].content[j].text = '$' + formatMoney(QBrecord.Line[j].Amount,0) + ' - ' + QBrecord.Line[j].Description.slice(0,30);// + '..' + ' Qty: ' + QBrecord.Line[j].SalesItemLineDetail.Qty;// + ' Tax: (per) ' + QBrecord.Line[j].SalesItemLineDetail.TaxCodeRef.value;
      section.widgets[cw].content[j].value = j;
      section.widgets[cw].content[j].selected = true;
      
    }
  }
  
*/

  // present individual invoice / bill lines as keyvalue widgets, one per line
  for (var j in QBrecord.Line) {
    if (QBrecord.Line[j].DetailType == 'SalesItemLineDetail' || QBrecord.Line[j].DetailType == 'AccountBasedExpenseLineDetail') {
      // advance to next widget
      cw++;


      section.widgets[cw] = {
        type : 'KeyValue',
        title : QBrecord.Line[j].Description.slice(0,30),
        icon : 'DOLLAR',
        content :  (custOrvendor ? (  'Qty: ' + QBrecord.Line[j].SalesItemLineDetail.Qty + ' x Rate: $' + formatMoney(QBrecord.Line[j].UnitPrice,0) + ' =') : '') + '$' + formatMoney(QBrecord.Line[j].Amount,2),
        buttonText : 'Line ' + QBrecord.Line[j].LineNum
      }
    }  
  }
    
  
  cw++; // next widget
  
  // insert direct link to either Invoice or Bill
  section.widgets[cw] = {};
  section.widgets[cw] = 
    {

      type: 'TextButton',
      title: 'Edit in QB',
      content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + (custOrvendor ? 'invoice' : 'bill') + '?txnId=' + QBrecord.Id,
      action: 'link',
      disabled: false,
      filled: false,
      fullsized: true,
      reload: true      


    };
  cw++; // next widget
  
  return section;
}
//============================================END QB=======================================//

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
		this.ComposedEmailType = {
									REPLY_AS_DRAFT   : 'REPLY_AS_DRAFT',
									STANDALONE_DRAFT : 'STANDALONE_DRAFT'
								};
		this.ContentType = {
								TEXT           : 'TEXT',
								MUTABLE_HTML   : 'MUTABLE_HTML',
								IMMUTABLE_HTML : 'IMMUTABLE_HTML'
							};
		this.Icon = {
						NONE 					 : '',	
						AIRPLANE 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						BOOKMARK 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',	
						BUS 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						CAR 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						CLOCK 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						CONFIRMATION_NUMBER_ICON : 'https://cardinsoft.github.io/outlook/assets/icons/',
						DOLLAR 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						DESCRIPTION 			 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						EMAIL 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						EVENT_PERFORMER 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						EVENT_SEAT 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						FLIGHT_ARRIVAL 			 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						FLIGHT_DEPARTURE 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						HOTEL 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						HOTEL_ROOM_TYPE 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						INVITE 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						MAP_PIN 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						MEMBERSHIP 				 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						MULTIPLE_PEOPLE 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						OFFER 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						PERSON 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						PHONE 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						RESTAURANT_ICON 		 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						SHOPPING_CART 			 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						STAR 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						STORE 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						TICKET 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						TRAIN 					 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						VIDEO_CAMERA 			 : 'https://cardinsoft.github.io/outlook/assets/icons/',
						VIDEO_PLAY 				 : 'https://cardinsoft.github.io/outlook/assets/icons/'
					};
		this.ImageStyle          = {
										SQUARE : 'SQUARE',
										CIRCLE : 'CIRCLE'
									};
		this.LoadIndicator       = {
										NONE    : 'NONE',
										SPINNER : 'SPINNER'
									};
		this.NotificationType    = {
										INFO    : 'INFO',
										WARNING : 'WARNING',
										ERROR   : 'ERROR'
									};
		this.OnClose             = {
										RELOAD_ADD_ON : 'RELOAD_ADD_ON',
										NOTHING       : 'NOTHING'
									};
		this.OpenAs              = {
										OVERLAY   : 'OVERLAY',
										FULL_SIZE : 'FULL_SIZE'
									};
		this.SelectionInputType  = {
										CHECK_BOX    : 'CHECK_BOX',
										RADIO_BUTTON : 'RADIO_BUTTON',
										DROPDOWN     : 'DROPDOWN'
									};
		this.TextButtonStyle     = {
										FILLED : 'FILLED'
									};
		this.UpdateDraftBodyType = {
										IN_PLACE_INSERT : 'IN_PLACE_INSERT'
									};
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
	if(property) { 
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
Navigation.prototype.popCard = function () {
	cardStack.pop();
	return this;
}
Navigation.prototype.popToNamedCard = function (cardName) {
	
}
Navigation.prototype.popToRoot = function () {
	var length = cardStack.length;
	for(var i = 1; i<length; i++) {
		cardStack.pop();
	}
	return this;
}
Navigation.prototype.printJson = function () {
	return JSON.stringify(this);
}
Navigation.prototype.pushCard = function (card) {
	cardStack.push(card);
	return this;
}
Navigation.prototype.updateCard = function (card) {
	cardStack[cardStack.length-1] = card;
	return this;
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
	//access Switch parameters;
	const fieldName = this.fieldName;
	const action    = this.action;
	const selected  = this.selected;
	const value     = this.value;
	
	//create toggler paragraph;
	const pToggle = document.createElement('p');
	parent.append(pToggle);
	
	//create toggler wrapper and set required parameters;
	const wrapToggle = document.createElement('div');
	wrapToggle.className = 'ms-Toggle ms-font-m-plus '+this.className;
	pToggle.append(wrapToggle);
	
	//create input and set required parameters;
	const input     = document.createElement('input');
	input.id        = fieldName;
	input.className = 'ms-Toggle-input';
	input.type      = 'checkbox';
	input.name      = fieldName;
	input.value     = value;
	
	//append toggler wrap and set state listener;
	wrapToggle.append(input);	
	wrapToggle.addEventListener('click',function(e){
		let val = input.value;
		if(val==='true') {
			input.value = 'false'; 
		}else {
			input.value = 'true'; 
		}
	});
	
	//set action if provided;
	if(action) { 
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
	
	if(this.cardHeader) {
		const headerWrap = document.createElement('div');
		headerWrap.id = 'main-Ui-header';
		$('.ms-CommandBar-mainArea').prepend(headerWrap);
		
		if(this.cardHeader.imageUrl) {
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
		if(cardSections.length===1) { serialize = false; }
		
		cardSections.forEach(function(cardSection){
			cardSection.appendToUi( $('#main-Ui-wrap'),serialize );
		});
	}
	
	cardStack.push(this);
	
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

	//access header text and set section header if provided;
	const headerText = this.header;
	if(headerText&&headerText!=='') {
		const header = document.createElement('p');
		header.className = 'ms-font-m-plus sectionHeader';
		header.textContent = headerText;
		section.append(header);
	}
	
	//append widgets wrapper and handle collapsed Ui;
	const widgetsWrap = document.createElement('div');
	if(collapsible) { widgetsWrap.className = 'closed'; }
	section.append(widgetsWrap);
	
	//set wrapper to widgets wrapper;
	let wrapper = widgetsWrap;
	
	//access widgets and append;
	const widgets = this.widgets;
	if(widgets.length!==0) {
		
		//check if at least one widget is a form input;
		const hasInput = widgets.some(function(widget){ 
			
			//access widget's parameters;
			let name      = widget.className;
			let hasSwitch = widget.switchToSet;
			
			//check if widget is a form element;
			let isFormElem = name==='TextInput'||name==='SelectionInput'||hasSwitch;
			
			//return true if found;
			if(isFormElem) {
				return widget;
			}
			
		});
		
		//if found form input -> append form element and set wrapper to form;
		if(hasInput) {
			const formElem = document.createElement('form');
			widgetsWrap.append(formElem);
			wrapper = formElem;
		}
		
		//append widgets to Ui;
		widgets.forEach(function(widget,index){
			widget.appendToUi(wrapper,index);
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
		this.fieldName = '';
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
	
	//append title text if provided;
	if(title) {	
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

	//create input element and set required parameters;
	const input     = document.createElement('input');
	input.type      = 'text';
	input.className = 'ms-TextField-field TextInputInput';
	input.value     = value;
	input.name      = fieldName;
	
	//set optional parameters to input;
	if(action) { input.addEventListener('focusout',actionCallback(action,input)); }
	
	//append input to wrapper;
	inputWrap.append(input);
	
	//initiate Fabric;
	new fabric['TextField'](inputWrap);
	
	//append hint text if provided;
	if(hint) {
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
	
	if(title) {	
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
	btnContent.innerHTML = text;
	button.append(btnContent);
	
	if(!openLink) {
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
	
	if(this.action) {
		const action = this.action;
		widget.addEventListener('click',actionCallback(action));
	}
	
	//handle image creation;
	if(this.url) {
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
	
	if(this.topLabel) {	
		const label = document.createElement('label');
		label.className = 'ms-fontSize-s KeyValueLabel';
		label.textContent = this.topLabel;
		wrapText.append(label);
	}
	const content = document.createElement('span');
	content.className = 'ms-font-m-plus KeyValueText';
	content.innerHTML = this.content;
	wrapText.append(content);
	
	//handle button or switch creation;
	const btn = this.button;
	const sw  = this.switchToSet;
	
	if(btn||sw) {
		const wrapButton = document.createElement('div');
		wrapButton.className = 'column';
		widget.append(wrapButton);	
	
		if(btn) {
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
		
		if(sw) {
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
	if(notif) {
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
const cardStack         = [];
const GLOBAL            = this;