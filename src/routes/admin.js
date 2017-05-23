


'use strict';

const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const IndexController = require('../controllers/admin/IndexController');
const PagesController = require('../controllers/admin/PagesController');


router.all('/cms*',             IndexController.filter);

router.get ('/cms',             IndexController.index);
router.get ('/cms/pages',       PagesController.index);
router.get ('/cms/pages/new',   PagesController.new);
router.post('/cms/pages',       PagesController.create);
router.get ('/cms/pages/:id',   PagesController.show);
router.get ('/cms/pages/:id/edit',  PagesController.edit);
router.post('/cms/pages/:id',   PagesController.update);


module.exports = router;
