var {wb_select}= require('../db');
var {encryption}= require('../utils');
var moment = require('moment');
module.exports= function(app){
    app.get('/user_books', function (req, res) {
        if(!req.cookies.user){
            return res.send({
                cedo: 200,
                data: []
            })
        }
        var sql_query= "user_code='"+encryption.aesDecrypt(req.cookies.user)+"'";
        var file_name= req.query.file_name;
        if(file_name){
            sql_query+= " and file_name='"+file_name+"'";
        }
        wb_select(sql_query,function(v){
            var tem=v.map(v=>({
                create_date: v.create_date?moment(v.create_date).format('YYYY-MM-DD HH:mm:ss'): '',
                file_name: v.file_name,
                original_name: v.original_name,
                keep_days: v.keep_days?moment(v.keep_days).format('YYYY-MM-DD HH:mm:ss'): '',
            }))
            res.send({
                cedo: 200,
                data: file_name?tem[0]:tem
            })
        })
    })
}