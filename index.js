/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

//initiate services to be able to access them;
const UrlFetchApp       = new _UrlFetchApp();
const CardService       = new _CardService();
const PropertiesService = new _PropertiesService();
const CacheService      = new _CacheService();
const e                 = new EventObject();
 
// The initialize function must be run each time a new page is loaded
Office.initialize = (reason) => {
	$(document).ready(function () {
		cardOpen();
		
		$('#home').click(function(){
			cardOpen();
		});
		
		$('#help').click(function(){
			cardHelp();
		});
		
		$('#app-body').show();
	
	});
};

function cardDisplay(parameters) {
	var index  = parameters.index;
	var code   = +parameters.code;
	var icon   = parameters.icon;
	var name   = parameters.name;
	var url    = parameters.url;
	var data   = parameters.data;
	var manual = parameters.manual;  
	var start  = parameters.start;
	if(manual==='true') { manual = true; }else { manual = false; } //e.parameters accepts only strings;
  
	var msg = getToken();
  
	var builder = CardService.newCardBuilder();
		builder.setHeader(CardService.newCardHeader().setTitle(name).setImageUrl(icon));
  
	var error = parameters.error;
	if(error!==undefined) {
		createErrorSection(builder,false,code,error);
	}
  
	var data = parseData(data);
	if(data.length===0&&error===undefined) { createNoFieldsSection(builder,false); }
  
	var connection = {icon:icon,name:name,url:url,manual:manual};
	createSectionEdit(builder,true,connection,index);
  
	createSectionBack(builder,false,index); //move back to bottom when handled 100 widgets issue;

	try {

		if(data.length!==0) {
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
					createShowSection(builder,result,true,j);
				}else {
					createShowSection(builder,result,false,j);
				}
			}
		  
		}
  
	}
	catch(err) {
    
		createUnparsedSection(builder,true,err.message,JSON.stringify(data));
    
	}
  
	var length = data.length;
	var diff = max-begin;
  
	console.log('TESTING');
	console.log(data);
  
	if(fullLength>cap) {
		var end = length-1;
		if(length>max||length+diff-1===max) {
			var prev = (begin-diff);
			createExtraDataSection(builder,false,end,prev,max,200,index,icon,url,name,manual,data);
		}
	}

	return builder.build();
}

async function cardsetDisplay(builder,idx) {
	var msg = getToken();
  
	var config = getProperty('config','user');
	console.log(config);
  
	var autofieldsSection,autosuccessSection,erroredSection,manualSection;
  
	for(var index=0; index<config.length; index++) {
		var connect = config[index];
		var icon   = connect.icon;
		var name   = connect.name;
		var url    = connect.url;
		var manual = connect.manual;
	
		if(!manual) {
			var response = await performFetch(url);
			
			const code = response.code;
					
			if(code>=200&&code<300) {
				var data = parseData(response.content);
				var len = data.length;
				var widget = actionKeyValueWidget(icon,'',name,'actionShow',{'code':code.toString(),'index':index.toString(),'icon':icon,'url':url,'name':name,'manual':manual.toString(),'data':JSON.stringify(data)});
					
				if(len!==0) {
					if(autofieldsSection===undefined) {
						autofieldsSection = CardService.newCardSection();
						autofieldsSection.setHeader(globalSuccessfulFetchHeader);
					}
					autofieldsSection.addWidget(widget);
				}else {
					if(autosuccessSection===undefined) {
						autosuccessSection = CardService.newCardSection();
						autosuccessSection.setHeader(globalNoDataFetchHeader);        
					}
					autosuccessSection.addWidget(widget);
				}
					
			}else { //handle incorrect urls;
					
				if(erroredSection===undefined) {
					erroredSection = CardService.newCardSection();
					erroredSection.setHeader(globalErroredHeader);
					var errorMsg = simpleKeyValueWidget('',globalIncorrectURL,true);
					erroredSection.addWidget(errorMsg);
				}
				var widget = actionKeyValueWidget(icon,'',name,'actionShow',{'code':code.toString(),'error':response.content,'index':index.toString(),'icon':icon,'url':url,'name':name,'manual':manual.toString()});
				erroredSection.addWidget(widget);
			  
			}

		}else { //handle manually triggered connections;
		  
			var button = textButtonWidget('Manual',true,false,'actionManual');
				
			if(manualSection===undefined) {
				manualSection = CardService.newCardSection();
				manualSection.setCollapsible(true);
				manualSection.setHeader(globalManualHeader);
				manualSection.setNumUncollapsibleWidgets(globalNumUncollapsible);
			}
			widget = actionKeyValueWidgetButton(icon,'',name,button,'actionManual',{'index':index.toString(),'icon':icon,'url':url,'name':name,'manual':manual.toString()});
			manualSection.addWidget(widget);		  
			
		}
	
	}
  
	if(erroredSection!==undefined)     { builder.addSection(erroredSection); }
	if(autofieldsSection!==undefined)  { builder.addSection(autofieldsSection); }
	if(autosuccessSection!==undefined) { builder.addSection(autosuccessSection); }
	if(manualSection!==undefined)      { builder.addSection(manualSection); }
  
	createCustomInstall(builder,true,config.length,globalCustomInstallHeader);
  
	return builder.build();
}

async function cardOpen(index) {
	var builder = CardService.newCardBuilder();
	
	$('.main-Ui-header').empty();
	
	var src = await getProperty('config','user');
	let config;
	if(src!==null) {
		config = src;
	}else {
		config = [];
	}
	  
	if(config.length===0) {//build welcome and settings card on install;
		builder.setHeader(CardService.newCardHeader().setTitle(globalOpenHeader));
		createCustomInstall(builder,false,config.length,globalCustomInstallHeader);
	}else {//build display card if any connections;
		cardsetDisplay(builder,index);
	}
	  
	return builder.build();
}

function cardHelp() {
	var builder = CardService.newCardBuilder();
		builder.setHeader(CardService.newCardHeader().setTitle(globalHelpHeader));
      
	createSectionWelcome(builder,false);
	createAdvanced(builder,false);

	return builder.build();
}

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

function createNoFieldsSection(builder,isCollapsed) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
      
  var noData = simpleKeyValueWidget(globalNoDataWidgetTitle,globalNoDataWidgetText,true);
  section.addWidget(noData);
  
  builder.addSection(section);
}

function createSectionBack(builder,isCollapsed,index) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
  
  createWidgetsBackAndToRoot(section,index);
  
  builder.addSection(section);
}

function createUnparsedSection(builder,isCollapsed,error,content) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 
      section.setHeader(globalUnparsedHeader);

  var errc = simpleKeyValueWidget(globalUnparsedErrorWidgetTitle,error,true);
  section.addWidget(errc);

  var data = simpleKeyValueWidget(globalUnparsedDataWidgetTitle,content,true);
  section.addWidget(data);

  builder.addSection(section);  

}

function createErrorSection(builder,isCollapsed,code,error) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed); 

  var errc = simpleKeyValueWidget(globalCodeWidgetTitle,code,true);
  section.addWidget(errc);

  var errt = simpleKeyValueWidget(globalErrorWidgetTitle,error,true);
  section.addWidget(errt);

  builder.addSection(section);
}

function createSectionEdit(builder,isCollapsed,connection,index) {
  var section = CardService.newCardSection();
      section.setCollapsible(isCollapsed);  
      section.setHeader(globalSettingsHeader);
  
  var del = textButtonWidget(globalRemoveConnectionText,false,false,'removeConnection',{'index':index});
  section.addWidget(del);
  
  createWidgetSetIcon(section,globalCustomWidgetIconTitle,globalCustomWidgetIconHint,connection.icon);
  createWidgetSetName(section,globalCustomWidgetNameTitle,globalCustomWidgetNameHint,connection.name);
  createWidgetSetUrl(section,globalCustomWidgetInputTitle,globalCustomWidgetHint,connection.url,'checkURL');
  createWidgetSwitchManual(section,connection.manual);
  
  var save = textButtonWidget(globalUpdateConnectionText,false,false,'updateConnection',{'index':index});
  section.addWidget(save);
  
  builder.addSection(section);   
}

function createShowSection(builder,data,isCollapsed,index) {
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

function createSectionWelcome(builder,isCollapsed,header) {
	var section = CardService.newCardSection();
		section.setCollapsible(isCollapsed);
	if(header!==undefined) { section.setHeader(header); }
  
	createWidgetWelcomeText(section);
  
	createWidgetWelcomeCardin(section);
  
	createWidgetWelcomeYouTube(section);
  
	builder.addSection(section);
}

function createSectionInstall(builder,isCollapsed,header) {
	var section = CardService.newCardSection();
		section.setCollapsible(isCollapsed);
	if(header!==undefined) { section.setHeader(header); }
  
	createWidgetInstallText(section);
	
	createWidgetInstallLink(section);

	builder.addSection(section);
}

function createCustomInstall(builder,isCollapsed,length,header) {
	var section = CardService.newCardSection();
		section.setCollapsible(isCollapsed);
	if(header!==undefined) { section.setHeader(header); }
  
	if(!isCollapsed) { createWidgetCustomConnect(section); }
  
	createWidgetSetIcon(section,globalCustomWidgetIconTitle,globalCustomWidgetIconHint);
  
	createWidgetSetName(section,globalCustomWidgetNameTitle,globalCustomWidgetNameHint);
  
	createWidgetSetUrl(section,globalCustomWidgetInputTitle,globalCustomWidgetHint);
  
	createWidgetSwitchManual(section,true);
  
	createWidgetSubmitUrl(section,globalCustomWidgetSubmitText);
  
	builder.addSection(section);
}

function createAdvanced(builder,isCollapsed,header) {
	var section = CardService.newCardSection();
		section.setCollapsible(isCollapsed);
	if(header!==undefined) { section.setHeader(header); }

	createWidgetResetText(section);
  
	createWidgetResetSubmit(section);
  
	//future release functionality - no cached states for 1.0
	//createWidgetClearText(section);
	//createWidgetClearSubmit(section);

	builder.addSection(section);  
}

function createWidgetWelcomeText(section) {
  var widget = simpleKeyValueWidget(globalWelcomeWidgetTitle,globalWelcomeWidgetContent,true);
  section.addWidget(widget);
}

function createWidgetWelcomeCardin(section) {
  var widget = textButtonWidgetLinked(globalCardinUrlText,false,false,globalCardinUrl,false,false);
  section.addWidget(widget);
}

function createWidgetWelcomeYouTube(section) {
  var widget = textButtonWidgetLinked(globalYouTubeUrlText,false,false,globalYouTubeUrl,false,false);
  section.addWidget(widget);
}

function createWidgetInstallText(section) {
  var widget = simpleKeyValueWidget(globalInstallWidgetTitle,globalInstallWidgetContent,true);
  section.addWidget(widget);
}
  
function createWidgetInstallLink(section) {
  var widget = textButtonWidget(globalInstallWidgetSubmit,false,false,'actionInstall',{'changeState':'true'});
  section.addWidget(widget);
}

function createWidgetSheetsLink(section) {
  var widget = actionKeyValueWidget(globalIconSheetsUrl,globalSheetsNavTitle,globalSheetsNavContent,'test');
  section.addWidget(widget);
}

function createWidgetFlowLink(section) {
  var widget = actionKeyValueWidget(globalIconFlowUrl,globalFlowNavTitle,globalFlowNavContent,'test');
  section.addWidget(widget);
}

function createWidgetCustomConnect(section) {
  var widget = simpleKeyValueWidget(globalCustomWidgetTitle,globalCustomWidgetContent,true);
  section.addWidget(widget);  
}

function createWidgetSetUrl(section,title,hint,url) {
  if(url!==undefined) { var content = url; }else { content = ''; }
  var widget = textInputWidget(title,'connectionURL',hint,content,'checkURL');
  section.addWidget(widget);   
}

function createWidgetSetName(section,title,hint,name) {
  if(name!==undefined) { var content = name; }else { content = ''; }
  var widget = textInputWidget(title,'connectionName',hint,content);
  section.addWidget(widget);  
}

function createWidgetSetIcon(section,title,hint,icon) {
  if(icon!==undefined) { var content = icon; }else { content = ''; }
  var widget = textInputWidget(title,'connectionIcon',hint,content);
  section.addWidget(widget);
}

function createWidgetSubmitUrl(section,text) {
  var widget = textButtonWidget(text,false,false,'submitURL');
  section.addWidget(widget);   
}

function createWidgetResetText(section) {
  var widget = simpleKeyValueWidget(globalResetWidgetTitle,globalResetWidgetContent,true);
  section.addWidget(widget);
}

function createWidgetClearText(section) {
  var widget = simpleKeyValueWidget(globalClearWidgetTitle,globalClearWidgetContent,true);
  section.addWidget(widget);
}

function createWidgetResetSubmit(section) {
  var widget = textButtonWidget(globalResetWidgetSubmitText,false,false,'performFullReset');
  section.addWidget(widget);
}

function createWidgetClearSubmit(section) {
  var widget = textButtonWidget(globalClearWidgetSubmitText,false,false,'clearLayout');
  section.addWidget(widget);
}

function createWidgetSwitchManual(section,manual) {
  if(manual===undefined) { manual = true; }
  var widget = switchWidget(globalCustomWidgetSwitchText,'manual',manual,'true');
  section.addWidget(widget);
}

function createWidgetMoveToDisplay(section,length) {
  if(length===0) { var disabled = true; }else { disabled = false; }
  var widget = textButtonWidget(globalInstallWidgetSubmit,disabled,false,'actionDisplay');
  section.addWidget(widget);
}

function createWidgetsBackAndToRoot(section,index) {
  var root = textButtonWidget(globalRootText,false,false,'goRoot',{'index':index});
  var widget = buttonSet([root]);
  section.addWidget(widget);
}

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
 * @param {String} text -> text to display as switch label;
 * @param {String} name -> unique fieldname (non-unique if multi-switch widget);
 * @param {Boolean} selected -> truthy value to set on / off click event;
 * @param {String} value -> value to pass to handler if selected;
 * @param {String} changeFunc -> name of the function fired on user change;
 * @param {Boolean} hasSpinner -> truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params -> parameters to pass to function;
 * @returns {KeyValue} 
 */
function switchWidget(text,name,selected,value,changeFunc,hasSpinner,params) {  
  var keyValue = CardService.newKeyValue();
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

function clearLayout(e) {
	var action = CardService.newActionResponseBuilder();
		action.setStateChanged(true);  
  
	var cache = CacheService.getScriptCache();
	cache.remove('layout');
  
	action.setNavigation(CardService.newNavigation().updateCard(cardOpen(e)));
	action.setNotification(notification(globalClearSuccess));
  
  return action.build();
}

function goBack(e) {
  var action = CardService.newActionResponseBuilder();
      action.setStateChanged(true);
      action.setNavigation(CardService.newNavigation().popCard());
  
  return action.build();  
}

function actionDisplay(e) {
  var action = CardService.newActionResponseBuilder();
      action.setStateChanged(true);
      action.setNavigation(CardService.newNavigation().updateCard(cardsetDisplay(e)));
  return action.build();
}

function actionInstall(e) {
  var changeState = e.parameters.changeState;
  if(changeState==='true') { changeState = true; }else { changeState = false; }
  
  var action = CardService.newActionResponseBuilder();
      action.setStateChanged(changeState);
      action.setNavigation(navigationInstall(e));
  
  return action.build();
}

function putToCache(key,value) {
	try {
		var cache = CacheService.getScriptCache();
		cache.setItem(key,value);
	}
	catch(error) {
		console.log(error.message);
	}
}

function removeFromCache(key,value) {
	try {
		var cache = CacheService.getScriptCache();
		cache.removeItem(key);
	}
	catch(error) {
		console.log(error.message);
	}
}

function getFromCache(key) {
	try {
		var cache = CacheService.getScriptCache();
		return cache.getItem(key);
	}
	catch(error) {
		console.log(error.message);
		return null;
	}
}

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
	submitURL : function submitURL(parameters) {
		return new Promise(
			async function(resolve) {
				const inputs = $('input');
				var icon = inputs[0].value;
				var name = inputs[1].value;
				var url = inputs[2].value;
				var useManual = inputs[3].value;
				if(useManual==='on') { useManual = true; }else { useManual = false; }
		  
				var connection = {
					icon: icon,
					url: url,
					name: name,
					manual: useManual
				};
		  
				var builder = CardService.newActionResponseBuilder();
				var src = getProperty('config','user');
				if(src===null) { createSettingsFile(); }
				
				var src = getProperty('config','user');
				src.push(connection);
				console.log(src);
				await setProperty('config',src,'user');
				
				builder.setNotification(notification(globalUpdateSuccess));
				builder.setStateChanged(true);
				cardOpen();
			}
		);
	},
	updateConnection : function updateConnection(parameters) {
		return new Promise(
			function(resolve) {		
				const inputs = $('input');
				var icon = inputs[0].value;
				var name = inputs[1].value;
				var url = inputs[2].value;
				var useManual = inputs[3].value;
				
				var connection = {
					icon: icon,
					url: url,
					name: name,
					manual: useManual
				};				
				
				var index = +parameters.index;
			
				if(useManual==='on') { useManual = true; }else { useManual = false; }

				var builder = CardService.newActionResponseBuilder();
				var src = getProperty('config','user');
				
				src[index] = connection;
				setProperty('config',src,'user');
				builder.setNotification(notification(globalUpdateSuccess));
				builder.setStateChanged(true);
				cardOpen();
			}
		);
	},
	removeConnection : function removeConnection(parameters) {
		return new Promise(
			function(resolve) {	  
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);
	  
				var index = +parameters.index;
				var src = getProperty('config','user');

				src = src.filter(function(connect,idx){ 
					if(idx!==index) { return connect; }
				});  
				setProperty('config',src,'user');
				builder.setNotification(notification(globalRemoveSuccess));
				builder.setStateChanged(true);
				cardOpen();
			}
		);
	},
	checkURL : function checkURL(parameters,element) {
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
	actionShow : function actionShow(parameters) {
		return new Promise(
			function(resolve) {			
				var action = CardService.newActionResponseBuilder();
					action.setStateChanged(true);
			  
				var code = +parameters.code;
				var data = parameters.data;
		  
				if(code>=200&&code<300) {
					
					cardDisplay(parameters);
			
				}else { //handle incorrect urls;
			
					parameters.data  = '[]';
					parameters.error = data;
					parameters.code  = code;
					
					action.setNotification(warning(globalIncorrectURL));
					
					cardDisplay(parameters);
			
				}
  
				return action.build();
			}
		);
	},
	actionManual : function actionManual(parameters) {
		return new Promise(
			async function(resolve) {
				var action = CardService.newActionResponseBuilder();
					action.setStateChanged(true);
				  
				var url   = parameters.url;
				var index = +parameters.index;
				
				var response = await performFetch(url);
				
				var code = response.code;
				var data = response.content;
				  
				if(code>=200&&code<300) {
					
					var len = data.length;
					if(len!==0) {
						parameters.data = data;
						var move = '1';
					}else if(code!==0) { //handle no data to show;
						move = '0';
					}
					
					cardDisplay(parameters);
					
				}else { //handle incorrect urls;
					
					parameters.data  = '[]';
					parameters.error = data;
					parameters.code  = code;
					move  = '-1';
					action.setNotification(warning(globalIncorrectURL));
					
					cardDisplay(parameters);
					
				}
				  
				return action.build();
			}
		);
	},
	goRoot : function goRoot(parameters) {
		return new Promise(
			function(resolve) {	
				var index = +parameters.index; 

				var action = CardService.newActionResponseBuilder();
					action.setStateChanged(true);
				  
				cardOpen(index);
				  
				//action.setNavigation(CardService.newNavigation().popCard().pushCard(cardOpen(e,index)));
			  
				return action.build();  
			}
		);
	},
	performFullReset : function performFullReset() {
		return new Promise(
			function(resolve) {
				var src = getProperty('config','user');
				if(src!==null) {
					try {
						deleteProperty('config','user');
					}
					catch(e) {
						console.log('There was no config to delete');
					}
				}
				//clearLayout();
			  
				var builder = CardService.newActionResponseBuilder();
					builder.setStateChanged(true);
				cardOpen();
			}
		);
	}
}

//emulate event object;
class EventObject {
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
	constructor(msgFrom,msgBcc,msgCc,msgDate,msgPlainBody,msgSubject,msgId) {
		this.msgFrom = msgFrom;
		this.msgBcc = msgBcc;
		this.msgCc = msgCc;
		this.msgDate = msgDate;
		this.msgPlainBody = msgPlainBody;
		this.msgSubject = msgSubject;
		this.msgId = msgId;
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

/**
 * Fetches authorization token for current email
 * @param {Object} e -> event object;
 * @returns {Message}
 */
function getToken(e) {
	const item = Office.context.mailbox.item;
	const msg = new Message( item.sender.emailAddress,'',item.cc,item.dateTimeCreated.toUTCString(),item.body,item.subject, item.itemId );
	return msg;
}

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

function parseData(data) {
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
  
  return data;
}

function createSettingsFile(content) {
	if(content===undefined) { content = []; }
	setProperty('config',content,'user');
}

async function performFetch(url) {
	
  var msg = getToken();
  
  var email = trimFrom(msg.getFrom());
  
	var payload = {
		'Bcc': msg.getBcc(),
		'Cc': msg.getCc(),
		'date': msg.getDate(),
		'from': email,
		'id': msg.getId(),
		'plainBody': msg.getPlainBody(),
		'subject': msg.getSubject()
	};
  
	let response;
  
	try {
		response = await UrlFetchApp.fetch(url,{'method':'post','payload':JSON.stringify(payload),'muteHttpExceptions':true,'contentType':'application/json'});
	}
	catch(error) {
		response = error;
	}
  
  console.log(response);
  
  return response;
	/*
	const code = response.getResponseCode();
	const headers = response.getHeaders();
	let content = response.getContentText();	
	console.log('CODE: '+code);
	console.log('IS EMPTY STRING: '+ (content==='') );
	console.log(typeof content);	
	
	var isValid = content!==null&&content!==undefined;
	if(!isValid) { content = '[]'; }	
	
    return {code:code,headers:headers,content:JSON.stringify(content)};
	*/
}

/**
 * Trims sender info from name and '<' & '>' characters - supplemental function
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
