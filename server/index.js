var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var {
    start, all, upload, test_png,
    maintain
} = require("./models/request");

start(app,8089);

app.use('/public', express.static('public'));

app.use(cookieParser())

all(app);

upload(app);

test_png(app);

maintain(app);