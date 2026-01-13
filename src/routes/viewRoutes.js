const express = require('express')
const { showLoginPage, showRegisterPage, showDashBoardPage, login, refreshToeknController, logoutController, register, uploadProfilePic, showProfilePage } = require('../controllers/viewController')
const authMiddleware = require('../middlewares/authMiddlewareFrontend')

const router=express.Router()
const upload = require('../middlewares/uploadMiddleware')

router.get('/',showLoginPage)
router.get('/register',showRegisterPage)
router.post('/register',upload.single('profilePic'), register)
router.get('/dashboard',  authMiddleware , showDashBoardPage)
router.post('/login',login)
router.post('/refresh-token',refreshToeknController)
router.post('/logout',logoutController)

router.get('/profile',authMiddleware, showProfilePage)
router.post('/profile/upload',authMiddleware, upload.single('profilePic'),uploadProfilePic)

module.exports=router