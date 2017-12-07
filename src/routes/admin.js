


'use strict';

const igo           = require('../../plugin').igo;
const router        = igo.express.Router();

const IndexController = require('../controllers/admin/IndexController');
const PagesController = require('../controllers/admin/PagesController');
const MediasController = require('../controllers/admin/MediasController');


router.all('/cms*',                 IndexController.filter);

router.get ('/cms',                 IndexController.index);

// Pages
router.get ('/cms/pages',             PagesController.index);
router.get ('/cms/pages/new',         PagesController.new);
router.post('/cms/pages',             PagesController.create);
router.get ('/cms/pages/:id',         PagesController.show);
router.get ('/cms/pages/:id/edit',    PagesController.edit);
router.post('/cms/pages/:id',         PagesController.update);
router.get ('/cms/pages/:id/trash',   PagesController.trash);

// Medias
router.get ('/cms/medias',            MediasController.index);
router.post('/cms/medias/upload',     MediasController.upload);
router.get ('/cms/medias/:id/trash',  MediasController.trash);

module.exports = router;
