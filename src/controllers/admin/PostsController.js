

'use strict';

const _         = require('lodash');
const Post      = require('../../models/Post');

const plugin    = require('../../../plugin');
const igo       = plugin.igo;

const StringUtils     = require('../../utils/StringUtils');
const ControllerUtils = require('./ControllerUtils');

//
module.exports.index = function(req, res) {

  ControllerUtils.index(Post, req, res, function(err, pages) {

    // if (req.query.status === 'published') {
    //   Page.showTree(cmsfilter, function(err, pages) {
    //     res.locals.pages = pages;
    //     res.render(plugin.dirname + '/views/admin/pages/index.dust');
    //   });
    //   return;
    // }

    res.render(plugin.dirname + '/views/admin/posts/index.dust');
  });
};

//
module.exports.new = function(req, res) {
  ControllerUtils.new(Post, req, res);
  res.render(plugin.dirname + '/views/admin/posts/new.dust');
};

//
module.exports.create = function(req, res) {
  ControllerUtils.create(Post, req, res, function(err, page) {
    res.redirect(plugin.options.adminpath + '/cms/posts/' + page.id + '/edit');
  });
};

//
module.exports.edit = function(req, res) {
  Post.find(req.params.id, function(err, page) {
    if (!page) {
      return res.redirect(plugin.options.adminpath + '/cms/posts');
    }
    res.locals.page = page;
    res.render(plugin.dirname + '/views/admin/posts/edit.dust');
  });
};

//
module.exports.update = function(req, res) {
  ControllerUtils.update(Post, req, res, function(err, page) {
    res.redirect(plugin.options.adminpath + '/cms/posts/' + page.id + '/edit');
  });
};

//
module.exports.trash = function(req, res, next) {
  Post.find(req.params.id, function(err, post) {
    post.update({ status: 'trashed' }, function() {
      req.flash('success', 'Post supprimé');
      return res.redirect(plugin.options.adminpath + '/cms/posts')
    });
  });
};
