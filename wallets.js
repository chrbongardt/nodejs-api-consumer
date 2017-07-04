var http = require('http');

var getWallets = function(host, eventId, key, orderField, walletLimit, walletOffset, lastModified, orderType) {
    return new Promise(function(resolve, reject) {
        var options = {
            host: host,
            path: '/backend/profiles/filtered/' + eventId + 
            '?order_by_field=' + orderField + 
            '&order_type='+ orderType +
            '&limit='+ walletLimit +
            '&offset=' + walletOffset,
            method: 'GET',
            headers: {
                'x-api-key' : key,
                accept : 'application/json'
            }
        };
        if (lastModified != '') {
            options.path = options.path + '&start_date=' + lastModified
        }
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
    getWallets: getWallets
};