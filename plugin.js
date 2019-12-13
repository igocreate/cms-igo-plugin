const _       = require('lodash');

const plugin = {
  options: {
    adminpath:    '/admin',
    adminlayout:  'admin/layouts/main',
    templates: {
      cms_show:   __dirname + '/views/pages/show.dust',
      faq_index:  __dirname + '/views/faq/index.dust'
    },
    url: (page) => `/${page.slug}`
  },
  dirname: __dirname
};

// init
plugin.init = function(igo) {
  plugin.igo = igo;
  plugin.routes = {
    main:   require('./src/routes/main'),
    medias: require('./src/routes/medias'),
    admin:  require('./src/routes/admin'),
  };
  plugin.controllers = {
    CmsController:    require('./src/controllers/CmsController'),
    MediasController: require('./src/controllers/MediasController')
  };
  plugin.services = {
    MediaService: require('./src/services/MediaService'),
    BlogService:  require('./src/services/BlogService')
  };
  plugin.CMS    = require('./src/services/CMS');
  plugin.models = {
    Media:  require('./src/models/Media'),
    Page:   require('./src/models/Page'),
    Post:   require('./src/models/Post')
  };
};

//
plugin.configure = (options) => {
  _.merge(plugin.options, options);
};

//
module.exports = plugin;
