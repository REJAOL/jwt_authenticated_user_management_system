const jwt = require('jsonwebtoken')
const authMiddleware = (req,res,next)=>{


    const token = req.cookies.accessToken
    if(!token){
        return res.redirect('/')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
}

module.exports = authMiddleware