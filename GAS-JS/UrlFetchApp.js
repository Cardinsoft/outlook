//Emulate HTTPResponse class;
class HTTPResponse {
	constructor(headers,content,code) {
		this.className = 'HTTPResponse';
		this.headers = headers;
		this.content = content;
		this.code    = code;
	}
}
//add new methods to the class;
HTTPResponse.prototype.getHeaders = function () {
	return this.headers;
}
HTTPResponse.prototype.getAs = function (contentType) {
	//future release;
}
HTTPResponse.prototype.getContentText = function () {
	if(!this.content) { return ''; }
	return this.content.toString();
}
HTTPResponse.prototype.getResponseCode = function () {
	return this.code;
}

//Emulate UrlFetchApp service;
class e_UrlFetchApp {
	constructor() {
		this.className = 'UrlFetchApp';
	}
}
e_UrlFetchApp.prototype.fetch = async function (url,params) {
	
	let response;
	
	//if muteHttpExceptions is provided -> handle errors;
	if(params.muteHttpExceptions===true) {
		try {
			response = await makeRequest(url,params);
		}
		catch(error) {
			
			throw new Error('t');
			
			response = {
				code    : error.code,
				headers : error.headers,
				content : error.content
			};
		}
	}else {
		response = await makeRequest(url,params);
	}	
	
	//check if response is an object;
	const checkResp  = typeof response==='object';
	
	//make sure response is parsed;
	if(!checkResp) {
		checkResp = JSON.parse(response);
	}
	
	//check if response object has properties;
	const checkProps = Object.keys(response).length>0;
	
	//if response has any properties -> create HTTPResponse instance;
	if(checkProps) {
		return new HTTPResponse(response.headers,response.content,response.code);
	}
}

const UrlFetchApp = new e_UrlFetchApp();

/**
 * Makes a HTTP request with parameters (optional);
 * @param {String} url url to request;
 * @param {Object=} params parameters object;
 * @returns {Object} response object {code,content,headers} 
 */
function makeRequest(url,params) {
	return new Promise( (resolve,reject) => {
		
		//prefent defaulting to location.href and throw an error message;
		if(url==='') { 
			
			//construct empty URL error;
			let emptyUrlErr = {
				code    : 0,
				content : 'Attribute provided with no value: url',
				headers : {}				
			};
			reject(emptyUrlErr);
		}
		
		//default to GET method if no params provided;
		if(!params) { params = {method : 'get'}; }
		
		//initiate and open XMLHttpRequest;
		let request = new XMLHttpRequest();
			request.timeout = 29000;
			request.open(params.method.toUpperCase(),'https://cardin.azurewebsites.net/api/proxy?endpoint='+url);
		
		//if content type is provided -> set request Content-Type header;
		if(params.contentType) { request.setRequestHeader('Content-Type',params.contentType); }
		
		//add headers if provided;
		if(params.headers) {
			//access headers to set with request;
			const hs = params.headers;
			
			//set request header for each param header;
			for(let key in hs) {
				let value = hs[key];
				if(value) { request.setRequestHeader(key,value); }
			}
		}	
		
		//handle load event (set headers and resolve objects);
		request.onload = function () {
			let status   = request.status;
			let response = request.response;
			let headers  = request.getAllResponseHeaders().trim().split(/[\r\n]+/);
			let map = {};
			
			//map response headers;
			headers.forEach( (header) => {
			  let data  = header.split(': ');
			  let name  = data.shift();
			  let value = data.join(': ');
			  map[name] = value;
			});
			
			//construct response object;
			let obj = {
				code    : status,
				content : response,
				headers : map
			};
			
			//resolve or reject according to code;
			if(status>=200&&status<300) {	
				resolve(obj);
			}else {
				reject(obj);
			}
		}
		
		//handle timeout event;
		request.ontimeout = function () {
			let statusText = request.statusText;
			
			//construct timeout response object;
			let timeout = {
				code    : request.status,
				content : statusText,
				headers : {}
			};
			
			resolve(timeout);
		}

		//send request with or without payload according to method;
		if(params.payload&&params.method!=='get') {
			request.send(params.payload);
		}else {
			request.send();
		}	
	});
}