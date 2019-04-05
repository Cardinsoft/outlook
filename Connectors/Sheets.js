//sample Sheets connector class;
function Sheets() {
  Connector.call(this);
  this.icon  = globalSheetsIconUrl;
  this.name  = 'Sheets';
  this.short = globalSheetsShort;
  this.config = [
    {
      'header': 'Additional config',
      'isCollapsible': false,
      'widgets': [
        {
          'name': globalURLfieldName,
          'type': 'TextInput',
          'title': 'Spreadsheet URL',
          'content': '',
          'hint': 'https://docs.google.com/spreadsheets/d/{id}/edit'
        },
        {
          'name': 'numcol',
          'type': 'TextInput',
          'title': 'Number of columns',
          'content': '',
          'hint': 'Max number of columns to lookup'
        },
        {
          'name': 'numrow',
          'type': 'TextInput',
          'title': 'Number of rows',
          'content': '',
          'hint': 'Max number of rows to lookup'
        }
      ]
    }
  ];
  this.auth = {};
  this.run = function (msg,connector,data) { 
    //unpack connector settings;
    var maxcol = +connector.numcol;
    var maxrow = +connector.numrow;
    
    //set initial result object properties;
    var result = {code:200,headers:{},content:[]};
    
    //perform trimming and assign values to variables;
    var trimmed = trimMessage(msg,true,true);  
    var name  = trimmed.name;
    var email = trimmed.email;
    
    //get spreadsheet and start fetching data;
    var spread = getSpreadsheet(connector.url,false);
    if(spread===null) { 
      result.code = 404;
      result.content = 'The spreadsheet with url < '+connector.url+' > could not be found or you do not have access to it';
      return result; 
    }else if(spread===404) {
      //access content;
      var content = result.content;
      
      //create denied auth section;
      var section = {
        header: '',
        isCollapsible: false,
        widgets: []
      };
      
      //access widgets;
      var widgets = section.widgets;
      
      //create prompt widget;
      var prompt = {
        title: 'Spreadsheet missing',
        type: 'KeyValue',
        content: 'Seems like the spreadsheet you are trying to access is missing or you do not have access to it'
      };
      widgets.push(prompt);
      
      //create tip widget;
      var tip = {
        type: 'KeyValue',
        content: 'You can try requesting access from the spreadsheet owner (if using multiple accounts, note that one of them might have access and you will be redericted to the spreadsheet instead)'
      };
      widgets.push(tip);
      
      
      //create request auth widget;
      var auth = {
        type      : 'TextButton',
        title     : 'Request access',
        content   : connector.url,
        action    : 'link',
        disabled  : false,
        filled    : false,
        fullsized : false,
        reload    : true
      };
      widgets.push(auth);
      
      //append section to result content;
      content.push(section);
    }
    
    try {//temp for dev

      if(spread!==null&&spread!==404) {
        var sheets = spread.getSheets();
        var numsh  = sheets.length;
  
        //loop through each sheet and perform fetching;
        for(var i=0; i<numsh; i++) {
          //check if sheet has email data in it;
          var cursh        = sheets[i];
          var shname       = cursh.getName();
          var hasEmailData = hasEmail(cursh);
          if(hasEmailData) {
            
            //get data dimentions and range;
            var numrow = cursh.getLastRow();
            var numcol = cursh.getLastColumn();
            if(maxcol!==0) { numcol = maxcol; }
            if(maxrow!==0) { numrow = maxrow+1; }
  
            var dataRange = cursh.getRange(1,1,numrow,numcol);
            
            //get values and data validations;
            var dataValues   = dataRange.getValues();
            var dataValids   = dataRange.getDataValidations();
            var dataFormats  = dataRange.getNumberFormats();
            var dataDisplays = dataRange.getDisplayValues(); 
            
            //get headers;
            var dataHeaders = dataValues[0];
            
            //loop through each values row;
            for(var j=1; j<dataValues.length; j++) {
              
              //get values, validations, formats and display values for current row; 
              var values   = dataValues[j];
              var valids   = dataValids[j];
              var formats  = dataFormats[j];
              var displays = dataDisplays[j]; 
              
              //check if values row has match to an email;
              var hasMatch = values.some(function(value) { return value===email; });
              if(hasMatch) {
                
                //create section for each email match;
                var section = {
                  header: '"'+shname+'", matched on row '+j,
                  isCollapsible: true,
                  numUncollapsible: globalNumUncollapsible,
                  widgets: []
                };             
                
                //create widgets for each field;
                values.forEach(function(value,index){
                  
                  //get validations, formats and display values for current value;
                  var valid   = valids[index];
                  var format  = formats[index];
                  var display = displays[index];
                  
                  //create widget to display data;
                  var widget = {
                    type: 'KeyValue',
                    title: dataHeaders[index],
                    content: display
                  };
                  
                  section.widgets.push(widget);
                });
                
                result.content.push(section);
              }
            }
            
            
          }else { continue; }
          
        }
        
      }
    
    }
    catch(er) {}
    
    //access content and check if no recods matched;
    var content = result.content;
    if(result.content.length===0) { 
      
      //create no contacts section;
      var section = {
        header        : 'No matches',
        isCollapsible : false,
        widgets       : []
      };
      
      //access widgets;
      var widgets = section.widgets;
      
      //create no record prompt;
      var prompt = {
        title   : '',
        type    : 'KeyValue',
        content : 'Seems like none of your records in the spreadsheet match!\rWould you like to create one?'
      };
      widgets.push(prompt);
      
      //create add record button;
      var button = {
        type  : 'TextButton',
        title : 'Add',
        content: connector.url,
        action: 'link',
        disabled: false,
        filled: false,
        fullsized: false,
        reload: true        
      };
      widgets.push(button);
      
      content.push(section);
    }
    
    //log result and return it;
    console.log(result);
    return result;
  }
}
//chain custom connector to base class;
Sheets.prototype = Object.create(Connector.prototype);