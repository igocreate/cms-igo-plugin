
const _       = require('lodash');
const gm      = require('gm').subClass({ imageMagick: true });

const plugin  = require('../../plugin');
const Media   = require('../models/Media');
const OVH     = require('./OVH');

const { config, cache, logger } = plugin.igo;


const FORMATS = _.merge({
  thumbnail: {
    width:  200,
    height: 200,
    background: 'white'
  },
}, plugin.options.formats || {});;

//
module.exports.resize = function(srcData, format, callback) {
  if (!format || !FORMATS[format]) {
    return callback(null, srcData);
  }
  format = FORMATS[format];
  var file = gm(srcData);

  file.size((err, size) => {
    if (err) {
      return callback(err);
    }
    const ratio = format.height / format.width;
    const fileRatio = size.height / size.width;

    if (ratio > fileRatio) {
      const w = size.height * format.width / format.height;
      file.crop(w, size.height, (size.width - w) / 2, 0);
    }

    file.resize(format.width, format.height)
      .background(format.background || 'white')
      .setFormat('jpeg')
      .gravity('Center')
      .extent(format.width, format.height)
      .toBuffer((err, buffer) => {
        callback(err, buffer);
      });
  });
};

//
module.exports.forcedownload = function(media, options, callback) {
  //
  OVH.getFile(media.fullpath, function(err, file) {
    if (err) {
      return callback(err);
    }
    module.exports.resize(file, options.format, callback);
  });
};

//
module.exports.download = function(user, options, callback) {
  Media.find({ uuid: options.uuid }, function(err, media) {
    if (!media) {
      return callback('notfound');
    }
    const key = [ options.uuid, options.format, options.site ].join('-');
    cache.fetch('mediaservice', key, function(key, callback) {
      module.exports.forcedownload(media, options, callback);
    }, function(err, data) {
      callback(err, data, media);
    });
  });
};

//
module.exports.upload = function(user, file, options, callback) {

  if (!file || !file.size) {
    return callback('missingfile');
  }

  options = options || {};

  const container   = config.ovh_storage.container;
  const title       = '/media-' + Date.now();
  const user_id     = user ? user.id : null;

  const media = {
    user_id:    user_id,
    site:       options.site,
    name:       file.name,
    filename:   file.name,
    type:       file.type,
    size:       file.size,
    container:  container,
    fullpath:   '/' + container + title
  };

  logger.info('Media upload: ' + media.fullpath + ' by user #' + user_id);
  Media.create(media, function(err, media) {
    if (err) {
      return callback(err);
    }

    OVH.putFile(file.path, media.fullpath, {container}, function(err) {
      if (err) {
        return callback(err);
      }
      if (!options.dest) {
        return callback(null, media);
      }
      options.dest.update({ media_uuid: media.uuid }, function() {
        callback(null, media);
      });
    });
  });
};
