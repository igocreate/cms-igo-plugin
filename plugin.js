
'use strict';

const _       = require('lodash');


const plugin = {
  options: {
    adminpath:  '/admin',
    templates: {
      cms_show: __dirname + '/views/pages/show.dust'
    }
  },
  dirname: __dirname
};

// init
plugin.init = function(igo) {
  plugin.igo = igo;
  plugin.routes = {
    main:   require('./src/routes/main'),
    medias: require('./src/routes/medias'),
    admin:  require('./src/routes/admin'),
  };
};

//
plugin.configure = function(options) {
  _.merge(plugin.options, options);
};

//
plugin.loadMenu = function(menu_id) {
  const CMS = require('./src/services/CMS');
  return function(req, res, next) {
    CMS.loadMenu(menu_id, function(err, menu) {
      _.each(menu, function(page) {
        page.active = req.path.endsWith(page.url);
      });
      res.locals['menu_' + menu_id] = menu;
      next();
    });
  };
};

//
plugin.loadPage = function(filter, callback) {
  const CMS = require('./src/services/CMS');
  CMS.loadPage(filter, callback);
};

module.exports = plugin;
