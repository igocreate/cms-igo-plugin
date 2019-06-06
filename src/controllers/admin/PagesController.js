
const _         = require('lodash');

const Page      = require('../../models/Page');
const plugin    = require('../../../plugin');

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
    const filter  = _.pick(res.locals.cmsfilter, ['site', 'lang'])
    filter.status = 'published';
    ControllerUtils.showTree(Page, filter, function(err, pages) {
      ControllerUtils.getObjectTypes(function(err, objectTypes) {
        res.locals.objectTypes = objectTypes;
        res.locals.pageTypes   = plugin.options.pageTypes;
        res.render(plugin.dirname + '/views/admin/pages/new.dust', { pages });
      });
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
    res.redirect(plugin.options.adminpath + '/cms/pages');
  });
};

//
module.exports.edit = function(req, res) {
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  Page.includes(['children', 'image']).find(req.params.id, function(err, page) {
    if (!page) {
      return res.redirect(plugin.options.adminpath + '/cms/pages');
    }
    res.locals.page = res.locals.flash.page || page;
    const filter  = _.pick(res.locals.cmsfilter, ['site', 'lang'])
    filter.status = 'published';
    ControllerUtils.showTree(Page, filter, function(err, pages) {
      ControllerUtils.getObjectTypes(function(err, objectTypes) {
        res.locals.objectTypes  = objectTypes;
        res.locals.pageTypes    = plugin.options.pageTypes;
        res.render(plugin.dirname + '/views/admin/pages/edit.dust', { pages });
      });
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
    res.redirect(plugin.options.adminpath + '/cms/pages');
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
