[
  {
    "header": "Head 1",
    "isCollapsible": true,
    "numUncollapsible": 4,
    "widgets": [
      {
        "state": "editable",
        "name": "field1",
        "type": "RADIO_BUTTON",
        "content": [
          {
            "text": "opt-1",
            "value": "1",
            "selected": false
          },
          {
            "text": "opt-2",
            "value": "2",
            "selected": true
          }
        ]
      },
      {
        "name": "field2",
        "type": "CHECK_BOX",
        "content": [
          {
            "text": "opt-1",
            "value": "1",
            "selected": false
          },
          {
            "text": "opt-2",
            "value": "2",
            "selected": true
          }
        ]
      },
      {
        "name": "field3",
        "type": "DROPDOWN",
        "content": [
          {
            "text": "opt-1",
            "value": "1",
            "selected": false
          },
          {
            "text": "opt-2",
            "value": "2",
            "selected": true
          }
        ]
      }
    ]
  },
  {
    "header": @{triggerBody()['sender']},
    "isCollapsible": true,
    "widgets": [
      {
        "icon": "CLOCK",
        "type": "KeyValue",
        "content": @{triggerBody()['date']}
      },
      {
        "state": "editable",
        "name": "field7",
        "icon": "EMAIL",
        "type": "KeyValue",
        "content": @{triggerBody()['from']},
        "hint": "Hint"
      },
      {
        "state": "editable",
        "name": "field6",
        "type": "TextInput",
        "title": "Message Id",
        "content": @{triggerBody()['id']},
        "hint": "Record Id to set (msg id by default)",
        "icon": "BOOKMARK"
      },
      {
        "type": "KeyValue",
        "content": "Simple text content to test",
        "title": "Test hint"
      }
    ]
  }
]