
const _         = require('lodash');
const plugin    = require('../../../plugin');

//
module.exports.filter = function(req, res, next) {
  res.locals.options = plugin.options;
  res.locals.dirname = plugin.dirname;
  if (plugin.options.menu) {
    _.set(res.locals, plugin.options.menu, {[req.query.page_type]: true});
  }
  next();
};

//
module.exports.index = function(req, res) {
  res.render(plugin.dirname + '/views/admin/index.dust');
};
