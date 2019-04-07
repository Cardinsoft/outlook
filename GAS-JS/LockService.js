//Emulate LockService service;
class LockService {
	constructor() {
		this.className = 'LockService';
	}
}
/**
 * Gets document Lock - FOR FUTURE RELEASE, NOT USED;
 * @returns {Lock}
 */
LockService.prototype.getDocumentLock = function () {
	const lock = '';
	
	//create an instance of Lock with ;
	const lock = new Lock(lock);
	return lock;
}
/**
 * Gets script Lock using ;
 * @returns {Lock}
 */
LockService.prototype.getScriptLock = function () {
	const lock = '';
	
	//create an instance of Lock with ;
	const lock = new Lock(lock);
	return lock;	
}
/**
 * Gets user Lock using ;
 * @returns {Lock}
 */
LockService.prototype.getUserLock = function () {
	const lock = '';
	
	//create an instance of Lock with ;
	const lock = new Lock(lock);
	return lock;
}


//Emulate Lock class for LockService service;
class Lock {
	constructor(lock) {
		this.lock = lock;
	}
}
Lock.prototype.hasLock = function () {}
Lock.prototype.releaseLock = function () {}
Lock.prototype.tryLock = function (timeoutInMillis) {}
Lock.prototype.waitLock = function (timeoutInMillis) {}