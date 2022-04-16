const express = require('express');
const sqlite3 = require('sqlite3');
const hbs = require('hbs');

let app = express();
app.set('view engine', 'hbs');
app.set('views', './templates');

app.use(express.static(__dirname + '/static'));
hbs.registerPartials(__dirname + '/templates/partials')

async function data(query, datas) {
    let db = new sqlite3.Database('blog.db', (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Коннект');
        }
    })
    let sqls = {
        main: "SELECT * FROM general",
        life_category: "SELECT * FROM general WHERE category = ?",
        popular_category: "SELECT * FROM general WHERE category = ?",
        travel_category: "SELECT * FROM general WHERE category = ?",
        technology_category: "SELECT * FROM general WHERE category = ?",
        education_category: "SELECT * FROM general WHERE category = ?",
        covid_category: "SELECT * FROM general WHERE category = ?",
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
    data('main', []).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data.slice(4),
            most_recent: data[0],
            featured1: data[1],
            featured2: data[2],
            featured3: data[3]
        };
        res.render('index.hbs', data_template)
    });
});

app.get('/life', (req, res) => {
    data('life_category', [6]).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data.slice(2),
            most_recent: data.slice(0, 2)
        };
        res.render('categories.hbs', data_template)
    });
});

app.get('/popular', (req, res) => {
    data('popular_category', [1]).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data.slice(2),
            most_recent: data.slice(0, 2)
        };
        res.render('categories.hbs', data_template)
    });
});

app.get('/travel', (req, res) => {
    data('travel_category', [2]).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data.slice(2),
            most_recent: data.slice(0, 2)
        };
        res.render('categories.hbs', data_template)
    });
});

app.get('/technology', (req, res) => {
    data('technology_category', [4]).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data.slice(2),
            most_recent: data.slice(0, 2)
        };
        res.render('categories.hbs', data_template)
    });
});

app.get('/education', (req, res) => {
    data('education_category', [5]).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data.slice(2),
            most_recent: data.slice(0, 2)
        };
        res.render('categories.hbs', data_template)
    });
});

app.get('/covid', (req, res) => {
    data('covid_category', [3]).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data.slice(2),
            most_recent: data.slice(0, 2)
        };
        res.render('categories.hbs', data_template)
    });
});

app.get('/life/:id', (req, res) => {
    data('life_category', [6]).then((data) => {
        data_template = {
            headers: Object.keys(data[0]),
            querys: data
        };
        res.render('inner.hbs', data_template)
    });
});


app.get('/inner', (req, res) => {
    res.render('inner.hbs')
});

app.listen(3000);