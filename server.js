var express = require('express');
var fs = require('fs');
var pdf = require('html-pdf');

var app = express();

app.use(express.static('public'));

// index page 
app.get('/', function(req, res) {
    
     var options = {
        root: __dirname + '/public/'
    };
    
    res.sendFile('index.html', options);
});

app.get('/pdf', function(req, res) {
    
     var options = {
        root: __dirname + '/public/'
    };
    
    res.sendFile('pdf.html', options);
});

app.get('/pdf2', function(reg, res) {
    
    var html = fs.readFileSync('./public/pdf.html', 'utf8');
    var options = { format: 'A4' };
    
    pdf.create(html, options).toFile('./public/pdf.pdf', function(err, res) {
        
        if (err) {
            return console.log(err);
        }
        
        console.log(res);
    });
});

app.listen(process.env.PORT || 8080);
console.log('8080 is the magic port');