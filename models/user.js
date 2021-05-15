const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const UserSchema = new Schema({
    name :{
        type: String,
        required : [true, 'Please provide a name.'],
    },
    email:{
        type: String,
        required: [true,"Please provide an email."],
        unique :true,
        match:[
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email.",
        ]
    },
    password:{
        type : String,
        required: [true,"Please provide an password."],
        minlength :[6,"Please provide a password with min length 6."],
        select : false,
    },

    profile_image :{
        type: String,
        default : "Image.jpg",
    },

    role :{
        type : String,
        enum: ["visitor", "admin"],
        default : "visitor",
    },

    createdAt :{
        type : Date,
        default : Date.now,
    },

    blocked :{
        type : Boolean,
        default : false,
    },

    resetPasswordToken:{
        type:String,
    },

    resetPasswordExpire :{
        type : Date
    }

});

UserSchema.methods.generateJWTFromUser = function(){
    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;
    
    const payload ={
        id: this._id,
        name : this.name,
    };

    const token = jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn : JWT_EXPIRE,
    })

    return token;
};

UserSchema.methods.getResetPasswordTokenFromUser = function(){
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const {RESET_PASSWORD_EXPIRE} = process.env;
    const randomPasswordToken = crypto
    .createHash('SHA256')
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = randomPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);
    return randomPasswordToken;
}

UserSchema.pre("save",function(next){
    if(!this.isModified("password")){
        next();
    }

    bcrypt.genSalt(10, (err, salt)=> {
        if(err ) next(err);
        bcrypt.hash(this.password, salt, (err, hash) =>{
            if(err) next(err);
            this.password = hash;
            next();
        });
    });
})

module.exports = mongoose.model('User',UserSchema);
