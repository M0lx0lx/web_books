var db_connect  = require('./config');
// var moment = require('moment')

module.exports= function({user_code,file_name,original_name,file,png_zip,create_data=new Date()},callback){
    db_connect(function(connection){
        var  addSql = 'INSERT INTO user_books(user_code,file_name,original_name,file,png_zip,create_data) VALUES(?,?,?,?,?,?)';

        // console.log('mysql时间格式：',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        connection.query(addSql,[user_code,file_name,original_name,file,png_zip,create_data],function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            if(callback){
                callback(result);
            }
            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);
            console.log('INSERT ID:',result);
            console.log('-----------------------------------------------------------------\n\n');
        });
        connection.end()
    })
}