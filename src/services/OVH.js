
const _               = require('lodash');
const fs              = require('fs');
const OVHStorage      = require('node-ovh-storage');
const stringToStream  = require('string-to-stream');

const plugin          = require('../../plugin');

const { config, logger }  = plugin.igo;


//
module.exports.putFile = function(src, dest, options, callback) {
  fs.readFile(src, function(err, data) {
    if (err) {
      return callback(err);
    }
    const storage = new OVHStorage(config.ovh_storage);
    storage.getToken(function(err) {
      if (err) {
        logger.error('Could not get token', err);
        return callback(err);
      }
      storage.createContainer(options.container, function(err) {
        if (err) {
          logger.error('Could not create container ' + options.container, err);
          return callback(err);
        }
        const stream = stringToStream(data);
        storage.putStream(stream, dest, function(err, result) {
          if (err) {
            logger.error(err);
            return callback(err);
          }
          console.log('finished upload', result)
          callback(err, result) ;
        });
      });
    });
  });
};

//
module.exports.getFile = function(path, options, callback) {
  if (_.isFunction(options)) {
    callback  = options;
    options   = {};
  }
  const storage   = new OVHStorage(config.ovh_storage);
  storage.getToken(function(err) {
    if (err) {
      logger.error(err);
      return callback(err);
    }
    storage.getFile(path, (err, file) => {
      if (err) {
        logger.error(err);
        return callback(err);
      }
      callback(err, file);
    });
  });
};
