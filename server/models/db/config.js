var mysql  = require('mysql');
var db_info= {
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    port: '3306',
    database: 'web_books'
};
module.exports= function db_connect(callback,data=db_info){
    var connection = mysql.createConnection(data);
    connection.connect();
    callback(connection);
}