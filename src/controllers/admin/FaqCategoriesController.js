
const _         = require('lodash');

const Faq           = require('../../models/Faq');
const FaqCategory   = require('../../models/FaqCategory');
const plugin        = require('../../../plugin');

const StringUtils     = require('../../utils/StringUtils');
const ControllerUtils = require('./ControllerUtils');

module.exports.faq = (req, res, next) => {
  if (plugin.options.menu) {
    _.set(res.locals, plugin.options.menu, { faq: true });
  }
  next();
};

//
module.exports.index = function(req, res) {
  ControllerUtils.index(FaqCategory.includes('faqs'), req, res, function(err, pages) {
    res.render(plugin.dirname + '/views/admin/faq_categories/index.dust', { pages });
  });
};


//
module.exports.show = function(req, res) {

  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  FaqCategory.find(req.params.id, (err, faq_category) => {
    // children have different subclass - load manually
    Faq.where({ parent_id: faq_category.id, status: cmsfilter.status }).list((err, children) => {
      faq_category.children = children;
      res.render(plugin.dirname + '/views/admin/faq_categories/show.dust', { faq_category });
    });
  });
};


//
module.exports.new = function(req, res) {
  res.locals.faq = res.locals.flash.faq;
  ControllerUtils.new(FaqCategory, req, res, function() {
    res.render(plugin.dirname + '/views/admin/faq_categories/new.dust');
  });
};

//
module.exports.create = function(req, res) {
  ControllerUtils.create(FaqCategory, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('faq', req.body);
      return res.redirect(plugin.options.adminpath + '/cms/faq_categories/new');
    }
    res.redirect(plugin.options.adminpath + '/cms/faq');
  });
};

//
module.exports.edit = function(req, res) {
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  FaqCategory.includes(['children', 'image']).find(req.params.id, function(err, faq_category) {
    if (!faq_category) {
      return res.redirect(plugin.options.adminpath + '/cms/faq');
    }
    res.locals.page = res.locals.flash.page || faq_category;
    const filter  = _.pick(res.locals.cmsfilter, ['site', 'lang'])
    filter.status = 'published';
    ControllerUtils.showTree(FaqCategory, filter, function(err, pages) {
      ControllerUtils.getObjectTypes(function(err, objectTypes) {
        res.locals.objectTypes  = objectTypes;
        res.locals.pageTypes    = plugin.options.pageTypes;
        res.render(plugin.dirname + '/views/admin/faq_categories/edit.dust', { pages });
      });
    });
  });
};

//
module.exports.update = function(req, res) {
  ControllerUtils.update(FaqCategory, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('faq', req.body);
    }
    res.redirect(plugin.options.adminpath + '/cms/faq');
  });
};

//
module.exports.trash = function(req, res, next) {
  FaqCategory.find(req.params.id, function(err, faq) {
    faq.update({ status: 'trashed' }, function() {
      req.flash('success', 'Catégorie FAQ supprimée');
      return res.redirect(plugin.options.adminpath + '/cms/faq')
    });
  });
};
