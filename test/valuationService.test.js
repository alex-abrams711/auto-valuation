
let assert = require('assert');

const Automobile = require("../model/Automobile");
const calculateCollisionDevaluation = require("../service/valuationService").calculateCollisionDevaluation;
const calculateAgeDevaluation = require("../service/valuationService").calculateAgeDevaluation;
const calculateMileageDevaluation = require("../service/valuationService").calculateMileageDevaluation;
const calculateNewCarValue = require("../service/valuationService").calculateNewCarValue;
const calculateOwnershipDevaluation = require("../service/valuationService").calculateOwnershipDevaluation;
const completeCalculation = require("../service/valuationService").completeCalculation;
const getValuation = require("../service/valuationService").getValuation;
const verifyMakeAndModel = require("../service/valuationService").verifyMakeAndModel;

describe('Collision Devaluation', function() {

  describe('No Collisions', function() {
    it('should return 0', function() {
      assert.equal(calculateCollisionDevaluation(0, 1000), 0);
    });
  });

  describe('More than 5 collisions', function() {
    it('should return 100', function() {
      assert.equal(calculateCollisionDevaluation(10, 1000), 100);
    });
  });

  describe('Between 0 and 5 collisions', function() {
    it('should return collisions * .02 * value', function() {
      assert.equal(calculateCollisionDevaluation(2, 1000), 40);
    });
  });
});

describe('Age Devaluation', function() {

  describe('No Age', function() {
    it('should return 0', function() {
      assert.equal(calculateAgeDevaluation(0, 1000), 0);
    });
  });

  describe('More than 10 years', function() {
    it('should return value * .05', function() {
      assert.equal(calculateAgeDevaluation(15, 1000), 50);
    });
  });

  describe('Between 0 and 10 years', function() {
    it('should return years * .005 * value', function() {
      assert.equal(calculateAgeDevaluation(2, 1000), 10);
    });
  });
});

describe('Mileage Devaluation', function() {

  describe('No Mileage', function() {
    it('should return 0', function() {
      assert.equal(calculateMileageDevaluation(0, 1000), 0);
    });
  });

  describe('More than 150000 miles', function() {
    it('should return value * .3', function() {
      assert.equal(calculateMileageDevaluation(200000, 1000), .3 * 1000);
    });
  });

  describe('Between 0 and 150000 miles', function() {
    it('should return miles/1000 * .002 * value', function() {
      assert.equal(calculateMileageDevaluation(20000, 1000), 20 * .002 * 1000);
    });
  });
});

describe('New Car Valuation', function() {

  describe('No past Owners', function() {
    it('should return value * 1.1', function() {
      assert.equal(calculateNewCarValue(0, 1000), 1100);
    });
  });

  describe('At least one owner', function() {
    it('should return original value', function() {
      assert.equal(calculateNewCarValue(2, 1000), 1000);
    });
  });
});

describe('Car Ownership Devaluation', function() {

  describe('More than 2 past Owners', function() {
    it('should return value * .75', function() {
      assert.equal(calculateOwnershipDevaluation(3, 1000), 750);
    });
  });

  describe('2 or fewer Owners', function() {
    it('should return given value', function() {
      assert.equal(calculateOwnershipDevaluation(2, 1000), 1000);
    });
  });
});

describe('Complete Valuation', function() {

  let automobile = new Automobile(30000, "Audi", "A4", 2, 32000, 1, 0);

  describe('Complete full Valuation', function() {
    it('should return 27780', function() {
      assert.equal(completeCalculation(automobile), 27780);
    });
  });
});

describe('Get Valuation', function() {

  let automobile = new Automobile(30000, "Audi", "A4", 2, 32000, 1, 0);

  describe('Get Valuation Call', function() {
    it('should return value 27780', async function () {
      assert.equal(await getValuation(automobile), 27780);
    });
  });
});

describe('Verify Make And Model', function() {

  let automobile = new Automobile(30000, "Audi", "A4", 2, 32000, 1, 0);

  describe('Verify Make and Model exists', function() {
    it('should return true', async function () {
      assert.equal(await verifyMakeAndModel(automobile), true);
    });
  });
});

describe('Verify Invalid Make And Model', function() {

  let automobile = new Automobile(30000, "Audi", "Car Does Not Exist", 2, 32000, 1, 0);

  describe('Verify Make and Model not exists', function() {
    it('should return true', async function () {
      assert.equal(await verifyMakeAndModel(automobile), false);
    });
  });
});

