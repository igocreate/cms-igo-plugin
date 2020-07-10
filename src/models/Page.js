const _           = require('lodash');

const plugin      = require('../../plugin');
const Model       = plugin.igo.Model;
const StringUtils = require('../utils/StringUtils');
const Media       = require('./Media');


//
const schema = {
  table:    'cms_pages',
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
    'category_slug',
    'tags',
    'image_id',
    'banner_id',
    'menu_id',
    'menu_order',
    'parent_id',
    'level',
    'site',
    'type',
    'page_type',
    'object_type',
    'object_id',
    'published_at',
    'updated_at',
    'created_at'
  ],
  associations: () => [
    [ 'belongs_to', 'image',    Media,  'image_id', 'id' ],
    [ 'belongs_to', 'banner',   Media,  'banner_id', 'id' ],
    [ 'belongs_to', 'parent',   Page,   'parent_id', 'id' ],
    [ 'has_many',   'children', Page,   'id',       'parent_id', { status: 'published' }],
    [ 'has_many',   'faqs',         require('./Faq'),   'id', 'parent_id', { status: 'published' }],
    [ 'belongs_to', 'faq_category', require('./FaqCategory'), 'parent_id',  'id' ],
  ],
  scopes: {
    default: (query) => query.includes(['image', 'banner']).order('`menu_order`, `title`')
  },
  subclasses: function() {
    return {
      page:         Page,
      post:         require('./Post'),
      faq:          require('./Faq'),
      faq_category: require('./FaqCategory'),
    };
  }
};

class Page extends Model(schema) {

  constructor(data) {
    super(data);
    if (this.category && !this.category_slug) {
      this.category_slug = _.kebabCase(this.category);
    }
  }

  beforeCreate(callback) {
    this.slug          = StringUtils.slugify(this.slug || this.title) || null;
    if (this.category) {
      this.category_slug = StringUtils.slugify(this.category);
    }
    if (!this.published_at && this.status === 'published') {
      this.published_at = new Date();
    }
    callback();
  }

  beforeUpdate(values, callback) {
    values.category_slug = values.category ? StringUtils.slugify(values.category) : null;
    // if (!this.slug) {
    //   values.slug = StringUtils.slugify(values.slug || values.title || this.title) || null;
    // }
    // if (!this.published_at && this.status === 'published') {
    //   values.published_at = new Date();
    // }
    callback();
  }

  get url() {
    return plugin.options.url(this);
  }

  get parts() {
    this._parts = this._parts || this.body && this.body.split('<hr>') || [];
    return this._parts ;
  }

  get title_with_level() {
    let ret = '';
    if (this.level > 0) {
      let i = 0;
      while (i < this.level - 1) {
        ret += '&nbsp;&nbsp;&nbsp;&nbsp;';
        i++;
      }
      ret += '└ ';
    }
    return ret + (this.title || 'Sans titre');
  }

}

module.exports = Page;
