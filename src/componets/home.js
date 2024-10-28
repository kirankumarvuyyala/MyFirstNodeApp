const express=require('express');
let home= express.Router();
const mysql = require('mssql');
const {config,selfconfig}=require('../configs/config');
const multer=require('multer');
const path=require('path');
const csv = require('csv-parser');

const fs=require('fs');
const res = require('express/lib/response');
const DestFolder='D:/OneDrive - Digitral/Training/React/Node/UploadFile';
if(!fs.existsSync(DestFolder)){
fs.mkdirSync(DestFolder,{recursive:true});
}
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,DestFolder);
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})
const uploader=multer({storage:storage});
home.post('/api/uploadFile',uploader.single('file'),async(req,res)=>{
    if(!req.file){
        return res.status(400).send({code:"400",message:"No File Uploaded"});
    }
    else {
        var filepath = path.join(DestFolder, req.file.filename);
        const localDate = new Date();
        console.log("READ file")
          const updated_date = localDate.toLocaleString()
          console.log("Date Time :: "+updated_date);
        await mysql.connect(selfconfig);
        fs.createReadStream(filepath)
            .pipe(csv({ headers: false })) // Disable automatic header parsing
            .on('data', (data) => {
                // Each line is an array of values
                const row = Object.values(data); // Convert to array
                // Process the first column (pipe-separated)
                if (row.length > 0) {
                    const primaryValue = row[0];
                    const values = row.length > 1 ? row[1].split(',') : []; // Split the second column if it exists

                    const primaryParts = primaryValue.split('|');
                    if (primaryParts.length === 2 && primaryParts[0] && primaryParts[1]) {
                        const offerid = primaryParts[0].trim();
                        const planid = primaryParts[1].trim();
                        const request = new mysql.Request();
                        request.input("OFF_ID", mysql.VarChar, offerid);
                        request.input("PRIMARY_PLANIDS", mysql.VarChar, planid);
                        request.input("UPDATED_DATE", mysql.DateTime, updated_date);
                        request.execute("UDP_UPDATE_B2B_PP");
                        // UDP_UPDATE_B2B_PP
                    }
                }
            })

        return res.status(200).send({ code: "200", message: "File Saved SuccessFully" });
    }
})

home.get('/home',(req,res)=>{
    try
    {
        res.status(200).send("homepage details ");
    }
    catch(error){
        res.send("error in homepage details");
    }
})
home.post('/api/insert', async (req, res) => {
    try {
        console.log("insert Working");
        console.log(req.body);
        const hrTime = process.hrtime();
        const ticks = hrTime[0] * 1e9 + hrTime[1];
        console.log("new Date() "+new Date());
        const { MOBILENO, USERID,OTP,ATTEMPTS,MODE } = req.body;
        await mysql.connect(config);
        const request = new mysql.Request();
        request.input("MODE", mysql.VarChar, MODE);
        request.input("MOBILENO", mysql.VarChar, MOBILENO);
        request.input("USERID", mysql.VarChar, USERID);
        request.input("Transid", mysql.VarChar,String(ticks));
        request.input("channel", mysql.VarChar, "NODE");
        request.input("OTP", mysql.VarChar, OTP);
        request.input("otptype", mysql.VarChar, "PROFILE");
        request.input("updated_date", mysql.DateTime, new Date());
        request.input("ATTEMPTS", mysql.Int, ATTEMPTS);
        request.output("RETVAL", mysql.Int);

        const resp = await request.execute("UDP_OTP_ATTEMPTS_TEMP");
        let results = resp.output.RETVAL
        console.log('results '+results);
        if (results > 0) {
            return res.status(200).json({code:200, message: "Updated SuccessFully" });
        } else {
            return res.status(901).json({code:901, message: 'Error while updating data' });
        }
    }
    catch (err) {
        console.log("err " + err);
        res.status(1).send(err);
    }
    finally{
            await mysql.close();
    }

});
home.get('/api/getall', async (req, res) => {
    try {
        console.log("get data  from home page ");
        await mysql.connect(config);
        const request = new mysql.Request();
        request.input('MODE', mysql.VarChar, "R");
        request.output("RETVAL", mysql.Int);
        const resp = await request.execute('UDP_OTP_ATTEMPTS_TEMP');
        return res.json(resp.recordset);

    }
    catch (err) {
        console.log('error while getting data ' + err);
        res.status(500).send('Error executing query');
    }
    finally {
        mysql.close();
    }

});

module.exports=home;