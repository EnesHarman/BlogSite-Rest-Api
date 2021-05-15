const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const router = require('./routers');

const connectDatabase = require('./helpers/database/connectDatabase');
const customErrorHandler = require('./middlewares/customErrorHandler');

dotenv.config({
    path: './config/env/config.env',
})

const {PORT} = process.env;

connectDatabase();

app.use(express.json());

app.use('/api',router); 

app.use(customErrorHandler);

app.use(express.static(path.join(__dirname,"public")));

app.listen(PORT,()=>{
    console.log(`Server working on localhost:${PORT}`);
})