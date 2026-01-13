const userModel = require("../models/userModel.js")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async(req,res)=>{
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
    const user =  new userModel({
        username,
        email,
        password:hashedPassword
    })
    await user.save()

    const token = jwt.sign(
        {
            id:user._id,
            email:user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN
        }
    )
    return res.status(201).json({
        message:"user created successfully",
        token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
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


    return res.status(200).json({
        message:'successfully loggedin',
        success:true,
        accessToken,
        user:{
            id:findUser._id,
            email:findUser.email,
            username:findUser.username
        }
    })
}

const refreshToken = (req,res)=>{
    const token = req.cookies.refreshToken
    if(!token) return res.status(401).json({
        message:"refresh token is missing"
    })
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
     const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    )
    res.json({accessToken})
}

const dashboard = (req,res)=>{
    res.json({
        message:"welcome to dashboard",
        user:req.user
    })
}
module.exports = {register, login, dashboard, refreshToken}