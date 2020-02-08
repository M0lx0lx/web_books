var { pdfToPng } = require("../utils");
module.exports= function(app){
    app.get('/test_png',function(req,res){
        // res.header('Content-Type', 'image/png;charset=UTF-8');
        pdfToPng("tbjgyb.pdf",function(v){
            res.end(JSON.stringify(v) );
        })
    })
}