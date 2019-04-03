var express = require('express');
var app = express();

var router = require('./routes/routes');
var PORT = process.env.PORT || 3000;

app.listen(PORT, function(){ console.log(`Express listening on port ${PORT}`);
});


app.use('/', router);

