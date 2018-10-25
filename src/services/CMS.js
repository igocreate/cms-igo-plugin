
'use strict';

const Page = require('../models/Page');

//
module.exports.loadMenu = function(menu_id, filter, callback) {
  Page.where(filter)
      .where({
        menu_id:  menu_id,
        status:   'published'
      })
      .order('`menu_order`')
      .list(callback);
};


//
module.exports.loadPage = function(filter, callback) {
  Page.where(filter)
      .where({ status: 'published'})
      .order('`updated_at` DESC')
      .first(callback);
};
