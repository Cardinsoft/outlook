function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** CardService service; */
let e_CardService =
/*#__PURE__*/
function () {
  function e_CardService() {
    _classCallCheck(this, e_CardService);

    /** @enum {String} draft type */
    this.ComposedEmailType = Object.freeze({
      REPLY_AS_DRAFT: 'REPLY_AS_DRAFT',
      STANDALONE_DRAFT: 'STANDALONE_DRAFT'
    });
    /** @enum {String} draft content type */

    this.ContentType = Object.freeze({
      TEXT: 'TEXT',
      MUTABLE_HTML: 'MUTABLE_HTML',
      IMMUTABLE_HTML: 'IMMUTABLE_HTML'
    });
    /** @enum {String} image border style */

    this.ImageStyle = Object.freeze({
      SQUARE: 'SQUARE',
      CIRCLE: 'CIRCLE'
    });
    /** @enum {String} indicator type */

    this.LoadIndicator = Object.freeze({
      NONE: 'NONE',
      SPINNER: 'SPINNER'
    });
    /** @enum {String} notification type */

    this.NotificationType = Object.freeze({
      INFO: 'INFO',
      WARNING: 'WARNING',
      ERROR: 'ERROR'
    });
    /** @enum {String} selection input type */

    this.SelectionInputType = Object.freeze({
      CHECK_BOX: 'CHECK_BOX',
      RADIO_BUTTON: 'RADIO_BUTTON',
      DROPDOWN: 'DROPDOWN'
    });
    /** @enum {String} draft body type */

    this.UpdateDraftBodyType = Object.freeze({
      IN_PLACE_INSERT: 'IN_PLACE_INSERT'
    });
    /** @enum {String} text button style */

    this.TextButtonStyle = Object.freeze({
      TEXT: 'TEXT',
      FILLED: 'FILLED'
    });
    /** @enum {String} on close action */

    this.OnClose = Object.freeze({
      RELOAD_ADD_ON: 'RELOAD_ADD_ON',
      NOTHING: 'NOTHING'
    });
    /** @enum {String} tab size type */

    this.OpenAs = Object.freeze({
      OVERLAY: 'OVERLAY',
      FULL_SIZE: 'FULL_SIZE'
    });
    /** @enum {String} icon */

    this.Icon = Object.freeze({
      NONE: '',
      AIRPLANE: 'https://cardinsoft.github.io/outlook/Icons/Enum/AIRPLANE.png',
      BOOKMARK: 'https://cardinsoft.github.io/outlook/Icons/Enum/BOOKMARK.png',
      BUS: 'https://cardinsoft.github.io/outlook/Icons/Enum/BUS.png',
      CAR: 'https://cardinsoft.github.io/outlook/Icons/Enum/CAR.png',
      CLOCK: 'https://cardinsoft.github.io/outlook/Icons/Enum/CLOCK.png',
      CONFIRMATION_NUMBER_ICON: 'https://cardinsoft.github.io/outlook/Icons/Enum/CONFIRMATION_NUMBER_ICON.png',
      DOLLAR: 'https://cardinsoft.github.io/outlook/Icons/Enum/DOLLAR.png',
      DESCRIPTION: 'https://cardinsoft.github.io/outlook/Icons/Enum/DESCRIPTION.png',
      EMAIL: 'https://cardinsoft.github.io/outlook/Icons/Enum/EMAIL.png',
      EVENT_PERFORMER: 'https://cardinsoft.github.io/outlook/Icons/Enum/EVENT_PERFORMER.png',
      EVENT_SEAT: 'https://cardinsoft.github.io/outlook/Icons/Enum/EVENT_SEAT.png',
      FLIGHT_ARRIVAL: 'https://cardinsoft.github.io/outlook/Icons/Enum/FLIGHT_ARRIVAL.png',
      FLIGHT_DEPARTURE: 'https://cardinsoft.github.io/outlook/Icons/Enum/FLIGHT_DEPARTURE.png',
      HOTEL: 'https://cardinsoft.github.io/outlook/Icons/Enum/HOTEL.png',
      HOTEL_ROOM_TYPE: 'https://cardinsoft.github.io/outlook/Icons/Enum/HOTEL_ROOM_TYPE.png',
      INVITE: 'https://cardinsoft.github.io/outlook/Icons/Enum/INVITE.png',
      MAP_PIN: 'https://cardinsoft.github.io/outlook/Icons/Enum/MAP_PIN.png',
      MEMBERSHIP: 'https://cardinsoft.github.io/outlook/Icons/Enum/MEMBERSHIP.png',
      MULTIPLE_PEOPLE: 'https://cardinsoft.github.io/outlook/Icons/Enum/MULTIPLE_PEOPLE.png',
      OFFER: 'https://cardinsoft.github.io/outlook/Icons/Enum/OFFER.png',
      PERSON: 'https://cardinsoft.github.io/outlook/Icons/Enum/PERSON.png',
      PHONE: 'https://cardinsoft.github.io/outlook/Icons/Enum/PHONE.png',
      RESTAURANT_ICON: 'https://cardinsoft.github.io/outlook/Icons/Enum/RESTAURANT_ICON.png',
      SHOPPING_CART: 'https://cardinsoft.github.io/outlook/Icons/Enum/SHOPPING_CART.png',
      STAR: 'https://cardinsoft.github.io/outlook/Icons/Enum/STAR.png',
      STORE: 'https://cardinsoft.github.io/outlook/Icons/Enum/STORE.png',
      TICKET: 'https://cardinsoft.github.io/outlook/Icons/Enum/TICKET.png',
      TRAIN: 'https://cardinsoft.github.io/outlook/Icons/Enum/TRAIN.png',
      VIDEO_CAMERA: 'https://cardinsoft.github.io/outlook/Icons/Enum/VIDEO_CAMERA.png',
      VIDEO_PLAY: 'https://cardinsoft.github.io/outlook/Icons/Enum/VIDEO_PLAY.png'
    });
  }
  /**
   * Creates an Action;
   * @return {Action} Action instance;
   */


  _createClass(e_CardService, [{
    key: "newAction",
    value: function newAction() {
      return new Action();
    }
  }, {
    key: "newAuthorizationAction",

    /**
     * Creates an Authorization action;
     * @return {AuthorizationAction} AuthorizationAction instance;
     */
    value: function newAuthorizationAction() {
      return new AuthorizationAction();
    }
  }, {
    key: "newActionResponseBuilder",

    /**
     * Create an ActionResponse builder;
     * @return {ActionResponseBuilder} ActionResponseBuilder instance;
     */
    value: function newActionResponseBuilder() {
      return new ActionResponseBuilder();
    }
  }, {
    key: "newButtonSet",

    /**
     * Create a Button Set;
     * @return {ButtonSet} ButtonSet instance;
     */
    value: function newButtonSet() {
      return new ButtonSet();
    }
  }, {
    key: "newCardAction",

    /**
     * Creates a Card Action;
     * @return {CardAction} CardAction instance;
     */
    value: function newCardAction() {
      return new CardAction();
    }
  }, {
    key: "newCardBuilder",

    /**
     * Creates a Card Builder;
     * @return {CardBuilder} CardBuilder instance;
     */
    value: function newCardBuilder() {
      return new CardBuilder();
    }
  }, {
    key: "newCardHeader",

    /**
     * Creates a Card Header;
     * @return {CardHeader} CardHeader instance;
     */
    value: function newCardHeader() {
      return new CardHeader();
    }
  }, {
    key: "newCardSection",

    /**
     * Creates a Card Section;
     * @return {CardSection} CardSection instance;
     */
    value: function newCardSection() {
      return new CardSection();
    }
  }, {
    key: "newImage",

    /**
     * Creates an Image;
     * @return {Image} Image instance;
     */
    value: function newImage() {
      return new Image();
    }
  }, {
    key: "newKeyValue",

    /**
     * Creates a KeyValue;
     * @return {KeyValue} KeyValue instance;
     */
    value: function newKeyValue() {
      return new KeyValue();
    }
  }, {
    key: "newNavigation",

    /**
     * Creates Navigation;
     * @return {Navigation} Navigation instance;
     */
    value: function newNavigation() {
      return new Navigation();
    }
  }, {
    key: "newNotification",

    /**
     * Creates a Notification;
     * @return {Notification} Notification instance;
     */
    value: function newNotification() {
      return new Notification();
    }
  }, {
    key: "newOpenLink",

    /**
     * Creates an Open link;
     * @return {OpenLink} OpenLink instance;
     */
    value: function newOpenLink() {
      return new OpenLink();
    }
  }, {
    key: "newSwitch",

    /**
     * Creates a Switch;
     * @return {Switch} Switch instance;
     */
    value: function newSwitch() {
      return new Switch();
    }
  }, {
    key: "newTextButton",

    /**
     * Creates a Text button;
     * @return {TextButton} TextButton instance;
     */
    value: function newTextButton() {
      return new TextButton();
    }
  }, {
    key: "newImageButton",

    /**
     * Creates an Image button;
     * @return {ImageButton} ImageButton instance;
     */
    value: function newImageButton() {
      return new ImageButton();
    }
  }, {
    key: "newTextInput",

    /**
     * Creates a Text input;
     * @return {TextInput} TextInput instance;
     */
    value: function newTextInput() {
      return new TextInput();
    }
  }, {
    key: "newSelectionInput",

    /**
     * Creates a Selection input;
     * @return {SelectionInput} SelectionInput instance;
     */
    value: function newSelectionInput() {
      return new SelectionInput();
    }
  }, {
    key: "newTextParagraph",

    /**
     * Creates a TextParagraph;
     * @return {TextParagraph} TextParagraph instance;
     */
    value: function newTextParagraph() {
      return new TextParagraph();
    }
  }, {
    key: "newUniversalActionResponseBuilder",

    /**
     * Creates a UniversalActionResponse builder; 
     * @return {UniversalActionResponseBuilder} UniversalActionResponseBuilder instance;
     */
    value: function newUniversalActionResponseBuilder() {
      return new UniversalActionResponseBuilder();
    }
  }]);

  return e_CardService;
}();