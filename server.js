const  http  = require('http');
const express=require('express');
const app=new express();
const {config,anotherConfig}=require('./src/configs/config');
const PORT = process.env.PORT || 5000;
const mysql=require('mssql');
const cors=require('cors');
const Login=require('./src/components/login');
const home=require('./src/components/home');
const { json } = require('express/lib/response');
const { Console } = require('console');

  app.use(express.json());
//   app.use(cors({origin:'http://localhost:4200' }));  //specific domine  angular
   app.use(cors());//  all domines postman 
  app.use(Login);
  app.use(home);
  app.get('/', async (req, res) => {
    try {
        // Connect to SQL Server
        await mysql.connect(config);

        // Query the database
        const result = await mysql.query('SELECT MOBILENO, USERID, OTP, REQUEST_DATE, ATTEMPTS FROM TBL_OTP_ATTEMPTS');
        const rows = result.recordset;

        let htmlTable = '<!DOCTYPE html><html><head><title>Data Table</title></head><body>';
        htmlTable += '<h1>Data Table</h1>';
        htmlTable += '<table border="1"><thead><tr>';

        // Add table headers
        if (rows.length > 0) {
            Object.keys(rows[0]).forEach(column => {
                htmlTable += `<th>${column}</th>`;
            });
            htmlTable += '</tr></thead><tbody>';

            // Add table rows
            rows.forEach(row => {
                htmlTable += '<tr>';
                Object.values(row).forEach(value => {
                    htmlTable += `<td>${value}</td>`;
                });
                htmlTable += '</tr>';
            });
            htmlTable += '</tbody></table>';
        } else {
            htmlTable += '<p>No data found.</p>';
        }
        htmlTable += '</body></html>';

        // Send the HTML response
        res.status(200).set('Content-Type', 'text/html').send(htmlTable);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close the SQL Server connection
        await mysql.close();
    }
});

// Routes
app.get('/api/items', async (req, res) => {
    try { 
         console.log(req.body);
        await mysql.connect(config);
        // Query the database
        const Response = await mysql.query(' SELECT MOBILENO,USERID,OTP,REQUEST_DATE,ATTEMPTS FROM TBL_OTP_ATTEMPTS');
        return res.json(Response.recordset);

    } catch (err) {
        console.error('SQL error:', err);
        console.log("Error " + err);
        res.status(500).send('Error executing query');
    } finally {
        await mysql.close();
    }
});
app.get('/api/getall', async (req, res) => {
    try {
        console.log("get data  from server page");
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

app.get('/api/items/:ID', async (req, res) => {
    try {


        var { ID } = req.params;
        await mysql.connect(config);
        const request = new mysql.Request();
        // const query = `SELECT MOBILENO,USERID,OTP,REQUEST_DATE,ATTEMPTS FROM TBL_OTP_ATTEMPTS WHERE USERID=@ID`;
        const query = ` UPDATE TBL_OTP_ATTEMPTS SET OTP='112211' WHERE USERID=@ID`;
        const resp = await request.input("ID", mysql.NVarChar, ID).query(query);
        return res.json(resp.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        console.log("Error " + err);
        res.status(500).send('Error executing query');
    } finally {
        await mysql.close();
    }
});

app.post('/api/update', async (req, res) => {
    try {
        const { MOBILENO, USERID,OTP,ATTEMPTS,MODE } = req.body;
        await mysql.connect(config);
        const request = new mysql.Request();
        request.input("MODE", mysql.VarChar, MODE);
        request.input("MOBILENO", mysql.VarChar, MOBILENO);
        request.input("USERID", mysql.VarChar, USERID);
        request.input("OTP", mysql.VarChar, OTP);
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

app.post('/api/update/:ID/:MODE/:OTP', async (req, res) => {
    try {
        const { ID, MODE,OTP } = req.params;
        console.log("iD "+ID);
        await mysql.connect(config);
        const request = new mysql.Request();
        request.input("MODE", mysql.VarChar, MODE);
        request.input("USERID", mysql.VarChar, ID);
        request.input("OTP", mysql.VarChar, OTP);
        request.output("RETVAL", mysql.Int);

        const resp = await request.execute("UDP_OTP_ATTEMPTS_TEMP");
        let results = resp.output.RETVAL
        console.log('results '+results);
        // console.log('RESP ' +res.json(resp));
        if (results > 0) {
            return res.status(200).send("Updated SuccessFully");
        }
        else
            return res.status(901).send('error while  updateing data');
    }
    catch (err) {
        console.log("err " + err);
        res.status(1).send(err);
    }
    finally{
        mysql.close();
    }

});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
