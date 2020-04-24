
const Post = require('../models/Post');

//
module.exports.categories= (filter, callback) => {
  Post.unscoped()
      .select('count(1) as `c`, `category`, `category_slug`')
      .where(filter)
      .where({ status: 'published'})
      .group([ 'category', 'category_slug'])
      .order('category')
      .list(callback);
};

//
module.exports.posts = (filter, callback) => {
  Post.where(filter)
      .where({ status: 'published'})
      .order('`published_at` DESC')
      .list(callback);
}

//
module.exports.latestPosts = (n, filter, callback) => {
  Post.where(filter)
      .where({ status: 'published'})
      .order('`published_at` DESC')
      .limit(n)
      .list(callback);
}

//
module.exports.post = (filter, callback) => {
  Post.where(filter)
      .where({ status: 'published'})
      .first(callback);
};
