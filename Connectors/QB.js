// control sandbox mode here, at a code level
var sbMode = false;

//QB connector class;
function QB() {
  Connector.call(this);
  this.icon = "https://quickbooks.intuit.com/content/dam/intuit/quickbooks/common/qb_thumb.png";
  this.name = 'QB';
  this.short = globalQBShortDesc;
  
  // allow power users to copy the icon URL from QB to uniquely ID multiple QB companies by logo
  this.allowCustomIcons = true;  

  // Authentication detail for 'Cardin for QB' app in Intuit store
  this.auth = {
    name: 'QB',
    urlAuth: 'https://appcenter.intuit.com/connect/oauth2',
    urlToken: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    id: (sbMode ? 'L0ZlJyFPZoBCRHSAQsLFjDMwKBURLH4uemB4dadwYiSbxRdDfu' : 'L0iTDowDGWB0YnpdBTwsyX2CoA1n8iKqd1Kqdc00UBcuey7ylS'),
    secret: (sbMode ? '4TK5iwkLFEFbo4zlPFQ9AS0RCezt8GYeFZg29XgY': 'eCukdtng3KMd0zKH0TQcPUGp8fd1dCecCPIyEL5W'),
    scope: 'com.intuit.quickbooks.accounting'
  };
  
  // return the login URL 
  this.login = function(type) {
    
    //set parameters and create authorization service;
    var parameters      = this.auth;
        parameters.name = type.name;
    var service = authService(parameters);

    // retrieve realmID (QuickBooks companyID), which was persisted by the OAuth2 callback function on authentication;
    var OAuth2Params = service.getStorage().getValue(type.name + '_OAuth2Params');
    
    if (OAuth2Params) {

      // deeplink / directlink to company login.
      return ('https://' + (sbMode ? 'sandbox.qbo.intuit.com' : 'qbo.intuit.com') + '/login?deeplinkcompanyid=' + OAuth2Params.realmId);
      
           
    }
    else {
      return ('https://' + (sbMode ? 'app.sandbox.' : '') + 'qbo.intuit.com/app/login');
    }
      
  };
  
  
  /**
   * method for performing fetch to external service;
   * @param {Object} msg message object;
   * @param {Object} connector connector config object;
   * @param {Object} data custom data object to pass to payload;
   * @return {Function}
   */
  this.run = function (msg,connector,data) {
 
    //set parameters and create authorization service;
    var parameters      = this.auth;
        parameters.name = connector.name;
    var service = authService(parameters);

    //set method for url fetch ('get' or 'post' for now)
    var method = 'get';
    
    // initially, assume we won't find data
    var foundDataResp = false;
    
    // this variable holds eiter the Customer or Vendor QB id string (integer)
    var id = '';
   
    //set payload in case POST request will be triggered
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
    if(data!==undefined) { payload.data = data; }
    
    // retrieve realmID (QuickBooks companyID), which was persisted by the OAuth2 callback function on authentication;
    var OAuth2Params = service.getStorage().getValue(connector.name + '_OAuth2Params');

    // realmID is the QB company ID
    var realmID = '';

    if (OAuth2Params) {
      // retrieve realmID (QuickBooks companyID), which was persisted by the OAuth2 callback function on authentication 
      var realmId = service.getStorage().getValue(connector.name + '_OAuth2Params').realmId;
    }
    
    // initialize our Card response to assume that no Customers or Vendors will be found
    // cs index tracks which Card section we are building
    var cs = 0;
    var cardReply = [];
    cardReply[cs] = {};
    cardReply[cs].header = 'QB Customer / Vendor Query Status';
    cardReply[cs].isCollapsible = true;
    cardReply[cs].numUncollapsible = 3;
    cardReply[cs].widgets = [];
    
    // build out default first section in case we get no results from customer/vendor query
    // this will be overwritten on success.
    cardReply[cs].widgets = [
      {
        'type': 'TextParagraph',
        'name': 'Status',
        'content': 'No Customers or Vendors match the sender of the currently-open email.'
      },
      {
        type: 'TextButton',
        title: 'Edit Customers',
        content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'customers',
        action: 'link',
        disabled: false,
        filled: false,
        fullsized: true,
        reload: true      
        
      },
      {
        type: 'TextButton',
        title: 'Edit Vendors',
        content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'vendors',
        action: 'link',
        disabled: false,
        filled: false,
        fullsized: true,
        reload: true      
        
      }

    ]
      
    // build QB query URL to find the company ID associated with this customer email address
    var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId + "/query?query=" + encodeURIComponent("select * from Customer where PrimaryEmailAddr = '" + payload.from + "'");
    
    //set headers for url fetch;
    var fetchHeaders = {
      'Authorization' : 'Bearer '+ service.getAccessToken(),
      'Accept': 'application/json'

    };

    //initiate QB customer lookup request with helper function
    var response = performFetch(url,method,fetchHeaders);
    
    // Parse response
    var result = JSON.parse(response.content);
    
    // if a customer matches the sender email, then isolate 'Customer' portion of QueryResponse 
    if (result.QueryResponse.Customer) {
      
      // note that we found at least one matching customer in QB
      foundDataResp = 'CUSTOMER';
      
      var customer = result.QueryResponse.Customer[0];
      
      cardReply[cs] = buildCustomerVendorSection(customer, true);

      // increment to next Card section
      cs++;
      
      // note QB ID assocated with Customer; we will use this later when building the Transaction list
      id = customer.Id;
      
      // now we've got the customer by QB Id, query invoices
      var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId + "/query?query=" + encodeURIComponent("select * from Invoice where CustomerRef = '" + id + "'");
      
      //initiate QB invoice lookup request with helper function
      var response = performFetch(url,method,fetchHeaders);
      
      // Parse response
      var result = JSON.parse(response.content);
      
      // isolate invoices from queryResult if invoices found, else return helpful message
      if (result.QueryResponse.Invoice) {
        var invoices = result.QueryResponse.Invoice;
   
        // attempt to format button text to Green; this presently is not supported, but keeping for future implementation
        foundDataResp = '<font color="#007A00">INVOICE(S)</font>';
        
        // iterate invoices and create widgets for display in card
        for (var i in invoices) {
          
          if (invoices[i].Balance) {
            cardReply[cs] = buildInvoiceBillSection (invoices[i],true);
          
            // advance to next Card section (one section per Invoice)
            cs++;
          }
        }
        
      }
      else {
        
        // Add Card section indicating no invoices outstanding
        cardReply[cs] = {};
        cardReply[cs].header = 'Invoice Status';
        cardReply[cs].isCollapsible = true;
        cardReply[cs].numUncollapsible = 2;
        cardReply[cs].widgets = [];
        
        cardReply[cs].widgets = [
          {
            'type': 'KeyValue',
            'title': '',
            'content': 'No invoices outstanding'
          },
          {
            type: 'TextButton',
            title: 'Add New Invoice',
            content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'invoice',
            action: 'link',
            disabled: false,
            filled: false,
            fullsized: true,
            reload: true      
            
          }

          
        ]
      }  
    }
   
    // setup to handle QB Bills, here.
    
    lastName = payload.sender.split(' ').slice(-1);
    
    // build QB query URL to find the Vendor ID associated with the last name indicated in this email address
    var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId + "/query?query=" + encodeURIComponent("select * from vendor where FamilyName = '" + lastName + "'");

    //initiate QB Vendor lookup request with helper function
    var response = performFetch(url,method,fetchHeaders);
    
    // Parse response
    var result = JSON.parse(response.content);
    
    // if a single Vendor matches on FamilyName, then isolate 'Vendor' portion of QueryResponse 
    if (result.QueryResponse.Vendor) {
     
      // note that we found at least one matching Vendor in QB
      foundDataResp = 'VENDOR';

      var vendor = result.QueryResponse.Vendor;

      // if there is more than one vendor that matches on last name, then provide the user with the capacity to select from drop down which they wish to see
      if (vendor.length > 1) {
        
        // add this handling in future; for now, assume single vendor match
      }        
      else {

        // assume array of length 1 as single match
        vendor = vendor[0];
        
        // add vendor detail section
        cardReply[cs] = buildCustomerVendorSection(vendor, false);
        
        // increment to next Card section
        cs++;
        
        // isolate the QB Id associated with this Vendor
        id = vendor.Id;
        
        // now we've identified vendor by QB Id, query bills
        var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId + "/query?query=" + encodeURIComponent("select * from bill where VendorRef = '" + id + "'");
        
        //initiate QB Bill lookup request with helper function
        var response = performFetch(url,method,fetchHeaders);
        
        // Parse response
        var result = JSON.parse(response.content);

        // isolate Bills from queryResult if Bills found, else return helpful message
        if (result.QueryResponse.Bill) {
          var bills = result.QueryResponse.Bill;
          
          foundDataResp = 'BILL(S)';   
          
          // iterate bills and create widgets for display in card
          for (var i in bills) {
            
            if (bills[i].Balance) {
              Logger.log(JSON.stringify(bills[i],null,4));
              cardReply[cs] = buildInvoiceBillSection (bills[i],false);
              
              // advance to next Card section (one section per Bill)
              cs++;
            }
          }
        
        }
        else {
          
          // Add Card section indicating no bills outstanding
          cardReply[cs] = {};
          cardReply[cs].header = 'Bill Status';
          cardReply[cs].isCollapsible = true;
          cardReply[cs].numUncollapsible = 3;
          cardReply[cs].widgets = [];
          
          cardReply[cs].widgets = [
            {
              'type': 'KeyValue',
              'title': '',
              'content': 'No bills outstanding'
            },
            {
              type: 'TextButton',
              title: 'Add New Bill',
              content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'bill',
              action: 'link',
              disabled: false,
              filled: false,
              fullsized: true,
              reload: true      
              
            },
            {
              type: 'TextButton',
              title: 'Add New Expense',
              content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + 'expense',
              action: 'link',
              disabled: false,
              filled: false,
              fullsized: true,
              reload: true      
              
            }
            
          ]
        }  

        
      }
    }

    
    // if we found a customer or vendor, then trigger the Transactions report and add as new section
    if (id) {
      // build QB query URL to get list of transactions associated with this Customer or Vendor ID (ID is 'name' in the context of the TransactionList report)
      var url = "https://" + (sbMode ? "sandbox-" : "") + "quickbooks.api.intuit.com/v3/company/" + realmId;

      // derive dates today and 30 days ago
      var today = new Date();
      var monthAgo = new Date(today.getTime() - (1000*60*60*24*30));
      
      // form report GET string
      url += "/reports/TransactionList?" +
        "group_by=Customer&name=" + id +
          "&start_date=" + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() +
            "&end_date=" + monthAgo.getFullYear() + '-' + (monthAgo.getMonth() + 1) + '-' + monthAgo.getDate() +
              "&qzurl=true";
     
      //Logger.log(url);
      
      //initiate QB Vendor lookup request with helper function
      var response = performFetch(url,method,fetchHeaders);
    
      //Logger.log(JSON.stringify(JSON.parse(response.content), null, 4));
      
      // Parse response
      var result = JSON.parse(response.content);
      
      // if there are transactions to display, build section 
      if (result.Header.Option[0].Value == 'false') {

        cardReply[cs] = buildTransactionsSection(result);
        cs++;
      }
    }
 
    
    // Add login button, here
    cs = cardReply.push(Object());

    // .push retruns new length, so index of tail element is returnvalue - 1
    cs--;
    
    cardReply[cs].header = 'Login to edit this company';
    cardReply[cs].isCollapsible = false;
    cardReply[cs].numUncollapsible = 1;
    cardReply[cs].widgets = [];
        
    cardReply[cs].widgets[0] = 
      {
        type: 'TextButton',
        title: 'Login',
        content: this.login(connector),
        action: 'link',
        disabled: false,
        filled: false,
        fullsized: false,
        reload: false      
        
      }
    
    cs++;

    // return result
    return {code:response.code,headers:response.headers,content:cardReply, hasMatch : {value : (foundDataResp != false), text : foundDataResp}};    
  }
}
//chain custom connector to base class;
QB.prototype = Object.create(Connector.prototype);

// Helper function for formatting dollar values received from QB API
// n = number to format as a monetary value
// c = number of decimal places
// d = string to use as decimal separator (default '.')
// t = string to use as group seperator (default ',')
function formatMoney(n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

// Helper function to caclulate the number of days between two Date objects
function daysBetween (firstDate, secondDate) {
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  
  return (Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))));
}

// Helper function which builds the card section detailing either a Vendor or a Customer and returns a Section object
// Sections have a few header fields and conclude with an array of widgets
function buildCustomerVendorSection (QBrecord,custOrvendor) {

  // Build card section detailing Customer or Vendor info
  section = {};
  section.header = (custOrvendor) ? 'Customer Detail' : 'Vendor Detail';
  section.isCollapsible = true;
  
  // Create date object reflecting date customer was created in QB
  var createdDate = new Date(QBrecord.MetaData.CreateTime);

  // check to see if email address field is defined; othewise set to indicate not found
  if (QBrecord.PrimaryEmailAddr) { var emailResult = QBrecord.PrimaryEmailAddr.Address } else { emailResult = 'no email in QB' }; 
  
  section.widgets = [
    {
      'type': 'KeyValue',
      'title': 'Name',
      'content': QBrecord.DisplayName,
      "icon": "PERSON"

    },
    {
      icon    : 'https://cardinsoft.com/wp-content/uploads/2019/03/baseline_business_black_18dp.png',
      title   : 'Company',
      type    : 'KeyValue',
      content : QBrecord.CompanyName ? QBrecord.CompanyName : ''
    },
    {
      'type': 'KeyValue',
      'title': 'Outstanding unpaid balance',
      'content': '$' + formatMoney(QBrecord.Balance),
      'icon' : 'DOLLAR'
    },
    {
      'type': 'KeyValue',
      'title': 'Currency',
      'content': QBrecord.CurrencyRef.value,
      'icon' : 'DOLLAR'
    },
    {
      'type': 'KeyValue',
      'title': 'First created in QB',
      'content': createdDate.toDateString(),
      'icon' : 'INVITE'
    },
    {
      'type': 'KeyValue',
      'title': 'Email in QB',
      'content': emailResult,
      'icon' : 'EMAIL'
    },
    {
      type: 'TextButton',
      title: 'Edit in QB',
      content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + (custOrvendor ? 'customerdetail' : 'vendordetail') + '?nameId=' + QBrecord.Id,
      action: 'link',
      disabled: false,
      filled: false,
      fullsized: true,
      reload: true      
      
    }
    
  ];             

  
  
  // set to expand fully
  section.numUncollapsible = section.widgets.length;
 
  return section;
}

// Helper function which builds the card section detailing either an Invoice and or Bill and returns a section object
// custOrvendor == true for Customer and false for Vendor
function buildInvoiceBillSection (QBrecord,custOrvendor) {

  // parse dates
  var txnDate = new Date(QBrecord.TxnDate);
  var dueDate = new Date(QBrecord.DueDate);
  var currentDate = new Date();
  var dueDays = daysBetween(dueDate, currentDate);
  
 
  // Build out invoice / bill detail
  var section = {};
  section.header = 'Outstanding ' + (custOrvendor ? ('Invoice Number ' + QBrecord.DocNumber) : 'Bill');
  section.isCollapsible = true;
  section.numUncollapsible = 3;
  section.widgets = [];
  
  // track current widget
  var cw = 0;

  // Balance outstanding and date created
  section.widgets[cw] =
    {
      'type': 'KeyValue',
      'title': 'Created '+ txnDate.toDateString(),
      'icon' : 'DOLLAR',
      'content': '<b>Total</b> $' + formatMoney(QBrecord.TotalAmt,0) + ' -- <b>Balance</b> $' + formatMoney(QBrecord.Balance,0)
    };
  cw++; // next widget

  // Due date: insert date and number of days until due or overdue
  section.widgets[cw] =
    {
      'type': 'KeyValue',
      'title': 'Due '+ dueDate.toDateString(),
      'icon' : 'INVITE',
      'content': currentDate < dueDate ? 'Due in ' + dueDays + ' days' : 'Overdue for ' + dueDays + ' days'
    };

/*
  cw++; // next widget

  // Balance outstanding and date created
  section.widgets[cw] =
    {
      'type': 'KeyValue',
      'title': (custOrvendor ? 'Invoice ' : 'Bill ') + 'detail',
      'icon' : 'DESCRIPTION',
      'content': 'click below to expand line items:'
    };
    
 */   
  
/*  
  cw++; // next widget

  // present individual invoice detail as a Dropdown widget with each line represented by an option for drill-down
  section.widgets[cw] = {};
  section.widgets[cw].type = 'DROPDOWN';
  section.widgets[cw].content = [];
  section.widgets[cw].name = 'record' + QBrecord.Id;

  // for each invoice, get line item detail for reference
  for (var j in QBrecord.Line) {
    if (QBrecord.Line[j].DetailType == 'SalesItemLineDetail' || QBrecord.Line[j].DetailType == 'AccountBasedExpenseLineDetail') {
      section.widgets[cw].content[j] = {};
      section.widgets[cw].content[j].text = '$' + formatMoney(QBrecord.Line[j].Amount,0) + ' - ' + QBrecord.Line[j].Description.slice(0,30);// + '..' + ' Qty: ' + QBrecord.Line[j].SalesItemLineDetail.Qty;// + ' Tax: (per) ' + QBrecord.Line[j].SalesItemLineDetail.TaxCodeRef.value;
      section.widgets[cw].content[j].value = j;
      section.widgets[cw].content[j].selected = true;
      
    }
  }
  
*/

  // present individual invoice / bill lines as keyvalue widgets, one per line
  for (var j in QBrecord.Line) {
    if (QBrecord.Line[j].DetailType == 'SalesItemLineDetail' || QBrecord.Line[j].DetailType == 'AccountBasedExpenseLineDetail') {
      // advance to next widget
      cw++;

      section.widgets[cw] = {
        type : 'KeyValue',
        title : QBrecord.Line[j].Description.slice(0,30),
        icon : 'DOLLAR',
        content :  (custOrvendor ? (  'Qty: ' + QBrecord.Line[j].SalesItemLineDetail.Qty + ' x Rate: $' + formatMoney(QBrecord.Line[j].SalesItemLineDetail.UnitPrice,0) + ' =') : '') + '$' + formatMoney(QBrecord.Line[j].Amount,2),
        buttonText : 'Line ' + QBrecord.Line[j].LineNum
      }
    }  
  }
    
  
  cw++; // next widget
  
  // insert direct link to either Invoice or Bill
  section.widgets[cw] = {};
  section.widgets[cw] = 
    {

      type: 'TextButton',
      title: 'Edit in QB',
      content: 'https://app.' + (sbMode ? "sandbox." : "") + 'qbo.intuit.com/app/' + (custOrvendor ? 'invoice' : 'bill') + '?txnId=' + QBrecord.Id,
      action: 'link',
      disabled: false,
      filled: false,
      fullsized: true,
      reload: true      


    };
  cw++; // next widget
  
  return section;
}

// Helper function which builds the card section detailing the transactions associated with a nameID (either customer or vendor)
function buildTransactionsSection (QBrecord) {

  // parse dates
  var startDate = new Date(QBrecord.Header.StartPeriod);
  var endDate = new Date(QBrecord.Header.EndPeriod);
  
  // Build out invoice / bill detail
  var section = {};
  section.header = 'Transactions from ' + QBrecord.Header.StartPeriod + ' to ' + QBrecord.Header.EndPeriod;
  section.isCollapsible = true;
  section.widgets = [];

  //Logger.log(JSON.stringify(section,null,4));
  
  // track current widget
  var cw = 0;

  // isolate transactions portion of response (array)
  var transactions = QBrecord.Rows.Row[0].Rows.Row;

  // present individual Transactions, one per KeyValue widget
  for (var j in transactions) {

    // isolate month and day
    var txDate = transactions[j].ColData[0].value
    var dateLen = txDate.length;
    txDate = txDate.slice(dateLen - 5, dateLen);
    
    section.widgets[cw] = {
      type : 'KeyValue',
      title : transactions[j].ColData[1].value,
      icon : 'DESCRIPTION',
      content :  '<b>Amount</b>: $' + formatMoney(transactions[j].ColData[8].value) + '\n' + transactions[j].ColData[6].value + '\n<b>Split</b>: ' + transactions[j].ColData[7].value,
      buttonText : txDate
    }
    cw++;
    
  }

  section.numUncollapsible = cw;
  
  return section;
}