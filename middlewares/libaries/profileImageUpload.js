const path = require('path');
const multer = require('multer');
const CustomError = require('../../helpers/errors/CustomError');

const storage = multer.diskStorage({
    destination : function(req,file,cal){
        const rootDir = path.dirname(require.main.filename);
        cal(null,path.join(rootDir,"/public/uploads"));
    },

    filename : function(req,file,cb){
        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_" + req.user.id + "."+ extension;
        cb(null,req.savedProfileImage);
    }
});

const fileFilter = (req,file,cb) =>{
    let allowedMineTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

    if(!allowedMineTypes.includes(file.mimetype)){
         cb(new CustomError('Please provide a valid image file.',400),false);
    }

     cb(null, true);
}

const profileImageUploaded = multer({storage,fileFilter});

module.exports = profileImageUploaded;