//Flow connector class;
function Flow() {
  Connector.call(this);
  this.icon     = globalIconWebhook;
  this.typeName = 'Webhook';
  this.short    = globalWebhookShort;
  this.config = [
    {
      'header': 'Webhook config',
      'isCollapsible': false,
      'widgets': [
        {
          'name': globalURLfieldName,
          'type': 'TextInput',
          'title': 'Webhook URL',
          'content': '',
          'hint': 'e.g. Http get or post URL'
        }
      ]
    }  
  ];
  this.auth = {};
  this.run = async function (msg,connector,data) {
    //set method for url fetch ('get' or 'post' for now);
    var method = 'post';

    //set headers for url fetch;
    var headers = {};
	
	connector.method = 'send';
    
    //set payload in case POST request will be triggered;
    var trimmed = trimMessage(msg,true,true);

    var payload = {
      'Bcc': msg.getBcc(),
      'Cc': msg.getCc(),
      'date': msg.getDate(),
      'sender': trimmed.name,
      'from': trimmed.email,
      'id': msg.getId(),
      'subject': msg.getSubject()
    };
    if(data) { payload.data = data; }
    
    //perform data fetch and return result;
    var result = await performFetch(connector.url,method,headers,payload);
    return result;
  }
}
//chain custom connector to base class;
Flow.prototype = Object.create(Connector.prototype);