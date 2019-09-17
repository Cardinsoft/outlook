/**
 * Creates menu for navigating between Cards;
 * @param {CardBuilder} builder card builder to append section to;
 * @returns {Card} Card that menu is appended to;
 */
function menu(builder) {
  //create menu Actions;
  var actionDashboard = actionAction('cardHome', true);
  var actionSettings = actionAction('cardSettings', true);
  var actionAdvanced = actionAction('cardAdvanced', true);
  var actionHelp = actionAction('cardHelp', true); //create menu CardActions;

  var cardDashboard = cardAction(globalDashboardHeader, globalActionClick, actionDashboard);
  var cardSettings = cardAction(globalSettingsHeader, globalActionClick, actionSettings);
  var cardAdvanced = cardAction(globalAdvancedHeader, globalActionClick, actionAdvanced);
  var cardHelp = cardAction(globalHelpHeader, globalActionClick, actionHelp); //set actions to builder;

  builder.addCardAction(cardDashboard);
  builder.addCardAction(cardSettings);
  builder.addCardAction(cardAdvanced);
  builder.addCardAction(cardHelp); //build Card as menu should be appended last;

  return builder.build();
}
/**
 * Creates CardAction to set on a CardHeader;
 * @param {Text} text text to set on header;
 * @param {String} action type;
 * @param {Action} action action to set;
 * @param {String=} composeType type of email to set; 
 * @returns {CardAction} this CardAction;
 */


function cardAction(text, type, action, composeType) {
  //create action and set required parameters;
  var cardAction = CardService.newCardAction();
  cardAction.setText(text); //set action type corresponding to type;

  switch (type) {
    case globalActionAuth:
      cardAction.setAuthorizationAction(action);
      break;

    case globalActionCompose:
      var composeEnum = 'REPLY_AS_DRAFT';

      if (composeType) {
        composeEnum = CardService.ComposedEmailType[composeType];
      }

      cardAction.setComposeAction(action, composeEnum);
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
 * Creates Action that can be used anywhere;
 * @param {String} funcName callback function name;
 * @param {Boolean} hasSpinner set spinner on Ui or not;
 * @param {Object} params parameters to pass to function;
 * @returns {Action} this Action;
 */


function actionAction(funcName, hasSpinner, params) {
  //create action and set required parameters;
  var action = CardService.newAction();
  action.setFunctionName(funcName); //set optional parameters;

  if (hasSpinner) {
    action.setLoadIndicator(CardService.LoadIndicator.SPINNER);
  }

  if (params) {
    action.setParameters(params);
  }

  return action;
}
/**
 * Creates a TextParagraph widget
 * @param {String} text specifies a text to populate widget with;
 * @returns {TextParagraph} this TextParagraph;
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
 * @param {String=} funcName callback function name;
 * @param {Boolean=} hasSpinner set spinner on Ui or not;
 * @param {Object=} params parameters to pass to function;
 * @returns {TextInput} 
 */


function textInputWidget(title, name, hint, content, multiline, funcName, hasSpinner, params) {
  //check if value is an instanceof Date and format if so;
  if (content instanceof Date) {
    content = content.toLocaleDateString();
  } //create widget and set required parameters;


  var widget = CardService.newTextInput();
  widget.setFieldName(name); //set optional parameters;

  if (title) {
    widget.setTitle(title);
  }

  if (content) {
    widget.setValue(content);
  } else {
    widget.setValue('');
  }

  if (hint) {
    widget.setHint(hint);
  }

  if (multiline) {
    widget.setMultiline(multiline);
  } //set action if function name provided;


  if (funcName) {
    var action = actionAction(funcName, hasSpinner, params);
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


function suggestions(textInputWidget, suggestions, suggestFunc) {
  textInputWidget.setSuggestions(suggestions);

  if (suggestFunc) {
    var sAction = CardService.newAction();
    sAction.setFunctionName(suggestFunc);
    textInputWidget.setSuggestionsAction(sAction);
  }
}
/**
 * Creates Suggestions object for TextInput autocomplete handler;
 * @param {Array} suggestions an array of string values for creating options;
 * @returns {Suggestions} Suggestions to set;
 */


function suggestion(suggestions) {
  var list = CardService.newSuggestions();
  list.addSuggestions(suggestions);
  return list;
}
/**
 * Creates a ButtonSet widget and appends buttons if provided;
 * @param {Array} buttons an array of button widgets to add to button set;
 * @returns {ButtonSet} this ButtonSet;
 */


function buttonSet(buttons) {
  var widget = CardService.newButtonSet();

  if (buttons.length > 0) {
    buttons.forEach(function (button) {
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
 * @param {String} funcName callback function name;
 * @param {Object} params parameters to pass to function;
 * @returns {TextButton} 
 */


function textButtonWidget(text, disabled, isFilled, funcName, params) {
  var widget = CardService.newTextButton();
  widget.setText(text); //set optional parameters;

  if (disabled) {
    widget.setDisabled(disabled);
  } else {
    widget.setDisabled(false);
  }

  if (isFilled) {
    widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  } //set action on button click;


  var action = actionAction(funcName, true, params);
  widget.setOnClickAction(action);
  return widget;
}
/**
 * Creates a TextButton widget with authorization action to trigger Auth flow;
 * @param {String} text text to appear on the button;
 * @param {Boolean} disabled truthy value to disable / enable click event;
 * @param {Boolean} isFilled sets buttons style to filled if true;
 * @param {String} url authorization url; 
 * @returns {TextButton} this TextButton;
 */


function textButtonWidgetAuth(text, disabled, isFilled, url) {
  var widget = CardService.newTextButton();
  widget.setText(text);
  widget.setDisabled(disabled);

  if (isFilled) {
    widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  }

  var action = CardService.newAuthorizationAction();
  action.setAuthorizationUrl(url);
  widget.setAuthorizationAction(action);
  return widget;
}
/**
 * Creates an ImageButton widget with authorization action to trigger Auth flow;
 * @param {String} image either icon name or image url to set;
 * @param {String} altText text to appear on the button on image load failure;
 * @param {String} url authorization url; 
 * @returns {ImageButton} this ImageButton;
 */


function imageButtonWidgetAuth(image, altText, url) {
  var widget = CardService.newImageButton();
  widget.setAltText(altText); //set icon if found or set icon url if not;

  if (image && image !== '') {
    var iconEnum = CardService.Icon[image];

    if (iconEnum) {
      widget.setIcon(iconEnum);
    } else {
      widget.setIconUrl(image);
    }
  }

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
 * @param {String} funcName callback function name;
 * @param {Object=} params parameters to pass to function;
 * @returns {TextButton} this TextButton;
 */


function textButtonWidgetLinked(text, disabled, isFilled, url, fullsized, needsReload, useAction, funcName, params) {
  var widget = CardService.newTextButton();
  widget.setText(text); //set optional parameters and defaults;

  if (isFilled) {
    widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  }

  if (disabled) {
    widget.setDisabled(disabled);
  } else {
    widget.setDisabled(false);
  }

  if (useAction) {
    //create action and set required parameters;
    var action = CardService.newAction();
    action.setFunctionName(funcName); //set parameters if provided;

    if (params) {
      action.setParameters(params);
    } else {
      if (!fullsized) {
        fullsized = false;
      }

      if (!needsReload) {
        needsReload = false;
      }

      action.setParameters({
        url: url,
        fullsized: fullsized.toString(),
        reload: needsReload.toString()
      });
    } //set action to button;


    widget.setOnClickOpenLinkAction(action);
  } else {
    //create OpenLink action and set required parameters;
    var openLink = CardService.newOpenLink();
    openLink.setUrl(url); //set OpenAs and OnClose parameters;    

    if (fullsized) {
      openLink.setOpenAs(CardService.OpenAs.FULL_SIZE);
    } else {
      openLink.setOpenAs(CardService.OpenAs.OVERLAY);
    }

    if (needsReload) {
      openLink.setOnClose(CardService.OnClose.RELOAD_ADD_ON);
    } else {
      openLink.setOnClose(CardService.OnClose.NOTHING);
    } //set OpenLink action to button;


    widget.setOpenLink(openLink);
  }

  return widget;
}
/**
 * Creates a ImageButton widget with icon content;
 * @param {Icon} icon icon object to appear on the button;
 * @param {String} alt alternative text to show on failure;
 * @param {String} funcName callback function name or link;
 * @param {Object=} params parameters to pass to function;
 * @param {String=} type if provided, overrides action type;
 * @param {Boolean=} fullsized if provided -> flag to open popup or tab;
 * @param {Boolean=} reload if provided -> flag to reload Add-on on close or not;
 * @returns {ImageButton} this ImageButton;
 */


function imageButtonWidget(icon, alt, funcName, params, type, fullsized, reload) {
  var widget = CardService.newImageButton();
  widget.setAltText(alt); //set icon if found or set icon url if not;

  if (icon && icon !== '') {
    var iconEnum = CardService.Icon[icon];

    if (iconEnum) {
      widget.setIcon(iconEnum);
    } else {
      widget.setIconUrl(icon);
    }
  } //add action if provided;


  if (funcName) {
    var action;

    switch (type) {
      case globalActionLink:
        action = CardService.newOpenLink();
        action.setUrl(funcName);

        if (fullsized) {
          action.setOpenAs(CardService.OpenAs.FULL_SIZE);
        } else {
          action.setOpenAs(CardService.OpenAs.OVERLAY);
        }

        if (reload) {
          action.setOnClose(CardService.OnClose.RELOAD_ADD_ON);
        } else {
          action.setOnClose(CardService.OnClose.NOTHING);
        }

        widget.setOpenLink(action);
        break;

      default:
        action = actionAction(funcName, true, params);
        widget.setOnClickAction(action);
    }
  }

  return widget;
}
/**
 * Creates an Image widget;
 * @param {String} src string url of publicly deployed image;
 * @param {String} alt text to display if image cannot be loaded or denied access;
 * @param {String=} funcName callback function name;
 * @param {Boolean=} hasSpinner set spinner on Ui or not;
 * @param {Object=} params parameters to pass to function;
 * @param {Boolean=} isAuth authorization action flag;
 * @returns {Image} this Image;
 */


function imageWidget(src, alt, funcName, hasSpinner, params, isAuth) {
  //create Image widget and set required parameters;
  var widget = CardService.newImage();
  widget.setImageUrl(src);
  widget.setAltText(alt); //set action if callback name provided;

  if (funcName && !isAuth) {
    var action = actionAction(funcName, hasSpinner, params);
    widget.setOnClickAction(action);
  } else if (funcName) {
    action = CardService.newAuthorizationAction(); //create service and get auth url;

    var service = authService(params);
    var url = service.getAuthorizationUrl(params); //set auth url and action;

    action.setAuthorizationUrl(url);
    widget.setAuthorizationAction(action);
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
 * @param {String=} funcName callback function name;
 * @param {Boolean=} hasSpinner set spinner on Ui or not;
 * @param {Object=} params parameters to pass to function;
 * @returns {KeyValue} this KeyValue with Switch set;
 */


function switchWidget(icon, top, content, name, selected, value, funcName, hasSpinner, params) {
  //create base KeyValue widget and set required parameters;
  var keyValue = CardService.newKeyValue();
  keyValue.setContent(content);
  keyValue.setMultiline(true); //set icon if found or set icon url if not;

  if (icon && icon !== '') {
    var iconEnum = CardService.Icon[icon];

    if (iconEnum) {
      keyValue.setIcon(iconEnum);
    } else {
      keyValue.setIconUrl(icon);
    }
  } //set top title if found;


  if (top && top !== '') {
    keyValue.setTopLabel(top);
  } //convert strings to boolean;


  if (typeof selected === 'string') {
    selected = selected === 'true';
  } //create Switch widget and set required parameters;


  var widget = CardService.newSwitch();
  widget.setFieldName(name);
  widget.setSelected(selected);
  widget.setValue(value); //set an onchange action;

  if (funcName) {
    var action = actionAction(funcName, hasSpinner, params);
    widget.setOnChangeAction(action);
  } //set switch and return widget;


  keyValue.setSwitch(widget);
  return keyValue;
}
/** 
 * Creates a simple KeyValue widget;
 * @param {Object} config widget configuration;
 * @return {KeyValue} simple KeyValue widget;
 */


function simpleKeyValueWidget(config) {
  var icon = config.icon;
  var title = config.title;
  var content = config.content;
  var hint = config.hint;
  var multiline = config.multiline;
  var button = config.button; //modify content to avoid errors;

  if (content instanceof Date) {
    content = content.toLocaleDateString();
  }

  if (!content) {
    content = '';
  } //create widget and set required parameters;


  var widget = CardService.newKeyValue();
  widget.setContent(content); //set optional parameters;

  if (multiline !== undefined) {
    widget.setMultiline(multiline);
  } else {
    widget.setMultiline(true);
  }

  if (title && title !== '') {
    widget.setTopLabel(title);
  }

  if (hint && hint !== '') {
    widget.setBottomLabel(hint);
  }

  if (button) {
    widget.setButton(button);
  } //set icon if found or set icon url if not;


  if (icon && icon !== '') {
    var iconEnum = CardService.Icon[icon];

    if (iconEnum) {
      widget.setIcon(iconEnum);
    } else {
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
 * @param {String} type action type;
 * @param {String} callback function name or link to open;
 * @param {Object=} params parameters to pass to function;
 * @returns {KeyValue} this KeyValue with action;
 */


function actionKeyValueWidget(icon, top, content, type, callback, params) {
  //modify content to avoid errors;
  if (content instanceof Date) {
    content = content.toLocaleDateString();
  }

  if (content === null) {
    content = '';
  } //create widget and set required parameters;


  var widget = CardService.newKeyValue();
  widget.setContent(content);
  widget.setMultiline(true); //set top title if found;

  if (top && top !== '') {
    widget.setTopLabel(top);
  } //set icon if found or set icon url if not;    


  if (icon && icon !== '') {
    var iconEnum = CardService.Icon[icon];

    if (iconEnum) {
      widget.setIcon(iconEnum);
    } else {
      widget.setIconUrl(icon);
    }
  } //set widget action;


  var action;

  switch (type) {
    case globalActionAction:
      action = actionAction(callback, true, params);
      widget.setOnClickAction(action);
      break;

    case globalActionLink:
      action = CardService.newOpenLink();
      action.setUrl(callback);

      if (params.fullsized) {
        action.setOpenAs(CardService.OpenAs.FULL_SIZE);
      } else {
        action.setOpenAs(CardService.OpenAs.OVERLAY);
      }

      if (params.reload) {
        action.setOnClose(CardService.OnClose.RELOAD_ADD_ON);
      } else {
        action.setOnClose(CardService.OnClose.NOTHING);
      }

      widget.setOpenLink(action);
      break;
  }

  return widget;
}
/** 
 * Creates a KeyValue widget with TextButton on the right;
 * @param {String} icon url or enum of icon to use;
 * @param {String} top widget title;
 * @param {String} content content text;
 * @param {TextButton} button a button object to add on the right; 
 * @param {String} funcName callback function name;
 * @param {Object=} params parameters to pass to function;
 * @returns {KeyValue} this KeyValue with TextButton;
 */


function actionKeyValueWidgetButton(icon, top, content, button, funcName, params) {
  //modify content to avoid errors;
  if (content instanceof Date) {
    content = content.toLocaleDateString();
  }

  if (content === null) {
    content = '';
  } //create widget and set required parameters;


  var widget = CardService.newKeyValue();
  widget.setContent(content);
  widget.setButton(button);
  widget.setMultiline(true); //set top title if found;

  if (top && top !== '') {
    widget.setTopLabel(top);
  } //set icon if found or set icon url if not;


  if (icon && icon !== '') {
    var iconEnum = CardService.Icon[icon];

    if (iconEnum) {
      widget.setIcon(iconEnum);
    } else {
      widget.setIconUrl(icon);
    }
  } //set onclick action and set parameters if provided;


  var action = actionAction(funcName, true, params);
  widget.setOnClickAction(action);
  return widget;
}
/**
 * Creates a selection widget with specified options;
 * @param {String} top widget title;
 * @param {String} name fieldname of the input;
 * @param {String} type type of select to render: checkboxes / radio btns / dropdown list;
 * @param {Array} options an array of objects representing selection options;
 * @param {String=} funcName callback function name;
 * @param {Boolean=} hasSpinner set spinner on Ui or not;
 * @param {Object=} params parameters to pass to function;
 * @returns {SelectionInput} this SelectionInput;
 */


function selectionInputWidget(top, name, type, options, funcName, hasSpinner, params) {
  //create widget and set required parameters;
  var widget = CardService.newSelectionInput();
  widget.setFieldName(name); //set widget's type accordingly [rewrite];

  widget.setType(CardService.SelectionInputType[type]); //set top title if found;

  if (top && top !== '') {
    widget.setTitle(top);
  } //set an onchange action;


  if (funcName) {
    var action = actionAction(funcName, hasSpinner, params);
    widget.setOnChangeAction(action);
  } //set options to widget;


  options.forEach(function (option) {
    widget.addItem(option.text, option.value, option.selected);
  });
  return widget;
}