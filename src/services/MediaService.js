
// DEV ONLY
const DISABLE_CACHE = false;

const uuidV4  = require('uuid').v4;
const _       = require('lodash');
const gm      = require('gm').subClass({ imageMagick: true });

const plugin  = require('../../plugin');
const Media   = require('../models/Media');
const OVH     = require('./OVH');

const { config, cache, logger } = plugin.igo;

const QUALITY = 90;

const FORMATS = _.merge({
  thumbnail: { width:  300, height: 300 },
  large: { width:  800, height: 800 },
}, plugin.options.formats || {});


//
module.exports.resize = async (data, format) => {

  if (!format || !FORMATS[format]) {
    return data;
  }
  format      = FORMATS[format];
  
  const buffer  = await new Promise((resolve) => {
    gm(data).autoOrient().toBuffer((err, buffer) => {
      err ? resolve({err}) : resolve(buffer);
    });
  });

  if (buffer.err) {
    return data;
  }

  const image = gm(buffer);

  const size = await new Promise((resolve, reject) => {
    image.size((err, size) => {
      err ? reject(err) : resolve(size);
    });
  });

  // crop if necessary
  if (format.height && format.width) {
    const ratio     = format.height / format.width;
    const fileRatio = size.height / size.width;
    if (ratio > fileRatio) {
      const w = size.height * format.width / format.height;
      image.crop(w, size.height, (size.width - w) / 2, 0);
    } else if (ratio < fileRatio) {
      const h = size.width * format.height / format.width;
      image.crop(size.width, h, 0, (size.height - h) / 2);
    }
  }

  return new Promise((resolve, reject) => {
    // resize image
    image
    .resize(format.width, format.height)
    .background('transparent')
    .quality(QUALITY)
    .gravity('Center')
    .extent(format.width, format.height)
    .toBuffer((err, buffer) => {
      err ? reject(err) : resolve(buffer);
    });
  });

};

//
module.exports.forcedownload = async (media, options) => {
  //
  const file = await OVH.getFile(media.fullpath);
  if (file.err) {
    return file;
  }
  return await module.exports.resize(file, options.format);
};

//
module.exports.download = async (user, options) => {
  const media = await Media.find({ uuid: options.uuid });

  if (!media) {
    return { err: 'notfound' };
  }

  // skip cache (DEV ONLY)
  if (config.env !== 'production' && DISABLE_CACHE) {
    const data = await module.exports.forcedownload(media, options);
    return { data, media };
  }

  const key = [ options.uuid, options.format, options.site ].join('-');

  const data = await cache.fetch('mediaservice', key, async () => {
    return await module.exports.forcedownload(media, options);
  });

  return { data, media };
};

//
module.exports.upload = function(user, file, options, callback) {

  if (!file || !file.size) {
    return callback('missingfile');
  }

  options = options || {};

  const uuid        = uuidV4();
  const container   = config.ovh_storage.container;
  const fullpath    = `/${container}/media-${uuid}`;
  const user_id     = user ? user.id : null;

  const media = {
    user_id:    user_id,
    uuid:       uuid,
    site:       options.site,
    name:       file.name,
    filename:   file.name,
    type:       file.type,
    size:       file.size,
    container:  container,
    fullpath:   fullpath,
    is_deleted: false
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