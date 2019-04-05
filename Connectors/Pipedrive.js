function Pipedrive() {
  Connector.call(this);
  this.icon = globalPipedriveIconUrl;
  this.name = 'Pipedrive';
  this.url  = 'https://api-proxy.pipedrive.com/';
  this.short = globalPipedriveShort;
  this.config = [
    
  ];
  this.auth = {
    name: 'Pipedrive',
    urlAuth: 'https://oauth.pipedrive.com/oauth/authorize',
    urlToken: 'https://oauth.pipedrive.com/oauth/token',
    id: '12cefab496cfcb98',
    secret: 'c4842d0956b6188431e300ca311a8d3832def793',
    scope: 'contacts:read'
  };
  this.login = function(connector) {
    var base = 'https://www.pipedrive.com/en/login';
    var url = base;
    return url;
  }
  this.run = function(msg,connector,data) {
    //set method for url fetch ('get' or 'post' for now);
    var method = 'get';

    //set headers for url fetch;
    var headers = {};
    
    //set payload in case POST request will be triggered;
    var trimmed = trimMessage(msg,true,true);    
    
    //access authoorization parameters and set service name;
    var parameters      = this.auth;
        parameters.name = connector.name;
        
    //create service and set authorization header;
    var service = authService(parameters);
    var bearer  = 'Bearer '+service.getAccessToken();
    headers.Authorization = bearer;
    
    //initiate access endpoints;
    var personsEP = '/persons';
    var activsEP  = '/activities';
    var dealsEP   = '/deals';
    
    //initate requests;
    var responsePersons = performFetch(this.url+personsEP,method,headers);
    var responseActivs  = performFetch(this.url+activsEP,method,headers);
    var responseDeals   = performFetch(this.url+dealsEP,method,headers);
    
    //access response codes;
    var codePersons = responsePersons.code;
    var codeActivs  = responseActivs.code;
    var codeDeals   = responseDeals.code;
    
    //access and parse response contents;
    var contentPersons = JSON.parse(responsePersons.content);
    var contentActivs  = JSON.parse(responseActivs.content);
    var contentDeals   = JSON.parse(responseDeals.content);
    
    //initialize info parsing on successful fetch;
    if(codePersons>=200&&codePersons<300) {
    
      //initiate result array, sections and set required params;
      var result = [];   
    
      //access content and check if it is not null;
      var persons = contentPersons.data;
      if(persons!==null) {
        //set section show to false by default;
        var matching = false;
        
        //access each person and create widgets;
        persons.forEach(function(person){
          //access person email addresses;
          var emailLabels = [], emailAddresses = [];
          var emails = person.email; 
          emails.forEach(function(email){
            var emailLabel   = email.label;
            var emailAddress = email.value;
            emailLabels.push(emailLabel);
            emailAddresses.push(emailAddress);
          });
              
          //check if there is email match;
          var hasMatch = emailAddresses.some(function(email){
            if(email===trimmed.email) { return email; }
          });
          
          if(hasMatch) {
          
            //create separator;
            var separator = {
              type: 'KeyValue',
              content: '\r'
            };
            
            //create section persons;
            var sectionPersons = {
              header: 'Person info',
              isCollapsible: true,
              widgets: []
            }; 
            
            //access widgets;
            var widgetsPerson = sectionPersons.widgets;            
          
            //access person properties;
            var company   = person.org_id;
            var owner     = person.owner_id;
            var first     = person.first_name;
            var last      = person.last_name;
            var phones    = person.phone;
            var created   = person.add_time;
            var updated   = person.update_time;
            var label     = person.label;
            var numOpen   = person.open_deals_count;
            var numClosed = person.closed_deals_count;
            var numWon    = person.won_deals_count;
            var numLost   = person.lost_deals_count;
            var numActiv  = person.activities_count;
            var nextDate  = person.next_activity_date;
            var nextTime  = person.next_activity_time;
            
            //create person name widget;
            var fullname = '';
            if(first!==null) { fullname += first; }
            if(last!==null)  { fullname += ' '+last; }
            var personName = {
              icon    : 'PERSON',
              title   : 'Full Name',
              type    : 'KeyValue',
              content : fullname
            };
            widgetsPerson.push(personName);
            
            //create person label widget;
            if(label!==null) {
              //set start and end tags and default color;
              var sText = '<b><font color="';
              var eText = '</font></b>';
              var color = '#000000';
              
              //set label text and color;
              if(label===1) { label = 'Customer';  color = '#007A00'; }
              if(label===2) { label = 'Hot lead';  color = '#ff0000'; }
              if(label===3) { label = 'Warm lead'; color = '#FFCE00'; }
              if(label===4) { label = 'Cold lead'; color = '#4285F4'; }
            
              var personLabel = {
                icon    : 'BOOKMARK',
                type    : 'KeyValue',
                content : sText+color+'">'+label+eText
              };
              widgetsPerson.push(personLabel);
            }
            
            //create person email widgets;
            if(emails!==null) {
              emails.forEach(function(email){
                var label     = email.label;
                var value     = '<a href="mailto:'+email.value+'">'+email.value+'</a>';
                var isPrimary = email.primary;
                
                var personEmail = {
                  icon       : 'EMAIL',
                  title      : label,
                  type       : 'KeyValue',
                  content    : value
                };
                if(isPrimary) { personEmail.buttonText = 'Primary'; }
                widgetsPerson.push(personEmail);
                
              });
            }
            
            //create person phone widgets;
            if(phones!==null) {
              phones.forEach(function(phone){
                var label     = phone.label;
                var value     = phone.value;
                var isPrimary = phone.primary;
                
                var personPhone = {
                  icon    : 'PHONE',
                  title   : label,
                  type    : 'KeyValue',
                  content : value
                };
                if(isPrimary) { personPhone.buttonText = 'Primary'; }
                widgetsPerson.push(personPhone);
              }); 
            }
            
            //create is active widget;
            var active = 'Inactive', color = '#ff0000';
            if(person.active_flag) { 
              active = 'Active';
              color  = '#007A00';
            }
            var personActive = {
              type    : 'KeyValue',
              content : '<font color="'+color+'">'+active.toString()+'</font>'     
            };
            widgetsPerson.push(personActive);            
            
            //set number of uncollapsible widgets to main info;
            sectionPersons.numUncollapsible = widgetsPerson.length;
            
            //append separator;
            widgetsPerson.push(separator);
            
            //create creation date widget;
            var personCreated = {
              icon    : 'INVITE',
              title   : 'Created on',
              type    : 'KeyValue',
              content : created
            };
            widgetsPerson.push(personCreated);
            
            //create update date widget;
            if(updated!==null) {
              var pesronUpdated = {
                icon    : 'INVITE',
                title   : 'Updated on',
                type    : 'KeyValue',
                content : updated
              };
              widgetsPerson.push(pesronUpdated);
            }
            
            //create deals section and widgets if are or were any;
            if(numOpen>0||numClosed>0) {
              //set single / multiple ending;
              var modOpen = '', modClosed = '';
              if(!endsOnOne(numOpen))   { modOpen   = 's'; }
              if(!endsOnOne(numClosed)) { modClosed = 's'; }
              
              //create deals section;
              var sectionDeals = {
                header        : 'Deals',
                isCollapsible : true,
                widgets       : []
              };
              
              //access section widgets;
              var dealsWidgets = sectionDeals.widgets;
              
              //create number of won deals widget;
              var won = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_thumbs_up_down_black_18dp.png',
                type    : 'KeyValue',
                content : numWon+' won | '+numLost+' lost'
              };
              dealsWidgets.push(won);
              
              //create number of open deals widget;
              var open = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_work_outline_black_18dp.png',
                type    : 'KeyValue',
                content : numOpen + ' open deal' + modOpen
              };
              dealsWidgets.push(open);
              
              //create number of closed deals widget;
              var closed = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_work_black_18dp.png',
                type    : 'KeyValue',
                content : numClosed + ' closed deal' + modClosed
              };
              dealsWidgets.push(closed);
              
            }//end deals section;
            
            //create activities section and widgets if are or were any;
            if(numActiv>0) {
              //create deals section;
              var sectionActivs = {
                header           : 'Activities',
                isCollapsible    : true,
                widgets          : []
              };  
              
              //access section widgets;
              var activsWidgets = sectionActivs.widgets;

              //create number of activities widget;
              var activsMod = 'ies';
              if(endsOnOne(numActiv)) { activsMod = 'y'; }
              var activs = {
                icon    : 'EVENT_PERFORMER',
                type    : 'KeyValue',
                content : numActiv+' activit'+activsMod
              };
              activsWidgets.push(activs);
              
              //create next activity date;
              if(nextDate!==null) {
                var nextD = {
                  icon    : 'INVITE',
                  title   : 'Next activity on',
                  type    : 'KeyValue',
                  content : nextDate
                };
                activsWidgets.push(nextD);
              }
              
              //create widgets for activities;
              if(codeActivs>=200&&codeActivs<300) {
                //access activities info;
                var activities = contentActivs.data;
                
                //loop through activities;
                activities.forEach(function(activity){
                  //access properties;
                  var personId = activity.person_id;
                  var orgId    = activity.org_id;
                  var dealName = activity.deal_title;
                  var subject  = activity.subject;
                  var type     = activity.type;
                  var duration = activity.duration;
                  var isDone   = activity.done;
                  var note     = activity.note;
                  var dueDate  = activity.due_date;
                  var dueTime  = activity.due_time;
                  
                  //create separator widget;
                  activsWidgets.push(separator);
                  
                  //create subject widget;
                  var activSubject = {
                    icon    : 'EVENT_PERFORMER',
                    title   : 'Subject',
                    type    : 'KeyValue',
                    content : subject
                  };
                  activsWidgets.push(activSubject);
                  
                  //create notes widget;
                  var activNotes = {
                    icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_speaker_notes_black_18dp.png',
                    title   : 'Notes',
                    type    : 'KeyValue',
                    content : note
                  };
                  activsWidgets.push(activNotes);
                  
                  //create due date and time widget;
                  var activDue = {
                    icon    : 'INVITE',
                    title   : 'Due to',
                    type    : 'KeyValue',
                    content : dueDate+' '+dueTime
                  };
                  activsWidgets.push(activDue);
                  
                  //create duration widget;
                  var activDur = {
                    icon    : 'CLOCK',
                    title   : 'Duration',
                    type    : 'KeyValue',
                    content : duration
                  };
                  activsWidgets.push(activDur);
                  
                  
                });
              
              }//end actives success;
              
              /*
			rec_master_activity_id = null,
			reference_id = null,
			active_flag = true,
			source_timezone = null,
			assigned_to_user_id = 8658926,
			participants = [{
				primary_flag = true,
				person_id = 1
			}],
			rec_rule_extension = null,
			reference_type = null,
			rec_rule = null,
			marked_as_done_time = ,
			series = null,
              */
               
              
            }
        
            /*[{
              email_messages_count = 0,
              last_outgoing_mail_time = null,
              last_activity_id = null,
              last_incoming_mail_time = null,
              undone_activities_count = 0,
              last_activity_date = null,
              next_activity_id = null,
              notes_count = 0,
              done_activities_count = 0
            }]*/
            
            //create organization section and widgets;
            if(company!==null) {
              
              //create organization section;
              var sectionCompany = {
                header        : 'Organization',
                isCollapsible : false,
                widgets       : []              
              };
              
              //access widgets;
              var widgetsCompany = sectionCompany.widgets;              
              
              //create organization name widget;
              var companyName = {
                icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_business_black_18dp.png',
                title   : 'Name',
                type    : 'KeyValue',
                content : company.name
              };
              widgetsCompany.push(companyName);
              
              //create organization address widget;
              if(company.address!==null) {
                var companyAddress = {
                  icon    : 'MAP_PIN',
                  title   : 'Address',
                  type    : 'KeyValue',
                  content : company.address
                };
                widgetsCompany.push(companyAddress);
              }
              
            }//end company section; 
            
            //create person owner section and widgets;
            if(owner!==null) {
              
              //create owner section;
              var sectionOwner = {
                header           : 'Contact owner',
                isCollapsible    : true,
                widgets          : []              
              };
              
              //access widgets;
              var widgetsOwner = sectionOwner.widgets;      
              
              //create owner name widget;
              var ownerName = {
                icon    : 'PERSON',
                title   : 'Name',
                type    : 'KeyValue',
                content : owner.name
              };
              widgetsOwner.push(ownerName);
              
              //create owner email widget;
              var ownerEmail = {
                icon    : 'EMAIL',
                title   : 'Email',
                type    : 'KeyValue',
                content : '<a href="mailto:'+owner.email+'">'+owner.email+'</a>'
              };
              widgetsOwner.push(ownerEmail);
              
              //create is active widget;
              var active = 'Inactive', color = '#ff0000';
              if(owner.active_flag) { 
                active = 'Active';
                color  = '#007A00';
              }
              var ownerActive = {
                type    : 'KeyValue',
                content : '<font color="'+color+'">'+active.toString()+'</font>'     
              };
              widgetsOwner.push(ownerActive);
                            
            }//end owner section;
            
            //append sections;
            result.push(sectionPersons);
            if(sectionCompany) { result.push(sectionCompany); }
            if(sectionDeals)   { result.push(sectionDeals);   }
            if(sectionActivs)  { result.push(sectionActivs);  }
            if(sectionOwner)   { result.push(sectionOwner);   }        
          
          }//end has match;
          
        });//end persons loop;
      
      }//end persons not null;
    
    }//end on response success;
    
    //set content to return;
    var returned = {
      code    : codePersons,
      headers : '',
      content : JSON.stringify(result)
    };    
    
    //print debug info;
    console.log(returned); 
    
    //return parsed info;
    return returned;
  }
}
Pipedrive.prototype = Object.create(Connector.prototype);