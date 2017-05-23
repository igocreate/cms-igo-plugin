
'use strict';

const Page = require('../models/Page');

//
module.exports.loadMenu = function(menu_id, callback) {
  Page
    .where({ menu_id: menu_id })
    .order('`menu_order`')
    .list(callback);
};
