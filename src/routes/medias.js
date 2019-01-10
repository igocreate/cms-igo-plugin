
const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const MediasController  = require('../controllers/MediasController');

// medias
router.get ('/medias/:uuid/:filename',          MediasController.show);
router.get ('/medias/:uuid/:format/:filename',  MediasController.show);

module.exports = router;
