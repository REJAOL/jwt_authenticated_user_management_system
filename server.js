const app = require("./app.js")
const connectDB = require("./src/config/mongodb.js")
const userRoutes = require("./src/routes/userRoutes.js")
const viewRoutes = require('./src/routes/viewRoutes.js')

const port = process.env.PORT || 5000
connectDB()


app.use('/users', userRoutes )
app.use('/', viewRoutes)



app.listen(port, ()=>{
    console.log(`app is running on port: ${port}`)
})

