/**
 * Creates a notification to show;
 * @param {String} text text to display when fired;
 * @returns {Notification}
 */
function notification(text) {
  var notification = CardService.newNotification();
      notification.setType(CardService.NotificationType.INFO);
      notification.setText(text);  
  return notification;
}

/**
 * Creates a warning to show;
 * @param {String} text text to display when fired;
 * @returns {Notification}
 */
function warning(text) {
  var notification = CardService.newNotification();
      notification.setType(CardService.NotificationType.WARNING);
      notification.setText(text);  
  return notification;  
}

/**
 * Creates an error to show;
 * @param {String} text text to display when fired;
 * @returns {Notification}
 */
function error(text) {
  var error = CardService.newNotification();
      error.setType(CardService.NotificationType.ERROR);
      error.setText(text);
  return error;
}