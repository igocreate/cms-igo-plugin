

const igo               = require('../../plugin').igo;
const router            = igo.express.Router();

const IndexController         = require('../controllers/admin/IndexController');
const PagesController         = require('../controllers/admin/PagesController');
const PostsController         = require('../controllers/admin/PostsController');
const FaqController           = require('../controllers/admin/FaqController');
const FaqCategoriesController = require('../controllers/admin/FaqCategoriesController');
const MediasController        = require('../controllers/admin/MediasController');


router.all ('*',                      IndexController.filter);

router.get ('/cms',                   IndexController.index);

// Pages
router.get ('/cms/pages',             PagesController.index);
router.get ('/cms/pages/new',         PagesController.new);
router.post('/cms/pages',             PagesController.create);
router.get ('/cms/pages/:id/edit',    PagesController.edit);
router.post('/cms/pages/:id',         PagesController.update);
router.get ('/cms/pages/:id/trash',   PagesController.trash);

// Postss
router.get ('/cms/posts',             PostsController.index);
router.get ('/cms/posts/new',         PostsController.new);
router.post('/cms/posts',             PostsController.create);
router.get ('/cms/posts/:id/edit',    PostsController.edit);
router.post('/cms/posts/:id',         PostsController.update);
router.get ('/cms/posts/:id/trash',   PostsController.trash);

// FAQ
router.all ('/cms/faq*',              FaqCategoriesController.faq);
router.get ('/cms/faq',               FaqCategoriesController.index);
router.get ('/cms/faq/new',           FaqCategoriesController.new);
router.post('/cms/faq',               FaqCategoriesController.create);
router.get ('/cms/faq/:id/edit',      FaqCategoriesController.edit);
router.get ('/cms/faq/:id',           FaqCategoriesController.show);
router.post('/cms/faq/:id',           FaqCategoriesController.update);
router.get ('/cms/faq/:id/trash',     FaqCategoriesController.trash);

router.get ('/cms/faq/:cat_id/new',           FaqController.new);
router.post('/cms/faq/:cat_id/new',           FaqController.create);
router.get ('/cms/faq/:cat_id/:id/edit',      FaqController.edit);
router.post('/cms/faq/:cat_id/:id',           FaqController.update);
router.get ('/cms/faq/:cat_id/:id/trash',     FaqController.trash);

// Medias
router.get ('/cms/medias',            MediasController.index);
router.post('/cms/medias/upload',     MediasController.upload);
router.get ('/cms/medias/modal',      MediasController.modal);
router.get ('/cms/medias/:id/trash',  MediasController.trash);

module.exports = router;
