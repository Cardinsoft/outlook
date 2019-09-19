function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** UniversalActionResponseBuilder class */
let UniversalActionResponseBuilder =
/*#__PURE__*/
function () {
  function UniversalActionResponseBuilder() {
    _classCallCheck(this, UniversalActionResponseBuilder);

    this.openLink;
  }

  _createClass(UniversalActionResponseBuilder, [{
    key: "setOpenLink",
    value: function setOpenLink(openLink) {}
  }, {
    key: "displayAddOnCards",
    value: function displayAddOnCards(cardObjects) {}
  }, {
    key: "build",
    value: function build() {
      const response = new UniversalActionResponse(this);
      return response;
    }
  }]);

  return UniversalActionResponseBuilder;
}();
/** UniversalActionResponse class */


let UniversalActionResponse = function UniversalActionResponse(builder) {
  _classCallCheck(this, UniversalActionResponse);

  this.returns = builder;
}; //TODO printJSON()