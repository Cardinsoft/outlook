/**
 * Returns an array of type config objects;
 * @param {Object=} filter filter settings;
 * @returns {Array} array of types;
 */
function getTypes(filter) {
  
  //create class instance to get config data;
  var flow       = new Flow();
  var lacrm      = new LessAnnoyingCRM();
  var pipedrive  = new Pipedrive();  

  //set type names to function name;
  flow.name       = Flow.name;
  lacrm.name      = LessAnnoyingCRM.name;
  pipedrive.name  = Pipedrive.name;
  
  //create an array of used types;
  var types = [flow,lacrm,pipedrive];
  
  //add github conn if in testing mode;
  if(globalIncludeGitHub) {
    var github = new GitHub();
    types.push(github);
  }  
  
  //apply filter;
  if(filter) {
    return types.filter(function(type){
    
      var compliant = true;
    
      //apply authorization type filter;
      if(filter.authType&&type.auth.type!==filter.authType) { compliant = false; }
      
      //apply other filter options;
      for(var prop in filter) {
        if(filter[prop]&&type[prop]!==filter[prop]&&prop!=='authType') { compliant = false;  }
      }
      
      if(compliant) { return type; }
    
    });
  }
  
  return types;
}

/**
 * Returns Connectors configuration;
 * @param {Object=} filter filter settings;
 * @returns {Array} array of Connector config objects;
 */
function getConfig(filter) {
  
  var connectors = getProperty('config','user');
  if(connectors===null) { return []; }
  
  //apply filter;
  if(filter) {
    return connectors.filter(function(connector){
    
      var compliant = true;
    
      //apply authorization type filter;
      if(filter.authType&&connector.auth!==filter.authType) { compliant = false; }
      
      //apply other filter options;
      for(var prop in filter) {
        if(filter[prop]&&connector[prop]!==filter[prop]&&prop!=='authType') { compliant = false;  }
      }
      
      if(compliant) { return connector; }
    
    });
  }

  return connectors;
}