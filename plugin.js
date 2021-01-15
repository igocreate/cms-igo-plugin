const _       = require('lodash');

const plugin = {
  options: {
    adminpath:    '/admin',
    adminlayout:  'layouts/main',
    pageTypes:  [],
    templates: {
      dir:        'cms',
      cms_show:   __dirname + '/views/templates/page.dust',
      faq_index:  __dirname + '/views/faq/index.dust'
    },
    url: (page) => `${page.parent ? page.parent.url : ''}/${page.slug}`
  },
  dirname: __dirname
};

// init
plugin.init = function(igo) {
  plugin.igo = igo;
  plugin.routes = {
    main:   require('./src/routes/main'),
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
    Media:        require('./src/models/Media'),
    Page:         require('./src/models/Page'),
    Post:         require('./src/models/Post'),
    Faq:          require('./src/models/Faq'),
    FaqCategory:  require('./src/models/FaqCategory'),
  };
};

//
plugin.configure = (options) => {
  _.merge(plugin.options, options);
};

//
module.exports = plugin;
