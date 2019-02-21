
const _               = require('lodash');

const plugin          = require('../../../plugin');
const igo             = plugin.igo;
const StringUtils     = require('../../utils/StringUtils');

const Page            = require('../../models/Page');

//
const getCmsfilter = module.exports.getCmsfilter = function(req, res) {
  const cmsfilter = req.session.cmsfilter || {};

  if (plugin.options.site) {
    cmsfilter.site = res.locals[plugin.options.site];
  } else if (plugin.options.sites) {
    cmsfilter.site = req.query.site || cmsfilter.site || plugin.options.sites[0];
  }
  if (plugin.options.langs && plugin.options.langs.length > 1) {
    cmsfilter.lang = req.query.lang || cmsfilter.lang || plugin.options.langs[0];
  }
  if (req.query.category !== undefined) {
    cmsfilter.category = req.query.category;
  }
  if (req.query.slug !== undefined) {
    cmsfilter.slug = req.query.slug;
  }
  if (!cmsfilter.category) {
    delete cmsfilter.category;
  }
  if (!cmsfilter.slug) {
    delete cmsfilter.slug;
  }

  cmsfilter.status = req.query.status || cmsfilter.status || 'published';

  res.locals.cmsfilter    = cmsfilter;
  req.session.cmsfilter   = cmsfilter;

  res.locals.langs    = plugin.options.langs;
  res.locals.sites    = plugin.options.sites;
  res.locals.cms_site = plugin.options.site && res.locals[plugin.options.site];
  res.locals.cms_lang = plugin.options.langs && plugin.options.langs.length === 1 && plugin.options.langs[0];

  return cmsfilter;
}

//
module.exports.index = function(model, req, res, callback) {

  const cmsfilter = getCmsfilter(req, res);

  if (cmsfilter.status === 'published' && model.name === 'Page') {
    return model.showTree(cmsfilter, function(err, pages) {
      res.locals.pages = pages;
      callback(err, pages);
    });
  }

  model.where(cmsfilter)
      .order('`updated_at` DESC')
      .list(function(err, pages) {
    res.locals.pages = pages;
    callback(err, pages);
  });
};

//
module.exports.new = function(model, req, res, callback) {
  const cmsfilter = getCmsfilter(req, res);

  res.locals.langs = plugin.options.langs;
  res.locals.sites = plugin.options.sites;

  if (!req.query.copy) {
    res.locals.page = res.locals.flash.page || {
      lang: cmsfilter.lang,
      site: cmsfilter.site || 'default',
    };
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
  [ 'image_id', 'menu_id', 'parent_id',
    'menu_order', 'category'
  ].forEach(function(attr) {
    req.body[attr] = req.body[attr] || null;
  });

  // force lang & site
  getCmsfilter(req, res);
  req.body.site = res.locals.cms_site || req.body.site;
  req.body.lang = res.locals.cms_lang || req.body.lang;

  req.body.slug = req.body.slug || StringUtils.slugify(req.body.slug || req.body.title);
  if (!req.body.published_at && req.body.status === 'published') {
    req.body.published_at = new Date();
  }
  model.find(req.params.parent_id, function(err, parent) {
    req.body.level = parent ? parent.level + 1 : 0;
    model.create(req.body, callback);
  });
};

//
module.exports.update = function(model, req, res, callback) {
  [ 'image_id', 'menu_id', 'parent_id',
    'menu_order', 'category'
  ].forEach(function(attr) {
    req.body[attr] = req.body[attr] || null;
  });

  // force lang & site
  getCmsfilter(req, res);
  req.body.site = res.locals.cms_site || req.body.site;
  req.body.lang = res.locals.cms_lang || req.body.lang;

  model.find(req.params.id, function(err, page) {
    req.body.slug = req.body.slug || StringUtils.slugify(req.body.slug || req.body.title);
    if (!req.body.published_at && req.body.status === 'published') {
      req.body.published_at = new Date();
    }
    model.find(req.body.parent_id, function(err, parent) {
      req.body.level = parent ? parent.level + 1 : 0;
      page.update(req.body, callback);
    });
  });
};

//
module.exports.trash = function(req, res, next) {
  Page.find(req.params.id, function(err, page) {
    page.update({ status: 'trashed' }, function() {
      req.flash('success', 'Page supprimée');
      return res.redirect(plugin.options.adminpath + '/cms/pages')
    });
  });
};
