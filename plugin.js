
'use strict';

//
class CmsIgoPlugin {

  constructor() {
    this.options = {
      adminpath:  '/admin'
    };
    this.dirname = __dirname;
  }

  get routes() {
    return {
      main:   require('./src/routes/main'),
      admin:  require('./src/routes/admin'),
    };
  }

  loadMenu(menu_id) {
    const CMS = require('./src/services/CMS');
    return function(req, res, next) {
      CMS.loadMenu(menu_id, function(err, menu) {
        res.locals['menu_' + menu_id] = menu;
        next();
      });
    };
  }

};

module.exports = new CmsIgoPlugin();
