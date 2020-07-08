

const igo               = require('../../plugin').igo;
const router            = igo.express.Router();

const IndexController         = require('../controllers/admin/IndexController');
const PagesController         = require('../controllers/admin/PagesController');
const PostsController         = require('../controllers/admin/PostsController');
const FaqController           = require('../controllers/admin/FaqController');
const FaqCategoriesController = require('../controllers/admin/FaqCategoriesController');
const MediasController        = require('../controllers/admin/MediasController');


router.all ('*',                   IndexController.filter);

router.get ('',                   IndexController.index);

// Pages
router.get ('/pages',             PagesController.index);
router.get ('/pages/new',         PagesController.new);
router.post('/pages',             PagesController.create);
router.get ('/pages/:id/edit',    PagesController.edit);
router.post('/pages/:id',         PagesController.update);
router.get ('/pages/:id/trash',   PagesController.trash);

// Postss
router.get ('/posts',             PostsController.index);
router.get ('/posts/new',         PostsController.new);
router.post('/posts',             PostsController.create);
router.get ('/posts/:id/edit',    PostsController.edit);
router.post('/posts/:id',         PostsController.update);
router.get ('/posts/:id/trash',   PostsController.trash);

// FAQ
router.all ('/faq*',              FaqCategoriesController.faq);
router.get ('/faq',               FaqCategoriesController.index);
router.get ('/faq/new',           FaqCategoriesController.new);
router.post('/faq',               FaqCategoriesController.create);
router.get ('/faq/:id/edit',      FaqCategoriesController.edit);
router.get ('/faq/:id',           FaqCategoriesController.show);
router.post('/faq/:id',           FaqCategoriesController.update);
router.get ('/faq/:id/trash',     FaqCategoriesController.trash);

router.get ('/faq/:cat_id/new',           FaqController.new);
router.post('/faq/:cat_id/new',           FaqController.create);
router.get ('/faq/:cat_id/:id/edit',      FaqController.edit);
router.post('/faq/:cat_id/:id',           FaqController.update);
router.get ('/faq/:cat_id/:id/trash',     FaqController.trash);

// Medias
router.get ('/medias',            MediasController.index);
router.post('/medias/upload',     MediasController.upload);
router.get ('/medias/modal',      MediasController.modal);
router.get ('/medias/:id/trash',  MediasController.trash);

module.exports = router;
