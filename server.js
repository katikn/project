const express = require('express');

let app = express();

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/inner', (req, res) => {
    res.sendFile(__dirname + '/inner.html')
});


app.listen(3000);