'use strict';

var AWSDirective = require('./lib/directive');

/**
 * Evergreen Module Declaration syntax
 * @type {{directives: Array}}
 */
module.exports = {
  directives: [ new AWSDirective() ]
};
