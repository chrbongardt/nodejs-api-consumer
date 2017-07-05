
var requests = require('./requests.js');

var walletsMap = {};
var isIntervalLooping = false;
var walletOffset = 0;

var getWallets = function(host, key, eventId, orderField, walletLimit, walletOffset, lastModified, orderType){    
    requests.getData(host, key, getWalletPath(eventId, orderField, orderType, walletLimit, walletOffset, lastModified))
        .then(function(response) {
            var body = JSON.parse(response);
            walletParser(body);
            if(body.length != 0 && body.length == walletLimit){
                walletOffset += walletLimit;
                getWallets(host, key, eventId, orderField, walletLimit, walletOffset, lastModified, orderType);
            } else {
                console.log("Finalizada la sincronización de monederos");
                walletOffset = 0;
                if (!isIntervalLooping){
                    console.log("Empieza sincronización por fecha, utilizando la última fecha de modificación del listado obtengo los wallets modificados recientemente");
                    console.log("Cada 60 segundos volvera a hacer la llamada");
                    setInterval( function() { 
                        getWallets(host, key, eventId, orderField, walletLimit, walletOffset, getLastWalletModified().toISOString(), orderType); 
                    }, 60000);
                    isIntervalLooping = true;
                }
            }
        });
}

var getWalletPath = function(eventId, orderField, orderType, limit, offset, startDate) {
    var path = '/backend/profiles/filtered/' + eventId + 
            '?order_by_field=' + orderField + 
            '&order_type='+ orderType +
            '&limit='+ limit +
            '&offset=' + offset;
    if (startDate != '') {
        path = path+'&start_date='+startDate;
    }
    return path;
}

var getLastWalletModified = function() {
    return new Date(Math.max.apply(null, Object.keys(walletsMap).map(function(key) {
        return new Date(walletsMap[key].modified_at);
    })));
}

var walletParser = function(walletList) {
    for(var i in walletList) {
        var key = walletList[i].wallet_id;
        walletsMap[key] = walletList[i];
        var start = null;
        var end = null;
        if(walletList[i].validity_range != null){
            start = walletList[i].validity_range.start;
            end = walletList[i].validity_range.end;
        }
        console.log("Guardado WalletId: "+ walletList[i].wallet_id +
        ", localizador(id huesped): "+ walletList[i].locator +
        ", referencia(num reserva): "+ walletList[i].reference +
        ", facility(hotel): "+ walletList[i].facility +
        ", room(habitación): "+ walletList[i].room +
        ", start_date(inicio reserva): "+ start +
        ", end_date(fin reserva): "+ end +
        ",  modificado por última vez en "+ walletList[i].modified_at);
    }
}
module.exports = {
    getWallets: getWallets
};
