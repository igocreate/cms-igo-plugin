

const _         = require('lodash');

const Page        = require('../models/Page');
const FaqCategory = require('../models/FaqCategory');
const CMS         = require('../services/CMS');
const { options } = require('../../plugin');
const FilterUtils = require('../utils/FilterUtils');

//
module.exports.loadMenu = (menu_id) => {
  return (req, res, next) => {
    const filter = {
      lang: res.locals.lang,
      site: res.locals.site
    }
    CMS.loadMenu(menu_id, filter, (err, menu) => {
      _.each(menu, function(page) {
        page.active = req.path.endsWith(page.slug);
      });
      res.locals['menu_' + menu_id] = menu;
      next();
    });
  };
};


//
module.exports.page = function(req, res, next) {

  CMS.loadPage(FilterUtils.loadPageFilter(req, res), (err, page) => {
    if (!page) {
      return next();
    }
    res.render(`${options.templates.dir}/${page.page_type}.dust`, { page });
  });

};

//
module.exports.faqIndex = function(req, res, next) {

  CMS.loadPage({
    slug: 'faq',
    lang: res.locals.lang,
    site: res.locals.site,
  }, (err, page) => {

    FaqCategory.where({
      lang:   res.locals.lang,
      site:   res.locals.site,
      status: 'published'
    }).list((err, faq_categories) => {
      res.render(options.templates.faq_index, { page, faq_categories });
    });
  });

};

//
module.exports.faq = function(req, res, next) {

  FaqCategory.includes('faqs').where({
    slug:   req.params.slug,
    lang:   res.locals.lang,
    site:   res.locals.site,
    status: 'published'
  }).first((err, faq_category) => {
    res.render(options.templates.faq_index, { faq_category, page: faq_category });
  });

};
