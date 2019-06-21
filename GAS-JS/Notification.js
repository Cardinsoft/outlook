function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
} //Emulate Class Notification for CardService service;


let Notification = function Notification() {
  _classCallCheck(this, Notification);

  this.text;
  this.type;
}; //add new methods to the class;


Notification.prototype.setText = function (text) {
  this.text = text;
  return this;
};

Notification.prototype.setType = function (type) {
  this.type = type;
  return this;
};

Notification.prototype.appendToUi = function ()
/*parent*/
{
  const type = this.type;
  const text = this.text;
  const parent = $('#app-notif');
  parent.empty(); //message bar;

  const notification = document.createElement('div');
  notification.className = 'ms-MessageBar';
  parent.appendChild(notification); //message bar content;

  const content = document.createElement('div');
  content.className = 'ms-MessageBar-content';
  notification.appendChild(content); //message bar icon;

  const icon = document.createElement('div');
  icon.className = 'ms-MessageBar-icon';
  content.appendChild(icon); //message bar icon content;

  const icontent = document.createElement('i');
  icontent.className = 'ms-Icon';
  icon.appendChild(icontent); //message bar text;

  const txt = document.createElement('div');
  txt.className = 'ms-MessageBar-text';
  txt.textContent = text;
  content.appendChild(txt);

  if (type === 'INFO') {
    icontent.classList.add('ms-Icon--Info');
  } else if (type === 'ERROR') {
    notification.classList.add('ms-MessageBar--error');
    icontent.classList.add('ms-Icon--ErrorBadge');
  } else if (type === 'WARNING') {
    notification.classList.add('ms-MessageBar--warning');
    icontent.classList.add('ms-Icon--Info');
  }

  window.setTimeout(function () {
    notification.remove();
  }, 3000);
};