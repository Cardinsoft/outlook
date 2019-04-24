function LessAnnoyingCRM() {
  Connector.call(this);
  this.icon   = globalLACRMiconUrl; 
  this.name   = 'LessAnnoyingCRM';
  this.short  = globalLACRMshort;
  this.url    = 'https://api.lessannoyingcrm.com';
  this.config = [
    {
      widgets : [
        {
          type    : 'KeyValue',
          title   : 'Action',
          content : 'You can choose between different actions for the Connector to perform (actions can be switched anytime in settings):'          
        },
        {
          name    : 'action',
          type    : globalEnumRadio,
          content : [
            {text:'Pipeline reporting', value:'pipeline', selected:false},
            {text:'Searching contacts', value:'search',   selected:true}
          ]
        },
        {
          type    : 'KeyValue',
          title   : 'Pipeline list',
          content : 'If you chose pipeline reporting, please, set at least one PipelineId (multiple ids should be separated by line breaks) obtained from <a href="https://www.lessannoyingcrm.com/app/Settings/Api">CRM settings</a>'
        },
        {
          name      : 'pipelineIds',
          type      : 'TextInput',
          title     : 'Pipeline Id',
          content   : '',
          hint      : 'e.g. 3587196306',
          multiline : true
        }
      ]
    }
  ];
  this.auth = {
    type : 'APItoken',
    config : {
      header : 'Authorization config',
      isCollapsible : true,
      numUncollapsible : 1,
      widgets : [
        {
          type    : 'KeyValue',
          title   : 'API token auth',
          content : 'This Connector uses API token-based authorization - please, fill the form below with your UserCode and API token obtained from <a href="https://www.lessannoyingcrm.com/app/Settings/Api">CRM settings</a>'
        },
        {
          name    : 'usercode',
          type    : 'TextInput',
          title   : 'User code',
          content : '',
          hint    : 'e.g. ABCDE'
        },
        {
          name    : 'apitoken',
          type    : 'TextInput',
          title   : 'API token',
          content : '',
          hint    : 'e.g. CWX3HYV1GT6YQFY9YRMQ3G0VD6Q'
        }
      ]
    }
  };
  this.edit = function(msg,connector,forms,data) {
  
    //access API parameters and connector type;
    var usercode   = connector.usercode;
    var apitoken   = connector.apitoken;
    var endpoint   = connector.url+'?';
    var actionType = connector.action;
    var funcName   = 'EditContact';

    var updates = [];
   
    for(var key in forms) {
      
      var value, property;
      
      //access property params;
      var params = key.split('&');
      var prop = params[0].split('-')[0]; //Phone;
      var idx  = params[0].split('-')[1]; //Index;
      var sub  = params.filter(function(p,i,a){ if(i>0&&i<a.length-1) {return p;} })[0]; //Text;
      var id   = params[params.length-1]; //contact id;

      //distribute properties to an array of contacts/companies to update;
      var addToUpd = updates.every(function(upd){ return upd.ContactId!==id; });
      if(addToUpd) { updates.push({ContactId:id}); }
      
      //set value to array or element;
      var vals = forms[key];
      if(vals.length===1) { vals = vals[0]; }      
      
      if(idx&&prop!=='CustomFields') {
        
        if(!property) { property = {}; }
        
        if(!value) { value = []; }
    
        //if prop by index does not exist -> add;
        if(!value[idx]) { value[idx] = {}; }
        
        //set properties;
        value[idx][sub] = vals;
        property[prop]  = value;

        //set property to updates;
        updates.forEach(function(update){
          if(update.ContactId===id) {
            for(var p in property) {
              update[p] = property[p];
            }
          }
        });
        
      }else {
        
        updates.forEach(function(update){
          if(update.ContactId===id) {
              if(!sub) {
                update[prop] = vals;
              }else {
                if(!update[prop]) { update[prop] = {}; }
                update[prop][sub] = vals;
              }
          }
        });
        
      }

    }
    
    Logger.log(updates);
   
    //send update if there is anything to update;
    if(updates.length>0) {
      updates.forEach(function(update){
        var query    = ['UserCode='+usercode,'APIToken='+apitoken,'Function='+funcName,'Parameters='+encodeURIComponent(JSON.stringify(update))].join('&'); 
        var response = performFetch(endpoint+query,'post',{});
      });
    }

    return this.run(msg,connector,data);
  }
  
  this.run = function (msg,connector,data) {
   
    //access API parameters and connector type;
    var usercode   = connector.usercode;
    var apitoken   = connector.apitoken;
    var endpoint   = connector.url+'?';
    var actionType = connector.action;
    
    //initiate function name according to action type;
    var funcName = '';
    if(actionType==='search') { funcName += 'SearchContacts'; }else if(actionType==='pipeline') { funcName += 'GetPipelineReport'; }
  
    //set method for url fetch ('get' or 'post' for now);
    var method = 'get';

    //set headers for url fetch;
    var headers = {};
    
    //initiate query and parameters;
    var query = ['UserCode='+usercode,'APIToken='+apitoken,'Function='+funcName];
    var params, result, code, success, sections = [];
    
    if(actionType!=='pipeline') {
    
      //unpack message object with to trimmed data;
      var trimmed = trimMessage(msg,true,true);
      
      //initiate request parameters;
      params = {
        SearchTerms : trimmed.email,
        Sort        : 'Relevance'
      };
      
      //set query with parameters and authorization provided;
      query.push('Parameters='+encodeURI(JSON.stringify(params)));
      query = query.join('&');
      
      //perform data fetch and return result;
      result  = performFetch(endpoint+query,method,headers);
      code    = result.code;
      var content = JSON.parse(result.content);
      success = content.Success;
      
      //on failure -> process errored response;
      if(!success) {
        return {code:code,headers:headers,content:content.Error};
      }
    
    }else {
      
      //access id list, if not set -> return error message;
      var pipelineIds = connector.pipelineIds;
      if(pipelineIds) { 
        pipelineIds = pipelineIds.split('\n'); 
        Logger.log(pipelineIds)
      }else {
        var pipeError = {descr : 'Pipeline Id list was not provided.\rPlease, set at least one Id or a comma-separated list of Ids. Pipelines info can be obtained from <a href="https://www.lessannoyingcrm.com/app/Settings/Api">CRM settings</a>'};
        return { code:0,headers:{},content:pipeError }
      }
      
      //initiate result;
      result         = {};
      code           = 200;
      result.headers = {};
      success        = [];
      var errDetails = '';
      
      pipelineIds.forEach(function(pId,index){
        params = {PipelineId : pId};        
        query.push('Parameters='+encodeURI(JSON.stringify(params)));
        var fullquery = query.join('&');
        
        //perform data fetch and process, then reset query;
        var pipelineResponse = performFetch(endpoint+fullquery,method,headers);
        var pipelineCode     = pipelineResponse.code;
        var pipelineHeaders  = pipelineResponse.headers;
        var pipelineContent  = JSON.parse(pipelineResponse.content);
        var pipelineSuccess  = pipelineContent.Success;
        query.pop();

        //push success value and error data on fail, else -> process;
        success.push(pipelineSuccess);
        if(!pipelineSuccess) { 
          errDetails += (index+1)+'. '+pipelineContent.Error+'\r'; 
        }else {
          //access content and create section;
          var pipeline = pipelineContent.Result;
          var pipelineSection = {
            header        : 'Pipeline '+(index+1),
            isCollapsible : false,
            widgets       : []
          };
          var pipelineWidgets = pipelineSection.widgets;
          
          pipeline.forEach(function(contact){
            
            //access contact properties;
            var fullName   = [];
            var status     = contact.StatusName;
            var title      = contact.Title;
            var company    = contact.EmployerName;
            var salutation = contact.Salutation;
            var first      = contact.FirstName;
            var middle     = contact.MiddleName;
            var last       = contact.LastName;
            var suffix     = contact.Suffix;
            var emails     = contact.Email;
            var phones     = contact.Phone;
            var lastNote   = contact.LastNote;
            
            //create fullName;
            if(salutation&&salutation!==null) { fullName.push(salutation); }
            if(first&&first!==null)           { fullName.push(first); }
            if(middle&&middle!==null)         { fullName.push(middle); }
            if(last&&last!==null)             { fullName.push(last); }
            if(suffix&&suffix!==null)         { fullName.push(suffix); }
            fullName = fullName.join(' ');            

            //create contact name + status widget;
            var nameWidget = {
              icon       : 'PERSON',
              type       : 'KeyValue',
              title      : 'Contact',
              content    : fullName,
              buttonText : status
            };
            pipelineWidgets.push(nameWidget);
            
            //if company -> add company widget;
            if(company) {
              var compContent;
              if(!title) { compContent = company; }else { compContent = title+' at '+company; }
              var companyWidget = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/04/BUSINESS.png',
                type    : 'KeyValue',
                title   : 'Employment',
                content : compContent
              };
              pipelineWidgets.push(companyWidget);
            }
            
            //create email widgets;
            emails.forEach(function(email,index){
              var contactEmail = {
                icon    : 'EMAIL',
                type    : 'KeyValue',
                title   : email.Type+' email',
                content : '<a href="mailto:'+email.Text+'">'+email.Text+'</a>'
              };            
              pipelineWidgets.push(contactEmail);
            });            

            //create phone widgets;
            phones.forEach(function(phone,index){
              var contactPhone = {
                icon    : 'PHONE',
                type    : 'KeyValue',
                title   : phone.Type+' phone',
                content : '<a href="tel:'+phone.Text+'">'+phone.Text+'</a>'
              };
              pipelineWidgets.push(contactPhone);
            });
            
            if(lastNote) {
              var contactNote = {
                icon    : 'DESCRIPTION',
                type    : 'KeyValue',
                //title   : 'Last note',
                content : lastNote
              };
              pipelineWidgets.push(contactNote);
            }

            //create separator widget;
            var separator = {type: 'KeyValue',content: '\r'};
            pipelineWidgets.push(separator);
          });
          
    
          
          sections.push(pipelineSection);
        }
        
        
      });
      
      Logger.log(sections);
      
      //if no call succeeded -> return errors info and user notification;
      if(!success.some(function(elem){ return elem; })) {
        return { code:0,headers:{},content:{descr:'Every call to LessAnnoyingCRM resulted in error, please, see details below for more information',additional:errDetails} }
      }
    }
  
    //perform search result analysis;
    if(actionType==='search') {
      var info = content.Result;

      //create result config;
      if(info.length>0) {
        info.forEach(function(entry){
          var isCompany = +entry.IsCompany;
          
          if(isCompany===0) {
            //create contact section and access widgets;
            var contSection = {
              header           : 'Contact info',
              isCollapsible    : true,
              widgets          : []
            };
            var contWidgets = contSection.widgets;
          
            //access contact properties;
            var fullName    = [];
            var salutation  = entry.Salutation;
            var first       = entry.FirstName;
            var middle      = entry.MiddleName;
            var last        = entry.LastName;
            var suffix      = entry.Suffix;
            var emails      = entry.Email;
            var phones      = entry.Phone;
            var addresses   = entry.Address;
            var websites    = entry.Website;
            var background  = entry.BackgroundInfo;
            var contactId   = entry.ContactId;
            var companyId   = entry.CompanyId;
            var companyName = entry.CompanyName;
            var createdCont = entry.CreationDate;
            var editedCont  = entry.EditedDate;
            var birthday    = entry.Birthday;
            var title       = entry.Title;
            var custom      = entry.CustomFields;
            Logger.log(entry)
            
            //create fullname widget;
            if(salutation&&salutation!==null) { fullName.push(salutation); }
            if(first&&first!==null)           { fullName.push(first); }
            if(middle&&middle!==null)         { fullName.push(middle); }
            if(last&&last!==null)             { fullName.push(last); }
            if(suffix&&suffix!==null)         { fullName.push(suffix); }
            fullName = fullName.join(' ');
            
            //create contact name widget;
            var contactName = {
              icon    : 'PERSON',
              type    : 'KeyValue',
              title   : 'Full Name',
              state   : 'editable',
              editMap : [
                {title : 'Salutation',  content : salutation, name : 'Salutation&'+contactId },
                {title : 'First name',  content : first,      name : 'FirstName&'+contactId },
                {title : 'Middle name', content : middle,     name : 'MiddleName&'+contactId },
                {title : 'Last name',   content : last,       name : 'LastName&'+contactId },
                {title : 'Suffix',      content : suffix,     name : 'Suffix&'+contactId }
              ],
              content : fullName
            };
            contWidgets.push(contactName);
            
            
            //create title widget;
            if(companyName&&companyName!==null) {
              var compContent;
              if(!title) { compContent = companyName; }else { compContent = title+' at '+companyName; }
              var contactTitle = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/04/WORK_BLACK.png',
                type    : 'KeyValue',
                state   : 'editable',
                editMap : [
                  {title : 'Employment', content : title, name : 'Title&'+contactId}
                ],
                title   : 'Employment',
                content : compContent
              };
              contWidgets.push(contactTitle);
            }
           
           
            //create email widgets;
            emails.forEach(function(email,index){
              var contactEmail = {
                icon    : 'EMAIL',
                type    : 'KeyValue',
                state   : 'editable',
                editMap : [
                  {
                    title: 'Text', 
                    content: email.Text, 
                    name: 'Email-'+index+'&Text&'+contactId
                  },{
                    title: 'Type', 
                    content: [
                      {text:'Work',     value:'Work',     selected:false},
                      {text:'Personal', value:'Personal', selected:false},
                      {text:'Other',    value:'Other',    selected:false}
                    ], 
                    name: 'Email-'+index+'&Type&'+contactId, 
                    type: globalEnumDropdown                    
                  }                
                ],
                title   : email.Type+' email',
                content : '<a href="mailto:'+email.Text+'">'+email.Text+'</a>'
              };
              contactEmail.editMap[1].content.forEach(function(option){
                if(option.value===email.Type) { option.selected = true; }
              });              
              contWidgets.push(contactEmail);
            });
            
            //create phone widgets;
            phones.forEach(function(phone,index){
              var contactPhone = {
                icon    : 'PHONE',
                type    : 'KeyValue',
                state   : 'editable',
                editMap : [
                  {
                    title: 'Text', 
                    content: phone.Text, 
                    name: 'Phone-'+index+'&Text&'+contactId
                  },
                  {
                    title: 'Type', 
                    content: [
                      {text:'Work',   value:'Work',   selected:false},
                      {text:'Mobile', value:'Mobile', selected:false},
                      {text:'Home',   value:'Home',   selected:false},
                      {text:'Fax',    value:'Fax',    selected:false},
                      {text:'Other',  value:'Other',  selected:false}
                    ], 
                    name: 'Phone-'+index+'&Type&'+contactId,
                    type: globalEnumDropdown
                  }
                ],
                title   : phone.Type+' phone',
                content : '<a href="tel:'+phone.Text+'">'+phone.Text+'</a>'
              };
              contactPhone.editMap[1].content.forEach(function(option){
                if(option.value===phone.Type) { option.selected = true; }
              });
              contWidgets.push(contactPhone);
            });
            
            //create website widgets;
            websites.forEach(function(website,index){
              var contactWebsite = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/04/web.png',
                type    : 'KeyValue',
                state   : 'editable',
                name    : 'Website-'+index+'&Text&'+contactId,
                title   : 'Website '+(index+1),
                content : website.Text
              };
              contWidgets.push(contactWebsite);
            });
            
            //create address widgets;
            addresses.forEach(function(address,index){
              var fullAddress = [];
              var street  = address.Street;
              var city    = address.City;
              var state   = address.State;
              var country = address.Country;
              var zip     = address.Zip;
              if(street)  { fullAddress.push(street); }
              if(city)    { fullAddress.push(city); }
              if(state)   { fullAddress.push(state); }
              if(country) { fullAddress.push(country); }
              if(zip)     { fullAddress.push(zip); }
              fullAddress = fullAddress.join(', ');
            
              var contactAddress = {
                icon    : 'MAP_PIN',
                type    : 'KeyValue',
                state   : 'editable',
                editMap : [
                  {title: 'Street',  content: street,  name: 'Address-'+index+'&Street&'+contactId},
                  {title: 'City',    content: city,    name: 'Address-'+index+'&City&'+contactId},
                  {title: 'State',   content: state,   name: 'Address-'+index+'&State&'+contactId},
                  {title: 'Country', content: country, name: 'Address-'+index+'&Country&'+contactId},
                  {title: 'Zip',     content: zip,     name: 'Address-'+index+'&Zip&'+contactId},
                  {
                    title: 'Type', 
                    content: [
                      {text:'Work',     value:'Work',     selected:false},
                      {text:'Billing',  value:'Billing',  selected:false},
                      {text:'Shipping', value:'Shipping', selected:false},
                      {text:'Home',     value:'Home',     selected:false},
                      {text:'Other',    value:'Other',    selected:false}
                    ], 
                    name: 'Address-'+index+'&Type&'+contactId, 
                    type: globalEnumDropdown
                  }
                ],
                title   : address.Type+' address',
                content : fullAddress
              };
              contactAddress.editMap[5].content.forEach(function(option){
                if(option.value===address.Type) { option.selected = true; }
              });
              contWidgets.push(contactAddress);
            });

            //create separator, creation and edit widgets;
            var separator = {type: 'KeyValue',content: '\r'};
            contWidgets.push(separator);
            
            //create widget for creation date;
            var created = createdCont.split(' ');
            var createdDate = new Date(created[0]);
            var createdTime = created[1].split(':');
                createdDate.setHours(createdTime[0]);
                createdDate.setMinutes(createdTime[1]);
                createdDate.setSeconds(createdTime[2]);
                      
            var contactCreated = {
              icon    : 'CLOCK',
              type    : 'KeyValue',
              title   : 'Created',
              content : createdDate.toLocaleDateString()+'\r'+createdDate.toLocaleTimeString()
            };
            contWidgets.push(contactCreated);
                  
            //create widget for edit date;
            if(editedCont) {
              var edited = editedCont.split(' ');
              var editedDate = new Date(edited[0]);
              var editedTime = edited[1].split(':');
                  editedDate.setHours(editedTime[0]);
                  editedDate.setMinutes(editedTime[1]);
                  editedDate.setSeconds(editedTime[2]);
                    
              var contactEdited = {
                icon    : 'CLOCK',
                type    : 'KeyValue',
                title   : 'Edited',
                content : editedDate.toLocaleDateString()+'\r'+editedDate.toLocaleTimeString()
              };
              contWidgets.push(contactEdited);
            }
            
            //set uncollapsible widgets;
            var num = contWidgets.length;
            if(contactEdited) { num -= 3; }else { num -= 2; }
            if(num<=0) { num = 1; }
            contSection.numUncollapsible = num;

            sections.push(contSection);
            
            if(companyId) {
              //perform company query by company Id;
              var getCompanyQuery = ['UserCode='+usercode,'APIToken='+apitoken,'Function=GetContact','Parameters='+encodeURI(JSON.stringify({ContactId:companyId}))].join('&');
              var companyResponse = performFetch(endpoint+getCompanyQuery,'get',{});
              
              //on successful fetch -> create company section;
              if(companyResponse.code>=200&&companyResponse.code<300) {
                var companyContent = JSON.parse(companyResponse.content);

                if(companyContent.Success) {
                  //access company property;
                  var company    = companyContent.Contact;
                  var cName      = company.CompanyName;
                  var cEmpl      = company.NumEmployees;
                  var cIndustry  = company.Industry;
                  var cEmails    = company.Email;
                  var cPhones    = company.Phone;
                  var cWebsites  = company.Website;
                  var cAddresses = company.Address;
                  var cCreated   = company.CreationDate;
                  var cEdited    = company.EditedDate;
                  
                  //create company section and access widgets;
                  var cSection = {
                    header           : 'Company info',
                    isCollapsible    : true,
                    widgets          : []
                  };
                  var cWidgets = cSection.widgets;
                  
                  //create company name widget;
                  var companyName = {
                    icon       : 'https://cardinsoft.com/wp-content/uploads/2019/04/BUSINESS.png',
                    type       : 'KeyValue',
                    state      : 'editable',
                    name       : 'CompanyName&'+companyId,
                    title      : 'Name',
                    content    : cName
                  };
                  cWidgets.push(companyName);
                  
                  if(cIndustry) {
                    //create company industry widget;
                    var companyInd = {
                      icon    : 'https://cardinsoft.com/wp-content/uploads/2019/04/CITY.png',
                      type    : 'KeyValue',
                      state   : 'editable',
                      name    : 'Industry&'+companyId,
                      title   : 'Industry',
                      content : cIndustry
                    };
                    cWidgets.push(companyInd);
                  }

                  //create email widgets;
                  if(cEmails) {
                    cEmails.forEach(function(email,index){
                      var companyEmail = {
                        icon    : 'EMAIL',
                        type    : 'KeyValue',
                        state   : 'editable',
                        editMap : [
                          {
                            title: 'Text', 
                            content: email.Text, 
                            name: 'Email-'+index+'&Text&'+companyId
                          },{
                            title: 'Type', 
                            content: [
                              {text:'Work',     value:'Work',     selected:false},
                              {text:'Personal', value:'Personal', selected:false},
                              {text:'Other',    value:'Other',    selected:false}
                            ], 
                            name: 'Email-'+index+'&Type&'+companyId, 
                            type: globalEnumDropdown                    
                          }                
                        ],
                        title   : email.Type+' email',
                        content : '<a href="mailto:'+email.Text+'">'+email.Text+'</a>'
                      };
                      companyEmail.editMap[1].content.forEach(function(option){
                        if(option.value===email.Type) { option.selected = true; }
                      });
                      cWidgets.push(companyEmail);
                    });
                  }
            
                  //create phone widgets;
                  if(cPhones) {
                    cPhones.forEach(function(phone,index){
                      var companyPhone = {
                        icon    : 'PHONE',
                        type    : 'KeyValue',
                        state   : 'editable',
                        editMap : [
                          {
                            title: 'Text', 
                            content: phone.Text, 
                            name: 'Phone-'+index+'&Text&'+companyId
                          },
                          {
                            title: 'Type', 
                            content: [
                              {text:'Work',   value:'Work',   selected:false},
                              {text:'Mobile', value:'Mobile', selected:false},
                              {text:'Home',   value:'Home',   selected:false},
                              {text:'Fax',    value:'Fax',    selected:false},
                              {text:'Other',  value:'Other',  selected:false}
                            ], 
                            name: 'Phone-'+index+'&Type&'+companyId, 
                            type: globalEnumDropdown
                          }
                        ],                      
                        title   : phone.Type+' phone',
                        content : '<a href="tel:'+phone.Text+'">'+phone.Text+'</a>'
                      };
                      companyPhone.editMap[1].content.forEach(function(option){
                        if(option.value===phone.Type) { option.selected = true; }
                      });
                      cWidgets.push(companyPhone);
                    });
                  }

                  //create websites widgets;
                  if(cWebsites) {
                    cWebsites.forEach(function(website,index){
                      var companyWebsite = {
                        icon    : 'https://cardinsoft.com/wp-content/uploads/2019/04/web.png',
                        type    : 'KeyValue',
                        state   : 'editable',
                        name    : 'Website-'+index+'&'+companyId,
                        title   : 'Website '+(index+1),
                        content : website.Text
                      };
                      cWidgets.push(companyWebsite);
                    });
                  }
                 
                  //create address widgets;
                  if(cAddresses) {
                    cAddresses.forEach(function(address,index){
                      var fullAddress = [];
                      var street  = address.Street;
                      var city    = address.City;
                      var state   = address.State;
                      var country = address.Country;
                      var zip     = address.Zip;
                      if(street)  { fullAddress.push(street); }
                      if(city)    { fullAddress.push(city); }
                      if(state)   { fullAddress.push(state); }
                      if(country) { fullAddress.push(country); }
                      if(zip)     { fullAddress.push(zip); }
                      fullAddress = fullAddress.join(', ');
                    
                      var companyAddress = {
                        icon    : 'MAP_PIN',
                        type    : 'KeyValue',
                        state   : 'editable',
                        editMap : [
                          {title: 'Street',  content: street,  name: 'Address-'+index+'&Street&'+companyId},
                          {title: 'City',    content: city,    name: 'Address-'+index+'&City&'+companyId},
                          {title: 'State',   content: state,   name: 'Address-'+index+'&State&'+companyId},
                          {title: 'Country', content: country, name: 'Address-'+index+'&Country&'+companyId},
                          {title: 'Zip',     content: zip,     name: 'Address-'+index+'&Zip&'+companyId},
                          {
                            title: 'Type', 
                            content: [
                              {text:'Work',     value:'Work',     selected:false},
                              {text:'Billing',  value:'Billing',  selected:false},
                              {text:'Shipping', value:'Shipping', selected:false},
                              {text:'Home',     value:'Home',     selected:false},
                              {text:'Other',    value:'Other',    selected:false}
                            ], 
                            name: 'Address-'+index+'&Type&'+companyId, 
                            type: globalEnumDropdown
                          }
                        ],
                        title   : address.Type+' address',
                        content : fullAddress
                      };
                      companyAddress.editMap[5].content.forEach(function(option){
                        if(option.value===address.Type) { option.selected = true; }
                      });
                      cWidgets.push(companyAddress);
                    });
                  }
                  
                  //create number of employees widgets;
                  if(cEmpl) {
                    var cEmplContent = cEmpl;
                    if(endsOnOne(cEmpl)) {cEmplContent += ' employee';}else {cEmplContent += ' employees';}
                    var numEmployees = {
                      icon    : 'EVENT_PERFORMER',
                      type    : 'KeyValue',
                      state   : 'editable',
                      editMap : [
                        {title : 'Number of employees', content : cEmpl, name : 'NumEmployees&'+companyId}
                      ],
                      content : cEmplContent
                    };
                    cWidgets.push(numEmployees);
                  }
                  
                  //create separator, creation and edit widgets;
                  var separator = {type: 'KeyValue',content: '\r'};
                  cWidgets.push(separator);
                  
                  //create widget for creation date;
                  var created = cCreated.split(' ');
                  var createdDate = new Date(created[0]);
                  var createdTime = created[1].split(':');
                      createdDate.setHours(createdTime[0]);
                      createdDate.setMinutes(createdTime[1]);
                      createdDate.setSeconds(createdTime[2]);
                      
                  var companyCreated = {
                    icon    : 'CLOCK',
                    type    : 'KeyValue',
                    title   : 'Created',
                    content : createdDate.toLocaleDateString()+'\r'+createdDate.toLocaleTimeString()
                  };
                  cWidgets.push(companyCreated);
                  
                  //create widget for edit date;
                  if(cEdited) {
                    var edited = cEdited.split(' ');
                    var editedDate = new Date(edited[0]);
                    var editedTime = edited[1].split(':');
                        editedDate.setHours(editedTime[0]);
                        editedDate.setMinutes(editedTime[1]);
                        editedDate.setSeconds(editedTime[2]);
                    
                    var companyEdited = {
                      icon    : 'CLOCK',
                      type    : 'KeyValue',
                      title   : 'Edited',
                      content : editedDate.toLocaleDateString()+'\r'+editedDate.toLocaleTimeString()
                    };
                    cWidgets.push(companyEdited);
                  }
                  
                  //set uncollapsible widgets;
                  var num = cWidgets.length;
                  if(cEdited) { num -= 3; }else { num -= 2; }
                  if(num<=0) { num = 1; }
                  cSection.numUncollapsible = num;
                  
                  sections.push(cSection);
                }
              }
            }
            
            //if contact has background -> add;
            if(background) {
              var backgroundSection = {
                header        : 'Background',
                isCollapsible : true,
                widgets       : []
              };
              var backgroundWidgets = backgroundSection.widgets;
            
              //if birthday provided -> set widget;
              if(birthday) {
                var contactBirthday = {
                  icon      : 'https://cardinsoft.com/wp-content/uploads/2019/04/CAKE.png',
                  type      : 'KeyValue',
                  state     : 'editable',
                  name      : 'Birthday&'+contactId,
                  title     : 'Birthday',
                  content   : birthday,
                  multiline : false
                };
                backgroundWidgets.push(contactBirthday);
              }
            
              //create background widgets;
              var contactBackground = {
                icon      : 'DESCRIPTION',
                type      : 'KeyValue',
                state     : 'editable',
                name      : 'BackgroundInfo&'+contactId,
                content   : background,
                multiline : true
              };
              backgroundWidgets.push(contactBackground);
              sections.push(backgroundSection);
            }
            
            //if contact has custom fields -> add;
            if(custom) {
              var customSection = {
                header        : 'Custom fields',
                isCollapsible : true,
                widgets       : []
              };
              var customWidgets = customSection.widgets;
              Logger.log(custom)
              
              var customIdx = 0;
              for(var field in custom) {
                var customWidget = {
                  type    : 'KeyValue',
                  state   : 'editable',
                  name    : ['CustomFields-'+customIdx,field,contactId].join('&'),
                  title   : field,
                  content : custom[field]
                };
                customWidgets.push(customWidget);
                customIdx++;
              }
              
              sections.push(customSection);
            }
            
          }
          
          
                  
        });
      }
    
    }
    
    //build return object;
    var returned = {
      code     : code,
      headers  : result.headers,
      content  : JSON.stringify(sections),
      hasMatch : {
        value  : true,
        text   : 'found',
        colour : '#008000'
      }
    };
     
    return returned;
  }
}
//chain custom connector to base class;
LessAnnoyingCRM.prototype = Object.create(Connector.prototype);