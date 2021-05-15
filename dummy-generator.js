const Article = require("./models/article");
const Answer = require("./models/answer");
const User = require("./models/user");
const fs = require("fs");
const connectDatabase = require("./helpers/database/connectdatabase");
const CustomError = require("./helpers/errors/CustomError");

const dotenv = require("dotenv");

const path = "./dummy/";

const users = JSON.parse(fs.readFileSync(path + "users.json" ));
const articles = JSON.parse(fs.readFileSync(path + "article.json" ));
const answers = JSON.parse(fs.readFileSync(path + "answers.json" ));

dotenv.config({
    path : "./config/env/config.env"
});

connectDatabase();

const importAllData = async function(){
    try {
        await User.create(users);
        await Article.create(articles);
        await Answer.create(answers);
        console.log("Import Process Successful");

    }   
    catch(err) {
        console.log(err);
        console.err("There is a problem with import process");
    }
    finally {
        process.exit();
    }
};

const deleteAllData = async function(){
    try {
        await User.deleteMany();
        await Article.deleteMany();
        await Answer.deleteMany();
        console.log("Delete Process Successful");


    }   
    catch(err) {
        console.log(err);
        console.err("There is a problem with delete process");
    }
    finally {
        process.exit();
    }
};

if (process.argv[2] == "--import"){
    importAllData();
}
else if (process.argv[2] == "--delete"){
    deleteAllData();
}
