const express=require('express');
const login=express.Router();
const mysql = require('mssql');
const {config,PAYMENT_PANEL,rc4Decrypt,RC4Encryption}=require('../configs/config');
const NodeCache = require('node-cache');
const mycache=new NodeCache();
const OTPHandle=require('./OTPHandle')
const { v4: uuidv4 } = require('uuid');



login.post('/api/login', async (req, res) => {
    try {
        const oauth = req.headers['x-imi-oauth'];
        const { data } = req.body;
        const rc4Value = rc4Decrypt(data, oauth);
        let originalData = JSON.parse(decodeURIComponent(atob(rc4Value)));
        console.log(originalData);
        console.log(originalData.uname);
        let AdminList = mycache.get("AdminList");
        if (!Array.isArray(AdminList)) {
            AdminList =await GetAdminList();
        }
        console.log(typeof AdminList);
        //  AdminList= Object.values(AdminList);
        const UserList = AdminList.find(user => user.uname.toLowerCase() == originalData.uname.toLowerCase() )
        console.log(typeof UserList);
        console.log(UserList);
        if (UserList!=null) {
            console.log(typeof UserList);
            let DBRes =await GetIncorrectAttempts('R', UserList.uid, "LOGIN", process.env.OTP_ATTEMPTS);
            if (DBRes == 0) {
                return res.status(200).json({ code: 400, message: "User Blocked " });
            }
            else {
                const transId = uuidv4().replace(/-/g, '');
                let OTP = Math.floor(100000 + Math.random() * 900000);
                console.log("contact "+UserList)
                const otpHandle = new OTPHandle(UserList.contact,"SMS", "Web",transId, UserList.uid);
               let HasAttempt= await otpHandle.HasAttempts("R")
                await mysql.connect(PAYMENT_PANEL);
                const request = new mysql.Request();
                request.input("MODE", mysql.VarChar, MODE);
                request.input("MOBILENO", mysql.VarChar, originalData.uname);
                request.input("USERID", mysql.VarChar, originalData.pwd);
                request.input("ATTEMPTS", mysql.Int, ATTEMPTS);
                request.output("RETVAL", mysql.Int);

                const resp = await request.execute("UDP_OTP_ATTEMPTS_TEMP");
                let results = resp.output.RETVAL
                console.log('results ' + results);
                if (results > 0) {
                    return res.status(200).json({ code: 200, message: "Updated SuccessFully" });
                } else {
                    return res.status(901).json({ code: 901, message: 'Error while updating data' });
                }
            }
        }
        else{
            console.log(" userList " +UserList);
        }
    }
    catch (err) {
        console.log("err " + err);
        res.send("Error in Login File");
    //    res.status(1).send(err);
    }
    finally {
        await mysql.close();
    }

});
async function  GetAdminList (){
    await mysql.connect(PAYMENT_PANEL);
    const request = new mysql.Request();
    const results = await request.execute("udp_manage_adminlogin");
    const auList  = results.recordsets[0].map(row => ({
        uid: row.userid,
        uname: row.username,
        md5pwd: row.passwordHash,
        displayname: row.displayname,
        contact: row.contact,
        ismerchant: row.IsMerchant
    }));
    mycache.set("AdminList",JSON.stringify(auList, null, 2),3600);
    await mysql.close();
    return auList;
}
async function GetIncorrectAttempts(mode,id,action,numbers){
    const localDate = new Date();
      const updated_date = localDate.toLocaleString()
    await mysql.connect(config);
    let request =new mysql.Request();
    request.input("mode",mysql.Char,mode);
    request.input("userid",mysql.VarChar,id);
    request.input("action",mysql.VarChar,action);
    request.input("maxcount",mysql.Int,numbers);
    request.input("logtime",mysql.DateTime,updated_date);
    request.input("startdate",mysql.DateTime,updated_date);
    request.output("result",mysql.Int,10);
    let resp= await request.execute("udp_incorrect_attempts");
    console.log(" attempts "+resp.output.result);
    return resp.output.result;
}
login.get('/get', async (req, res) => {
    try {
        await mysql.connect(config);
        const request = new mysql.Request();
        request.input("MODE", mysql.VarChar, MODE);
        request.input("MOBILENO", mysql.VarChar, originalData.uname);
        request.input("USERID", mysql.VarChar, originalData.pwd);
        request.input("ATTEMPTS", mysql.Int, ATTEMPTS);
        request.output("RETVAL", mysql.Int);

        const resp = await request.execute("udp_manage_adminlogin");
        res.send("Login File");
    }
    catch(err){
        res.send("Error in Login File");
    }
});


module.exports = login;