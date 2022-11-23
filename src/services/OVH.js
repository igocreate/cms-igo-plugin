
const fs              = require('fs');
const OVHStorage      = require('node-ovh-storage');
const stringToStream  = require('string-to-stream');

const { config }      = require('igo');

//
module.exports.putData = (data, dest) => {
  return new Promise((resolve) => {
    if (config.env === 'test') {
      return resolve();
    }
    const storage = new OVHStorage(config.ovh_storage);
    storage.getToken((err) => {
      if (err) {
        console.log(err);
        return resolve({err});
      }
      const stream = stringToStream(data);
      storage.putStream(stream, dest, (err, result) => {
        if (err) {
          console.log(err);
          return resolve({err});
        }
        resolve(result);
      });
    });
  });
};

//
module.exports.putFile = (src, dest) => {
  return new Promise((resolve, reject) => {
    if (config.env === 'test') {
      return resolve();
    }
    fs.readFile(src, (err, data) => {
      if (err) {
        return resolve({err});
      }
      module.exports.putData(data, dest).then(resolve).catch(reject);
    });
  });
};

//
module.exports.getFile = (path) => {
  return new Promise((resolve) => {
    if (config.env === 'test') {
      return resolve();
    }
    const storage   = new OVHStorage(config.ovh_storage);
    storage.getToken((err) => {
      if (err) {
        console.log(err);
        return resolve({err});
      }
      storage.getFile(path, (err, file) => {
        if (err) {
          console.log(err);
          return resolve({err});
        }
        resolve(file);
      });
    });
  });
};

//
module.exports.deleteFile = (path) => {
  return new Promise((resolve) => {
    if (config.env === 'test') {
      return resolve();
    }
    const storage   = new OVHStorage(config.ovh_storage);
    storage.getToken((err) => {
      if (err) {
        console.log(err);
        return resolve({err});
      }
      storage.deleteFile(path, (err) => {
        if (err) {
          console.log(err);
          return resolve({err});
        }
        resolve();
      });
    });
  });
};

