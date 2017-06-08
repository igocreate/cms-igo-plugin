


'use strict';

const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const CmsController     = require('../controllers/CmsController');

// Cms pages
router.get('/:page',                            CmsController.show);

module.exports = router;
