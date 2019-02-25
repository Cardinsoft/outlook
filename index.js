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
 * Creates and shows card with connection edit form;
 * @param {Object} e -> event object;
 */
function editDisplay(e) {
  var icon   = e.parameters.icon;
  var name   = e.parameters.name;
  var url    = e.parameters.url;
  var index  = e.parameters.index;
  var manual = e.parameters.manual;
  if(manual==='true') { manual = true; }else { manual = false; }
  var isDefault = e.parameters.isDefault;
  if(isDefault==='true') { isDefault = true; }else { isDefault = false; }
  var loadFields = e.parameters.loadFields;
  if(loadFields==='true') { loadFields = true; }else { loadFields = false; }
  var field1 = e.parameters.field1;
  var field2 = e.parameters.field2;
  var field3 = e.parameters.field3;
  var isType = e.parameters.isType;
  if(isType==='true') { isType = true; }else { isType = false; }
  
  var connection = {
    icon: icon,
    name: name,
    url: url,
    manual: manual,
    isDefault: isDefault
  };
  if(field1!==undefined) { connection.field1 = field1; }
  if(field2!==undefined) { connection.field2 = field2; }
  if(field3!==undefined) { connection.field3 = field3; }
 
  var builder = CardService.newCardBuilder();
      builder.setHeader(CardService.newCardHeader().setTitle(name).setImageUrl(icon));
  
  if(!isType) {
    createSectionEditConnection(builder,false,connection,loadFields,index,true); //add handling for field1-3 if Zapier;
  }else {
    createSectionAddConnection(builder,false,'',loadFields,connection);
  }
  
  return builder.build();
}

/**
 * Creates and shows card with connection display according to data passed with event object;
 * @param {Object} e -> event object;
 */
function cardDisplay(e) {
  var index  = e.parameters.index;
  var code   = +e.parameters.code;
  var icon   = e.parameters.icon;
  var name   = e.parameters.name;
  var url    = e.parameters.url;
  var data   = e.parameters.data;
  var manual = e.parameters.manual;
  var field1 = e.parameters.field1;
  var field2 = e.parameters.field2;
  var field3 = e.parameters.field3;
  var start  = e.parameters.start;
  if(manual==='true') { manual = true; }else { manual = false; } //e.parameters accepts only strings;
  var connection = {'icon':icon,'name':name,'url':url,'manual':manual,'field1':field1,'field2':field2,'field3':field3};
  
  var msg = getToken();
  
  var builder = CardService.newCardBuilder();
      builder.setHeader(CardService.newCardHeader().setTitle(name).setImageUrl(icon));
  
  var error = e.parameters.error;
  if(error!==undefined) {
    createErrorSection(builder,false,code,error);
  }
  
  var data = parseData(data);
  if(data.length===0&&error===undefined) { createNoFieldsSection(builder,false); }
  //createSectionBack(builder,false,index); - commented out for 1.0 release, but might be needed for future releases;

  try {

    if(data.length!==0) {
    
      //check if there are any nested objects or not;
      var hasNested = checkNested(data);
      if(hasNested) {
      
        for(var j=0; j<data.length; j++) {
          var obj = data[j];
          var keys = Object.keys(obj);
          var overrides = {};
          if(keys.indexOf('header')!==-1)           { overrides.header = obj.header; }
          if(keys.indexOf('isCollapsible')!==-1)    { overrides.isCollapsible = obj.isCollapsible; }
          if(keys.indexOf('numUncollapsible')!==-1) { overrides.numUncollapsible = obj.numUncollapsible; }
          createSectionsShow(builder,code,data,obj,overrides,index,j,connection);     
        }
        
        var hasEditable = checkEditable(data);
        if(hasEditable) {
          var updateButton = textButtonWidget(globalUpdateShowText,false,false,'updateSectionsShow',{'data':JSON.stringify(data),'connection':JSON.stringify(connection)});
          var updateSection = CardService.newCardSection();
              updateSection.addWidget(updateButton);
          builder.addSection(updateSection);
        }
        
      }else {
        var cap = 0, fullLength = 0;
        
        //handle full data length (including all fields)
        for(var i=0; i<data.length; i++) {
          try {var result = JSON.parse(data[i]);}
          catch(er) { result = data[i]; }
          for(var key in result) { fullLength += 1; }      
        }
        
        //handle number of sections to display at one time
        for(var max=0; max<data.length; max++) {
          if(cap>=globalWidgetsCap) { break; }
          try {var result = JSON.parse(data[max]);}
          catch(er) { result = data[max]; }
          for(var key in result) { cap += 1; }
        }
        
        if(start!==undefined) { 
          var begin = +start;
          max = max + begin;
        }else {
          begin = 0; 
        }
        
        for(var j=begin; j<data.length; j++) {
          if(j===max) { break; }
          var result = data[j];
          if(data.length!==1) {
            createSectionShow(builder,result,true,j);
          }else {
            createSectionShow(builder,result,false,j);
          }
        }
      
      }
      
    }
  
  }
  catch(err) {
    
    createUnparsedSection(builder,true,err.message,JSON.stringify(data));
    
  }
  
  var length = data.length;
  var diff = max-begin;
  
  if(fullLength>cap) {
    var end = length-1;
    if(length>max||length+diff-1===max) {
      var prev = (begin-diff);
      createExtraDataSection(builder,false,end,prev,max,200,index,icon,url,name,manual,data);
    }
  }

  return builder.build();
}

/**
 * Generates a display of connections card;
 * @param {Object} e -> event object;
 *
 */
async function cardsetDisplay(e,builder,idx) {
	var msg = getToken();
	var config = await getProperty('config','user');
  
	var section;
  
	for(var index=0; index<config.length; index++) {
		var connect = config[index];
		var icon   = connect.icon;
		var name   = connect.name;
		var url    = connect.url;
		var manual = connect.manual;
		var field1 = connect.field1;
		var field2 = connect.field2;
		var field3 = connect.field3;

		if(section===undefined) { 
			section = CardService.newCardSection(); 
			section.setCollapsible(false);
			//section.setNumUncollapsibleWidgets(globalNumUncollapsible);
		}
		
		if(!manual) {
			
			if(field1!==undefined||field2!==undefined||field3!==undefined) {
				var dataToPass = {};
				if(field1!==undefined) { dataToPass.field1 = field1; }
				if(field2!==undefined) { dataToPass.field2 = field2; }
				if(field3!==undefined) { dataToPass.field3 = field3; }
				var response = await performFetch(e,url,dataToPass);
			}else {
				response = await performFetch(e,url);
			}			
			
			const code = response.code;
			
			if(code>=200&&code<300) {
				
				var data = parseData(response.content);
				var len = data.length;
				
				if(len!==0) {
				  var button = textButtonWidget(globalSuccess,true,false,'actionShow');
				}else {
				  button = textButtonWidget(globalNoData,true,false,'actionShow');
				}
				
				var widget = actionKeyValueWidgetButton(icon,'',name,button,'actionShow',{'code':code.toString(),'index':index.toString(),'icon':icon,'url':url,'name':name,'manual':manual.toString(),'data':JSON.stringify(data)});
				
			}else { //handle incorrect urls;
			
				button = textButtonWidget(globalError,true,false,'actionShow');
				widget = actionKeyValueWidgetButton(icon,'',name,button,'actionShow',{'code':code.toString(),'error':response.content,'index':index.toString(),'icon':icon,'url':url,'name':name,'manual':manual.toString()});
			
			}

		}else { //handle manually triggered connections;
		  
			button = textButtonWidget(globalManual,true,false,'actionManual');
			var params = {
				'index':index.toString(),
				'icon':icon,
				'url':url,
				'name':name,
				'manual':manual.toString()
			};
			if(field1!==undefined) { params.field1 = field1; }
			if(field2!==undefined) { params.field2 = field2; }
			if(field3!==undefined) { params.field3 = field3; } 
			widget = actionKeyValueWidgetButton(icon,'',name,button,'actionManual',params);		  
			
		}
		
		section.addWidget(widget);
	
	}
  
	builder.addSection(section);
	return builder.build();
}

/**
 * Triggers either a welcome or display of connections card generators;
 * @param {Object} e -> event object;
 * @params {Integer} index
 * @returns {Card}
 */
async function cardOpen(e,index) {
	var builder = CardService.newCardBuilder();
	
	$('.main-Ui-header').empty();
	
	var src = await getProperty('config','user');
	let config;
	if(src!==null) {
		config = src;
	}else {
		config = [];
	}
	
	var hasDefault = config.some(function(conn){ if( conn.isDefault!==false && conn.isDefault!==undefined ) { return conn; } });
	if(hasDefault) {	
		
		var def = config.filter(function(conn){ if( conn.isDefault===true ) { return conn; } })[0];
		
		//set parameters to pass with event object;
		e.parameters.icon      = def.icon;
		e.parameters.name      = def.name;
		e.parameters.url       = def.url;
		e.parameters.manual    = def.manual.toString();
		e.parameters.isDefault = def.isDefault.toString();
		if(def.field1!==undefined) { e.parameters.field1 = def.field1; }
		if(def.field2!==undefined) { e.parameters.field2 = def.field2; }
		if(def.field3!==undefined) { e.parameters.field3 = def.field3; }	

		var response = performFetch(e,def.url);
		var code     = response.code;
		var data     = response.content; 
		
		e.parameters.code = code;
		
		if(code>=200&&code<300) {
    
			var len = data.length;
			if(len!==0) { e.parameters.data = data; }
    
		}else { //handle incorrect urls;
    
			e.parameters.data  = '[]';
			e.parameters.error = data;
    
		}

		return cardDisplay(e);
	
	}else {
	  
		if(config.length===0) {//build welcome and settings card on install;
			builder.setHeader(CardService.newCardHeader().setTitle(globalOpenHeader));
			createSectionChooseType(builder,false,globalChooseTypeHeader);
			createSectionAddConnection(builder,true,globalAddConnectionHeader,true);
			createSectionWelcome(builder,false);
		}else {//build display card if any connections;
			cardsetDisplay(e,builder,index);
		}
	
	}
	  
	return builder.build();
}

/**
 * Generates settings card according to configuration;
 * @param {Object} e -> event object;
 */
async function cardSettings() {
	var builder = CardService.newCardBuilder();
	//builder.setHeader(CardService.newCardHeader().setTitle(globalSettingsHeader)); - not needed for 1.0 release;
      
	var src = await getProperty('config','user');
	let config;
	if(src!==null) {
		config = src;
	}else {
		config = [];
	}
  
	if(config.length!==0) {
		createConfiguredConnectsSection(builder,true,6,config);
	}
  
	createSectionChooseType(builder,false,globalChooseTypeHeader);
	createSectionAddConnection(builder,true,globalAddConnectionHeader,true);  
	createAdvanced(builder,false,globalAdvancedHeader);
  
	return builder.build();
}

/**
 * Generates help card;
 * @param {Object} e -> event object;
 */
function cardHelp(e) {
	var builder = CardService.newCardBuilder();
		builder.setHeader(CardService.newCardHeader().setTitle(globalHelpHeader));
      
	createSectionWelcome(builder,false);

	return builder.build();
}
//===========================================END CARD===========================================//

//===============================================SECTIONS===============================================//
/**
 *
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 */
function createGoToSettingsSection(builder,isCollapsed) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
      
  createWidgetGoToSettings(section,false);

  builder.addSection(section);
}

/**
 * Creates section with a list of configured connections;
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {Integer} numUncollapsible -> number of widgets to show in a list initially;
 * @param {Array} config -> an array of connection settings objects;
 */
function createConfiguredConnectsSection(builder,isCollapsed,numUncollapsible,config) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);   
      if(isCollapsed) { section.setNumUncollapsibleWidgets(numUncollapsible); }
      section.setHeader(globalConfiguredHeader);
  try {
    config.forEach(function(connection,index) {
      var icon      = connection.icon;
      var name      = connection.name;
      var url       = connection.url;
      var manual    = connection.manual;
      var isDefault = connection.isDefault;
      if(isDefault===undefined) { isDefault = false; }
      var field1    = connection.field1;
      var field2    = connection.field2;
      var field3    = connection.field3;
      
      var parameters = {'index':index.toString(),'icon':icon,'url':url,'name':name,'manual':manual.toString(),'isDefault':isDefault.toString()};
      if(field1!==undefined) { parameters['field1'] = field1; }
      if(field2!==undefined) { parameters['field2'] = field2; }
      if(field3!==undefined) { parameters['field3'] = field3; }
      
      var widget = actionKeyValueWidget(icon,'',name,'actionEdit',parameters);
      section.addWidget(widget);
    
    });
  }
  catch(e) {  
    var resetText = simpleKeyValueWidget(globalConfigErrorWidgetTitle,globalConfigErrorWidgetContent,true);
    var resetBtn = textButtonWidget(globalResetWidgetSubmitText,false,false,'testDeleteAllUP');
    
    section.addWidget(resetText); 
    section.addWidget(resetBtn);
  }
  
  builder.addSection(section);
}

/**
 *
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {} end -> 
 * @param {} begin -> 
 * @param {} max -> 
 * @param {Integer} code -> 
 * @param {} index -> 
 * @param {} icon -> 
 * @param {} url -> 
 * @param {} name -> 
 * @param {Boolean} manual -> 
 * @param {} data -> 
 */
function createExtraDataSection(builder,isCollapsed,end,begin,max,code,index,icon,url,name,manual,data) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
      
  var restText = simpleKeyValueWidget(globalExtraDataTitle,globalExtraDataText,true);
  section.addWidget(restText);
  
  var parameters = {
    'code':code.toString(),
    'index':index.toString(),
    'icon':icon,
    'url':url,
    'name':name,
    'manual':manual.toString(),
    'data':JSON.stringify(data),
    'start':max.toString()
  };
  var show = textButtonWidget(globalLoadExtraForwardText,false,false,'actionShow',parameters);
  parameters.start = begin.toString();
  var back = textButtonWidget(globalLoadExtraBackText,false,false,'actionShow',parameters);
  
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
 * Creates section for no data to show scenario;
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
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
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {Integer} index ->
 */
function createSectionBack(builder,isCollapsed,index) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
  
  createWidgetsBackAndToRoot(section,index);
  
  builder.addSection(section);
}

/**
 *
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {} error -> 
 *
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
 *
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {} code ->
 * @param {} error -> 
 */
function createErrorSection(builder,isCollapsed,code,error) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 

  var errCode = simpleKeyValueWidget(globalCodeWidgetTitle,code,true);
  section.addWidget(errCode);

  var errText = simpleKeyValueWidget(globalErrorWidgetTitle,error,true);
  section.addWidget(errText);

  builder.addSection(section);
}

/**
 * Handles sections generation if a simple json schema (an array of objects with key-value pairs) is provided;
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Array} data -> a set of key-value pairs representing widgets; 
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {Integer} index -> result index to append to section header;
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
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Integer} code -> response status code;
 * @param {Object} data -> full data array with card display settings;
 * @param {Object} obj -> data object element with section display settings;
 * @param {Object} overrides -> a set of settings to override defaults with;
 * @param {} paramIdx -> ;
 * @param {} idx -> ;
 * @param {} connection -> ;
 */
function createSectionsShow(builder,code,data,obj,overrides,paramIdx,idx,connection) {
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
        var type    = widget.type;
        var title   = widget.title;
        var name    = widget.name;
        var content = widget.content;
        switch(type) {
          case 'TextParagraph':
            element = textWidget(content);
            break;
          case 'KeyValue':
            var isMultiline = widget.isMultiline;
            if(isMultiline===undefined) { isMultiline = true; }
            var iconUrl     = widget.icon;
            if(iconUrl===undefined) { iconUrl = ''; }
            var switchValue = widget.switchValue;
            var buttonText = widget.buttonText;
            if(switchValue!==undefined) {
              element = switchWidget(title,content,name,switchValue,switchValue);
            }else {
            
              //parameters to pass to edit handler to ensure correct card reload;
              var params = {
                'code' : code.toString(),
                'sectionIdx' : idx.toString(),
                'widgetIdx' : index.toString(),
                'data' : JSON.stringify(data),
                'connection' : JSON.stringify(connection)
              }; 
              if(paramIdx!==undefined) { params.paramIdx = paramIdx.toString(); }
            
              if(buttonText!==undefined) {
                var button = textButtonWidget(buttonText,true,false);
                if(state!=='editable') {
                  element = simpleKeyValueWidget(title,content,isMultiline,iconUrl,button);
                }else {
                  element = actionKeyValueWidgetButton(iconUrl,title,content,button,'editSectionsShow',params);
                }
              }else {
                if(state!=='editable') {
                  element = simpleKeyValueWidget(title,content,isMultiline,iconUrl);
                }else {
                  element = actionKeyValueWidget(iconUrl,title,content,'editSectionsShow',params);
                }
              }
            }
            break;
          case 'TextInput':
            var hint = widget.hint;
            element = textInputWidget(title,name,hint,content);
            break;
          case 'Radio':
            element = selectionInputWidget(title,name,type.toLowerCase(),content);
            break;
          case 'Checkbox':
            element = selectionInputWidget(title,name,type.toLowerCase(),content);
            break;
          case 'Dropdown':
            element = selectionInputWidget(title,name,type.toLowerCase(),content);
            break;
        }
      }
      section.addWidget(element);
    });
  builder.addSection(section);
  }
 
}

/**
 * Creates a section for metadata;
 * @param {CardBuilder} builder -> card builder;
 * @param {Message} msg -> current message;
 * @param {String} sender -> email address string;
 * @param {String} updates -> JSON string with a list of updates;
 */
function createSectionMeta(builder,isCollapsed,msg) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  var from = simpleKeyValueWidget('<b>From: </b>',trimFrom(msg.getFrom()),false); 
  section.addWidget(from);
  
  builder.addSection(section);
}

/**
 * 
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {String} header -> section header text;
 */
function createSectionWelcome(builder,isCollapsed,header) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined) { section.setHeader(header); }
  
  createWidgetWelcomeText(section);
  
  createWidgetWelcomeCardin(section);
  
  createWidgetWelcomeYouTube(section);
  
  builder.addSection(section);
}

/**
 *
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {String} header -> section header text;
 */
function createSectionChooseType(builder,isCollapsed,header) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined) { section.setHeader(header); }
  
  var paramsSheets = {
    'icon':globalSheetsIconUrl,
    'name':globalSheetsContent,
    'url':'',
    'manual':'true',
    'isType':'true',
    'loadFields':'false'
  };
  var paramsFlow = {
    'icon':globalFlowIconUrl,
    'name':globalFlowContent,
    'url':'',
    'manual':'true',
    'isType':'true',
    'loadFields':'false'
  };
  var paramsZapier = {
    'icon':globalZapierIconUrl,
    'name':globalZapierContent,
    'url':'',
    'manual':'true',
    'isType':'true',
    'loadFields':'true'
  };
  var paramsFttt = {
    'icon':globalIftttIconUrl,
    'name':globalIftttContent,
    'url':'',
    'manual':'true',
    'isType':'true',
    'loadFields':'false'
  };
  
  //types go here
  createWidgetCreateType(section,globalSheetsIconUrl,globalSheetsContent,paramsSheets);
  createWidgetCreateType(section,globalFlowIconUrl,globalFlowContent,paramsFlow);
  createWidgetCreateType(section,globalZapierIconUrl,globalZapierContent,paramsZapier);
  createWidgetCreateType(section,globalIftttIconUrl,globalIftttContent,paramsFttt);
  
  builder.addSection(section);
}

/**
 *
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {String} header -> section header text;
 * @param {Object} connection -> 
 * @param {Boolean} loadFields ->
 */
function createSectionAddConnection(builder,isCollapsed,header,loadFields,connection) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined&&header!=='') { section.setHeader(header); }
  if(!isCollapsed&&connection===undefined) { createWidgetCustomConnect(section); }
  
  if(connection!==undefined) {
    createWidgetSetIcon(section,globalCustomWidgetIconTitle,globalCustomWidgetIconHint,connection.icon);
    createWidgetSetName(section,globalCustomWidgetNameTitle,globalCustomWidgetNameHint,connection.name);
    createWidgetSetUrl(section,globalCustomWidgetInputTitle,globalCustomWidgetHint,connection.url);
  }else {
    createWidgetSetIcon(section,globalCustomWidgetIconTitle,globalCustomWidgetIconHint);
    createWidgetSetName(section,globalCustomWidgetNameTitle,globalCustomWidgetNameHint);
    createWidgetSetUrl(section,globalCustomWidgetInputTitle,globalCustomWidgetHint);
  }
  
  if(loadFields) {
    createWidgetSetField(section,globalCustomWidgetFieldTitle+'1 (optional)',globalCustomWidgetFieldHint,'',1);
    createWidgetSetField(section,globalCustomWidgetFieldTitle+'2 (optional)',globalCustomWidgetFieldHint,'',2);
    createWidgetSetField(section,globalCustomWidgetFieldTitle+'3 (optional)',globalCustomWidgetFieldHint,'',3);
  }
  
  createWidgetSwitchManual(section,true);
  
  createWidgetSwitchDefault(section,false);
  
  createWidgetCreateConnection(section,globalCustomWidgetSubmitText);
  
  builder.addSection(section);
}

/**
 *
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {} connection ->
 * @param {Boolean} loadFields -> 
 * @param {} index -> 
 * @param {} fromSettings -> 
 */
function createSectionEditConnection(builder,isCollapsed,connection,loadFields,index,fromSettings) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);  
      section.setHeader(globalSettingsHeader);
  
  var del = textButtonWidget(globalRemoveConnectionText,false,false,'removeConnection',{'index':index,'fromSettings':fromSettings.toString()});
  section.addWidget(del);
  
  createWidgetSetIcon(section,globalCustomWidgetIconTitle,globalCustomWidgetIconHint,connection.icon);
  createWidgetSetName(section,globalCustomWidgetNameTitle,globalCustomWidgetNameHint,connection.name);
  createWidgetSetUrl(section,globalCustomWidgetInputTitle,globalCustomWidgetHint,connection.url,'checkURL');
  
  if(loadFields) {
    var field1 = connection.field1, field2 = connection.field2, field3 = connection.field3;
    if(field1===undefined) { field1 = ''; }
    if(field2===undefined) { field2 = ''; }
    if(field3===undefined) { field3 = ''; }
    
    createWidgetSetField(section,globalCustomWidgetFieldTitle+'1 (optional)',globalCustomWidgetFieldHint,field1,1);
    createWidgetSetField(section,globalCustomWidgetFieldTitle+'2 (optional)',globalCustomWidgetFieldHint,field2,2);
    createWidgetSetField(section,globalCustomWidgetFieldTitle+'3 (optional)',globalCustomWidgetFieldHint,field3,3);
  }
  
  createWidgetSwitchManual(section,connection.manual);
  
  createWidgetSwitchDefault(section,connection.isDefault);
  
  var save = textButtonWidget(globalUpdateConnectionText,false,false,'updateConnection',{'index':index,'fromSettings':fromSettings.toString()});
  section.addWidget(save);
  
  builder.addSection(section);   
}

/**
 *
 * @param {CardBuilder} builder -> card builder to append section to;
 * @param {Boolean} isCollapsed -> truthy value to determine whether to generate section as collapsible;
 * @param {String} header -> section header text;
 */
function createAdvanced(builder,isCollapsed,header) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);
  if(header!==undefined) { section.setHeader(header); }

  createWidgetResetText(section);
  
  createWidgetResetSubmit(section);

  builder.addSection(section);  
}

//===============================================WIDGETS===============================================//
/**
 *
 * @param {CardSection} section -> section to append widget sets;
 *
 */
function createWidgetCreateType(section,url,content,params) {
  var widget = actionKeyValueWidget(url,'',content,'editDisplay',params);
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 * @param {String} title -> title text of the widget;
 */
function createWidgetSetField(section,title,hint,content,num) {
  var widget = textInputWidget(title,'field'+num,hint,content);
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 *
 */
function createWidgetGoToSettings(section) {
  var widget = textButtonWidget(globalGoToSettings,false,false,'cardSettings');
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 *
 */
function createWidgetWelcomeText(section) {
  var widget = simpleKeyValueWidget(globalWelcomeWidgetTitle,globalWelcomeWidgetContent,true);
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 *
 */
function createWidgetWelcomeCardin(section) {
  var widget = textButtonWidgetLinked(globalCardinUrlText,false,false,globalCardinUrl,false,false);
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 *
 */
function createWidgetWelcomeYouTube(section) {
  var widget = textButtonWidgetLinked(globalYouTubeUrlText,false,false,globalYouTubeUrl,false,false);
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 *
 */
function createWidgetCustomConnect(section) {
  var widget = simpleKeyValueWidget(globalCustomWidgetTitle,globalCustomWidgetContent,true);
  section.addWidget(widget);  
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 * @param {String} title -> title text of the widget;
 */
function createWidgetSetUrl(section,title,hint,url) {
  if(url!==undefined) { var content = url; }else { content = ''; }
  var widget = textInputWidget(title,'connectionURL',hint,content,'checkURL');
  section.addWidget(widget);   
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 * @param {String} title -> title text of the widget;
 */
function createWidgetSetName(section,title,hint,name) {
  if(name!==undefined) { var content = name; }else { content = ''; }
  var widget = textInputWidget(title,'connectionName',hint,content);
  section.addWidget(widget);  
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 * @param {String} title -> title text of the widget;
 */
function createWidgetSetIcon(section,title,hint,icon) {
  if(icon!==undefined) { var content = icon; }else { content = ''; }
  var widget = textInputWidget(title,'connectionIcon',hint,content);
  section.addWidget(widget);
}

/**
 * 
 * @param {CardSection} section -> section to append widget sets;
 *
 */
function createWidgetCreateConnection(section,text) {
  var widget = textButtonWidget(text,false,false,'createConnection');
  section.addWidget(widget);   
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 */
function createWidgetResetText(section) {
  var widget = simpleKeyValueWidget(globalResetWidgetTitle,globalResetWidgetContent,true);
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 */
function createWidgetClearText(section) {
  var widget = simpleKeyValueWidget(globalClearWidgetTitle,globalClearWidgetContent,true);
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 */
function createWidgetResetSubmit(section) {
  var widget = textButtonWidget(globalResetWidgetSubmitText,false,false,'performFullReset');
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 */
function createWidgetClearSubmit(section) {
  var widget = textButtonWidget(globalClearWidgetSubmitText,false,false,'clearLayout');
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 * @param {Boolean} isManual -> 
 */
function createWidgetSwitchManual(section,isManual) {
  if(isManual===undefined) { isManual = true; }
  var widget = switchWidget('',globalCustomWidgetSwitchText,'manual',isManual,true);
  section.addWidget(widget);
}

/**
 * 
 * @param {CardSection} section -> section to append widget sets;
 * @param {Boolean} isDefault -> 
 */
function createWidgetSwitchDefault(section,isDefault) {
  if(isDefault===undefined||isDefault==='true') { isDefault = true; }
  var widget = switchWidget('',globalIsDefaultWidgetSwitchText,'isDefault',isDefault,true);
  section.addWidget(widget);
}

/**
 *
 * @param {CardSection} section -> section to append widget sets;
 *
 */
function createWidgetsBackAndToRoot(section,index) {
  var root = textButtonWidget(globalRootText,false,false,'goRoot',{'index':index});
  var widget = buttonSet([root]);
  section.addWidget(widget);
}

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
 * @param {String} title -> title of the input;
 * @param {String} name -> fieldname of the input;
 * @param {String} hint -> text that appears on the input;
 * @param {String} value -> value that is passed to widget by default;
 * @param {String} changeFunc -> name of the function fired on user change;
 * @param {Boolean} hasSpinner -> truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params -> parameters to pass to function;
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
 * @param {textInput} textInputWidget -> text input to append suggestions to;
 * @param {Suggestions} suggestions -> list of suggestions to append;
 * @param {String} suggestFunc -> function name to fire on suggestion select;
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
 * @param {Array} suggestions -> an array of string values for creating options;
 * @returns {Suggestions}
 */
function suggestion(suggestions) {
  var list = CardService.newSuggestions();
      list.addSuggestions(suggestions);
  return list;
}

/**
 * Creates a set of buttons for chaining;
 * @param {Array} buttons -> an array of button widgets to add to button set;
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
 * @param {String} text -> text to appear on the button;
 * @param {Boolean} disabled -> truthy value to disable / enable click event;
 * @param {Boolean} isFilled -> sets buttons style to filled if true;
 * @param {String} changeFunc -> name of the function fired on user click;
 * @param {Object} params -> parameters to pass to function;
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
 * Creates a button widget with link action set to it instead of an inbound action;
 * @param {String} text -> text to appear on the button;
 * @param {Boolean} disabled -> truthy value to disable / enable click event;
 * @param {Boolean} isFilled -> sets buttons style to filled if true;
 * @param {String} url -> URL being opened on user button click;
 * @param {Boolean} fullsized -> truthy value to detemine whether to open link as fullsized or overlayed;
 * @param {Boolean} needsReload -> truthy value to determine whether it needs to reload the Add-on on link close;
 * @returns {TextButton} 
 */
function textButtonWidgetLinked(text,disabled,isFilled,url,fullsized,needsReload) {
  var widget = CardService.newTextButton();
      widget.setText(text);
      widget.setDisabled(disabled);
      
      if(isFilled) { widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED); }
      
      var openLink = CardService.newOpenLink();
          openLink.setUrl(url);
      if(fullsized) { openLink.setOpenAs(CardService.OpenAs.FULL_SIZE); }else { openLink.setOpenAs(CardService.OpenAs.OVERLAY); }
      if(needsReload) { openLink.setOnClose(CardService.OnClose.RELOAD_ADD_ON); }else { openLink.setOnClose(CardService.OnClose.NOTHING); }
      widget.setOpenLink(openLink);

  return widget;
}

/*
 * Creates a button widget with icon content;
 * @param {Icon} icon -> icon object to appear on the button;
 * @param {String} changeFunc -> name of the function fired on user click;
 * @param {Object} params -> parameters to pass to function;
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
 * Creates an image widget;
 * @param {String} src -> string url of publicly deployed image;
 * @param {String} alt -> text to display if image cannot be loaded or denied access;
 * @param {String} clickFunc -> name of the function fired on user click;
 * @param {Boolean} hasSpinner -> truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params -> parameters to pass to function;
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
 * Creates a switch widget (in conjunction with a KeyValue as this is the only way to create a switch);
 * @param {String} title -> title of the input;
 * @param {String} text -> text to display as switch label;
 * @param {String} name -> unique fieldname (non-unique if multi-switch widget);
 * @param {Boolean} selected -> truthy value to set on / off click event;
 * @param {String} value -> value to pass to handler if selected;
 * @param {String} changeFunc -> name of the function fired on user change;
 * @param {Boolean} hasSpinner -> truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params -> parameters to pass to function;
 * @returns {KeyValue} 
 */
function switchWidget(title,text,name,selected,value,changeFunc,hasSpinner,params) {  
  var keyValue = CardService.newKeyValue();
  if(title!==''&&title!==undefined) { keyValue.setTopLabel(title); }
      keyValue.setContent(text);
  
  var widget = CardService.newSwitch();
      widget.setFieldName(name);
      widget.setSelected(selected);
      widget.setValue(value);
  if(changeFunc!==undefined) { 
    var action = CardService.newAction();
        action.setFunctionName(changeFunc);
    if(hasSpinner) { action.setLoadIndicator(CardService.LoadIndicator.SPINNER) }
    if(params!==undefined) {action.setParameters(params);}
    widget.setOnChangeAction(action);
  }
  
  keyValue.setSwitch(widget);
  return keyValue;
}

/** 
 * Creates an unclickable keyValue widget (for labeled text purposes) - due to a possible bug in param assignment;
 * @param {String} iconUrl -> url of icon to use;
 * @param {String} top -> label text;
 * @param {String} content -> content text;
 * @param {Boolean} isMultiline -> truthy value for determining multiline feature;
 * @param {TextButton} button -> a button object to add on the right; 
 * @returns {KeyValue}
 */
function simpleKeyValueWidget(top,content,isMultiline,iconUrl,button) {
  var widget = CardService.newKeyValue();
      widget.setTopLabel(top);
      widget.setContent(content);
      widget.setMultiline(isMultiline);
  if(button!==undefined) { widget.setButton(button); }
  if(iconUrl!==undefined) { widget.setIconUrl(iconUrl); }
  return widget;
}

/** 
 * Creates a keyValue widget (for labeled text purposes);
 * @param {String} iconUrl -> url of icon to use;
 * @param {String} top -> label text;
 * @param {String} content -> content text;
 * @param {String} clickFunc -> name of the function fired on user click;
 * @param {Object} params -> parameters to pass to function;
 * @returns {KeyValue} 
 */
function actionKeyValueWidget(iconUrl,top,content,clickFunc,params) {
  if(content instanceof Date) { content = content.toLocaleDateString(); }
  var widget = CardService.newKeyValue();
      widget.setTopLabel(top);
      widget.setContent(content);
      widget.setIconUrl(iconUrl);

  var action = CardService.newAction();
      action.setFunctionName(clickFunc);
  if(params!==undefined) {action.setParameters(params);}
  widget.setOnClickAction(action);
      
  return widget;
}

/** 
 * Creates a keyValue widget with button on the right (for labeled text purposes);
 * @param {String} iconUrl -> url of icon to use;
 * @param {String} top -> label text;
 * @param {String} content -> content text;
 * @param {TextButton} button -> a button object to add on the right; 
 * @param {String} clickFunc -> name of the function fired on user click;
 * @param {Object} params -> parameters to pass to function;
 * @returns {KeyValue} 
 */
function actionKeyValueWidgetButton(iconUrl,top,content,button,clickFunc,params) {
  if(content instanceof Date) { content = content.toLocaleDateString(); }
  var widget = CardService.newKeyValue();
      widget.setTopLabel(top);
      widget.setContent(content);
      widget.setIconUrl(iconUrl);
      widget.setButton(button);
  
  var action = CardService.newAction();
      action.setFunctionName(clickFunc);
  if(params!==undefined) {action.setParameters(params);}
  widget.setOnClickAction(action);
      
  return widget;  
}

/**
 * Creates a selection widget with specified options;
 * @param {String} title -> title of the input;
 * @param {String} name -> fieldname of the input;
 * @param {String} type -> type of select to render: checkboxes / radio btns / dropdown list;
 * @param {String} changeFunc -> name of the function fired on value change;
 * @param {Object} params -> parameters to pass to function;
 * @returns {SelectionInput}
*/
function selectionInputWidget(title,name,type,options,changeFunc,params) {
  var widget = CardService.newSelectionInput();
  switch(type) {
    case 'checkbox':
      widget.setType(CardService.SelectionInputType.CHECK_BOX);
    break;
    case 'dropdown':
      widget.setType(CardService.SelectionInputType.DROPDOWN);
    break;
    case 'radio':
      widget.setType(CardService.SelectionInputType.RADIO_BUTTON);
    break;
  }
  widget.setTitle(title);
  widget.setFieldName(name);
  
  if(changeFunc!==undefined) { 
    var action = CardService.newAction();
        action.setFunctionName(changeFunc);
        action.setLoadIndicator(CardService.LoadIndicator.SPINNER);
    if(params!==undefined) {action.setParameters(params);}
    widget.setOnChangeAction(action);
  }
  
  var anySelected = options.some(function(option) { return option.selected===true; });
  if(!anySelected) { widget.addItem('...','',true); }
  options.forEach(function(option) { widget.addItem(option.text,option.value,option.selected); });
  
  return widget;
}

//===============================================ACTIONS===============================================//
/**
 *
 */
function clearLayout() {
	var action = CardService.newActionResponseBuilder();
		action.setStateChanged(true);  
  
	var cache = CacheService.getScriptCache();
	cache.remove('layout');
  
	cardOpen();
	
	action.setNotification(notification(globalClearSuccess));
  
	return action.build();
}

/**
 *
 */
function goBack() {
	var action = CardService.newActionResponseBuilder();
		action.setStateChanged(true);
		action.setNavigation(CardService.newNavigation().popCard());
  
	return action.build();  
}

/**
 *
 */
function actionDisplay() {
	var action = CardService.newActionResponseBuilder();
		action.setStateChanged(true);
	
	cardsetDisplay();
	
	return action.build();
}

//===============================================NOTIFICATIONS===============================================//

/**
 * Creates a notification to show;
 * @param {String} text -> text to display when fired;
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
 * @param {String} text -> text to display when fired;
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
 * @param {String} text -> text to display when fired;
 * @returns {Notification}
 */
function error(text) {
  var error = CardService.newNotification();
      error.setType(CardService.NotificationType.ERROR);
      error.setText(text);
  return error;
}

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
	return async function(e) {
		const functionName  = action.functionName;
		const loadIndicator = action.loadIndicator;
		const parameters    = action.parameters;
		
		if(loadIndicator!=='NONE') {
			const overlay = $('#app-overlay');
			//overlay.show();
		}
		
		await callbacks[functionName](parameters,element)
		
		//$('#app-overlay').hide();
		
	}
}

const callbacks = {
	blink : function (parameters) { //blink is a debug function and is not used outside testing environment!
		return new Promise(
			function(resolve) {
				setTimeout(function() { resolve(); },3000);
			}
		);
	},
	//==============================START ACTIONS==============================//
	editSectionsShow : function editSectionsShow(e) {
		return new Promise(
			async function(resolve) {
				var parameters = e.parameters;
  
				var sectionIdx = +parameters.sectionIdx;
				var widgetIdx  = +parameters.widgetIdx;
				var data       = JSON.parse(parameters.data);
				var connection = JSON.parse(parameters.connection);
  
				data[sectionIdx].widgets[widgetIdx].type = 'TextInput';

				e.parameters.index  = parameters.paramIdx;
				e.parameters.icon   = connection.icon;
				e.parameters.name   = connection.name;
				e.parameters.url    = connection.url;
				e.parameters.manual = connection.manual;
				e.parameters.field1 = connection.field1;
				e.parameters.field2 = connection.field2;
				e.parameters.field3 = connection.field3;
				e.parameters.data   = JSON.stringify(data);
  
				return cardDisplay(e);
			}
		);
	},
	updateSectionsShow : function updateSectionsShow(e) {
		return new Promise(
			async function(resolve) {
				var conn = JSON.parse(e.parameters.connection);
				var data = JSON.parse(e.parameters.data);
				var form = e.formInput; //change to formInputs for multiselect;
		  
				data.forEach(function(elem){
					var widgets = elem.widgets;
					widgets.forEach(function(widget){
			  
						var type = widget.type;
				  
						for(var key in form) {
							if(key===widget.name) {
								if(type==='Radio'||type==='Checkbox'||type==='Dropdown') {
									var content = widget.content;
									content.forEach(function(option){
										if(option.value===form[key]) { option.selected = true; }else { option.selected = false; }
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
						var noInput = !Object.keys(form).some(function(key){ return key===widget.name; });
						if(type==='KeyValue'&&widget.switchValue!==undefined&&noInput) {
							widget.switchValue = false;
						}
			  
					});
				});
		 
				var resp = await performFetch(e,conn.url,{data:data,field1:conn.field1,field2:conn.field2,field3:conn.field3});
		  
				//override event object parameters with connection info and response data;
				e.parameters.code   = resp.code;
				e.parameters.icon   = conn.icon;
				e.parameters.name   = conn.name;
				e.parameters.url    = conn.url;
				e.parameters.manual = conn.manual;
				e.parameters.field1 = conn.field1;
				e.parameters.field2 = conn.field2;
				e.parameters.field3 = conn.field3;
				e.parameters.data   = parseData(resp.content);
			
				return actionShow(e);
			}
		);
	},
	checkURL : function checkURL(e,element) {
		return new Promise(
			function(resolve) {
				var regExp = /^http:\/\/\S+\.+\S+|^https:\/\/\S+\.+\S+/;
				var url = element.value;
				var test = regExp.test(url);
				if(!test) {
					var action = CardService.newActionResponseBuilder();
						action.setNotification(warning(globalInvalidURLnoMethod));
					return action.build();
				}
		  
			}
		);
	},
	goRoot : function goRoot(e) {
		return new Promise(
			function(resolve) {	
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);				
				
				var index = +e.parameters.index; 
				
				cardOpen(e,index);
			  
				return builder.build();  
			}
		);
	},	
	actionEdit : function actionEdit(e) {
 		return new Promise(
			function(resolve) { 
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);
				
				editDisplay(e);
      
				return builder.build();
			}
		);
	},
	actionShow : function actionShow(e) {
		return new Promise(
			function(resolve) {			
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);
			  
				var code = +e.parameters.code;
				var data = e.parameters.data;
				
				e.parameters.code = code;
		  
				if(code>=200&&code<300) {
					
					cardDisplay(e);
			
				}else { //handle incorrect urls;
			
					e.parameters.data  = '[]';
					e.parameters.code  = code;
					
					builder.setNotification(warning(globalIncorrectURL));
					cardDisplay(e);
			
				}
  
				return builder.build();
			}
		);
	},
	actionManual : function actionManual(e) {
		return new Promise(
			async function(resolve) {
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);
				  
				var url   = e.parameters.url;
				var index = +e.parameters.index;
				
				var response = await performFetch(e,url);
				var code = response.code;
				var data = response.content;
				  
				if(code>=200&&code<300) {
					
					var len = data.length;
					if(len!==0) {
						e.parameters.data = data;
					}
					cardDisplay(e);
					
				}else { //handle incorrect urls;
					
					e.parameters.data  = '[]';
					e.parameters.error = data;
					builder.setNotification(warning(globalIncorrectURL));
					cardDisplay(e);
					
				}
				  
				return builder.build();
			}
		);
	},
	actionDisplay : function actionDisplay(e) {
		return new Promise(
			function(resolve) {
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);
					cardsetDisplay(e);
				return builder.build();
			}
		);
	},
	//==============================END ACTIONS==============================//
	
	//==============================START CONNECTION ACTIONS==============================//
	createConnection : function createConnection(e) {
		return new Promise(
			async function(resolve) {
				const inputs = $('input');
				var icon 	  = inputs[0].value;
				var name      = inputs[1].value;
				var url       = inputs[2].value;
				var field1    = inputs[3].value;
				var field2    = inputs[4].value;
				var field3    = inputs[5].value;
				var useManual = inputs[6].value;
				if(useManual==='true') { useManual = true; }else { useManual = false; }
		  
				var connection = {
					icon: icon,
					url: url,
					name: name,
					manual: useManual
				};
				if(field1!=='') { connection.field1 = field1; }
				if(field2!=='') { connection.field2 = field2; }
				if(field3!=='') { connection.field3 = field3; }
		  
				var builder = CardService.newActionResponseBuilder();
				
				var src = await getProperty('config','user');
				if(src===null) { createSettings(); }
				src = await getProperty('config','user');
				
				src.push(connection);
				console.log(src);
				await setProperty('config',src,'user');
				
				builder.setNotification(notification(globalUpdateSuccess));
				builder.setStateChanged(true);
				cardOpen(e);
				
				return builder.build();
			}
		);
	},
	updateConnection : function updateConnection(e) {
		return new Promise(
			async function(resolve) {		
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);
					
				var index = +e.parameters.index;

				var fromSettings = e.parameters.fromSettings;
				if(fromSettings==='true') { fromSettings = true; }else { fromSettings = false; }
				
				const inputs = $('input');
				var icon 	  = inputs[0].value;
				var name      = inputs[1].value;
				var url       = inputs[2].value;
				var field1    = inputs[3].value;
				var field2    = inputs[4].value;
				var field3    = inputs[5].value;
				var useManual = inputs[6].value;
				if(useManual==='true') { useManual = true; }else { useManual = false; }
				
				var connection = {
					icon: icon,
					url: url,
					name: name,
					manual: useManual
				};	
				if(field1!=='') { connection.field1 = field1; }
				if(field2!=='') { connection.field2 = field2; }
				if(field3!=='') { connection.field3 = field3; }				
				
				var src = await getProperty('config','user');
				src[index] = connection;
				setProperty('config',src,'user');
				
				builder.setNotification(notification(globalUpdateSuccess));
				
				if(fromSettings) {
					cardSettings(e);
				}else {
					cardOpen(e);
				}
				
				return builder.build();
			}
		);
	},
	removeConnection : function removeConnection(e) {
		return new Promise(
			async function(resolve) {	  
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);
	  
				var index = +e.parameters.index;
				var fromSettings = e.parameters.fromSettings;
				if(fromSettings==='true') { fromSettings = true; }else { fromSettings = false; }
				
				var src = await getProperty('config','user');
				src = src.filter(function(connect,idx){ 
					if(idx!==index) { return connect; }
				}); 				
				setProperty('config',src,'user');
				
				builder.setNotification(notification(globalRemoveSuccess));
				
				if(fromSettings) {
					cardSettings(e);
				}else {
					cardOpen(e);
				}
				
				return builder.build();
			}
		);
	},
	performFullReset : function performFullReset(e) {
		return new Promise(
			function(resolve) {
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);				
				
				var src = getProperty('config','user');
				if(src!==null) {
					try {
						deleteProperty('config','user');
					}
					catch(e) {
						console.log('There was no config to delete');
					}
				}
				deleteAllProperties('user');
				
				cardOpen(e);
				return builder.build();
			}
		);
	},
	//==============================END CONNECTION ACTIONS==============================//
	invokeCardSettings: function invokeCardSettings(parameters) {
		return new Promise(
			function(resolve) {
				cardSettings(parameters);
			}
		);
	}
}

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
		this.parameters;
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

//===========================================START PROPERTY===========================================//
/**
 * Fetches user / script property value by key;
 * @param {String} key -> key of the property to find;
 * @param {String} type -> 'user' or 'script' to determine prop type to get;
 * @returns {String}
 */
function getProperty(key,type) {
  let props;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  let value = props.get(key);
  if(value===undefined) {value = null;}
  return value;
}

/**
 * Fetches an sets user / script property by key;
 * @param {String} key -> key of the property to find;
 * @param {String} value -> new value of the property;
 * @param {String} type -> 'user' or 'script' to determine prop type to get;
 */
function setProperty(key,value,type) {
  let props;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  props.set(key,value);
  props.saveAsync();
}

/**
 * Deletes a user / script property by key;
 * @param {String} key -> key of the property to find;
 * @param {String} type -> 'user' or 'script' to determine prop type to get;
 */
function deleteProperty(key,type) {
  let props;
  switch(type) {
    case 'script': 
      props = PropertiesService.getScriptProperties();
    break;
    case 'user':
      props = PropertiesService.getUserProperties();
    break;
  }
  props.remove(key);
  props.saveAsync();
}

/**
 * Deletes every user / script property set;
 * @param {String} key -> key of the property to find
 * @param {String} type -> 'user' or 'script' to determine prop type to get 
 */
function deleteAllProperties(type) {
  let props;
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
//===========================================END PROPERTY===========================================//

//===========================================START BACKEND===========================================//
/**
 * Checks if data contains widgets in "editable" state;
 * @param {Array} data -> an array of objects to check;
 * @returns {Boolean}
*/
function checkEditable(data) {
  var hasEditable = data.some(function(elem){
    var widgets = elem.widgets;
    var elemHasEditable = widgets.some(function(widget){
      var state = widget.state;
      if(state==='editable') { return widget; }
    });
    if(elemHasEditable) { return elem; }
  });
  return hasEditable;
}

/**
 * Checks if data contains nested objects to determine which Ui to load;
 * @param {Array} data -> an array of objects to check;
 * @returns {Boolean}
 */
function checkNested(data) {
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
 * @param {String} data -> data string to be parsed;
 * @returns {Array}
 */
function parseData(data) {
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
 * @param {String} content -> content to pass to JSON file;
 */
function createSettings(content) {
  if(content===undefined) { content = []; }
  setProperty('config',content,'user');
}

/**
 * Performs URL fetch with payload to external service;
 * @param {Object} e -> event object;
 * @param {String} url -> url to be passed to UrlFetchApp call;
 * @param {Object} dataToPass -> object containing fields 1-3 for Zapier connection;
 * @returns {Object}
 */
async function performFetch(e,url,dataToPass) {
	var msg = getToken();
  
	var from = msg.getFrom();
	var email  = trimFrom(from);
	var sender = trimSender(from);
  
	//var labels = msg.getThread().getLabels().map(function(label){ return label.getName(); }); - as categories are in beta for Outlook;
  
	var payload = {
		'Bcc': msg.getBcc(),
		'Cc': msg.getCc(),
		'date': msg.getDate(),
		'sender': sender,
		'from': email,
		'id': msg.getId(),
		'plainBody': msg.getPlainBody(),
		'subject': msg.getSubject()/*,
		'labels': labels*/
	};
	if(dataToPass!==undefined) {
		var data   = dataToPass.data;
		var field1 = dataToPass.field1;
		var field2 = dataToPass.field2;
		var field3 = dataToPass.field3;
		if(data!==undefined)   { payload.data   = data;   }
		if(field1!==undefined) { payload.field1 = field1; }
		if(field2!==undefined) { payload.field2 = field2; }
		if(field3!==undefined) { payload.field3 = field3; }
	}
	console.log(payload);
  
	let response;
  
	try {
		response = await UrlFetchApp.fetch(url,{'method':'post','payload':JSON.stringify(payload),'muteHttpExceptions':true,'contentType':'application/json'});
	}
	catch(error) {
		response = error;
	}
  
	return response;
}

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
	return settings;	
}
e_PropertiesService.prototype.getScriptProperties = function () {
	const settings = Office.context.roamingSettings;
	return settings;	
}
e_PropertiesService.prototype.getUserProperties = function () {
	const settings = Office.context.roamingSettings;
	return settings;
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

//===========================================START GLOBALS===========================================//
//headers;
var globalOpenHeader             = 'Welcome to Cardin';
var globalInstallHeader          = 'Card setup';
var globalSettingsHeader         = 'Settings';
var globalAdvancedHeader         = 'Advanced';
var globalHelpHeader             = 'Help';
var globalExistingConnectsHeader = 'Configured cards';
var globalManualHeader           = 'Manual fetch';
var globalAutoHeader             = 'Auto fetch';
var globalAddConnectionHeader    = 'Add custom card';
var globalSuccessfulFetchHeader  = 'Successfully fetched';
var globalNoDataFetchHeader      = 'Fetched with no data';
var globalErroredHeader          = 'Returned with error';
var globalShowHeader             = 'Contact';
var globalUnparsedHeader         = 'Unparsed data';
var globalConfiguredHeader       = 'Configured cards';
var globalChooseTypeHeader       = 'Choose card type';

//titles;
var globalWelcomeWidgetTitle       = '';
var globalInstallWidgetTitle       = '';
var globalCustomWidgetTitle        = '';
var globalCustomWidgetIconTitle    = 'Card icon';
var globalCustomWidgetNameTitle    = 'Card name';
var globalCustomWidgetInputTitle   = 'Card URL';
var globalResetWidgetTitle         = 'Reset';
var globalClearWidgetTitle         = 'Cache';
var globalCodeWidgetTitle          = 'Code';
var globalErrorWidgetTitle         = 'Error info';
var globalUnparsedErrorWidgetTitle = 'Parse failure reason';
var globalUnparsedDataWidgetTitle  = 'Unparsed data';
var globalNoDataWidgetTitle        = '';
var globalExtraDataTitle           = '';
var globalCustomWidgetFieldTitle   = 'Field';
var globalConfigErrorWidgetTitle   = 'Add-on failure';

//hints;
var globalCustomWidgetIconHint  = 'Card icon to display next to card name';
var globalCustomWidgetNameHint  = 'Card name to display in list of cards';
var globalCustomWidgetHint      = 'Card URL (eg Flow/Zapier Webhook trigger)';
var globalCustomWidgetFieldHint = 'Data to be sent with payload';

//contents & texts;
var globalWelcomeWidgetContent      = 'If you need help, setup instructions are available on resources below:';
var globalCustomWidgetContent       = 'You can create custom card by configuring form below. You can create as many cards as you want';
var globalConfigErrorWidgetContent  = 'Seems like you either have a malformed configuration - most likely this is due to a significant update to config structure. Please, initiate Add-on reset';
var globalResetWidgetContent        = 'Every user preference will be wiped clean, and cards configuration will be deleted';
var globalClearWidgetContent        = 'Cached data will be cleared, including information about successful fetches';
var globalCustomWidgetSwitchText    = 'Use manual data fetch';
var globalIsDefaultWidgetSwitchText = 'Use as default card';
var globalNoDataWidgetText          = 'Card fetch returned with no data to be displayed. If this is not an intended behaviour, please consider reconfiguring it';
var globalExtraDataText             = 'There is more data to show, but we trimmed it to several sections to avoid hitting 100 widgets capping';
var globalGoToSettings              = 'Go to settings';
var globalSheetsContent             = 'Google Sheets';
var globalFlowContent               = 'Microsoft flow';
var globalZapierContent             = 'Zapier';
var globalIftttContent              = 'IFTTT';

//button as labels texts;
var globalSuccess                   = 'Success';
var globalError                     = 'Error';
var globalNoData                    = 'No data';
var globalAuto                      = 'Auto';
var globalManual                    = 'Manual';

//button texts;
var globalResetWidgetSubmitText     = 'Reset';
var globalClearWidgetSubmitText     = 'Clear';
var globalCreateConnectionText      = 'Create';
var globalUpdateConnectionText      = 'Update';
var globalRemoveConnectionText      = 'Remove';
var globalUpdateShowText            = 'Update';
var globalLoadExtraForwardText      = 'Next';
var globalLoadExtraBackText         = 'Back';
var globalRootText                  = 'Go back';
var globalCardinUrlText             = 'cardinsoft.com';
var globalYouTubeUrlText            = 'YouTube instructions';

//URLs;
var globalCardinUrl     = 'https://cardinsoft.com/';
var globalYouTubeUrl    = 'https://youtube.com/';
var globalSheetsIconUrl = 'https://cardinsoft.github.io/outlook/assets/sheets.png';
var globalFlowIconUrl   = 'https://cardinsoft.github.io/outlook/assets/flow.png';
var globalZapierIconUrl = 'https://cardinsoft.github.io/outlook/assets/zapier.png';
var globalIftttIconUrl  = 'https://cardinsoft.github.io/outlook/assets/ifttt.jpg';

//notifications, warnings and error messages
var globalUpdateSuccess      = 'Configuration successfully updated!';
var globalRemoveSuccess      = 'Configuration successfully removed!';
var globalClearSuccess       = 'Cache successfully cleared!';
var globalIncorrectURL       = 'Please, consider reconfiguring cards listed below as their URLs returned with an error';
var globalInvalidURLnoMethod = 'URLs should include http or https method indication and domain';

//other;
var globalConfigName       = 'config';
var globalNumUncollapsible = 5;
var globalWidgetsCap       = 50;
//===========================================END GLOBALS===========================================//

//initiate services to be able to access them;
const UrlFetchApp       = new e_UrlFetchApp();
const CardService       = new e_CardService();
const PropertiesService = new e_PropertiesService();
const CacheService      = new e_CacheService();
const e                 = new e_EventObject();
