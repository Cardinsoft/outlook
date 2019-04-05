//sample GitHub connector class;
function GitHub() {
  Connector.call(this);
  this.icon   = index.globalGitHubIconUrl;
  this.name   = 'GitHub';
  this.short  = globalGitHubShort;
  this.url    = 'https://api.github.com/user';
  this.config = [];
  this.auth = {
    name: 'GitHub',
    urlAuth: 'https://github.com/login/oauth/authorize',
    urlToken: 'https://github.com/login/oauth/access_token',
    id: 'e6c7b5e9866ad262b1c8',
    secret: 'd53fe70345b269e96477a1559d844a29c0061251',
    scope: 'malformed',
    prompt: true
  };
  
  /**
   * method for performing fetch to external service;
   * @param {Object} msg message object;
   * @param {Object} connector connector config object;
   * @param {Object} data custom data object to pass to payload;
   * @return {Function}
   */
  this.run = function (msg,connector,data) { 
    //initiate authorization service;
    var parameters = this.auth;
        parameters.name = connector.name;
    
    
    var service = authService(parameters);
    
    //set method for url fetch ('get' or 'post' for now);
    var method = 'get';
  
    //set headers for url fetch;
    var headers = {
      'Authorization' : 'Bearer '+service.getAccessToken()
    };
  
    //set payload in case POST request will be triggered;
    var trimmed = trimMessage(msg,true,true);
    var labels = msg.getThread().getLabels().map(function(label){ return label.getName(); });
    var payload = {
      'Bcc': msg.getBcc(),
      'Cc': msg.getCc(),
      'date': msg.getDate(),
      'sender': trimmed.name,
      'from': trimmed.email,
      'id': msg.getId(),
      'subject': msg.getSubject(),
      'labels': labels
    };
    if(data) { payload.data = data; }
  
    //initiate request;
    var response = performFetch(connector.url,method,headers,payload);
    
    //initialize result without content;
    var parsed;
    
    //perform some parsing;
    if(!(response instanceof Array)) {
      //change content into array and parse all nested objects;
      parsed = new Array(parseData(response.content));
    }
    //add custom key-value pair;
    parsed[0].custom = 'CUSTOM ADDITION';
    //filter out empty strings, undefined and nulls from array elements;
    parsed.forEach(function(elem){
      for(var key in elem) {
        var value = elem[key];
        if(value===''||value===undefined||value===null) { delete elem[key]; }
      }
    });
    
    //button colour test;
    parsed = [
      {
        header:'Button test',
        widgets:[
          {
            type:'TextButton',
            title:'Coloured button',
            colour:'#DE009B',
            action:'click',
            content:'actionManual',
            disabled:false
          }
        ]
      }
    ];
    
    //build return object;
    var returned = {
      code     : response.code,
      headers  : response.headers,
      content  : parsed,
      hasMatch : {
        value  : true,
        text   : 'found',
        colour : '#DE009B'
      }
    };
    
    return returned;
  }
}
//chain custom connector to base class;
GitHub.prototype = Object.create(Connector.prototype);
