var db_connect  = require('./config');
module.exports= function(where_params,callback){
    db_connect(function(connection){
        var  addSql = 'delete from user_books where '+where_params;

        connection.query(addSql,function (err, result) {
            if(err){
                console.log('[delete ERROR] - ',err.message);
                return;
            }
            if(callback){
                callback(result);
            }
        });
        connection.end()
    })
}