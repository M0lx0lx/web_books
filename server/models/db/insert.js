var db_connect  = require('./config');
var moment = require('moment');
var wb_select = require('./select');
var wb_delete = require('./delete');
var schedule = require('node-schedule');
var {schedule_info}= require('../tem_data');

module.exports= function({user_code,file_name,original_name,file,png_zip,keep_days=0,create_date=new Date()},callback){
    db_connect(function(connection){
        var  addSql = "INSERT INTO user_books(user_code,file_name,original_name,file,png_zip,keep_days,create_date) VALUES(?,?,?,?,?,?,?)";

        // console.log('mysql时间格式：',moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        var kd= keep_days?new Date(moment().add(keep_days, 'days')): null;
        if(keep_days === 'm'){
            console.log('insert测试');
            kd=new Date(moment().add(30, 'seconds'));
        }
        connection.query(addSql,[user_code,file_name,original_name,file,png_zip,kd,create_date],function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }

            wb_select("user_code='"+user_code+"' and file_name='"+file_name+"'",function(v){
                var t=v[0];
                var dt= schedule_info.delete_name(t.id,t.file_name)
                if(dt){
                    dt.cancel();
                }
                var job= schedule.scheduleJob(new Date(t.keep_days), function(){
                    wb_delete('id='+t.id,function(){
                        console.log('完成定时清除任务',+t.id+':'+t.keep_days);
                    })
                });
                schedule_info.push_names(t.id,t.file_name,job)
                console.log('更新定时任务：',job)

            })

            if(callback){
                callback(result);
            }
        });
        connection.end()
    })
}