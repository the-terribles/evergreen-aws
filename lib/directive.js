'use strict';

var AWS = require('aws-sdk'),
   errors = require('./errors'),
   EvergreenAWSExpressionError = errors.EvergreenAWSExpressionError;

function AWSDirective(){
}

AWSDirective.prototype.strategy = 'aws';

AWSDirective.parseExpression = function(expression){
  var awsItem;

  try {
    awsItem = (expression.indexOf('/') > -1) ? expression.slice(0, expression.indexOf('/')) : expression;
  }
  catch (e){
    throw new EvergreenAWSExpressionError(expression);
  }
  return { awsItem: awsItem };
};

AWSDirective.prototype.credentials = function(context, callback){
  return new AWS.CredentialProviderChain().resolve(function(err, credentials){
    if (err){
      return callback(err);
    }

    return callback(null, context.resolve(credentials));
  })
}

AWSDirective.prototype.handle = function(context, _tree, _metadata, callback){
  var parsed = null;

  try {
    parsed = AWSDirective.parseExpression(context.expression);
  }
  catch (e){
    return callback(e);
  }

  return this[parsed.awsItem](context, callback);
};

module.exports = AWSDirective;
