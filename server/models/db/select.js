var db_connect  = require('./config');
module.exports= function(user_code,callback){
    db_connect(function(connection){
        var  addSql = 'select * from user_books where user_code=?';

        connection.query(addSql,[user_code],function (err, result) {
            if(err){
                console.log('[select ERROR] - ',err.message);
                return;
            }
            callback(result);

            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);
            console.log('select ID:',result);
            console.log('-----------------------------------------------------------------\n\n');
        });
        connection.end()
    })
}