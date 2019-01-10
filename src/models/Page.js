const _           = require('lodash');

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
    'category_slug',
    'tags',
    'image_id',
    'menu_id',
    'menu_order',
    'parent_id',
    'level',
    'site',
    'type',
    'published_at',
    'updated_at',
    'created_at'
  ],
  associations: () => [
    [ 'belongs_to', 'image',    Media,  'image_id', 'id' ],
    [ 'has_many',   'children', Page,   'id',       'parent_id']
  ],
  scopes: {
    default: (query) => query.order('`menu_order`, `title`')
  },
  subclasses: function() {
    return {
      page:     Page,
      post:     require('./Post')
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
    return [this.slug, this.id].join('-');
  }

  get parts() {
    this._parts = this._parts || this.body.split('<hr>');
    return this._parts;
  }

  get title_with_level() {
    let ret = '';
    for (let i = 0; i < this.level; i++) {
      ret += '--';
    }
    if (ret.length > 0) {
      ret += ' ';
    }
    return ret + (this.title || 'Sans titre');
  }

}

module.exports = Page;

//
module.exports.showTree = function(cmsfilter, callback) {
  Page.where(cmsfilter)
      .order('`level`, `menu_order`, `title`')
      .list(function(err, pages) {
    const tree = [];
    for (let i = 0; i < pages.length; i++) {
      // add page
      if (tree.indexOf(pages[i]) < 0) {
        tree.push(pages[i]);
      }
      // add children
      const children = _.filter(pages, (p) => p.parent_id === pages[i].id)
      Array.prototype.push.apply(tree, children);
    }
    callback(err, tree);
  });
};
