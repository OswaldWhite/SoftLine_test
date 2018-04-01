'use strict'

const http = require('http');    
const querystring = require('querystring');
let url = "http://93.174.135.221:8080/sd/services/rest/get/test$2145641?accessKey=85bd54ca-55fd-4fa0-8d0a-8a9906efce54";
var key1, answer, nextUUID, state;
function doRequest(url) {
    http.get(url, (res) => {
        let { statusCode } = res;
        let contentType = res.headers['content-type'];
      
        let error;
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(`Invalid content-type.\n` +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.error(error.message);
          // consume response data to free up memory
          res.resume();
          return;
        }
      
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            console.log(parsedData);

            nextUUID = parsedData.next.UUID;
            key1 = parsedData.key1;
            answer = parsedData.answer;

            if (!!answer) {
                console.log("VICTORY = " + answer);
            } else {
                setTimeout(editRequest, 500, nextUUID, key1);
                setTimeout(editRequest2, 1000, nextUUID);
                setTimeout(doRequest, 3000, setURLforFind(nextUUID));
            }
          } catch (e) {
            console.error(e.message);
          }
        });
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });
}

function editRequest(UUID, key1) {
    let postData = querystring.stringify({
      });
      let options = {
        hostname: '93.174.135.221',
        port: 8080,
        path: "/sd/services/rest/edit/" + UUID + "?accessKey=85bd54ca-55fd-4fa0-8d0a-8a9906efce54&response=" + key1,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      console.log("PATH: " + options.path);
      let req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          console.log('No more data in response.');
        });
      });
      
      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });
      
      req.write(postData);
      req.end();

}

function editRequest2(UUID) {
    let postData = querystring.stringify({
    });
    let options = {
      hostname: '93.174.135.221',
      port: 8080,
      path: "/sd/services/rest/edit/" + UUID + "?accessKey=85bd54ca-55fd-4fa0-8d0a-8a9906efce54&state=closed",
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log("PATH: " + options.path);
    let req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });
    
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    
    req.write(postData);
    req.end();

}

doRequest(url);