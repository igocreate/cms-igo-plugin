

'use strict';

const _         = require('lodash');
const Page      = require('../../models/Page');

const plugin    = require('../../../plugin');
const igo       = plugin.igo;

//
module.exports.index = function(req, res) {
  req.query.status  = req.query.status || 'published';
  res.locals.status = req.query.status;

  if (req.query.status === 'published') {
    Page.showTree(function(err, pages) {
      res.locals.pages = pages;
      res.render(plugin.dirname + '/views/admin/pages/index.dust');
    });
    return;
  }
  
  Page.where({ status: req.query.status })
      .order('`updated_at` DESC')
      .list(function(err, pages) {
    res.locals.pages = pages;
    res.render(plugin.dirname + '/views/admin/pages/index.dust');
  });
};

//
module.exports.new = function(req, res) {
  Page.showTree(function(err, pages) {
    res.locals.pages = pages;
    res.render(plugin.dirname + '/views/admin/pages/new.dust');
  });
};

//
module.exports.create = function(req, res) {
  [ 'image_id', 'menu_id', 'parent_id',
    'menu_order', 'category'
  ].forEach(function(attr) {
    req.body[attr] = req.body[attr] || null;
  });
  Page.find(req.params.parent_id, function(err, parent) {
    req.body.level = parent ? parent.level + 1 : 0;
    Page.create(req.body, function(err, page) {
      res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
    });
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
    Page.showTree(function(err, pages) {
      _.remove(pages, { id: page.id });
      res.locals.pages = pages;
      res.render(plugin.dirname + '/views/admin/pages/edit.dust');
    });
  });
};

//
module.exports.update = function(req, res) {
  [ 'image_id', 'menu_id', 'parent_id',
    'menu_order', 'category'
  ].forEach(function(attr) {
    req.body[attr] = req.body[attr] || null;
  });
  Page.find(req.params.id, function(err, page) {
    req.body.slug = req.body.slug || StringUtils.slugify(req.body.slug || req.body.title);
    if (!page.published_at && req.body.status === 'published') {
      req.body.published_at = new Date();
    }
    Page.find(req.body.parent_id, function(err, parent) {
      req.body.level = parent ? parent.level + 1 : 0;
      page.update(req.body, function(err, page) {
        console.dir(page);
        res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
      });
    });
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
