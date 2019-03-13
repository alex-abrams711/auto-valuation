/**
 * Utility class for validating the creation of an Automobile Object
 */
class AutomobileValidator {

  /**
   * Validate that a required, numeric parameter is non-negative
   * @param param
   * @returns {boolean}
   */
  static validateRequiredNumericParam(param) {
    return (param >= 0);
  }

  /**
   * Validate that non-required, numeric parameter is non-negative, in the case that it is included
   * @param param
   * @returns {boolean}
   */
  static validateNonRequiredNumericParam(param) {
    return param ? param >= 0 : true;
  }

  /**
   * Validate that required String parameters are included and are not empty
   * @param param
   * @returns {*|boolean}
   */
  static validateRequiredStringParam(param) {
    return param && param.length > 0;
  }

  /**
   * Full validation method for all necessary Automobile validations
   * @param value
   * @param model
   * @param make
   * @param age
   * @param mileage
   * @param owners
   * @param collisions
   * @returns {boolean|(*|boolean)}
   */
  static validateAllParams(value, model, make, age, mileage, owners, collisions) {
    return AutomobileValidator.validateRequiredNumericParam(value) &&
    AutomobileValidator.validateRequiredStringParam(make) &&
    AutomobileValidator.validateRequiredStringParam(model) &&
    AutomobileValidator.validateRequiredNumericParam(age) &&
    AutomobileValidator.validateRequiredNumericParam(mileage) &&
    AutomobileValidator.validateNonRequiredNumericParam(owners) &&
    AutomobileValidator.validateNonRequiredNumericParam(collisions);
  }
}

module.exports = AutomobileValidator;
