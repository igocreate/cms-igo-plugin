
// DEV ONLY
const DISABLE_CACHE = true;

const _       = require('lodash');
const gm      = require('gm').subClass({ imageMagick: true });

const plugin  = require('../../plugin');
const Media   = require('../models/Media');
const OVH     = require('./OVH');

const { config, cache, logger } = plugin.igo;

const DEFAULT_QUALITY = 90;

const FORMATS = _.merge({
  thumbnail: {
    width:  300,
    height: 300
  },
  large: {
    width:  800,
    height: 800
  },
}, plugin.options.formats || {});;

//
module.exports.resize = function(srcData, format, callback) {
  if (!format || !FORMATS[format]) {
    return callback(null, srcData);
  }
  format = FORMATS[format];
  const file = gm(srcData);

  // console.log(`Resize image ${format.width}x${format.height}`);
  file.size((err, size) => {
    if (err) {
      return callback(err);
    }
    const ratio     = format.width / format.height;
    const fileRatio = size.width / size.height;

    if (ratio > fileRatio) {
      file.resize(format.width, Math.round(format.width / fileRatio));
    } else {
      file.resize(Math.round(format.height * fileRatio), format.height);
    }
    
    file.gravity('Center')
      .crop(format.width, format.height)
      .quality(format.quality || DEFAULT_QUALITY)
      .setFormat('jpeg').toBuffer(callback);
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

    // skip cache (DEV ONLY)
    if (config.env !== 'production' && DISABLE_CACHE) {
      return module.exports.forcedownload(media, options, (err, data) => {
        callback(err, data, media);
      });
    }

    const key = [ options.uuid, options.format, options.site ].join('-');
    cache.fetch('mediaservice', key, function(key, callback) {
      module.exports.forcedownload(media, options, callback);
    }, (err, data) => {
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
