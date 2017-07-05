var http = require('http');

var getData = function(host, key, path) {
    return new Promise(function(resolve, reject) {
        var options = {
            host: host,
            path: path,
            method: 'GET',
            headers: {
                'x-api-key' : key,
                accept : 'application/json'
            }
        };
        console.log('Llamada de URL: '+ options.host + options.path);
        var req = http.request(options, function(res) {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                console.log('statusCode=' + res.statusCode);
            }
            req.rawBody = '';
            res.on('data', function(body) {
                req.rawBody += body;
            });
            res.on('end', function() {
                resolve(req.rawBody);
            });
        });
        req.on('error', function(err) {
            reject(err);
        });
        req.end();
    });
}

module.exports = {
    getData: getData
};
