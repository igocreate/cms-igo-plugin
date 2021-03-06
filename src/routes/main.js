
const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const CmsController     = require('../controllers/CmsController');
const MediasController  = require('../controllers/MediasController');

// medias
router.get ('/medias/:uuid/:format?/:filename',  MediasController.show);

// FAQ
router.get ('/faq',         CmsController.faqIndex);
router.get ('/faq/:slug',   CmsController.faq);

// Cms pages
router.get ('/:slug?',                  CmsController.page);
router.get ('/:parent/:slug',           CmsController.page);


module.exports = router;
