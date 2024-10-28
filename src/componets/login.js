const express=require('express');
const login=express.Router();

login.get('/login', async (req, res) => {
    try {
        res.send("Login File");
    }
    catch(err){
        res.send("Error in Login File");
    }
});
module.exports = login;