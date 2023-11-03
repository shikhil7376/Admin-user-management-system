
const userRoute = require('./routes/userRoutes')
const adminroute = require('./routes/adminRoutes')
const session = require('express-session')

const mongoose = require("mongoose")
const nocache = require('nocache')
const express = require('express')
const app = express();


app.set('view engine', 'ejs')
app.use(nocache())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret:"asdfghjkloiuyyjdsh",
    resave:false,
    saveUninitialized:true
}))

app.use('/',userRoute)
app.use('/admin',adminroute)

mongoose
    .connect('mongodb://127.0.0.1:27017/user_managment_system')
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err))

app.listen(3000,function(){
    console.log("server runnng");
})
