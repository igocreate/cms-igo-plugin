
'use strict';

const Post = require('../models/Post');

//
module.exports.categories= function(callback) {
  Post.unscoped()
      .distinct('category')
      .order('category')
      .list(callback);
};

//
module.exports.posts = function(filter, callback) {
  Post.where(filter)
      .where({ status: 'published'})
      .order('`updated_at` DESC')
      .list(callback);
}

//
module.exports.post = function(filter, callback) {
  Post.where(filter)
      .where({ status: 'published'})
      .order('`updated_at` DESC')
      .first(callback);
};
