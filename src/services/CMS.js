
const Page = require('../models/Page');

//
module.exports.loadMenu = function(menu_id, filter, callback) {
  Page.where(filter)
      .where({
        menu_id,
        status:   'published'
      })
      .order('`menu_order`')
      .list(callback);
};


//
module.exports.loadPage = function(filter, callback) {
  Page.includes(['image', {parent: {parent: 'parent'}}, {children: {children: 'children'}}])
      .where(filter)
      .where({ status: 'published'})
      .order('`published_at` DESC')
      .first(callback);
};

//
module.exports.loadPages = function(filter, options, callback) {
  if (!callback) {
    callback  = options;
    options   = {};
  }
  const query = Page.includes(['image'])
                    .where(filter)
                    .where({ status: 'published'})
                    .order('`published_at` DESC');
  if (options.limit) {
    query.limit(options.limit);
  }
  query.list(callback);
};
