# auto-valuation
automobile valuation tool

# endpoints

/value: 

  method: POST
  
  required parameters: 
    value:      num,
    make:       str,
    model:      str,
    age:        num,
    mileage:    num,
  
  non-required parameters:
    collisions: num,
    owners:     num

  expected response:
  
    Success
      status code: 200
      response:    { "valuation": ~valuation~ }
    
  error cases:
    
    Invalid Make/Model
      status code: 400
      response:    { "errorMessage": "Invalid Make/Model" }
      
    Invalid Parameter
      status code: 400
      response:    { "errorMessage": "Error: Invalid Parameters" }
      
      
