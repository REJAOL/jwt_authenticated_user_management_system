
require('dotenv').config()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'src','views'))

module.exports = app