const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const mailtransport = nodemailer.createTransport({
    service:"Gmail",
    host:'smtp.gmail.com',
    auth:{
        user:process.env.USER,
        pass:process.env.PASSWORD
    }
});

var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, './public/uploads');    
    }, 
    filename: function (req, file, cb) { 
       cb(null , new Date().getTime()+"-"+path.extname(file.originalname));   
    }
 });


module.exports = { mailtransport, storage };