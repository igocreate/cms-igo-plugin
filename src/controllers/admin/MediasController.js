
const plugin        = require('../../../plugin');

const igo           = plugin.igo;

const ControllerUtils = require('./ControllerUtils');
const MediaService    = require('../../services/MediaService');
const Media           = require('../../models/Media');


//
module.exports.index = function(req, res) {


  const is_deleted = req.query.status === 'deleted';
  res.locals.cmsfilter = {
    status: is_deleted ? 'deleted' : 'published'
  };

  const query = Media.unscoped().where({is_deleted});

  const cmsfilter = ControllerUtils.getCmsfilter(req, res);
  if (cmsfilter.site) {
    query.where({ site: cmsfilter.site });
  }

  query.order('`created_at` DESC')
      .list(function(err, medias) {
    res.locals.medias = medias;
    res.render(plugin.dirname + '/views/admin/medias/index.dust');
  });
};

//
module.exports.new = function(req, res) {
  res.render(plugin.dirname + '/views/admin/pages/new.dust');
};

//
module.exports.show = function(req, res) {
  Media.find(req.params.id, function(err, page) {
    res.locals.page = page;
    res.render(plugin.dirname + '/views/admin/pages/show.dust');
  });
};

//
module.exports.edit = function(req, res) {
  Media.find(req.params.id, function(err, page) {
    res.locals.page = page;
    res.render(plugin.dirname + '/views/admin/pages/edit.dust');
  });
};

//
module.exports.update = function(req, res) {
  igo.Admin.AdminUtils.handleParams(Media, req.body);
  Media.find(req.params.id, function(err, page) {
    page.update(req.body, function(err, page) {
      res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
    });
  });
};

//
module.exports.upload = function(req, res, next) {
  const file = req.files.file[0];
  const cmsfilter = ControllerUtils.getCmsfilter(req, res);

  const options = {
    offer_id: req.body.offer_id,
    site:     cmsfilter.site,
  };
  file.type = file.headers && file.headers['content-type'];
  
  MediaService.upload(null, file, options, (err, media) => {
    if (err || !media) {
      return res.send({
        error: true,
        message: err || 'Something went wrong...'
      });
    }
    res.send({
      file: {
        url:  '/medias/' + media.uuid + '/original.png',
        id:   media.uuid
      }
    });
  });
};

//
module.exports.trash = function(req, res, next) {
  Media.unscoped().find(req.params.id, function(err, media) {
    media.update({ is_deleted: true }, function() {
      req.flash('success', 'Objet supprimé');
      return res.redirect(plugin.options.adminpath + '/cms/medias')
    });
  });
};

//
module.exports.modal = function(req, res) {
  const query = Media.where({ is_deleted: false });

  const cmsfilter = ControllerUtils.getCmsfilter(req, res);
  if (cmsfilter.site) {
    query.where({ site: cmsfilter.site });
  }

  query.order('`created_at` DESC')
      .limit(50).list(function(err, medias) {
    res.locals.medias = medias;
    res.render(plugin.dirname + '/views/admin/medias/modal');
  });
};
