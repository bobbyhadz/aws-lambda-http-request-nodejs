const https = require('https');

function deleteRequest(path) {
  const options = {
    hostname: 'reqres.in',
    // 👇 specify path e.g. /api/users/2
    path: path,
    method: 'DELETE',
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
          // 👇️ It's possible that your API has no response for DELETE requests
          // If so, remove `JSON.parse(rawData)` and simply resolve()
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(new Error(err));
        }
      });
    });

    req.on('error', err => {
      reject(new Error(err));
    });

    req.end();
  });
}

exports.handler = async event => {
  try {
    const result = await deleteRequest(`/api/users/2`);
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
