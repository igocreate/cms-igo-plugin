

const _         = require('lodash');

const Page        = require('../models/Page');
const CMS         = require('../services/CMS');
const { options } = require('../../plugin');

//
module.exports.loadMenu = (menu_id) => {
  return (req, res, next) => {
    const filter = {
      lang: res.locals.lang,
      site: res.locals.site
    }
    CMS.loadMenu(menu_id, filter, (err, menu) => {
      _.each(menu, function(page) {
        page.active = req.path.endsWith(page.url);
      });
      res.locals['menu_' + menu_id] = menu;
      next();
    });
  };
};


//
module.exports.page = function(req, res, next) {

  CMS.loadPage({
    slug: req.params.slug,
    lang: res.locals.lang,
    site: res.locals.site,
  }, (err, page) => {
    if (!page) {
      return next();
    }
    res.render(options.templates.cms_show, { page });
  });

};
