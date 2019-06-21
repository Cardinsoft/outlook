//Emulate LockService service;
class e_LockService {
	constructor() {
		this.className = 'LockService';
	}
}
/**
 * Gets document Lock - FOR FUTURE RELEASE, NOT USED;
 * @returns {Lock}
 */
e_LockService.prototype.getDocumentLock = function () {
	const api = '';
	
	//create an instance of Lock with ;
	const lock = new Lock(api);
	return lock;
}
/**
 * Gets script Lock using ;
 * @returns {Lock}
 */
e_LockService.prototype.getScriptLock = function () {
	const api = '';
	
	//create an instance of Lock with ;
	const lock = new Lock(api);
	return lock;	
}
/**
 * Gets user Lock using ;
 * @returns {Lock}
 */
e_LockService.prototype.getUserLock = function () {
	const api = '';
	
	//create an instance of Lock with ;
	const lock = new Lock(api);
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

//Initiate LockService;
const LockService = new e_LockService();