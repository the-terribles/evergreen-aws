'use strict';

var util = require('util');

/**
 * Really shitty way to call "super" on an error.
 * @param name {String} Name of the Error.
 * @param message {String} Message passed to Error.
 */
var superError = function(name, message){
  var error = Error.call(this, message);
  this.name = name;
  this.message = error.message;
  this.stack = error.stack;
};

/**
 * Should be thrown if the supplied expression is invalid
 * @param expression {String} Expression
 * @constructor
 */
function EvergreenAWSExpressionError(expression){
  superError.call(
    this,
    'EvergreenAWSExpressionError',
    util.format(
      'The supplied expression is invalid: %s', expression)
  );

  this.expression = expression;
}

util.inherits(EvergreenAWSExpressionError, Error);

exports.EvergreenAWSExpressionError = EvergreenAWSExpressionError;
