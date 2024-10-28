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
  module.exports= {config,selfconfig,anotherConfig};