var fs = require("fs");
var path = require("path");
var multer  = require('multer');
var compressing= require('compressing');
var {wb_select}= require('../db');
var { pdfToPng,encryption,getIp } = require("../utils");
var {books_info}= require("../tem_data");


module.exports= function(app){
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.resolve(__dirname,"../../public/pdf/")) // 保存的路径
        },
    //     filename: function (req, file, cb) {
    //         cb(null, file.originalname)
    // }
});
    var upload = multer({ storage })
    app.post('/upload', upload.single('filename'), function (req, res) {//上传文件并生成图片
        const file = req.file
        // console.log('原始文件名：%s', file.originalname)
        // books_info.changing.push(file.filename);
        books_info.push_changing(file.filename)
        res.send({
            code: 200,
            name: file.filename
        })

        pdfToPng(file.filename,function(v){
            books_info.push_book(file.filename,file.originalname,v);
        })
    })
    app.get('/book', function (req, res) { //请求生成的文件
        var name= req.query.s;
        var user_cookie= req.cookies.user;
        if(!user_cookie){
            var new_cookie= encryption.aesEncrypt(req.ip);
            res.cookie('user',new_cookie);
            user_cookie= new_cookie;
        }

        if(name in books_info.names){
            // var tem= encryption.aesEncrypt(req.ip);
            // var c= encryption.aesDecrypt(tem)
            // console.log('req.cookies.user:',req.cookies.user);
            // console.log('ip源码:',c);
            res.send({
                code: 200,
                images: books_info.datas[name],
                name: books_info.names[name],
                file_name: name
            })
        } else if(books_info.changing.includes(name)){
            res.send({
                code: 202,
            })
        } else{
            wb_select("user_code='"+encryption.aesDecrypt(user_cookie)+"' and file_name='"+name+"'",function(v){
                if(!v.length){
                    res.send({
                        code: 404,
                    })
                    return
                }
                var pa= v[0];
                var file_tem= path.resolve(__dirname,"../../public/tem_zip/"+pa.file_name+".zip");
                fs.writeFile(file_tem, pa.png_zip,  function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    compressing.zip.uncompress(file_tem,path.resolve(__dirname,"../../public/tem_png/")).then(()=>{
                        fs.readdir(path.resolve(__dirname,"../../public/tem_png/"+pa.file_name),function(err, files){
                            if (err) {
                                return console.error(err);
                            }

                            var images= files.map(v=>"http://"+getIp()+":8089/public/tem_png/"+pa.file_name+'/'+v)
                            books_info.push_book(pa.file_name,pa.original_name,images);
                            res.send({
                                code: 200,
                                images,
                                name: pa.original_name,
                                file_name: pa.file_name
                            })
                        });
                    })
                });

                var pdf_tem= path.resolve(__dirname,"../../public/pdf/"+pa.file_name)
                fs.writeFile(pdf_tem, pa.file,  function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('写入PDF：')
                });
            })

        }
    })
}