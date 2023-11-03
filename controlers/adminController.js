const { render } = require('ejs');
const User = require('../models/userModel');
const bcrypt = require('bcrypt')



const securepassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch(error){
        console.log(error.message);
    }
}
const loadAdmin = async(req,res)=>{
    try{
        res.render('admin/adminLogin')
    } catch(error){
        console.log(error.message);
    }
}


const adminValid = async(req,res)=>{
    const { email, password} = req.body;
  
    try{
        const admin = await User.findOne({email})
    
        if(!admin){
            return res.render('admin/adminLogin',{message:"admin not registerd"})
        }
        
        const isMatch = await bcrypt.compare(password,admin.password)
        if(!isMatch){
            return res.render('admin/adminLogin',{ message:"password is incorrect" })
        }
        if(admin.is_admin === 1){
            req.session.admin = admin._id
            res.redirect('/admin/dashboard');
        }else{
            res.render('admin/adminLogin',{ message:"your not a admin" })
        }
       
      
    } catch(error){
        console.log(error.message);
    }
}
const userDashboard = async (req,res)=>{  
    const { query } = req.query
    try {
        let users;
        if (query) {
            users = await User.find({ name: { $regex: '.*' + query + '.*',$options: 'i' }, is_admin: 0 });
        } else {
            users = await User.find({ is_admin: 0 });
        }
        return res.render('admin/dashboad', { users, query });
    } catch (error) {
        res.render('admin/dashboad')
    }
}
const deleteUser = async (req,res)=>{
    try{
        const { userId } = req.query
        const deleteUser = await User.findByIdAndDelete(userId)


        if(!deleteUser){
           
            res.render('admin/dashboad',{message:"user not found"})
        }
        if(deleteUser){
         
            return res.redirect('/admin/dashboard')
        }


    } catch(error){
        console.log(error)
    }
}

const editerload = async(req,res) =>{
    const { id } = req.params
    try{
        const user = await User.findById(id)
        res.render('admin/userEdit', { user })    

    } catch(error){
        console.log(error);
    }
}

const updateUser = async (req,res) => {
    const { id } = req.params
    const { name, email, mobile, is_varified } = req.body
    try{
        await User.findByIdAndUpdate(id, {$set: {
            name,
            email,
            mobile,
            is_varified
        }})

        res.redirect('/admin/dashboard')
    } catch(erro){
        console.log(erro);
    }
}

const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/admin/login')
}

const loadCreateUser = async (req,res,next) => {
    try{
        res.render("admin/createUser")
    } catch(error){
        console.log(error);
    }
}
const createUser = async(req,res)=>{
    const { name, email, password, mno } = req.body;
    try{
        const spassword = await securepassword(password)
        const user = new User({
            name,
            email,
            password: spassword,
            mobile: mno,
        })
        const userData = await user.save()
        if(userData){
            res.render('user/registration',{message:"Create new user has been successfully."})
            
             req.session.user = user._id;

        }else{
            res.render('user/registration',{message:'Create new use has been failed.'})
        }
        
    } catch(error){
        console.log(error.message);
    }

}

module.exports = {
    adminValid,
    loadAdmin,
    userDashboard,
    deleteUser,
    logout,
    updateUser,
    editerload,
    loadCreateUser,
    createUser
}