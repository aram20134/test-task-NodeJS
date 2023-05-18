const Router = require('express')
const UserController = require('../controllers/UserController')
const router = new Router()

router.post('/regUser', UserController.regUser)
router.post('/logUser', UserController.logUser)

module.exports = router
