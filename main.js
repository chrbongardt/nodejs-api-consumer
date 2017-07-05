var wallets = require('./wallets.js');
var transactions = require('./transactions.js');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));


wallets.getWallets(config.host, config.key, config.eventId, 'modified_at', 2, 0, '', 'ASC');
transactions.getTransactions(config.host, config.key, config.eventId, 2, 0, '', 'ASC');
