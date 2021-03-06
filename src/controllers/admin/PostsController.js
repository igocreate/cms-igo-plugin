
const _         = require('lodash');

const Post      = require('../../models/Post');
const plugin    = require('../../../plugin');

const igo       = plugin.igo;

const StringUtils     = require('../../utils/StringUtils');
const ControllerUtils = require('./ControllerUtils');

//
module.exports.index = function(req, res) {

  ControllerUtils.index(Post, req, res, function(err, pages) {
    res.render(plugin.dirname + '/views/admin/posts/index.dust', { pages });
  });
};

//
module.exports.new = function(req, res) {
  res.locals.post = res.locals.flash.post;
  ControllerUtils.new(Post, req, res, function() {
    res.render(plugin.dirname + '/views/admin/posts/new.dust');
  });
};

//
module.exports.create = function(req, res) {
  ControllerUtils.create(Post, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('post', req.body);
      return res.redirect(plugin.options.adminpath + '/cms/posts/new');
    }
    res.redirect(plugin.options.adminpath + '/cms/posts');
  });
};

//
module.exports.edit = function(req, res) {
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  Post.includes('children').find(req.params.id, function(err, post) {
    if (!post) {
      return res.redirect(plugin.options.adminpath + '/cms/posts');
    }
    res.locals.page = res.locals.flash.page || post;
    const filter  = _.pick(res.locals.cmsfilter, ['site', 'lang'])
    filter.status = 'published';
    ControllerUtils.showTree(Post, filter, function(err, pages) {
      ControllerUtils.getObjectTypes(function(err, objectTypes) {
        res.locals.objectTypes  = objectTypes;
        res.locals.pageTypes    = plugin.options.pageTypes;
        res.render(plugin.dirname + '/views/admin/posts/edit.dust', { pages });
      });
    });
  });
};

//
module.exports.update = function(req, res) {
  ControllerUtils.update(Post, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('post', req.body);
    }
    res.redirect(plugin.options.adminpath + '/cms/posts');
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
