
const _               = require('lodash');
const async           = require('async');
const plugin          = require('../../../plugin');
const igo             = plugin.igo;
const FilterUtils     = require('../../utils/FilterUtils');
const StringUtils     = require('../../utils/StringUtils');

const Page            = require('../../models/Page');

const FIELDS = [
  'id',
  'title', 'body', 'page_type', 'slug',
  'site', 'lang',
  'meta_title', 'meta_description', 'subtitle', 'excerpt',
  'image_id', 'banner_id', 'menu_id', 'parent_id',
  'menu_order', 'category', 'tags', 'published_at'
];

const getParams = (req, res) => {
  const { options } = plugin;

  // force lang & site
  getCmsfilter(req, res);
  
  const params = {};
  FIELDS.forEach(function(attr) {
    params[attr] = req.body[attr] || null;
  });

  const pageType = _.find(options.pageTypes, {type: params.page_type});
  // page type structure
  if (pageType && pageType.structure) {
    params.content = {};
    _.each(pageType.structure, field => {
      params.content[field.attr] = req.body[field.attr] || null;
    });
  }

  // force site and lang if no options and detected
  if (!plugin.options.sites && plugin.options.detect_site) {
    params.site = res.locals[plugin.options.detect_site];
  }
  if (!plugin.options.langs && plugin.options.detect_lang) {
    params.lang = res.locals[plugin.options.detect_lang];
  }

  // do not allow change site and lang if no options
  // if (!plugin.options.sites) {
  //   delete req.body.site;
  // }
  // if (!plugin.options.langs) {
  //   delete req.body.lang;
  // }

  params.meta_title     = params.meta_title || req.body.title;
  params.page_type      = params.page_type || 'page';
  params.slug           = params.slug || StringUtils.slugify(params.title);
  params.category_slug  = params.category && StringUtils.slugify(params.category);

  if (!params.published_at && params.status === 'published') {
    params.published_at = new Date();
  }

  return params;
}

//
const getCmsfilter = module.exports.getCmsfilter = function(req, res) {
  const cmsfilter = req.session.cmsfilter || {};

  FilterUtils.getSiteFilter(req, res, cmsfilter);
  FilterUtils.getLangFilter(req, res, cmsfilter);

  [ 'page_type', 'slug', 'category' ].forEach(attr => {
    if (req.query[attr] !== undefined) {
      cmsfilter[attr] = req.query[attr];
    }
    if (!cmsfilter[attr]) {
      delete cmsfilter[attr];
    }
  });

  cmsfilter.status = req.query.status || cmsfilter.status || 'published';

  res.locals.cmsfilter    = cmsfilter;
  req.session.cmsfilter   = cmsfilter;

  res.locals.pageTypes    = plugin.options.pageTypes;

  return cmsfilter;
}

//
const applyCmsFilter = (model, cmsfilter) => {
  const filter  = _.pick(cmsfilter, ['site', 'lang', 'status', 'page_type']);
  const query   = model.where(filter);
  ['slug', 'category'].forEach(attr => {
    if (cmsfilter[attr]) {
      query.where(`\`${attr}\` like CONCAT('%', ?,  '%')`, cmsfilter[attr]);
    }
  });

  return query;
};

module.exports.showTree = (model, cmsfilter, callback) => {
  const query = applyCmsFilter(model, cmsfilter);
  query.order('`level`, COALESCE(`menu_order`, 999), `title`')
        .list(function(err, pages) {

    const tree = [];
    const addPage = (page) => {
      if (tree.indexOf(page) < 0) {
        tree.push(page);
      }
      // add children
      const children = _.filter(pages, (p) => p.parent_id === page.id)
      page.hasChildren = children.length > 0;
      children.forEach(addPage);
    }

    for (let i = 0; i < pages.length; i++) {
      addPage(pages[i]);
    }
    callback(err, tree);
  });
};


//
module.exports.index = function(model, req, res, callback) {

  const cmsfilter = getCmsfilter(req, res);
  if (model.name !== 'Page') {
    delete cmsfilter.page_type;
  }

  if (cmsfilter.status === 'published' && model.name === 'Page' &&
      !cmsfilter.category && !cmsfilter.slug && !cmsfilter.page_type) {
    res.locals.showtree = true;
    return module.exports.showTree(model, cmsfilter, callback);
  }
  const query = applyCmsFilter(model, cmsfilter);
  query.order('`updated_at` DESC').list(callback);
};

//
module.exports.new = function(model, req, res, callback) {
  const cmsfilter = getCmsfilter(req, res);

  res.locals.langs = plugin.options.langs;
  res.locals.sites = plugin.options.sites;

  if (!req.query.copy) {
    res.locals.page = res.locals.flash.page || _.merge(
      _.pick(cmsfilter, ['lang', 'site']),
      _.pick(req.query, ['slug', 'title', 'parent_slug', 'page_type', 'object_type', 'object_id'])
    );
    return callback();
  }

  model.find(req.query.copy, function(err, page) {
    delete page.id;
    res.locals.page = page;
    callback();
  })
};

//
module.exports.create = function(model, req, res, callback) {

  const params = getParams(req, res);
  
  model.find(params.parent_id, function(err, parent) {
    params.level = parent ? parent.level + 1 : 0;
    model.create(params, callback);
  });
};

//
module.exports.update = function(model, req, res, callback) {

  const params = getParams(req, res);

  model.find(params.id, function(err, page) {
    model.find(params.parent_id, function(err, parent) {
      params.level = parent ? parent.level + 1 : 0;
      page.update(params, callback);
    });
  });
};

//
module.exports.trash = function(req, res, next) {
  Page.find(req.params.id, function(err, page) {
    page.update({ status: 'trashed' }, function() {
      req.flash('success', 'Page supprimée');
      return res.redirect(plugin.options.adminpath + '/pages')
    });
  });
};

//
module.exports.getObjectTypes = function(callback) {
  async.map(plugin.options.objectTypes, function(objectType, callback) {
    objectType.list(function(err, objects) {
      callback(null, {
        list:   objects,
        label:  objectType.label,
        type:   objectType.type,
      });
    });
  }, callback);
};
