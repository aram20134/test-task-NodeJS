const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const blogRouter = require('./blogRouter')

router.use('/u', userRouter)
router.use('/b', blogRouter)
// router.use('/map', mapRouter)
// router.use('/admin', adminRouter)

module.exports = router
