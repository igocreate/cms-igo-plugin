


'use strict';

const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const CmsController     = require('../controllers/CmsController');
const MediasController  = require('../controllers/MediasController');

// medias
router.get ('/medias/:uuid/:filename',          MediasController.show);
router.get ('/medias/:uuid/:format/:filename',  MediasController.show);

// Cms pages
router.get('/:page',                            CmsController.show);

module.exports = router;
