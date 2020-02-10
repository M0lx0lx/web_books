var path= require('path');
var fs= require('fs');
var compressing= require('compressing');
var {insert,wb_select,wb_update}= require('../db');
var {encryption}= require('../utils');
var {books_info}= require('../tem_data');
module.exports= function(app){
    app.get('/maintain',function(req,res){
        var {original_name, keep_days}= req.query;
        // console.log('cookies.user:',encryption.aesDecrypt(req.cookies.user));

        var file_name=books_info.search_key(original_name);
        var user_code= encryption.aesDecrypt(req.cookies.user);

        wb_select("user_code='"+user_code+"' and  file_name='"+file_name+"' and original_name='"+original_name+"'",function(v){
            if(v.length){
                wb_update({
                    id: v[0].id,
                    keep_days
                })
            }
            else{
                var data_save={
                    user_code,
                    file_name,
                    original_name,
                    keep_days,
                }

                fs.readFile(path.resolve(__dirname,"../../public/pdf/")+'/'+file_name, function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    data_save.file=data;

                    compressing.zip.compressDir(path.resolve(__dirname,"../../public/tem_png/"+file_name), path.resolve(__dirname,"../../public/tem_zip/")+'/'+file_name+'.zip')
                        .then(() => {
                            fs.readFile(path.resolve(__dirname,"../../public/tem_zip/")+'/'+file_name+'.zip', function (err, data) {
                                if (err) {
                                    return console.error(err);
                                }
                                data_save.png_zip = data
                                insert(data_save);
                            })
                        })
                        .catch(err => {
                            console.error(err);
                        });
                });
            }
            res.send({
                code: 200,
            })

        });

    })
}