const express = require('express')
const admin_route = express.Router()
const adminController = require('../controlers/adminController')
const Auth = require("../middleware/Auth")





admin_route.get('/login', Auth.logoutAdmin, adminController.loadAdmin)

admin_route.post('/login', Auth.logoutAdmin,  adminController.adminValid)

admin_route.get('/dashboard', Auth.loggedadmin, adminController.userDashboard)

admin_route.post('/users/Delete', Auth.loggedadmin, adminController.deleteUser)

admin_route.get('/users/:id/Edit', Auth.loggedadmin,  adminController.editerload)

admin_route.post('/users/:id', Auth.loggedadmin,  adminController.updateUser)

admin_route.post('/logout', Auth.loggedadmin, adminController.logout)

admin_route.post('/createUser', Auth.loggedadmin, adminController.createUser)

admin_route.get('/dashboard/createUser', Auth.loggedadmin, adminController.loadCreateUser)

admin_route.get('/logoutAdmin',Auth.logouting)






module.exports = admin_route;
