const express=require('express');
const login=express.Router();
const mysql = require('mssql');
const {config,rc4Decrypt,RC4Encryption}=require('../configs/config');
const { json } = require('express/lib/response');
const NodeCache = require('node-cache');
const mycache=new NodeCache();
login.post('/api/login', async (req, res) => {
    try {
        const oauth = req.headers['x-imi-oauth'];
        const { data } = req.body;
        const rc4Value = rc4Decrypt(data, oauth);
        const originalData = JSON.parse(decodeURIComponent(atob(rc4Value)));
        originalData = JSON.stringify(originalData);
        console.log(originalData);
        const AdminList = mycache.get("AdminList");
        if (AdminList == null) {
            AdminList = GetAdminList();
            console.log("getting data from db");
        }
        const UserList = AdminList.some(user => user.uname == originalData.uname)
        if (UserList) {

            await mysql.connect(config);
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
        else{
            
        }
    }
    catch (err) {
        console.log("err " + err);
        res.status(1).send(err);
    }
    finally {
        await mysql.close();
    }

});
async function  GetAdminList (){
    await mysql.connect(config);
    const request = new mysql.Request();
    request.input("MODE", mysql.VarChar, MODE);
    const results = await request.execute("udp_manage_adminlogin");
    const auList = _.map(results, (row) => {
        return {
            uid: row.userid,
            uname: row.username,
            md5pwd: row.passwordHash,
            displayname: row.displayname,
            contact: row.contact,
            ismerchant: row.IsMerchant
        };
    });
    mycache.set("AdminList",auList,3600);
    return auList;
}
function CheckLoginDetails(AdminList){

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