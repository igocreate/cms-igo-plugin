'use strict';

const plugin  = require('../../plugin');
const igo     = plugin.igo;

const config  = igo.config;
const logger  = igo.logger;
const cache   = igo.cache;


const Media   = require('../models/Media');

const OVH     = require('./OVH');
const gm      = require('gm').subClass({ imageMagick: true });

const FORMATS = {
  large: {
    width:  1200,
    height: 800,
    background: 'white'
  },
  small: {
    width:  400,
    height: 300,
    background: 'white'
  },
  logo: {
    width:  200,
    height: 200,
    background: 'white'
  },
};

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
      .background('white')
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

  options = options || {};

  const container   = (config.ovh.containerprefix || '') + 'medias';
  const title       = '/media-' + Date.now();
  const user_id     = user ? user.id : null;

  const media = {
    user_id:    user_id,
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
    const options = {
      container: container
    };
    OVH.putFile(file.path, media.fullpath, options, function(err) {
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
