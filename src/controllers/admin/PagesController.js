
const _         = require('lodash');

const Page      = require('../../models/Page');
const plugin    = require('../../../plugin');

const ControllerUtils = require('./ControllerUtils');

//
module.exports.index = function(req, res) {
  ControllerUtils.index(Page, req, res, function(err, pages) {
    res.locals.pageTypesByType = _.keyBy(plugin.options.pageTypes, 'type');
    res.render(plugin.dirname + '/views/admin/pages/index.dust', { pages });
  });
};

//
module.exports.new = function(req, res) {
  ControllerUtils.new(Page, req, res, function() {
    const filter  = _.pick(res.locals.cmsfilter, ['site', 'lang'])
    filter.status = 'published';

    const { page }  = res.locals;
    const type      = page ? page.page_type : req.query.page_type;
    const page_type = _.find(plugin.options.pageTypes, { type }) || plugin.options.pageTypes[0];
    const fields    = page_type && page_type.structure;

    ControllerUtils.showTree(Page, filter, (err, pages) => {
      ControllerUtils.getObjectTypes((err, objectTypes) => {
        res.render(plugin.dirname + '/views/admin/pages/new', { pages, objectTypes, fields });
      });
    });
  });
};

//
module.exports.create = function(req, res) {
  ControllerUtils.create(Page, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('page', req.body);
      return res.redirect(plugin.options.adminpath + '/cms/pages/new');
    }
    res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
  });
};

//
module.exports.edit = function(req, res) {
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  
  Page.find(req.params.id, function(err, page) {
    if (!page) {
      return res.redirect(plugin.options.adminpath + '/cms/pages');
    }
    // switch page_type
    if (req.query.page_type) {
      page.page_type = req.query.page_type;
    }
    const page_type = _.find(plugin.options.pageTypes, { type: page.page_type }) || plugin.options.pageTypes[0];
    const fields    = page_type && page_type.structure;
    
    res.locals.page = res.locals.flash.page || page;
    const filter  = _.pick(res.locals.cmsfilter, ['site', 'lang'])
    filter.status = 'published';
    ControllerUtils.showTree(Page, filter, (err, pages) => {
      ControllerUtils.getObjectTypes((err, objectTypes) => {
        res.render(plugin.dirname + '/views/admin/pages/edit', { pages, objectTypes, fields });
      });
    });
  });
};

//
module.exports.update = function(req, res) {
  ControllerUtils.update(Page, req, res, function(err, page) {
    if (err) {
      req.flash('error', err);
      req.cacheflash('page', req.body);
    }
    res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
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
