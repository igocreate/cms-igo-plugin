

'use strict';

const _         = require('lodash');

const plugin    = require('../../../plugin');


//
module.exports.filter = function(req, res, next) {
  res.locals.options = plugin.options;
  res.locals.dirname = plugin.dirname;
  next();
};

//
module.exports.index = function(req, res) {
  res.render(plugin.dirname + '/views/admin/index.dust');
};
