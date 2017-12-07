

'use strict';

const Model       = require('../../plugin').igo.Model;

const StringUtils = require('../utils/StringUtils');

const Media       = require('./Media');


//
const schema = {
  table:    'pages',
  columns:  [
    'id',
    'author_id',
    'lang',
    'status',
    'title',
    'subtitle',
    'slug',
    'meta_title',
    'meta_description',
    'excerpt',
    'body',
    'category',
    'tags',
    'image_id',
    'menu_id',
    'menu_order',
    'published_at',
    'updated_at',
    'created_at'
  ],
  associations: [
    ['belongs_to', 'image', Media, 'image_id', 'id'],
  ]
};

class Page extends Model(schema) {

  beforeCreate(callback) {
    this.slug   = StringUtils.slugify(this.slug || this.title) || null;
    if (!this.published_at && this.status === 'published') {
      this.published_at = new Date();
    }
    callback();
  }
  // 
  // beforeUpdate(values, callback) {
  //   if (!this.slug) {
  //     values.slug = StringUtils.slugify(values.slug || values.title || this.title) || null;
  //   }
  //   if (!this.published_at && this.status === 'published') {
  //     values.published_at = new Date();
  //   }
  //   callback();
  // }

  get url() {
    return [this.slug, this.id].join('-');
  }

  get parts() {
    this._parts = this._parts || this.body.split('<hr>');
    return this._parts;
  }

}

module.exports = Page;
