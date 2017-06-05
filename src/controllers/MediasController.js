
'use strict';

const MediaService  = require('../services/MediaService');

//
module.exports.show = function(req, res) {
  const user    = res.locals.current_user;
  const options = {
    uuid:     req.params.uuid,
    format:   req.params.format,
    site:     res.locals.site
  };
  MediaService.download(user, options, function(err, data, file) {
    if (err) {
      return res.status(404).send('Not found');
    }
    if (file.type) {
      res.setHeader('Content-type', file.type);
    }
    if (file.size) {
      res.setHeader('Content-Length', file.size);
    }
    if (err) {
      return res.status(404).send('Not found');
    }
    res.send(data);
  });
};
