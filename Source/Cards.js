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
  
  console.log('CONTENT');
  console.log(content);

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
            await createSectionAdvanced(builder,section,j,connector,layout[j]); 
          }
          catch(er) {
			console.error(er);
            //try to handle nested objects that do not conform to our schema;
            await createSectionSimple(builder,section,true,j);
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
    await createConnectorListSection(builder,true,globalConnectorListHeader,config,msg);
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
      try { var response = await cType.run(msg,def); }
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
          await createConnectorListSection(builder,false,'',config,msg);
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