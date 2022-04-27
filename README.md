# automated-event-validation
### This script allows to set up automated event validation via Tealium functions

#### Implement tealiumSsFunctionAT.js in function based on processed data trigger
https://community.tealiumiq.com/t5/Customer-Data-Hub/About-Functions/ta-p/34585#toc-hId--1156376365

#### Define event schema
###### Each schema can be stored either locally in tealiumSsFunctionAT.js or as a global variable. On the event schema level you can define JSON with attributes and their properties like value(exact/contains)/type/length(max length)/regex-match that will be verified for each invocation.

#### Schema example
```
{
  "user_account_id": { "type": "string" , "length" : 50},
  "user_id": { "type": "string" , "length" : 50},
  "user_language": { "type": "string" , "length" : 2},
  "user_login_id": { "type": "string" , "length" : 100},
  "user_login_status": { "type": "string" , "value": "logged-in" },
  "*user_type": { "type": "string" , "value": "b2b" }
  //By adding * to key name in schema you are chanigng match type from 'exact' to 'contains'
}
```
#### Schema naming convention
###### For event schema's global variable, name needs to be the same as tealium_event value.

#### Nested schemas
######  In case you want to run very generic tests for a set of variables that occur in multiple events you can group them and nest them within event schemas. One example might be the 'user' category from 'Schema example'. Potentially this set of attributes should be part of all events after users has logged in. In such case, you can create userSchema.json and nest it in your event schema.

```
{
    "schemasList":["jobSchema","userSchema","ecommerceSchema","companySchema"],
    "eventSchema":{
        "ecommerce_action": {"value": "purchase" , "type": "string" },
        "event_action":  {"value": "ecommerce_purchase" , "type": "string" },
        "event_category":  {"value": "ecommerce" , "type": "string" },
        "event_funnel_name": {"value": "ecommerce" , "type": "string" },
        "event_funnel_step": {"value": 3 , "type": "number" },
        "event_name": {"value": "ecommerce_purchase" , "type": "string" },
        "event_source": {"value": "application" , "type": "string" }
        }
}
```
