var fs = require("fs");
var path = require("path")
var util = require("util")
var multer  = require('multer')
var { pdfToPng,encryption } = require("../utils");
var { books } = require("./books_info");


module.exports= function(app){
    console.log('载入upload路由');
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
        // console.log('文件大小：%s', file.size)
        books.changing.push(file.filename);
        res.send({
            code: 200,
            name: file.filename
        })

        pdfToPng(file.filename,function(v){
            var tem= books.changing.indexOf(file.filename)
            if( tem!== -1){
                books.changing.splice(tem,1)
            }
            books.names[file.filename]= file.originalname
            books.datas[file.filename]=v
        })
    })
    app.get('/book', function (req, res) { //请求生成的文件
        var name= req.query.s;
        console.log('req.query:',req.query,books.changing.includes(name))
        if(name in books.names){
            res.cookie('user',encryption.aesEncrypt(req.ip))
            res.send({
                code: 200,
                images: books.datas[name],
                name: books.names[name]
            })
        } else if(books.changing.includes(name)){
            res.send({
                code: 202,
            })
        } else{
            res.send({
                code: 404,
            })
        }
    })
}