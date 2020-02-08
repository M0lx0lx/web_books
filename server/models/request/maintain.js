var path= require('path');
var fs= require('fs');
var compressing= require('compressing');
var {insert}= require('../db');
var {encryption}= require('../utils');
var {books}= require('./books_info');
module.exports= function(app){
    app.get('/maintain',function(req,res){
        var {file_name}= req.query;
        console.log('cookies.user:',encryption.aesDecrypt(req.cookies.user));
        console.log('file_name:',file_name);
        console.log('original_name:',books.names[file_name]);


        var name=file_name;
        for(let i in books.names){
            if(books.names[i]=== file_name){
                name= i;
            }
        }

        var data_save={
            user_code: encryption.aesDecrypt(req.cookies.user),
            file_name: name,
            original_name: file_name,
        }

        fs.readFile(path.resolve(__dirname,"../../public/pdf/")+'/'+name, function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("异步读取文件成功：",file_name);
            data_save.file=data

            compressing.zip.compressDir(path.resolve(__dirname,"../../public/tem_png/"+name), path.resolve(__dirname,"../../public/tem_zip/")+'/'+name+'.zip')
                .then(() => {
                    console.log('目录文件压缩成功',);
                    fs.readFile(path.resolve(__dirname,"../../public/tem_zip/")+'/'+name+'.zip', function (err, data) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("异步读取文件成功：", file_name);
                        data_save.png_zip = data
                        insert(data_save);
                    })
                })
                .catch(err => {
                    console.error(err);
                });
        });


        console.log('file_name:',file_name)
        console.log('req.ip:',req.ip)
        // res.cookies('u','kjkljlkjoijeofjk')
        // console.log('req.cookies:',req.cookies)
        // req.setHeader('Cookie', ['type=ninja', 'language=javascript']);
        res.send({
            code: 200,
        })
        // res.header('Content-Type', 'image/png;charset=UTF-8');
    })
}