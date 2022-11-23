
const MediaService  = require('../services/MediaService');

//
module.exports.show = async (req, res) => {
  const user    = res.locals.current_user;
  const options = {
    uuid:     req.params.uuid,
    format:   req.params.format,
    site:     res.locals.site
  };
  const { err, data, media } = await MediaService.download(user, options);
  if (err || !media) {
    return res.status(404).send('Not found');
  }
  res.setHeader('Content-type', media.type || 'image/jpeg');
  res.setHeader('Content-Length', data.length);
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // 365days
  res.send(data);
};
