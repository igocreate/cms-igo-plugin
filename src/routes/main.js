


'use strict';

const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const CMSController = require('../controllers/CMSController');

router.get('/:page',          CMSController.show);
router.get('/*/:page',        CMSController.show);

module.exports = router;
