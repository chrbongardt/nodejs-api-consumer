
var requests = require('./requests.js');

var map = {};
var isIntervalLooping = false;
var offset = 0;

var getTransactions = function(host, key, eventId, limit, offset, lastModified, orderType){    
    requests.getData(host, key, getTransactionPath(eventId, orderType, limit, offset, lastModified))
        .then(function(response) {
            var body = JSON.parse(response);
            transactionParser(body.transactions);
            if(body.transactions.length != 0 && body.transactions.length == limit){
                offset += limit;
                getTransactions(host, key, eventId, limit, offset, lastModified, orderType);
            } else {
                console.log("Finalizada la sincronización de transacciones");
                offset = 0;
                if (!isIntervalLooping){
                    console.log("Empieza sincronización por fecha, utilizando la última fecha de modificación del listado obtengo las nuevas transacciones");
                    console.log("Cada 60 segundos volvera a hacer la llamada");
                    setInterval( function() { 
                        getTransactions(host, key, eventId, limit, offset, getLastTransactionModified().toISOString(), orderType); 
                    }, 60000);
                    isIntervalLooping = true;
                }
            }
        });
}

var getTransactionPath = function(eventId, orderType, limit, offset, startDate) {
    var path = '/backend/transactions/event/' + eventId + 
            '?order_type='+ orderType +
            '&limit='+ limit +
            '&offset=' + offset;
    if (startDate != '') {
        path = path+'&start_date='+startDate;
    }
    return path;
}

var getLastTransactionModified = function() {
    return new Date(Math.max.apply(null, Object.keys(map).map(function(key) {
        return new Date(map[key].received_at);
    })));
}

var transactionParser = function(list) {
    for(var i in list) {
        var key = list[i].transaction_id;
        map[key] = list[i];
        console.log("Guardada TransactionId: "+ list[i].transaction_id +
        ", amount(cantidad): "+ list[i].amount/100+
        ", date(fecha de la transacción) "+list[i].date+
        ", flag(postpago/prepago) "+list[i].flag+
        ", type(tipo de transacción) "+list[i].type);
    }
}
module.exports = {
    getTransactions: getTransactions
};
