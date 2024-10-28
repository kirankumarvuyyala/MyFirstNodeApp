const fs=require("fs").promises;
const { error } = require("console");
const getname=require('../home');
require('dotenv').config();
const os=require('os');
const path=require('path');
let mypath='D:\OneDrive - Digitral\Training\React\Node\MyFirstApp\App.js';

// console.log(path.basename(mypath))
// // console.log(path.fileName(mypath))
// console.log(path.extname(mypath))
// console.log(path.parse(mypath))
// console.log(path.dirname(mypath))
// console.log(os.uptime());
// console.log(os.freemem());
// console.log(os.userInfo());
// console.log(os.freemem);
// fs.mkdir('./components',(error)=>{
//     if(error){
//         console.log(error);
//     }
// })
const data="KK  with node .js";
fs.writeFile('./components/Test.txt',data,{flag: 'a'});
fs.rename('./components/Test.txt','./components/LogFile.txt')
let dirname='./components';
console.log('Attempting to get file:', dirname);
fs.readdir(dirname, (err, files) => {
    if(err){
        console.log(err);
        return;
    }
    if (files.length === 0) {
        console.log('Directory is empty.');
    } else {
        console.log('Directory read successfully! Here are the files:');
        files.forEach(file => console.log(file));
    }
})
let delpath='./components/LogFile.txt';
console.log('Attempting to delete file:', delpath);
fs.unlink(delpath, (err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log('File Deleted Successfully!')
})
global.keyname="Test";

async function ReadjsonFile(fileName) {
    try {
        var data = await fs.readFile(fileName, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`Error While Reading The File ${fileName} :: Error ${error}`)
        return [];
    }

}
async function main() {
    try {

        var names = await ReadjsonFile('names.json');
        var address = await ReadjsonFile('address.json');
        const biodata = names.map((name) => {
            const matchingadd = address.find((address) => address.id == name.id);
            return { ...name, ...matchingadd };
        })
        await fs.writeFile('biodata.json',JSON.stringify(biodata, null, 2));
        getname('kk');
        getname('kk18');
        console.log("Success "+ keyname);
    }
    catch (error) {
        console.error(`error while reading Data `);
    }
    
    
}
// main();