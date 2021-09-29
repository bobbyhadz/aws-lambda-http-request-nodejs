const https = require('https');

function putRequest(path, body) {
  const options = {
    hostname: 'reqres.in',
    // 👇 specify path e.g. /api/users/2
    path: path,
    method: 'PUT',
    port: 443, // 👈️ replace with 80 for HTTP requests
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let rawData = '';

      res.on('data', chunk => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(new Error(err));
        }
      });
    });

    req.on('error', err => {
      reject(new Error(err));
    });

    // 👇️ write body on request object
    req.write(JSON.stringify(body));
    req.end();
  });
}

exports.handler = async event => {
  try {
    const result = await putRequest(`/api/users/2`, {
      name: 'Bob Jones',
      job: 'accountant',
    });
    console.log('result is: 👉️', result);

    // 👇️️ response structure assume you use proxy integration with API gateway
    return {
      statusCode: 200,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.log('Error is: 👉️', error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
