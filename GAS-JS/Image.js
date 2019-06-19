/**
 * Image widget constructor function;
 */
function Image() {
	this.className = 'Image';
	this.src;
	this.alt = '';
	this.action;
	this.authorizationAction;
	this.openLink;
	this.composedEmailType;
}

/**
 * Sets alternative text to display when image isn't available;
 * @returns {Image} this Image widget;
 */
Image.prototype.setAltText = function(altText) {
	this.alt = altText;
	return this;
}

/**
 * Sets AuthorizationAction to Image;
 * @param {Action} action action to set;
 * @returns {Image} this Image widget; 
 */
Image.prototype.setAuthorizationAction = function(action) {
	this.authorizationAction = JSON.stringify(action);
	return this;	
}

/**
 * Sets ComposeAction to Image;
 * @param {Action} action action to set;
 * @param {composedEmailType} composedEmailType email type to compose;
 * @returns {Image} this Image widget;
 */
Image.prototype.setComposeAction = function(action, composedEmailType) {
	this.action = JSON.stringify(action);
	this.composedEmailType = composedEmailType;
	return this;	
}

/**
 * Sets image URL to display;
 * @param {String} url URL of the image;
 * @returns {Image} this Image widget;
 */
Image.prototype.setImageUrl = function(url) {
	this.src = url;
	return this;
}

/**
 * Sets Action to Image;
 * @param {Action} action action to set;
 * @returns {Image} this Image widget;
 */
Image.prototype.setOnClickAction = function(action) {
	this.action = JSON.stringify(action);
	return this;	
}

/**
 * Sets OpenLink Action with a callback to Image;
 * @param {Action} action action to set;
 * @returns {Image} this Image widget;
 */
Image.prototype.setOnClickOpenLinkAction = function(action) {
	this.action = JSON.stringify(action);
	return this;	
}

/**
 * Sets OpenLink Action to Image;
 * @param {OpenLink} openLink openLink action to set;
 * @returns {Image} this Image widget;
 */
Image.prototype.setOpenLink = function(openLink) {
	this.openLink = JSON.stringify(openLink);
	return this;	
}