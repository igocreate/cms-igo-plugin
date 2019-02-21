
const _         = require('lodash');

const Page      = require('../../models/Page');
const plugin    = require('../../../plugin');
const igo       = plugin.igo;

const StringUtils     = require('../../utils/StringUtils');
const ControllerUtils = require('./ControllerUtils');

//
module.exports.index = function(req, res) {
  ControllerUtils.index(Page, req, res, function(err, pages) {
    res.render(plugin.dirname + '/views/admin/pages/index.dust', { pages });
  });
};

//
module.exports.new = function(req, res) {
  ControllerUtils.new(Page, req, res, function() {
    Page.showTree(res.locals.cmsfilter, function(err, pages) {
      res.render(plugin.dirname + '/views/admin/pages/new.dust', { pages });
    });
  });
};

//
module.exports.create = function(req, res) {
  ControllerUtils.create(Page, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('page', req.body);
      return res.redirect(plugin.options.adminpath + '/cms/pages/new');
    }
    res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
  });
};

//
module.exports.edit = function(req, res) {
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  Page.includes('image').find(req.params.id, function(err, page) {
    if (!page) {
      return res.redirect(plugin.options.adminpath + '/cms/pages');
    }
    res.locals.page = res.locals.flash.page || page;
    Page.showTree(cmsfilter, function(err, pages) {
      _.remove(pages, { id: page.id });
      res.render(plugin.dirname + '/views/admin/pages/edit.dust', { pages });
    });
  });
};

//
module.exports.update = function(req, res) {
  ControllerUtils.update(Page, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('page', req.body);
    }
    res.redirect(plugin.options.adminpath + '/cms/pages/' + req.body.id + '/edit');
  });
};

//
module.exports.trash = function(req, res, next) {
  Page.find(req.params.id, function(err, page) {
    page.update({ status: 'trashed' }, function() {
      req.flash('success', 'Page supprimée');
      return res.redirect(plugin.options.adminpath + '/cms/pages')
    });
  });
};
