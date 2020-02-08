module.exports= function(app){
    app.all('*',function(req,res,next){
        res.header('Access-Control-Allow-Origin','http://192.168.0.4:8080');
        res.header('Access-Control-Allow-Headers','X-Requested-With');
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Credentials',true);
        res.header('X-Powered-By','3.2.1');
        res.header('Content-Type','application/json;charset=utf-8');
        // var Cookies = {};
        // req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        //     var parts = Cookie.split('=');
        //     Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        // });
        // var exp = new Date();
        // exp.setTime(exp.getTime() + 0.2*60*1000)
        // res.header('cookie',`myCookie=test;expires=${exp.toGMTString()}`)
        next();
    })
}