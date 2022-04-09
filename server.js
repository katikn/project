const express = require('express');
const sqlite3 = require('sqlite3');

let app = express();
app.set('view engine', 'hbs');
app.set('views', './templates');

app.use(express.static(__dirname + '/static'));

async function data(query, datas) {
    let db = new sqlite3.Database('blog.db', (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Коннект');
        }
    })
    let sqls = {
        first: "SELECT * FROM general"
    };
    let sql = sqls[query];

    console.log(datas);
    let promise = new Promise((resolve, reject) => {
        db.all(sql, datas, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })

    let data = await promise;
    return data;

    db.close();
};


app.get('/', (req, res) => {
    data('first', []).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data
        };
        res.render('index.hbs', data_template)
    });
});

app.get('/inner', (req, res) => {
    res.render('inner.hbs')
});

app.get('/category', (req, res) => {
    res.render('categories.hbs')
});


app.listen(3000);