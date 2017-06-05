

'use strict';

const _             = require('lodash');

const plugin        = require('../../../plugin');
const igo           = plugin.igo;

const MediaService  = require('../../services/MediaService');
const Media         = require('../../models/Media');


//
module.exports.index = function(req, res) {

  const is_deleted = req.query.status === 'deleted';
  Media.unscoped()
      .where({is_deleted: is_deleted})
      .order('`created_at` DESC')
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
module.exports.create = function(req, res) {
  igo.Admin.AdminUtils.handleParams(Media, req.body);
  Media.create(req.body, function(err, page) {
    res.redirect(plugin.options.adminpath + '/cms/pages/' + page.id + '/edit');
  });
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
  const file = req.files.file;
  const options = {
    offer_id: req.body.offer_id
  };
  MediaService.upload(null, file, options, function(err, media) {
    if (err) {
      return res.status(500).send('KO');
    }
    console.log('/medias/' + media.uuid + '/original.png');
    res.send({
      url:  '/medias/' + media.uuid + '/original.png',
      id:   media.uuid
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
  Media.where({ is_deleted: false })
      .order('`created_at` DESC')
      .limit(50).list(function(err, medias) {
    res.locals.medias = medias;
    res.render(plugin.dirname + '/views/admin/medias/modal');
  });
};
