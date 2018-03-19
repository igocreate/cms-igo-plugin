

'use strict';

const _         = require('lodash');
const Page      = require('../../models/Page');

const plugin    = require('../../../plugin');
const igo       = plugin.igo;
const StringUtils     = require('../../utils/StringUtils');
const ControllerUtils = require('./ControllerUtils');

//
module.exports.index = function(req, res) {

  ControllerUtils.index(Page, req, res, function(err, pages) {
    res.locals.pages = pages;
    res.render(plugin.dirname + '/views/admin/pages/index.dust');
  });
};

//
module.exports.new = function(req, res) {
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);
  ControllerUtils.new(Page, req, res);
  Page.showTree(cmsfilter, function(err, pages) {
    res.locals.pages = pages;
    res.render(plugin.dirname + '/views/admin/pages/new.dust');
  });
};

//
module.exports.create = function(req, res) {
  ControllerUtils.create(Page, req, res, function(err, page) {
    res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
  });
};

//
module.exports.edit = function(req, res) {
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  res.locals.langs = plugin.options.langs;
  res.locals.sites = plugin.options.sites;
  
  Page.find(req.params.id, function(err, page) {
    if (!page) {
      return res.redirect(plugin.options.adminpath + '/cms/pages');
    }
    res.locals.page = page;
    Page.showTree(cmsfilter, function(err, pages) {
      _.remove(pages, { id: page.id });
      res.locals.pages = pages;
      res.render(plugin.dirname + '/views/admin/pages/edit.dust');
    });
  });
};

//
module.exports.update = function(req, res) {
  ControllerUtils.update(Page, req, res, function(err, page) {
    res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
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
