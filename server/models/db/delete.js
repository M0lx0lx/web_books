var db_connect  = require('./config');
module.exports= function({user_code,file_name},callback){
    db_connect(function(connection){
        var  addSql = 'delete from user_books where user_code=? and file_name=?';

        connection.query(addSql,[user_code,file_name],function (err, result) {
            if(err){
                console.log('[delete ERROR] - ',err.message);
                return;
            }
            if(callback){
                callback(result);
            }
            console.log('--------------------------delete----------------------------');
            //console.log('INSERT ID:',result.insertId);
            console.log('delete:',result);
            console.log('-----------------------------------------------------------------\n\n');
        });
        connection.end()
    })
}