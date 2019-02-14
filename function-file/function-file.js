/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// The initialize function must be run each time a new page is loaded
Office.initialize = reason => {

};

// Add any ui-less function here


function getJSON(id) {
  var file = DriveApp.getFileById(id);  
  var blob = file.getBlob();
  var str = blob.getDataAsString();    
  return JSON.parse(str);
}

function setJSON(id,content) {
  var file = DriveApp.getFileById(id);
  var str = JSON.stringify(content);
  return file.setContent(str);
}

/**
 * Fetches user / script property value by key;
 * @param {String} key -> key of the property to find;
 * @param {String} type -> 'user' or 'script' to determine prop type to get;
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
  return value;
}

/**
 * Fetches an sets user / script property by key;
 * @param {String} key -> key of the property to find;
 * @param {String} value -> new value of the property;
 * @param {String} type -> 'user' or 'script' to determine prop type to get;
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
  props.setProperty(key,value);
}

/**
 * Deletes a user / script property by key;
 * @param {String} key -> key of the property to find;
 * @param {String} type -> 'user' or 'script' to determine prop type to get;
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
 * @param {String} key -> key of the property to find
 * @param {String} type -> 'user' or 'script' to determine prop type to get 
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

/* 
 * Attempts to clear any pre-cached data from the widget
 * @param {Object} e -> event object;
 * @returns {ActionResponse}
 */
function universalRefresh(e) {
  var card = cardOpen(e);
  var builder = CardService.newUniversalActionResponseBuilder();
      builder.displayAddOnCards([card]);
  return builder.build();
}

function universalSettings(e) {
  var card = cardOpen(e);
  var builder = CardService.newUniversalActionResponseBuilder();
      builder.displayAddOnCards([card]);
  return builder.build();  
}

function universalAdvanced(e) {
  var card = cardAdvanced(e);
  var builder = CardService.newUniversalActionResponseBuilder();
      builder.displayAddOnCards([card]);
  return builder.build();
}

function universalHelp(e) {
  var card = cardHelp(e);
  var builder = CardService.newUniversalActionResponseBuilder();
      builder.displayAddOnCards([card]);
  return builder.build();
}

function parseData(data) {
  Logger.log(data);
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
  if(content===undefined) { content = '[]'; }
  var file = DriveApp.createFile(globalConfigName+'.json',content,MimeType.PLAIN_TEXT);
  setProperty('config',file.getId(),'user');
}

function performFullReset(e) {
  var src = getProperty('config','user');
  if(src!==null) {
    try {
      var file = DriveApp.getFileById(src);
      DriveApp.removeFile(file); 
    }
    catch(e) {
      Logger.log('There was no config file to delete');
    }
  }
  deleteAllProperties('user');
  clearLayout();
  
  var builder = CardService.newActionResponseBuilder();
      builder.setStateChanged(true);
      builder.setNavigation(CardService.newNavigation().updateCard(cardOpen(e)));
  return builder.build();
}

function performFetch(e,url) {
  var msg = getToken(e);
  
  var email = trimFrom(msg.getFrom());
  
  var payload = {
    'Bcc': msg.getBcc(),
    'Cc': msg.getCc(),
    'date': msg.getDate(),
    'from': email,
    'id': msg.getId(),
    'plainBody': msg.getPlainBody(),
    'subject': msg.getSubject(),
    'destination': url
  };
  
  try {
    var response = UrlFetchApp.fetch(globalGateUrl,{'method':'post','payload':JSON.stringify(payload),'muteHttpExceptions':true,'contentType':'application/json'});
    var code = response.getResponseCode();
    var headers = response.getHeaders();
    var content = response.getContentText();
    
    Logger.log('CODE: '+code);
    Logger.log('IS EMPTY STRING: '+ (content==='') );
    Logger.log(typeof content);
    var isValid = content!==null&&content!==undefined;
    if(!isValid) { content = '[]'; }
    
    return {code:code,headers:headers,content:JSON.stringify(content)};
  }
  catch(e) { //handle http exceptions, including code sets 40-,50-;
    return {code:0,headers:'',content:e.message}
  }
  
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