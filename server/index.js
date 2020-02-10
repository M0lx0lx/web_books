var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var {
    start, all, upload, test_png,
    maintain,user_books
} = require("./models/request");
// var moment = require('moment')
// console.log('mysql时间格式：',moment().add(3, 'days'))
start(app,8089);

app.use('/public', express.static('public'));

app.use(cookieParser())

all(app);

upload(app);

user_books(app);

test_png(app);

maintain(app);