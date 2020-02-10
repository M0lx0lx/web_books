var db_connect  = require('./config');
module.exports= function(where_params,callback){
    db_connect(function(connection){
        if(typeof where_params === 'function'){
            callback=where_params;
            where_params=null
        }

        var  addSql = "select * from user_books "+ (where_params?"where "+where_params:"");

        connection.query(addSql,function (err, result) {
            if(err){
                console.log('[select ERROR] - ',err.message);
                return;
            }
            if(callback){
                callback(result);
            }
        });
        connection.end()
    })
}