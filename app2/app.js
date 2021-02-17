const express = require('express');
const bodyParser = require('body-parser');
const Request = require("request");
const https = require('https');
const path = require('path');
const fs = require('fs');
const app = express();

const keyUrl = 'https://replatformdev.blob.core.windows.net/dev/node/certificate/key.pem';
const certUrl = 'https://replatformdev.blob.core.windows.net/dev/node/certificate/cert.pem';

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({"message": "Welcome to Test application two."});
});

app.get('/appTwo', (req, res) => {
    const url = "https://localhost:3000/appOne";		
    Request.get(url, (error, response, body) => {
    	if(error) {
        	return console.dir(error);
    	}
	console.log("Appone from apptwo called!!");    
	const {data, message} = JSON.parse(body);
	console.log("data:", data);
	console.log("message:", message);       
    });
    res.json({"message": "Application two called"});	
})

/** const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app); **/

processKeyFromUrl = () => {
	return new Promise((resolve, reject) => {
		Request(keyUrl, (err, res, body) => {
		if(err) return reject(err);
			try{
				resolve(body);
			}catch(error){
				reject(error);
			} 
		});	
	});
}

processCertFromUrl = () => {
        return new Promise((resolve, reject) => {
                Request(certUrl, (err, res, body) => {
                if(err) return reject(err);
                        try{
                                resolve(body);
                        }catch(error){
                                reject(error);
                        }
                });
        });
}

const sslServer1 = async () => {
	const keyData = await processKeyFromUrl();
	const certData = await processCertFromUrl();
	return new Promise ((resolve, reject) => { 
		resolve(https.createServer({ key: Buffer.from(keyData, 'utf8'), cert: Buffer.from(certData, 'utf8') }, app))
	});
} 

sslServer1().then((data) => {
	data.listen(4000, () => console.log('Secure server on port 4000')
)});




