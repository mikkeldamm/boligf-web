var express = require('express');

var app = express();

app.use(express.static('public'));

// index page 
app.get('/', function(req, res) {
    
     var options = {
        root: __dirname + '/public/'
    };
    
    res.sendFile('index.html', options);
});

app.listen(process.env.PORT || 8080);
console.log('8080 is the magic port');