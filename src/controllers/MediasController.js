
const MediaService  = require('../services/MediaService');

//
module.exports.show = function(req, res) {
  const user    = res.locals.current_user;
  const options = {
    uuid:     req.params.uuid,
    format:   req.params.format,
    site:     res.locals.site
  };
  MediaService.download(user, options, function(err, data, media) {
    if (err) {
      return res.status(404).send('Not found');
    }
    if (media.type) {
      res.setHeader('Content-type', media.type);
    }
    if (media.size) {
      res.setHeader('Content-Length', media.size);
    }
    if (err) {
      return res.status(404).send('Not found');
    }
    res.send(data);
  });
};
