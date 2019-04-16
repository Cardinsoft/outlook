//===========================================START URL FETCH===========================================//
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
			console.log(error);
			
			if(!error instanceof Error) {
				response = error;
			}else {
				response = {
					code    : 400,
					headers : {},
					content : error.message
				};
			}
			
		}
	}else {
		response = await makeRequest(url,params);
	}	
	
	//check if response is an object and if it has properties;
	const checkResp  = typeof response==='object';
	const checkProps = Object.keys(response).length>0;
	
	//make sure response is parsed correctly and return HTTPResponse instance;
	if(checkResp) {
		if(checkProps) {
			return new HTTPResponse(response.headers,response.content,response.code);
		}
	}
}

const UrlFetchApp = new e_UrlFetchApp();

/**
 * Makes a HTTP request with parameters (optional);
 * @param {String} url url to request;
 * @param {Object=} params parameters object;
 * @returns {Promise}
 */
function makeRequest(url,params) {
	return new Promise(function (resolve,reject) {
		
		//prefent defaulting to location.href and throw an error message;
		if(url==='') { throw new Error('Attribute provided with no value: url'); }
		
		//default to GET method if no params provided;
		if(!params) { params = {method : 'get'}; }
		
		//initiate and open XMLHttpRequest;
		let request = new XMLHttpRequest();
			request.timeout = 29000;
			request.open(params.method.toUpperCase(),url);
		
		//if content type is provided -> set request Content-Type header;
		if(params.contentType) { request.setRequestHeader('Content-Type',params.contentType); }
		
		//add headers if provided;
		if(params.headers) {
			//access headers to set with request;
			const hs = params.headers;
			
			//set request header for each param header;
			for(var key in hs) {
				let value = hs[key];
				if(value) { request.setRequestHeader(key,value); }
			}
		}	
		
		//handle load event (set headers and resolve objects);
		request.onload = function () {
			let status     = request.status;
			let response   = request.response;
			let headers    = request.getAllResponseHeaders().trim().split(/[\r\n]+/);
			let map = {};
			headers.forEach(function (header) {
			  let data = header.split(': ');
			  let name = data.shift();
			  let value = data.join(': ');
			  map[name] = value;
			});
			let obj = {
				code: status,
				content: response,
				headers: map
			};
			
			if(status>=200&&status<300) {	
				resolve(obj);
			}else {
				reject(obj);
			}
		}
		
		//handle timeout event;
		request.ontimeout = function () {
			let statusText = request.statusText; 
			resolve(statusText);
		}
		
		console.log(request);
		
		if(params.payload) {
			request.send(params.payload);
		}else {
			request.send();
		}	
	});
}