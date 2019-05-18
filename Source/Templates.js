/**
 * Creates CardAction to set on a CardHeader;
 * @param {Text} text text to set on header;
 * @param {String} action type;
 * @param {Action} action action to set;
 * @param {String=} composeType type of email to set; 
 * @returns {CardAction}
 */
function cardAction(text,type,action,composeType){
  
  //create action and set required parameters;
  var cardAction = CardService.newCardAction();
      cardAction.setText(text);
      
  //set action type corresponding to type;
  switch(type) {
    case globalActionAuth:
      cardAction.setAuthorizationAction(action);
      break;
    case globalActionCompose:
      var composeEnum = 'REPLY_AS_DRAFT';
      if(composeType) { composeEnum = CardService.ComposedEmailType[composeType]; }
      cardAction.setComposeAction(action,composeEnum);
      break;
    case globalActionClick:
      cardAction.setOnClickAction(action);
      break;
    case globalActionLink:
      cardAction.setOnClickOpenLinkAction(action);
      break;
  }
  
  return cardAction;
}

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
 * @param {String} content value that is passed to widget by default;
 * @param {Boolean} multiline truthy value to determine whether to make input multiline;
 * @param {String} changeFunc name of the function fired on user change;
 * @param {Boolean} hasSpinner truthy value to determine whether to set spinner for changeFunc;
 * @param {Object} params parameters to pass to function;
 * @returns {TextInput} 
 */
function textInputWidget(title,name,hint,content,multiline,changeFunc,hasSpinner,params) {
  //check if value is an instanceof Date and format if so;
  if(content instanceof Date) { content = content.toLocaleDateString(); }
  
  //create widget and set required parameters;
  var widget = CardService.newTextInput();
      widget.setFieldName(name);
  
  //set conditional parameters;
  if(title)     { widget.setTitle(title); }
  if(content)   { widget.setValue(content); }else { widget.setValue(''); }
  if(hint)      { widget.setHint(hint); }
  if(multiline) { widget.setMultiline(multiline); }
  
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
  
  if(buttons.length>0) {
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
  
  //set optional parameters and default behaviour;
  if(disabled) { widget.setDisabled(disabled); }else { widget.setDisabled(false); }
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
      
  //set optional parameters and defaults;
  if(isFilled) { widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED); }
  if(disabled) { widget.setDisabled(disabled); }else { widget.setDisabled(false); }
  
  if(useAction) {
    //create action and set required parameters;
    var action = CardService.newAction();
        action.setFunctionName(clickFunc);
        
    //set parameters if provided;
    if(params) { 
      action.setParameters(params); 
    }else {
      if(!fullsized)   { fullsized = false; }
      if(!needsReload) { needsReload = false; }
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
 * @param {String} icon url or enum of icon to use;
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
function switchWidget(icon,top,content,name,selected,value,changeFunc,hasSpinner,params) {  
  //create base KeyValue widget and set required parameters;
  var keyValue = CardService.newKeyValue();
      keyValue.setContent(content);

  //set icon if found or set icon url if not;
  if(icon&&icon!=='') { 
    var iconEnum = CardService.Icon[icon];
    if(iconEnum) {
      widget.setIcon(iconEnum);
    }else {
      widget.setIconUrl(icon);
    } 
  }

  //set top title if found;
  if(top&&top!=='') { keyValue.setTopLabel(top); }
  
  //convert strings to boolean;
  if(typeof selected==='string') { selected = selected==='true'; }
  
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
      widget.setMultiline(true);
  
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