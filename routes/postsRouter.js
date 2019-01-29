const controller = require('../controllers/postsController');
const router = require('express').Router();

router.get('/', controller.Get);
router.get('/:postId', controller.GetWithId);
router.post('/', controller.Post);
router.delete('/:postId', controller.Delete);
router.patch('/:postId', controller.Patch);

module.exports = router;