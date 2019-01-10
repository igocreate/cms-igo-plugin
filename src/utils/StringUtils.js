
const _     = require('lodash');


//
module.exports.slugify = function(s) {
  return _.chain(s).kebabCase().value();
};
