exports.msg = function(statusCode, msg) {
    var m = msg;
    if(m === 'db') {
        m = 'Database operation error';
    }
    return {
        "status": statusCode,
        "message": m
    };
}


