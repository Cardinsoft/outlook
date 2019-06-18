"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate PropertiesService service;
var e_PropertiesService = function e_PropertiesService() {
  _classCallCheck(this, e_PropertiesService);

  this.className = 'PropertiesService';
  this.documentProperties = Office.context.roamingSettings;
  this.scriptProperties = Office.context.roamingSettings;
  this.userProperties = Office.context.roamingSettings;
};

e_PropertiesService.prototype.getDocumentProperties = function () {
  var settings = this.documentProperties;
  return new Properties(settings, 'document');
};

e_PropertiesService.prototype.getScriptProperties = function () {
  var settings = this.scriptProperties;
  return new Properties(settings, 'script');
};

e_PropertiesService.prototype.getUserProperties = function () {
  var settings = this.userProperties;
  return new Properties(settings, 'user');
}; //Emulate Class Properties for PropertiesService service;


var Properties = function Properties(settings, type) {
  _classCallCheck(this, Properties);

  this.settings = settings;
  this.type = type;
}; //add new methods to the class;


Properties.prototype.deleteAllProperties = function () {
  //initiate settings storage;
  var settings = this.settings; //access configured keys;

  var keys = Object.keys(settings); //delete every key found;

  keys.forEach(function (key) {
    //access settings props;
    var obj = settings[key]; //remove every setting;

    if (obj !== null) {
      var props = Object.keys(obj);

      if (props.length > 0) {
        props.forEach(function (prop) {
          settings.remove(prop);
        });
      }
    }
  }); //persist changes;

  settings.saveAsync();
  var type = this.type; //update RoamingSettings in PropertiesService;

  if (type === 'user') {
    PropertiesService.userProperties = settings;
  }

  return settings;
};

Properties.prototype.deleteProperty = function (key) {
  var settings = this.settings;
  settings.remove(key);
  settings.saveAsync();
  var type = this.type; //update RoamingSettings in PropertiesService;

  if (type === 'user') {
    PropertiesService.userProperties = settings;
  }

  return settings;
}; //Properties.prototype.getKeys = function () {} - not needed for initial release;
//Properties.prototype.getProperties = function () {} - not needed for initial release;


Properties.prototype.getProperty = function (key) {
  var settings = this.settings;
  var property = settings.get(key);

  if (property) {
    return property;
  } else {
    return null;
  }
};

Properties.prototype.setProperties = function (properties, deleteAllOthers) {
  //add delete others after initial release;
  var settings = this.settings;

  for (var key in properties) {
    var value = properties[key];
    settings.setProperty(key, value);
  }

  var type = this.type;

  if (type === 'user') {
    PropertiesService.userProperties = settings;
  }

  return settings;
};

Properties.prototype.setProperty = function (key, value) {
  var settings = this.settings;
  settings.set(key, value);
  settings.saveAsync();
  var type = this.type; //update RoamingSettings in PropertiesService;

  if (type === 'user') {
    PropertiesService.userProperties = settings;
  }

  return settings;
};