const express = require('express')
const { register, login, dashboard, refreshToken } = require('../controllers/userController.js')
const authMiddleware = require('../middlewares/authMiddleware.js')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/refresh-token', refreshToken)
router.get("/dashboard", authMiddleware, dashboard )

module.exports = router