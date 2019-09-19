/**
 * Logger class;
 */
function e_Logger() {
  this.history = [];
  /**
   * Clears console;
   */

  this.clear = function () {
    this.history = [];
    console.clear();
  };
  /**
   * Returns log for current session;
   * @return {String} log history;
   */


  this.getLog = function () {
    return this.history.join('\r');
  };
  /**
   * Logs formatted or normal log;
   * @param {*|String} input input to log;
   * @param {...String} values substitutes to call on input;
   * @return {Object} Logger instance;
   */


  this.log = function (input) {
    var _console;

    this.history.push(new Date().toDateString() + ' INFO: ' + JSON.stringify(input));

    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    (_console = console).log.apply(_console, [input].concat(values));

    return this;
  };
}