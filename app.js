// Libraries
const express = require("express");
const bodyParser = require("body-parser");

// Classes
const Automobile = require("./model/Automobile");
const AutomobileValidator = require("./validator/AutomobileValidator");
const getValuation = require("./service/valuationService").getValuation;

// Constants
const INVALID_PARAMS_STR = 'Error: Invalid Parameters';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Method: POST
 * Endpoint: /value
 *
 * Required Parameters:
 *  value:      num
 *  make:       str
 *  model:      str
 *  age:        num
 *  mileage:    num
 * Non-Required Parameters:
 *  owners:     num
 *  collisions: num
 *
 * Usage: Calculate the valuation of a car, based on given parameters
 */
app.post("/value", (req, res) => {

  // Break down request body into expected parameters
  let { value, make, model, age, mileage, owners, collisions } = req.body;

  // Validate parameters prior to building Automobile and calculating valuation
  if (AutomobileValidator.validateAllParams(value, model, make, age, mileage, owners, collisions)) {
    let auto = new Automobile(value, make, model, age, mileage, owners, collisions);
    getValuation(auto).then(data => {
      // return JSON containing valuation on successful request, with status code 200
      res.status(200).send({
        valuation: data
      })
    }).catch(error => {
      // catch and return necessary error code, with status code 400
      res.status(400).send({
        errorMessage: error.message
      })
    });
  } else {
    // catch and return Invalid Parameters error, with status code 400
    res.status(400).send({
      errorMessage: INVALID_PARAMS_STR
    });
  }
});

// Start up application
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
