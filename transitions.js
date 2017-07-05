
var requests = require('./requests.js');

var map = {};
var isIntervalLooping = false;
var offset = 0;

var getTransitions = function(host, key, eventId, limit, offset, lastModified, orderType){    
    requests.getData(host, key, getTransactionPath(eventId, orderType, limit, offset, lastModified))
        .then(function(response) {
            var body = JSON.parse(response);
            transitionParser(body.transitions);
            if(body.transitions.length != 0 && body.transitions.length == limit){
                offset += limit;
                getTransitions(host, key, eventId, limit, offset, lastModified, orderType);
            } else {
                console.log("Finalizada la sincronización de transiciones");
                offset = 0;
                if (!isIntervalLooping){
                    console.log("Empieza sincronización por fecha, utilizando la última fecha de modificación del listado obtengo las nuevas transiciones");
                    console.log("Cada 60 segundos volvera a hacer la llamada");
                    setInterval( function() { 
                        getTransitions(host, key, eventId, limit, offset, getLastTransitionModified().toISOString(), orderType); 
                    }, 10000);
                    isIntervalLooping = true;
                }
            }
        });
}

var getTransactionPath = function(eventId, orderType, limit, offset, startDate) {
    var path = '/backend/transitions/event/' + eventId + 
            '?order_type='+ orderType +
            '&limit='+ limit +
            '&offset=' + offset;
    if (startDate != '') {
        path = path+'&start_date='+startDate;
    }
    return path;
}

var getLastTransitionModified = function() {
    return new Date(Math.max.apply(null, Object.keys(map).map(function(key) {
        return new Date(map[key].received_at);
    })));
}

var transitionParser = function(list) {
    for(var i in list) {
        var key = list[i].id;
        map[key] = list[i];
        console.log("Guardada TransitionId: "+ list[i].id +
        ", consumer_id(dispositivo): " + list[i].consumer_id+
        ", wallet_id(identificador del monedero): " + list[i].wallet_id+
        ", zone_id(identificador de zona): " + list[i].zone_id+
        ", received_at(fecha de guardado): " + list[i].received_at +
        ", moment(momento de transicion): " + list[i].moment);
    }
}
module.exports = {
    getTransitions: getTransitions
};
