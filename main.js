var wallets = require('./wallets.js');
var transactions = require('./transactions.js');
var transitions = require('./transitions.js');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var argument = process.argv[2];

switch (argument)
{
    case "wallet":
        wallets.getWallets(config.host, config.key, config.eventId, 'modified_at', 2, 0, '', 'ASC');
        break;
    case "transaction":
        transactions.getTransactions(config.host, config.key, config.eventId, 2, 0, '', 'ASC');
        break;
    case "transition": 
        transitions.getTransitions(config.host, config.key, config.eventId, 2, 0, '', 'ASC');
       break;
    default: 
        wallets.getWallets(config.host, config.key, config.eventId, 'modified_at', 2, 0, '', 'ASC');
        break;
}

