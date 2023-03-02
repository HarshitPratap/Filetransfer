const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Users = require('../DB/UserModel');
const {isNotLogin} = require('./middlewares/middlewares');

//get login route
router.get('/',isNotLogin, (req,res) => {
    res.render('login',{
        message:req.flash()
    });
});

//login route
router.post('/login',isNotLogin,passport.authenticate('local',{failureFlash: true, successRedirect : '/', failureRedirect:'/auth/'}));

//get register route
router.get('/register',isNotLogin, (req,res) => {
    res.render('register');
});

//post register route
router.post('/register',isNotLogin,async (req,res) => {
    const userData = {
        username:req.body.username,
        email:req.body.email,
        password: await bcrypt.hash(req.body.password, 10)
    };
    const userExist = await Users.findOne({email: userData.email});
    if(userExist){
        res.render('register',{
            status:false,
            message:"User already exist with email.",
            req:req.body
        });
        return;
    }
    const user = await Users.create(userData);
    if(!user){
        res.render('register',{
            status:false,
            message:"Something went wrong.",
            req:req.body
        });
        return;
    }
    res.redirect('/auth/');
});

//get route to reset password
router.get('/forgotpassword', isNotLogin, (req,res) => {
    res.render('forgotpassword');
});

//post route to reset password
router.post('/forgotpassword/', isNotLogin, async (req,res) => {
    const userExist = await Users.findOne({email: req.body.email});
    if(!userExist){
        res.render('forgotpassword',{
            status:false,
            message:"No user exist wit this email.",
            email: req.body.email
        });
        return;
    }
    const mailopt = {
        from:process.env.USER,
        to:req.body.email,
        subject:"File download link",
        html:`<p>Please follow the link to download your file</p><br/>${str}
        <a href="${req.headers.origin}/sendfile/file/${file.id}">Click Here</a>`
    }
    mailtransport.sendMail(mailopt ,function (error,resp) {
        if(error){
            res.render('sendfile', {
                status : false,
                message : "Something went wrong."
            });
            return;
        }else if(resp){ 
            res.render('sendfile', {
                status : true,
                message : "File uploaded and mail sent."
            }); 
            return;           
        }
    });
});

//logout routes
router.get('/logout', (req,res) =>{
    req.logOut((err) => {if(err) console.log(err)});
    res.redirect('/');
});


module.exports = router;