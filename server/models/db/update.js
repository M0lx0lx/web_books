var db_connect  = require('./config');
var moment = require('moment');
var wb_select = require('./select');
var wb_delete = require('./delete');
var schedule = require('node-schedule');
var {schedule_info}= require('../tem_data');

module.exports= function({id,keep_days,last_update=new Date()},callback){
    db_connect(function(connection){
        var  addSql = "update user_books set keep_days=?,last_update=? where id=?";
        var kd= keep_days?new Date(moment().add(keep_days, 'days')): null;
        if(keep_days === 'm'){
            console.log('update测试');
            kd=new Date(moment().add(30, 'seconds'));
        }
        connection.query(addSql,[kd,last_update,id],function (err, result) {
            if(err){
                console.log('[delete ERROR] - ',err.message);
                return;
            }

            wb_select("id='"+id+"'",function(v){
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