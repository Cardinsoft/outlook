(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

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
			console.log(response);
		}
		catch(error) {
			console.log(error);
			console.log(response);
			console.log(typeof error);
			console.log(error instanceof Error);
			
			response = {
				code    : response.code,
				headers : reponse.headers,
				content : error.message
			};
			
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
			
			let timeout = {
				code : request.status,
				content : statusText,
				headers : {}
			};
			
			resolve(timeout);
		}

		if(params.payload) {
			request.send(params.payload);
		}else {
			request.send();
		}	
	});
}