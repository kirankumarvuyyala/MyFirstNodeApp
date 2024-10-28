require('dotenv').config();
const config = {
    user:process.env.DB_USER, // Ensure this is a valid SQL Server user
    password: process.env.DB_PASSWORD, // Ensure this password is correct
    server: '192.168.161.108', // Replace with your server IP or hostname
    database: 'PAYMENT_PANEL_TRANS', // Replace with your database name
    options: {
      encrypt: false, // Use true if your SQL Server is configured to use encryption
      trustServerCertificate: true, // Set to true if using self-signed certificates
      charset: 'UTF-8',
    }
  };
  const selfconfig = {
    user:process.env.DB_USER, // Ensure this is a valid SQL Server user
    password: process.env.DB_PASSWORD, // Ensure this password is correct
    server: '192.168.161.108', // Replace with your server IP or hostname
    database: 'SELFCARE_TRANS', // Replace with your database name
    options: {
      encrypt: false, // Use true if your SQL Server is configured to use encryption
      trustServerCertificate: true, // Set to true if using self-signed certificates
      charset: 'UTF-8',
    }
  };
  const anotherConfig = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000', // Example additional config
};
function RC4Eryption(text,pwd){

let password = 'OoredooMM!123$';
  //eslint-disable-next-line
  if(pwd!=null && pwd !=undefined && pwd !='')
  {
    password = pwd;
  }
console.log(password +" pwd");
  var cipherEnDeCrypt = '';
  var N = 256;
  var cipher = '';
  // var a;
  var sbox;
    sbox = [];
    let key = [];
    let n11 = password.length;
    for (let a = 0; a < N; a++) {
      let ac = password[a % n11];
      key[a] = ac.charCodeAt(0);
      sbox[a] = a;
    }
    let b = 0;
    for (let a = 0; a < N; a++) {
      b = (b + sbox[a] + key[a]) % N;
      let tempSwap = sbox[a];
      sbox[a] = sbox[b];
      sbox[b] = tempSwap;
    }

    //eslint-disable-next-line
    var cipher = '';
    var i = 0,
      j = 0,
      k = 0;
    for (var a = 0; a < text.length; a++) {
      i = (i + 1) % N;
      j = (j + sbox[i]) % N;
      var tempSwap = sbox[i];
      sbox[i] = sbox[j];
      sbox[j] = tempSwap;

      k = sbox[(sbox[i] + sbox[j]) % N];

      var cipherBy = text[a].charCodeAt(0) ^ k;

      var _tmp1 = String.fromCharCode(cipherBy);
      cipher += _tmp1 + '';
    }

    var enctxt = '';
    //eslint-disable-next-line
    for (var i = 0; i < cipher.length; i++) {
      var v = cipher[i].charCodeAt(0);
      var _cc = v.toString(16);
      //eslint-disable-next-line
      if (_cc.length == 1) _cc = '0' + _cc;
      enctxt += _cc;
    }

return(enctxt);
}
function rc4Decrypt(ciphertext, rcpwd) {
  const N = 256;
  let sbox = [];
  let key = [];
  let decrypted = '';

  // Initialize key and sbox
  const n11 = rcpwd.length;
  for (let a = 0; a < N; a++) {
      key[a] = rcpwd[a % n11].charCodeAt(0);
      sbox[a] = a;
  }

  // Key-Scheduling Algorithm
  let b = 0;
  for (let a = 0; a < N; a++) {
      b = (b + sbox[a] + key[a]) % N;
      [sbox[a], sbox[b]] = [sbox[b], sbox[a]];
  }

  // Pseudo-Random Generation Algorithm
  let i = 0, j = 0;
  for (let a = 0; a < ciphertext.length; a += 2) {
      i = (i + 1) % N;
      j = (j + sbox[i]) % N;
      [sbox[i], sbox[j]] = [sbox[j], sbox[i]];
      
      const k = sbox[(sbox[i] + sbox[j]) % N];

      // Get the hex pair
      const hexPair = ciphertext.substr(a, 2);
      const charCode = parseInt(hexPair, 16);
      
      // Decrypt the byte
      const decryptedChar = String.fromCharCode(charCode ^ k);
      decrypted += decryptedChar;
  }

  return decrypted;
}

  module.exports= {config,selfconfig,anotherConfig,rc4Decrypt,RC4Eryption};