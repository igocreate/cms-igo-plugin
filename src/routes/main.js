


'use strict';

const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const CmsController = require('../controllers/CmsController');

router.get('/:page',          CmsController.show);
router.get('/*/:page',        CmsController.show);

module.exports = router;
