const userModel = require("../models/userModel.js")
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')

const showRegisterPage = (req,res)=>{
    return res.render('register')
}
const showLoginPage = (req,res)=>{
    return res.render('login')
}
const showDashBoardPage = async (req,res)=>{
    const userFromToken=req.user
    const user = await userModel.findById(userFromToken.id).select('-password')
    return res.render('dashboard',{user})
}

const register = async (req,res)=>{
    const {username, email,password} = req.body
        if(!username||!email||!password){
            return res.status(403).json({
                message:'every field is necessary',
                success:false
            })
        }
        const findUser = await userModel.findOne({email})
        if(findUser){
            return res.status(500).json({
                message:"email is already registered"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10)
        let profilePic = 'https://res.cloudinary.com/dkvqddjit/image/upload/v1/default-avatar.png'

        if(req.file && req.file.path){
            profilePic = req.file.path.trim()
        }
        const user =  new userModel({
            username,
            email,
            password:hashedPassword,
            profilePic
        })
        await user.save()
    

        const accessToken = jwt.sign({
            id:user._id,
            email:user.email
        },
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN}
        )

        const refreshToken = jwt.sign({
            id:user._id,
            email:user.email
        },
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:process.env.JWT_REFRESH_EXPIRES_IN}
        )

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:false,
            samesite:"strict",
            maxAge:7*24*60*60*1000
        })
        res.cookie('accessToken',accessToken,{
            httpOnly:true,
            secure:false,
            samesite:'strict',
            maxAge:15*60*1000
        })

        return res.redirect('/')
}

const login = async(req,res)=>{

    const {email,password} = req.body
    if(!email||!password){
        return res.status(400).json({
            message:"must enter email and  password"
        })
    }
    const findUser = await userModel.findOne({email})
    if(!findUser){
        return res.status(500).json({
            message:'user is not found'
        })
    }

    const isMatch = await bcrypt.compare(password, findUser.password)

    if(!isMatch){
        return res.status(200).json({
            message:"wrong credential"
        })
    }

    const accessToken = jwt.sign({
        id:findUser._id,
        email:findUser.email
    },
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES_IN}
    )

    const refreshToken = jwt.sign({
        id:findUser._id,
        email:findUser.email
    },
    process.env.JWT_REFRESH_SECRET,
    {expiresIn:process.env.JWT_REFRESH_EXPIRES_IN}
    )

    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:false,
        samesite:"strict",
        maxAge:7*24*60*60*1000
    })
    res.cookie('accessToken',accessToken,{
        httpOnly:true,
        secure:false,
        samesite:'strict',
        maxAge:15*60*1000
    })

    return res.redirect('/dashboard')
}

const refreshToeknController=async(req,res)=>{
    const refreshToekn = req.cookies.refreshToken
    if(!refreshToekn){
        return res.status(401).json({ message: "refresh token missing" });
    }
    const decoded = jwt.verify(
        refreshToekn,
        process.env.JWT_REFRESH_SECRET
    )
    const newAccessToken = jwt.sign(
        {
            id:decoded.id,
            email:decoded.email
        },
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN}
    )
    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false,
        samesite: 'strict',
        maxAge: 15 * 60 * 1000
    });
}
const logoutController=async(req,res)=>{
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    return res.redirect('/')
}

const uploadProfilePic = async (req, res) => {
    try {
        if (!req.user) return res.status(401).send('User not authenticated');
        if (!req.file) return res.redirect('/profile');

        // terminal debug
        console.log('Uploaded file object:', JSON.stringify(req.file, null, 2));
        console.log('Cloudinary URL:', req.file.path);
        console.log('req.user:', JSON.stringify(req.user, null, 2));

        // save Cloudinary URL in DB
        await userModel.findByIdAndUpdate(req.user.id, {
            profilePic: req.file.path
        });

        return res.redirect('/profile');
    } catch (err) {
        console.error('Upload error:', err);
        return res.status(500).send('Upload failed');
    }
};

const showProfilePage = async(req,res)=>{
    const user = await userModel.findById(req.user.id)
    return res.render('profile',{user})
}


module.exports = {showRegisterPage,showLoginPage,showDashBoardPage,login,refreshToeknController,logoutController,register,uploadProfilePic,showProfilePage}