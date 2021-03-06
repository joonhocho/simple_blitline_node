// jscs:disable requireTrailingComma,requirePaddingNewLinesBeforeLineComments

// Library version.
exports.version = '2.1.1';

// core modules
var https = require('https');

var jobs = [];

// exports
module.exports = {
  addJob: function(jobHash) {
    if (typeof jobHash !== 'object') {
      return console.error('The job submitted must be an object!');
    }

    jobs.push(jobHash);
    return jobs;
  },
  postJobs: function() {
    return new Promise(function(resolve, reject) {
      var result = null;

      // stringify the jobs Array to prep sending it to Blitline API
      var body = JSON.stringify({json: jobs});

      // after creating the body, clear the jobs Array
      jobs = [];

      // create the options Object for the https.Agent
      options = {
        host: 'api.blitline.com',
        port: 443,
        path: '/job',
        method: 'POST',
        headers: {
          'Content-Length': body.length,
          'Content-Type': 'application/json'
        },
        rejectUnauthorized: true
        // jscs:enable
      };

      // create a https Agent to keep the connection alive
      options.agent = new https.Agent(options);

      request = https.request(options, function(res) {
        var result = [];

        res
          .on('data', function(chunk) {
            return result.push(chunk.toString());
          })
          .on('end', function() {
            // when the response ends, send the response back to the callback
            return resolve(JSON.parse(result.join('')));
          });

        res.resume();

        return res;

      });

      request.on('error', function(error) {
        console.error('ERROR:Blitline:ErrorHandler: ', error);
        return reject(error);
      });

      request.write(body);
      return request.end();
    });
  }
};
