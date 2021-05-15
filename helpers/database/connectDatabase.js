const mongoose = require('mongoose');
const connectDatabase = async ()=>{
    await mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
         useFindAndModify: false,
         useCreateIndex :true,
         useUnifiedTopology:true 
    })
    .then(()=>{
        console.log('MongoDB Connection Successfull.')
    })
    .catch((err)=>{
        console.log('MongoDB Connection Error: '+err)
    })
}


module.exports = connectDatabase;