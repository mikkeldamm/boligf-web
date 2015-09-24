var express = require('express');

var app = express();

app.use(express.static('public'));

// index page 
app.get('/', function(req, res) {
    res.sendFile('/index.html');
});

app.listen(process.env.PORT || 8080);
console.log('8080 is the magic port');