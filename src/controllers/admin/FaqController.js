
const _         = require('lodash');

const Faq           = require('../../models/Faq');
const FaqCategory   = require('../../models/FaqCategory');
const plugin        = require('../../../plugin');

const igo           = plugin.igo;

const StringUtils     = require('../../utils/StringUtils');
const ControllerUtils = require('./ControllerUtils');


//
module.exports.new = function(req, res) {
  FaqCategory.find(req.params.cat_id, (err, faq_category) => {
    res.locals.faq = res.locals.flash.faq;
    ControllerUtils.new(Faq, req, res, function() {
      res.render(plugin.dirname + '/views/admin/faq/new.dust', { faq_category });
    });
  });
};


//
module.exports.create = function(req, res) {

  req.body.parent_id  = req.params.cat_id;
  req.body.body       = [req.body.question, req.body.answer].join('<hr>');

  ControllerUtils.create(Faq, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('faq', req.body);
      return res.redirect(plugin.options.adminpath + '/cms/faq/' + req.params.cat_id + '/new');
    }
    res.redirect(plugin.options.adminpath + '/cms/faq/' + req.params.cat_id);
  });
};


//
module.exports.edit = function(req, res) {
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  Faq.includes(['faq_category', 'image'])
      .where({ parent_id: req.params.cat_id })
      .find(req.params.id, (err, faq) => {
    if (!faq) {
      return res.redirect(plugin.options.adminpath + '/cms/faq/' + req.params.id);
    }

    res.locals.page = res.locals.flash.page || faq;
    const filter  = _.pick(res.locals.cmsfilter, ['site', 'lang'])
    filter.status = 'published';
    ControllerUtils.showTree(Faq, filter, function(err, pages) {
      ControllerUtils.getObjectTypes(function(err, objectTypes) {
        res.locals.objectTypes  = objectTypes;
        res.locals.pageTypes    = plugin.options.pageTypes;
        res.render(plugin.dirname + '/views/admin/faq/edit.dust', { pages });
      });
    });
  });
};

//
module.exports.update = function(req, res) {

  req.body.parent_id  = req.params.cat_id;
  req.body.body       = [req.body.question, req.body.answer].join('<hr>');

  ControllerUtils.update(Faq, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('faq', req.body);
    }
    res.redirect(plugin.options.adminpath + '/cms/faq/' + req.params.cat_id);
  });
};

//
module.exports.trash = function(req, res, next) {
  Faq.find(req.params.id, function(err, faq) {
    faq.update({ status: 'trashed' }, function() {
      req.flash('success', 'Question supprimée');
      return res.redirect(plugin.options.adminpath + '/cms/faq/' + req.params.cat_id);
    });
  });
};
