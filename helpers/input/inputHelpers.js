const bcrypt = require('bcryptjs');

const validateInputs = (email,password)=>{
    return email && password;
}

const comparePassword = (user,password)=>{ 
    return bcrypt.compareSync(password,user.password);
}

module.exports = {
    validateInputs,
    comparePassword
};