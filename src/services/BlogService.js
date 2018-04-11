
'use strict';

const Post = require('../models/Post');

//
module.exports.categories= function(callback) {
  Post.unscoped()
      .distinct([ 'category', 'category_slug'])
      .order('category')
      .list(callback);
};

//
module.exports.posts = function(filter, callback) {
  Post.includes('image')
      .where(filter)
      .where({ status: 'published'})
      .order('`published_at` DESC')
      .list(callback);
}

//
module.exports.latestPosts = function(n, filter, callback) {
  Post.includes('image')
      .where(filter)
      .where({ status: 'published'})
      .order('`published_at` DESC')
      .limit(n)
      .list(callback);
}

//
module.exports.post = function(filter, callback) {
  Post.includes('image')
      .where(filter)
      .where({ status: 'published'})
      .first(callback);
};
