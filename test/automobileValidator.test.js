
let assert = require('assert');

const AutomobileValidator = require("../validator/AutomobileValidator");

describe('Validate Required Numeric Param', function() {

  describe('Valid param', function () {
    it('should return true', function () {
      assert.equal(AutomobileValidator.validateRequiredNumericParam(200), true);
    });
  });

  describe('Invalid param', function () {
    it('should return false', function () {
      assert.equal(AutomobileValidator.validateRequiredNumericParam(-1), false);
    });
  });
});

describe('Validate Required String Param', function() {

  describe('Valid param', function () {
    it('should return true', function () {
      assert.equal(AutomobileValidator.validateRequiredStringParam("Valid"), true);
    });
  });

  describe('Invalid param', function () {
    it('should return false', function () {
      assert.equal(AutomobileValidator.validateRequiredStringParam(""), false);
    });
  });
});

describe('Validate Non Required Numeric Param', function() {

  describe('Undefined param', function () {
    it('should return true', function () {
      assert.equal(AutomobileValidator.validateNonRequiredNumericParam(undefined), true);
    });
  });

  describe('Valid param', function () {
    it('should return true', function () {
      assert.equal(AutomobileValidator.validateNonRequiredNumericParam(200), true);
    });
  });

  describe('Invalid param', function () {
    it('should return false', function () {
      assert.equal(AutomobileValidator.validateNonRequiredNumericParam(-1), false);
    });
  });
});

describe('Validate All Params', function() {

  describe('All valid', function () {
    it('should return true', function () {
      assert.equal(AutomobileValidator.validateAllParams(100, "Model", "Make", 2, 10000, 0, 0), true);
    });
  });

  describe('Any Not Valid', function () {
    it('should return false', function () {
      assert.equal(AutomobileValidator.validateAllParams(-2, "Model", "Make", 2, 10000, 0, 0), false);
    });
  });
});
