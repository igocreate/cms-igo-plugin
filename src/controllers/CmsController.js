

const _         = require('lodash');

const Page      = require('../models/Page');
const plugin    = require('../../plugin');

//
module.exports.show = function(req, res, next) {

  res.locals.initmap = true;

  const id = _.chain(req.params.page).split('-').last().value();
  Page.find(id, function(err, page) {
    if (!page) {
      return next();
    }
    if (page.url !== req.params.page) {
      //const url = req.url.replace(req.params.page, page.url);
      return res.redirect(page.url);
    }
    res.locals.page = page;
    res.render(plugin.options.templates.cms_show);
  });

};
