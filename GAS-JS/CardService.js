"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Emulate CardService service;
var e_CardService = function e_CardService() {
  _classCallCheck(this, e_CardService);

  this.className = 'CardService';
  this.ComposedEmailType = {
    REPLY_AS_DRAFT: 'REPLY_AS_DRAFT',
    STANDALONE_DRAFT: 'STANDALONE_DRAFT'
  };
  this.ContentType = {
    TEXT: 'TEXT',
    MUTABLE_HTML: 'MUTABLE_HTML',
    IMMUTABLE_HTML: 'IMMUTABLE_HTML'
  };
  this.Icon = {
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
  };
  this.ImageStyle = {
    SQUARE: 'SQUARE',
    CIRCLE: 'CIRCLE'
  };
  this.LoadIndicator = {
    NONE: 'NONE',
    SPINNER: 'SPINNER'
  };
  this.NotificationType = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
  };
  this.OnClose = {
    RELOAD_ADD_ON: 'RELOAD_ADD_ON',
    NOTHING: 'NOTHING'
  };
  this.OpenAs = {
    OVERLAY: 'OVERLAY',
    FULL_SIZE: 'FULL_SIZE'
  };
  this.SelectionInputType = {
    CHECK_BOX: 'CHECK_BOX',
    RADIO_BUTTON: 'RADIO_BUTTON',
    DROPDOWN: 'DROPDOWN'
  };
  this.TextButtonStyle = {
    TEXT: 'TEXT',
    FILLED: 'FILLED'
  };
  this.UpdateDraftBodyType = {
    IN_PLACE_INSERT: 'IN_PLACE_INSERT'
  };
}; //add new methods to the class;


e_CardService.prototype.newAction = function () {
  return new Action();
};

e_CardService.prototype.newAuthorizationAction = function () {
  return new AuthorizationAction();
};

e_CardService.prototype.newActionResponseBuilder = function () {
  return new ActionResponseBuilder();
};

e_CardService.prototype.newButtonSet = function () {
  return new ButtonSet();
};

e_CardService.prototype.newCardAction = function () {
  return new CardAction();
};

e_CardService.prototype.newCardBuilder = function () {
  return new CardBuilder();
};

e_CardService.prototype.newCardHeader = function () {
  return new CardHeader();
};

e_CardService.prototype.newCardSection = function () {
  return new CardSection();
};

e_CardService.prototype.newKeyValue = function () {
  return new KeyValue();
};

e_CardService.prototype.newNavigation = function () {
  var navigation = new Navigation();
  return navigation;
};

e_CardService.prototype.newNotification = function () {
  return new Notification();
};

e_CardService.prototype.newOpenLink = function () {
  return new OpenLink();
};

e_CardService.prototype.newSwitch = function () {
  return new Switch();
};

e_CardService.prototype.newTextButton = function () {
  return new TextButton();
};

e_CardService.prototype.newTextInput = function () {
  return new TextInput();
};

e_CardService.prototype.newSelectionInput = function () {
  return new SelectionInput();
};

e_CardService.prototype.newTextParagraph = function () {
  return new TextParagraph();
};

e_CardService.prototype.newUniversalActionResponseBuilder = function () {
  return new UniversalActionResponseBuilder();
}; //initiate services to be able to access them;


var CardService = new e_CardService();