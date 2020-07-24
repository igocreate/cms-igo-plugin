
const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const CmsController     = require('../controllers/CmsController');

// Cms pages
router.get('/:slug?',    CmsController.page);

module.exports = router;
