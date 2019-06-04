
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
  Page.includes([{parent: {parent: 'parent'}}, {children: {children: 'children'}}])
      .where(filter)
      .where({ status: 'published'})
      .order('`published_at` DESC')
      .first(callback);
};
