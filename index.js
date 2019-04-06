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

const e = new e_EventObject();
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

const UrlFetchApp = new e_UrlFetchApp();

/**
 * Makes a HTTP request with parameters (optional);
 * @param {String} url url to request;
 * @param {Object=} params parameters object;
 * @returns {Promise}
 */
function makeRequest(url,params) {
	return new Promise(function (resolve,reject) {
		
		//default to GET method if no params provided;
		if(!params) { params = {method : 'get'}; }
		
		//initiate and open XMLHttpRequest;
		let request = new XMLHttpRequest();
			request.timeout = 29000;
			request.open(params.method.toUpperCase(),url);
		
		//if content type is provided -> set request Content-Type header;
		if(params.contentType) { request.setRequestHeader('Content-Type',params.contentType); }
		
		//
		if(params.headers) {
			//access headers to set with request;
			const hs = params.headers;
			
			//set request header for each param header;
			for(var key in hs) {
				let value = hs[key];
				if(value) { request.setRequestHeader(key,value); }
			}
		}
		
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