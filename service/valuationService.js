// Libraries
const fetch = require("node-fetch");

// URL Util Constants
const FORMAT_JSON_STR = '?format=json';
const GET_MODELS_FOR_MAKE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/';

// Error Messages
const INVALID_AGE_STR = 'Invalid Age';
const INVALID_MAKE_MODEL_STR = 'Invalid Make/Model';
const INVALID_MILEAGE_STR = 'Invalid Mileage';

// Automobile Valuation Constants
const AGE_DEVALUATION_LIMIT = 10;
const AGE_DEVALUATION_PERCENT = .005;
const MILEAGE_DEVALUATION_LIMIT = 150000;
const MILEAGE_DEVALUATION_PERCENT = .002;
const MILEAGE_DEVALUATION_INTERVAL = 1000;
const OWNERS_DEVALUATION_LIMIT = 2;
const OWNERS_DEVALUATION_PERCENT = .75;
const COLLISION_DEVALUATION_LIMIT = 5;
const COLLISION_DEVALUATION_PERCENT = .02;
const NEW_CAR_VALUATION_PERCENT = 1.1;

/**
 * Method used to get the valuation of a car based on current age, make, model, mileage, and optionally
 * owners/collisions
 * Will only return valuation in the case that user has sent Make and Model of a real car, checked using
 * government automobile API
 * @returns {Promise<*>}
 */
async function getValuation(automobile) {
  return await verifyMakeAndModel(automobile)
    .then(async response => {
      if (response) {
        return await completeCalculation(automobile).toFixed(2);
      } else {
        throw new Error(INVALID_MAKE_MODEL_STR);
      }
    })
    .catch(error => {
      throw error;
    })
}

/**
 * Method used to verify that Make/Model of given automobile exists
 * @returns {Promise<boolean>}
 */
async function verifyMakeAndModel(automobile) {
  let response = await fetch(GET_MODELS_FOR_MAKE_URL + automobile.make + FORMAT_JSON_STR);
  let json = await response.json();
  let found = false;
  await json.Results.forEach(async model => {
    if (await model.Model_Name.toUpperCase() === automobile.model.toUpperCase()) {
      found = true;
    }
  });
  return found;
}

/**
 * Method used to do the full calculation of the automobile's valuation
 * @returns {number}
 */
function completeCalculation(automobile) {
  let adjustedValue = automobile.value;
  adjustedValue = calculateOwnershipDevaluation(automobile.owners, adjustedValue);
  let ageDevaluation = calculateAgeDevaluation(automobile.age, adjustedValue);
  let mileageDevaluation = calculateMileageDevaluation(automobile.mileage, adjustedValue);
  let collisionsDevaluation = calculateCollisionDevaluation(automobile.collisions, adjustedValue);
  adjustedValue = adjustedValue - (ageDevaluation + mileageDevaluation + collisionsDevaluation);
  adjustedValue = calculateNewCarValue(automobile.owners, adjustedValue);
  return adjustedValue;
}

/**
 * In the case that the car is new (has no former owners), add an additional 10% to the car's final actualized
 * value
 * @returns {number}
 */
function calculateNewCarValue(owners, adjustedValue) {
  return (!owners || owners === 0) ? adjustedValue * NEW_CAR_VALUATION_PERCENT : adjustedValue;
}

/**
 * Take half a percent of valuation off of the car for each year of the car's age, max: 10 years
 * @returns {number}
 */
function calculateAgeDevaluation(age, adjustedValue) {
  if (age < 0) {
    throw new Error(INVALID_MILEAGE_STR);
  } else if (age >= AGE_DEVALUATION_LIMIT) {
    return adjustedValue * (AGE_DEVALUATION_LIMIT * AGE_DEVALUATION_PERCENT);
  } else {
    return adjustedValue * (age * AGE_DEVALUATION_PERCENT);
  }
}

/**
 * Take a fifth of a percent of valuation off of the car for every 1000 miles on the car, max: 150000 miles
 * @returns {number}
 */
function calculateMileageDevaluation(mileage, adjustedValue) {
  if (mileage < 0) {
    throw new Error(INVALID_AGE_STR);
  } else if (mileage >= MILEAGE_DEVALUATION_LIMIT) {
    return adjustedValue * (MILEAGE_DEVALUATION_LIMIT / MILEAGE_DEVALUATION_INTERVAL * MILEAGE_DEVALUATION_PERCENT);
  } else {
    return adjustedValue * ((mileage / MILEAGE_DEVALUATION_INTERVAL) * MILEAGE_DEVALUATION_PERCENT);
  }
}

/**
 * Take a quarter of the valuation off of the car in the case that there have been more than 2
 * owners in the car's lifetime
 * @returns {number}
 */
function calculateOwnershipDevaluation(owners, adjustedValue) {
  return owners > OWNERS_DEVALUATION_LIMIT ? adjustedValue * OWNERS_DEVALUATION_PERCENT : adjustedValue;
}

/**
 * Take 2 percent off of the valuation of the car for every collision the car has had: max 5 collisions
 * @returns {number}
 */
function calculateCollisionDevaluation(collisions, adjustedValue) {
  if (collisions >= COLLISION_DEVALUATION_LIMIT) {
    return adjustedValue * (COLLISION_DEVALUATION_LIMIT * COLLISION_DEVALUATION_PERCENT);
  } else {
    return adjustedValue * (collisions * COLLISION_DEVALUATION_PERCENT);
  }
}

module.exports = {
  getValuation,
  verifyMakeAndModel,
  completeCalculation,
  calculateNewCarValue,
  calculateAgeDevaluation,
  calculateMileageDevaluation,
  calculateOwnershipDevaluation,
  calculateCollisionDevaluation
};
