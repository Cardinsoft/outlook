function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}
/**
 * Gets an Array element by its property;
 * @param {Array} array an Array of objects;
 * @param {String} name property name;
 * @param {*} value property value;
 * @returns {Object|Array} element
 */


function getByProperty(array, name, value) {
  var output = array.filter(function (element) {
    if (element[name] === value) {
      return element;
    }
  });
  return output;
}
/**
 * Copies object's properties to another object;
 * @param {Object} original object to copy;
 * @param {Object} target object to copy to;
 * @param {Boolean} override override props under same name;
 * @returns {Object} target object;
 */


function copyObject(original, target, override) {
  for (var key in original) {
    if (!override && target[key] !== undefined) {
      continue;
    }

    target[key] = original[key];
  }

  return target;
}
/**
 * Generates a unique identifier for new entity;
 * @param {Array} ids an array of objects with identifiers;
 * @returns {String} new identifier;
 */


function generateId(ids) {
  var id = Utilities.base64Encode(Math.random().toString());

  var isUnique = function (a, i) {
    var result = true;

    for (var p in a) {
      if (a[p].ID === i) {
        result = false;
      }
    }

    return result;
  }(ids, id);

  if (isUnique) {
    return id;
  } else {
    return generateId(ids);
  }
}
/**
 * Fills content for each widget provided with preserved values;
 * @param {Object} connector object containing preserved values;
 * @param {Array} widgets an array of widgets to loop through;
 */


function preserveValues(connector, widgets) {
  //ensure input values are preserved;
  if (widgets.length !== 0) {
    widgets.forEach(function (widget) {
      var name = widget.name;
      var content = widget.content;

      for (var key in connector) {
        //if field name is found;
        if (key === name) {
          //if content is array -> select options;
          if (content instanceof Array) {
            content.forEach(function (option) {
              if (connector[key].indexOf(option.value) !== -1) {
                option.selected = true;
              } else {
                option.selected = false;
              }
            });
          } else {
            widget.content = connector[key];
          }
        }
      }
    });
  }
}
/**
 * Helper function to sort config array;
 * @param {Array} config an array of Connector settings objects;
 */


function sortConfig(_x) {
  return _sortConfig.apply(this, arguments);
}
/**
 * Performs a simple sort of input provided;
 * @param {String|Date|Number} A prior input;
 * @param {String|Date|Number} B posterior input;
 * @param {Boolean} reverse truthy value to toggle sorting order reverse;
 * @returns {Integer}
 */


function _sortConfig() {
  _sortConfig = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(config) {
    var orderType, reverse;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return getProperty('order', 'user');

        case 2:
          orderType = _context.sent;
          _context.next = 5;
          return getProperty('reverse', 'user');

        case 5:
          reverse = _context.sent;
          _context.t0 = orderType;
          _context.next = _context.t0 === 'alphabet' ? 9 : _context.t0 === 'type' ? 11 : _context.t0 === 'creation' ? 13 : 15;
          break;

        case 9:
          config.sort(function (a, b) {
            return order(a.name, b.name, reverse);
          });
          return _context.abrupt("break", 15);

        case 11:
          config.sort(function (a, b) {
            return order(a.type, b.type, reverse);
          });
          return _context.abrupt("break", 15);

        case 13:
          if (reverse) {
            config.reverse();
          }

          return _context.abrupt("break", 15);

        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _sortConfig.apply(this, arguments);
}

function order(A, B, reverse) {
  //perform implicit boolean conversion;
  if (reverse === 'true') {
    reverse = true;
  } else if (reverse === 'false' || reverse === null) {
    reverse = false;
  } //check if both inputs are of the same type and which one;


  var areStrings = typeof A === 'string' && typeof B === 'string';
  var areDates = A instanceof Date && B instanceof Date;
  var areNumbers = typeof A === 'number' && typeof B === 'number';

  if (!areStrings && !areDates && !areNumbers) {
    //if types differ from expected -> do not sort;
    return 0;
  } else if (areStrings) {
    //if both are strings -> sort alphabetically;
    A = A.toLowerCase();
    B = B.toLowerCase();

    if (reverse) {
      if (A > B) {
        return -1;
      } else if (A < B) {
        return 1;
      }
    } else {
      if (A > B) {
        return 1;
      } else if (A < B) {
        return -1;
      }
    }
  } else if (areNumbers) {
    //if both numbers -> subtract A from B (or reverse);
    if (reverse) {
      return B - A;
    } else {
      return A - B;
    }
  } else if (areDates) {
    //if both are dates -> subtract value of A from value of B (or reverse);
    A = A.valueOf();
    B = B.valueOf();

    if (reverse) {
      return B - A;
    } else {
      return A - B;
    }
  }

  return 0;
}
/**
 * Checks if input ends with 1;
 * @param {Number|String} input input to check;
 * @returns {Boolean}
 */


function endsOnOne(input) {
  var result = false;
  var isNum = typeof input === 'number';
  var isStr = typeof input === 'string';

  if (isNum) {
    var arr = input.toString().split('');
    var li = arr.lastIndexOf('1');

    if (li === arr.length - 1) {
      result = true;
    }
  } else if (isStr) {
    return input.lastIndexOf('1') === input.length - 1;
  }

  return result;
}
/**
 * Creates an object with extra data parameters;
 * @param {Array} content an array of sections with widgets;
 * @param {Integer} start index to start from (for extra data);
 * @returns {Object}
 */


function getBeginMax(content, start) {
  var cap = 0,
      full = 0; //handle full content length (including all fields)

  for (var i = 0; i < content.length; i++) {
    try {
      var result = JSON.parse(content[i]);
    } catch (er) {
      result = content[i];
    }

    for (var key in result) {
      full += 1;
    }
  } //handle number of sections to display at one time


  for (var max = 0; max < content.length; max++) {
    if (cap >= globalWidgetsCap) {
      break;
    }

    try {
      var result = JSON.parse(content[max]);
    } catch (er) {
      result = content[max];
    }

    for (var key in result) {
      cap += 1;
    }
  } //shift begin and max parameters;


  if (start !== undefined) {
    var begin = +start;
    max = max + begin;
  } else {
    begin = 0;
  } //construct output object and return it;


  var output = {
    full: full,
    begin: begin,
    max: max,
    cap: cap
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
  var max = Math.floor(100 / content.length); //count full number of widgets;

  var full = 0,
      layout = [];
  content.forEach(function (c) {
    //access widgets;
    var widgets = c.widgets; //increment full length;

    for (var widget in widgets) {
      full += 1;
    } //add number of widgets to layout;


    var length = widgets.length;

    if (length > max) {
      layout.push(max);
    } else {
      layout.push(widgets.length);
    }
  });
  return layout;
}
/**
 * Creates an object for generating timeframes;
 * @param {Date} start instance of Date (starting);
 * @param {Date} end instance of Date (ending);
 * @returns {Object}
 */


function getTimeframe(start, end) {
  //calc milliseconds between dates;
  var between = end.valueOf() - start.valueOf(); //create timeframe object;

  var timeframe = {
    between: between,
    minutes: 0,
    hours: 0,
    days: 0,
    months: 0,
    years: 0
  }; //count timeframe values;

  var minutes = end.getMinutes() - start.getMinutes();
  var hours = end.getHours() - start.getHours();
  var days = end.getDate() - start.getDate();
  var months = end.getMonth() - start.getMonth();
  var years = end.getFullYear() - start.getFullYear(); //update timeframe parameters;

  timeframe.minutes = minutes, timeframe.hours = hours, timeframe.days = days, timeframe.months = months, timeframe.years = years;
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
  var hasEmailData = data.some(function (d) {
    return regExp.test(d);
  });
  return hasEmailData;
}
/**
 * Fetches spreadsheet by URL or Id;
 * @param {String} filter spreadsheet URL or Id;
 * @param {Boolean} isId truthy value to determine fetching by Id;
 * @returns {Spreadsheet|null}
 */


function getSpreadsheet(filter, isId) {
  try {
    var spreadsheet;

    if (isId) {
      spreadsheet = SpreadsheetApp.openById(filter);
    } else {
      spreadsheet = SpreadsheetApp.openByUrl(filter);
    }

    return spreadsheet;
  } catch (error) {
    var isMissing = error.message.indexOf('is missing') >= 0;
    console.log('Could not find spreadsheet with filter set to "%s"', filter);

    if (isMissing) {
      return 404;
    } else {
      return null;
    }
  }
}
/**
 * Checks error type against common error types;
 * @param {Object} error error object;
 * @returns {Boolean}
 */


function checkAgainstErrorTypes(error) {
  var isEval = error instanceof EvalError;
  var isRange = error instanceof RangeError;
  var isRef = error instanceof ReferenceError;
  var isSyntax = error instanceof SyntaxError;
  var isType = error instanceof TypeError;
  var isURI = error instanceof URIError;
  var notTyped = !isEval && !isRange && !isRef && !isSyntax && !isType && !isURI;
  return notTyped;
}
/**
 * Stringifies every object property that is not of type String;
 * @param {Object} object object to change;
 * @returns {Object}
 */


function propertiesToString(object) {
  var length = Object.keys(object).length;

  if (length !== 0) {
    for (var key in object) {
      var value = object[key];

      if (value) {
        //check normal types;
        var isObject = typeof value === 'object';
        var isBoolean = typeof value === 'boolean';
        var isNumber = typeof value === 'number'; //check unique situations;

        var isNull = value === null;
        var isArray = value instanceof Array;
        var isNotNum = isNaN(value);

        if (isArray) {
          value.forEach(function (element, index, array) {
            //check normal types;
            var elemIsObject = typeof element === 'object';
            var elemIsBoolean = typeof element === 'boolean';
            var elemIsNumber = typeof element === 'number'; //check unique situations;

            var elemIsNull = element === null;
            var elemIsArray = element instanceof Array;
            var elemIsNotNum = isNaN(element); //modify values according to checks;

            if (!elemIsNull && elemIsObject && !elemIsArray) {
              array[index] = JSON.stringify(element);
            }

            if (elemIsBoolean) {
              array[index] = element.toString();
            }

            if (elemIsNull) {
              array[index] = JSON.stringify(new Object(element));
            }
          });
          object[key] = value.join(',');
        } //handle arrays (only plain ones);


        if (!isNull && isObject && !isArray) {
          object[key] = JSON.stringify(value);
        } //handle proper objects;


        if (isBoolean || isNumber || isNotNum) {
          object[key] = value.toString();
        } //handle booleans, numbers and NaNs (same behaviour);


        if (isNull) {
          object[key] = JSON.stringify(new Object(value));
        } //handle null;

      } else {
        object[key] = ''; //undefined props to empty strings;
      }
    }
  }

  return object;
}

function toStr(obj) {
  var isStr = typeof obj === 'string';
  var isObj = typeof obj === 'object';
  var isNumber = typeof obj === 'number';
  var isBool = typeof obj === 'boolean';
  var isArr = obj instanceof Array;
  var isNull = obj === null;
  var isUndef = obj === undefined;

  if (isStr) {
    return obj;
  }

  if (isNumber || isBool) {
    return obj.toString();
  }

  if (isNull) {
    return JSON.stringify(new Object(obj));
  }

  if (isObj && !isArr && !isNull) {
    //is empty object ? return '{}'
    if (Object.keys(obj).length === 0) {
      return '{}';
    } //has no nested objects or arrays ?


    var hasObj = false;
    var hasArr = false;

    for (var key in obj) {
      if (typeof obj[key] === 'object') {
        hasObj = true;
      }

      if (obj[key] instanceof Array) {
        hasArr = true;
      }
    }

    if (!hasObj && !hasArr) {
      return JSON.stringify(obj);
    }

    for (var key in obj) {
      var sub = obj[key];

      if (sub === undefined) {
        delete obj[key];
      } else {
        obj[key] = toStr(sub);
      }
    }

    return JSON.stringify(obj);
  } else if (isArr) {
    obj.forEach(function (sub, key) {
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


function getIndex(config, connector) {
  var index = -1;
  var name = connector.name;

  if (config instanceof Array) {
    if (config.length !== 0) {
      config.forEach(function (conn, idx) {
        if (conn.name === name) {
          index = idx;
        }
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


function mergeObjects(extended, extender) {
  //check if extended and extender are arrays;
  var isArrExd = extended instanceof Array;
  var isArrExr = extender instanceof Array; //perform merging;

  if (isArrExd && isArrExr) {
    //if both are arrays -> extend length;
    extender.forEach(function (prop) {
      extended[extended.length] = prop;
    });
    return extended;
  } else if (!isArrExd && !isArrExr) {
    //if both are objects -> extend props;
    for (var key in extender) {
      var prop = extender[key];

      if (prop === undefined) {
        continue;
      }

      if (!extended.hasOwnProperty(key)) {
        extended[key] = prop;
      }
    }

    return extended;
  } else if (isArrExd) {
    //if extended is array -> append extender;
    extended[extended.length] = extender;
    return extended;
  } else {
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


function extendCustom(object, inputs) {
  for (var key in inputs) {
    var notIcon = key !== globalIconFieldName;
    var notName = key !== globalNameFieldName;
    var notURL = key !== globalURLfieldName;
    var notManual = key !== globalManualFieldName;
    var notDefault = key !== globalDefaultFieldName;

    if (notIcon && notName && notURL && notManual && notDefault) {
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


function trimMessage(msg, trimFromToFrom, trimFromToSender) {
  if (trimFromToFrom || trimFromToSender) {
    var from = msg.getFrom();
  }

  var trimmed = {};

  if (trimFromToFrom) {
    trimmed.email = trimFrom(from);
  }

  if (trimFromToSender) {
    trimmed.name = trimSender(from); //split sender's name by spaces (rudimental guessing);

    var split = trimmed.name.split(' '); //access possible first name, lowercase it and set default first name index;

    var first = split[0];
    var lwd = first.toLowerCase();
    var start = 0; //check if sender's name starts with "the" or "a";

    if (lwd === 'the' || lwd === 'a') {
      first += ' ' + split[1];
      start = 1;
    } //set first name and initiate last;


    trimmed.first = first;
    trimmed.last = '';

    if (split.length > 1) {
      split.forEach(function (part, idx) {
        var spacer = '';

        if (idx !== start + 1) {
          spacer = ' ';
        }

        if (idx > start) {
          trimmed.last += spacer + part;
        }
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
  if (!(data instanceof Array)) {
    return false;
  }

  var hasEditable = data.some(function (elem) {
    var widgets = elem.widgets;

    if (widgets instanceof Array) {
      var elemHasEditable = widgets.some(function (widget) {
        var state = widget.state;
        var type = widget.type;

        if (state === 'editable' || type === globalTextInput) {
          return widget;
        }
      });
    } else {
      elemHasEditable = false;
    }

    if (elemHasEditable) {
      return elem;
    }
  });
  return hasEditable;
}
/**
 * Checks if data contains nested objects to determine which Ui to load;
 * @param {Array} data an array of objects to check;
 * @returns {Boolean}
 */


function checkNested(data) {
  if (!(data instanceof Array)) {
    return false;
  }

  var hasNested = data.some(function (elem) {
    var hasSecondLevelObject = false;

    for (var key in elem) {
      var val = elem[key];

      if (typeof val === 'object') {
        hasSecondLevelObject = true;
        break;
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
  //check for empty and correct objects;
  var isObj = typeof data === 'object';

  if (isObj && Object.keys(data).length === 0) {
    return [];
  } else if (isObj) {
    return data;
  } //if data is undefined return empty array;


  if (!data) {
    return [];
  } //try to parse content until recieved an array; 


  try {
    while (!(data instanceof Array)) {
      data = JSON.parse(data);
    }

    return data;
  } catch (err) {
    data = data;
  }

  try {
    if (data === '' || data === '[]' || data === '""') {
      data = [];
    } else if (data !== []) {
      data = JSON.parse(data);
    }

    if (!(data instanceof Array) && !(typeof data === 'string')) {
      data = [data];
    } else if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (!(data instanceof Array) && typeof data === 'object') {
      data = [data];
    }
  } catch (error) {
    return data;
  } //if no other choice, return data;


  return data;
}
/**
 * Creates settings storage;
 * @param {String} content content to pass to JSON file;
 */


function createSettings(_x2) {
  return _createSettings.apply(this, arguments);
}
/**
 * Trims sender info from name and '<' & '>' characters;
 * @param {String} input email string;
 * @return {String}
 */


function _createSettings() {
  _createSettings = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(content) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!content) {
            content = [];
          }

          _context2.next = 3;
          return setProperty('config', content, 'user');

        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _createSettings.apply(this, arguments);
}

function trimFrom(input) {
  var regEx1 = /\<.+@.+\>/;
  var regEx2 = /[^\<].*@.+[^\>]/;

  try {
    var r = input.match(regEx1)[0];
  } catch (e) {
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

    if (index === -1) {
      return '';
    } else {
      return input.replace(input.slice(index), '');
    }
  } catch (e) {
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
  var isString = typeof input === 'string';
  var isBoolean = typeof input === 'boolean'; //if is boolean -> return unchanged;

  if (isBoolean) {
    return input;
  } //if is string -> change to boolean;


  if (isString) {
    if (input === 'true') {
      return true;
    }
  } //if nothing is applicable -> return false;


  return false;
}