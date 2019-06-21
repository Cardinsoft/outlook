"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
} //Emulate CacheService service;


var e_CacheService = function e_CacheService() {
  _classCallCheck(this, e_CacheService);

  this.className = 'CacheService';
};
/**
 * Gets document Cache - FOR FUTURE RELEASE, NOT USED;
 * @returns {Cache}
 */


e_CacheService.prototype.getDocumentCache = function () {
  return this;
};
/**
 * Gets script Cache using Window.sessionStorage API;
 * @returns {Cache}
 */


e_CacheService.prototype.getScriptCache = function () {
  //access session storage;
  var session = window.sessionStorage; //create an instance of Cache with storage;

  var cache = new Cache(session);
  return cache;
};
/**
 * Gets user Cache using Window.localStorage API;
 * @returns {Cache}
 */


e_CacheService.prototype.getUserCache = function () {
  //access session storage;
  var local = window.localStorage; //create an instance of Cache with storage;

  var cache = new Cache(local);
  return cache;
}; //Emulate Cache class for CacheService service;


var Cache = function Cache(storage) {
  _classCallCheck(this, Cache);

  this.storage = storage;
};
/**
 * Gets value from Cache by key (or null if value not found);
 * @param {String} key key to get value by;
 * @return {String|Object}
 */


Cache.prototype.get = function (key) {
  //access storage;
  var cache = this.storage; //access value by key;

  var value = cache.getItem(key);
  return value;
};
/**
 * Gets values from Cache by keys (or null if value not found);
 * @param {Array} keys keys Array to get values by;
 * @return {Object}
 */


Cache.prototype.getAll = function (keys) {
  //access storage;
  var cache = this.storage; //initialize result;

  var values = {};

  if (keys.length > 0) {
    keys.forEach(function (key) {
      //access value by key;
      var value = cache.getItem(key);

      if (value !== null) {
        values[key] = value;
      }
    });
  } else {
    return null;
  }
};
/**
 * Puts value to Cache by key without expiration;
 * @param {String} key key to save value by;
 * @param {String} value value to set to key;
 */


Cache.prototype.put = function (key, value) {
  //access storage;
  var cache = this.storage; //if value is an object, stringify;

  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  } //set key-value pair to cache;


  try {
    cache.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};
/**
 * Puts values to Cache by keys without expiration;
 * @param {Array} values an Array of key-value pairs to set;
 */


Cache.prototype.putAll = function (values) {
  //access storage;
  var cache = this.storage;

  if (values.length > 0) {
    values.forEach(function (value) {
      //access key from key-value pair;
      var key = Object.keys(value)[0];
      var val = value[key];
      cache.setItem(key, val);
    });
  }
};
/**
 * Removes value from Cache by key;
 * @param {String} key key to remove value by;
 */


Cache.prototype.remove = function (key) {
  //access storage;
  var cache = this.storage;
  cache.removeItem(key);
};
/**
 * Removes values from Cache by keys;
 * @param {Array} keys an Array of keys to remove;
 */


Cache.prototype.removeAll = function (keys) {
  //access storage;
  var cache = this.storage;

  if (keys.length > 0) {
    keys.forEach(function (key) {
      cache.removeItem(key);
    });
  }
}; //Storage API does not have expiration methods;


Cache.prototype.put = function (key, value, expirationInSeconds) {
  //access storage;
  var cache = this.storage; //if value is an object, stringify;

  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  } //set key-value pair to cache;


  try {
    cache.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

Cache.prototype.putAll = function (values, expirationInSeconds) {
  //access storage;
  var cache = this.storage;

  if (values.length > 0) {
    values.forEach(function (value) {
      //access key from key-value pair;
      var key = Object.keys(value)[0];
      var val = value[key];
      cache.setItem(key, val);
    });
  }
}; //Initiate CacheService;


var CacheService = new e_CacheService();