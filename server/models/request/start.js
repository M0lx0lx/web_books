var schedule = require('node-schedule');
var {wb_select,wb_delete}= require('../db');
var {schedule_info}= require('../tem_data');

function execute_clean(){
    wb_select(function(v){
        v.forEach(function(v,i){
            if(v.keep_days){
                if(Date.parse(new Date(v.keep_days))< Date.parse(new Date())){
                    wb_delete('id='+v.id,function(){
                        console.log('完成已过期数据清除',+v.id+':'+v.keep_days);
                    })
                }
                else{
                    var job= schedule.scheduleJob(new Date(v.keep_days), function(){
                        wb_delete('id='+v.id,function(){
                            console.log('完成定时清除任务',+v.id+':'+v.keep_days);
                        })
                    });
                    schedule_info.push_names(v.id,v.file_name,job)
                    console.log('设置定时任务'+i+':',v.keep_days)
                }
            }
        })
    });

}

module.exports= function(app,port=9000){
    var server = app.listen(port, function () {

        var host = server.address().address
        var port = server.address().port

        execute_clean();

        console.log("http://", host, port)

    })
}