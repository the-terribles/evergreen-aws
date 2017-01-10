'use strict';

var chai = require('chai'),
    expect = chai.expect,
    AWS = require('aws-sdk-mock'),
    util = require('util'),
    errors = require('../lib/errors'),
    DirectiveContext = require('trbl-evergreen/lib/directive-context.js'),
    TestUtils = require('trbl-evergreen/test/utils.js'),
    AWSDirective = require('../lib/directive');

AWS.mock('CredentialProviderChain', 'resolve', function (callback){
  callback(null, {
    SharedIniFileCredentials: {
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE'
    }
  });
});

describe('AWS Branch Source Directive', function() {

  it('should return an error if the expression is invalid', function(next){
    var context = new DirectiveContext('aws', null, []),
        awsDirective = new AWSDirective();

    awsDirective.handle(context, {}, {}, TestUtils.wrapAsync(next, function(err){
      expect(err).to.be.an.instanceOf(errors.EvergreenAWSExpressionError);
    }));
  });

  it('should return the document for the specified query', function(next){

    var context = new DirectiveContext('aws', 'credentials', []),
        awsDirective = new AWSDirective();

    awsDirective.handle(context, {}, {}, TestUtils.wrapAsync(next, function(err, _context){
      expect(err).to.be.null;
      expect(_context.value).to.deep.eq({
        SharedIniFileCredentials: {
          accessKeyId: 'AKIAIOSFODNN7EXAMPLE'
        }
      });
    }));
  });

  describe('Integration', function(){

    it('should allow the module to be registered with Evergreen', function(next){

      var evergreenAWS = require('../index');

      require('trbl-evergreen')
        .addModule(evergreenAWS)
        .render({ stuff: '$aws:credentials' })
        .and()
        .then(TestUtils.wrapAsync(next, function(config){
            expect(config).to.deep.eq({
              stuff: {
                SharedIniFileCredentials: {
                  accessKeyId: 'AKIAIOSFODNN7EXAMPLE'
                }
              }
            });
          }),
          TestUtils.wrapAsync(next, function(err){
            expect.fail();
          }));
    });
  });
});
