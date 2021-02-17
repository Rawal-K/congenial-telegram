const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');
const fs = require('fs');
const Request = require("request");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({"message": "Welcome to test application one."});
});

app.get('/appOne', (req, res) => {
    const data = {"data": "1111", "message": "Application one called."};
    console.log("Application one called", data);	
    res.send(data);		
});


const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))	
}, app);

sslServer.listen(3000, () => console.log('Secure server on port 3000'));

















