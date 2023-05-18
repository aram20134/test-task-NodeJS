const Router = require('express')
const BlogController = require('../controllers/BlogController')
const router = new Router()
const auth = require('../middleware/auth')

router.post('/addBlog', auth, BlogController.addBlog)
router.get('/getBlogs', BlogController.getBlogs)
router.post('/delBlog', auth, BlogController.delBlog)
router.post('/updateBlog', auth, BlogController.updateBlog)

module.exports = router
