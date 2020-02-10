var fs = require("fs");
var path = require("path");
var pdf2png = require("pdf2png");
var {getIp} = require("./getInfo");
module.exports= function(name,callback){
    var files_path=[];
    pdf2png.convert(path.resolve(__dirname,"../../public/pdf/")+'/'+name, function(resp){
        if(!resp.success)
        {
            console.log("Something went wrong: " + resp.error);
            return;
        }
        var tem_path= path.resolve(__dirname,"../../public/tem_png/"+name)
        fs.mkdirSync(tem_path);
        for(var i=0,len=resp.data.length;i<len;i++){
            fs.writeFileSync(tem_path+'/'+name+i+".png",resp.data[i])
            files_path.push("http://"+getIp()+":8089/public/tem_png/"+name+'/'+name+i+".png")
        }
        callback(files_path);
    });
}