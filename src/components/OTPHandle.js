// OTPHandle.js
const mysql = require('mssql');
const {config}=require('../configs/config');
const  mobile='';
class OTPHandle {

    constructor(mobileNo, otpType, channel, transId, userId) {
        let connectionStr = "DSN_PAYMENT_PANEL_TRANS";
         this.mobileNo = mobileNo.length === 10 ? "95" + mobileNo : mobileNo;
this.mobile=mobileNo;
        // Load configuration settings (You need to implement LoadConfig)
        let attemptsLimit = process.env.OTP_ATTEMPTS || 3;
        let minutesLimit = process.env.OTP_BLOCK_MINUTES|| 30;
        let pinLength = process.env.OTP_PIN_LENGTH || 4;
        console.log("pinLength "+pinLength);
        // Validate pinLength
        if (this.pinLength < 4 || this.pinLength > 10) {
            this.pinLength = 4;
        }
        console.log("OTPHandle class ")
        this.reqTime = new Date();
        this.channel = channel;
        this.lastReqTime = new Date();
        this.transId = transId;
        this.userId = userId;
    }

    // Simulated LoadConfig method
    loadConfig(key) {
        const config = {
            "OTP_ATTEMPTS": 3,
            "OTP_BLOCK_MINUTES": 30,
            "OTP_PIN_LENGTH": 6
        };
        return config[key];
    }
   async HasAttempts(mode) {
        console.log(" HasAttempts "+ this.mobileNo )
        console.log( this.mobileNo );
        let isBlocked = false;
        let userid ='';
            await mysql.connect(config);

        let request = new mysql.Request();
        request.input("type", mysql.VarChar, mode);
        request.input("MobileNo", mysql.VarChar, this.mobileNo);
        request.input("channel", mysql.VarChar, "ADMINMPG");
        request.input("Transid", mysql.VarChar, this.transId);
        let resp =await request.execute("UDP_OTP_ATTEMPTS");
        console.log(resp);
        if (resp.recordsets[0] != null&&resp.recordsets[0].length>0) {
            let data=resp.recordsets[0];
            console.log(data[0].USERID +" Use r")
        }

    }
}

module.exports = OTPHandle;
