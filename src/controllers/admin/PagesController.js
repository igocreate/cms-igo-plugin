

'use strict';

const _         = require('lodash');
const Page      = require('../../models/Page');

const plugin    = require('../../../plugin');
const igo       = plugin.igo;

//
module.exports.index = function(req, res) {
  Page.list(function(err, pages) {
    res.locals.pages = pages;
    res.render(plugin.dirname + '/views/admin/pages/index.dust');
  });
};

//
module.exports.new = function(req, res) {
  res.render(plugin.dirname + '/views/admin/pages/new.dust');
};

//
module.exports.create = function(req, res) {
  igo.Admin.AdminUtils.handleParams(Page, req.body);
  Page.create(req.body, function(err, page) {
    res.redirect(plugin.options.adminpath + '/cms/pages');
  });
};

//
module.exports.show = function(req, res) {
  Page.find(req.params.id, function(err, page) {
    res.locals.page = page;
    res.render(plugin.dirname + '/views/admin/pages/show.dust');
  });
};

//
module.exports.edit = function(req, res) {
  Page.find(req.params.id, function(err, page) {
    res.locals.page = page;
    res.render(plugin.dirname + '/views/admin/pages/edit.dust');
  });
};

//
module.exports.update = function(req, res) {
  igo.Admin.AdminUtils.handleParams(Page, req.body);
  Page.find(req.params.id, function(err, page) {
    page.update(req.body, function(err, page) {
      res.redirect(plugin.options.adminpath + '/cms/pages');
    });
  });
};
