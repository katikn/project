const express = require('express');
const sqlite3 = require('sqlite3');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const hbs = require('hbs');
var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })
let app = express();
app.set('view engine', 'hbs');
app.set('views', './templates');
app.use(cookieParser());

app.use(express.static(__dirname + '/static'));
hbs.registerPartials(__dirname + '/templates/partials')

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "karkarmysecret123321loltopdota2uzhas",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

var session;

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
        create: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        loging: "SELECT id FROM users WHERE name = ? AND password = ?"
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

app.get('/register', (req, res) => {
    console.log(req.body);
    res.render('createacc.hbs')
})

app.post('/create', urlencodedParser, (req, res) => {
    data('create', [req.body.username, req.body.email, req.body.password]).then((data) => {
        res.redirect('/login')
    })
})

app.get('/login', (req, res) => {
    console.log(req.body);
    res.render('login.hbs')
})

app.post('/loging', urlencodedParser, (req, res) => {
    data('loging', [req.body.username, req.body.password]).then((data) => {
        console.log(data);
        if (data.length > 0) {
            session=req.session;
            session.userid=data[0]['id'];
            console.log(session);
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    })
})

app.get('/inner', (req, res) => {
    res.render('inner.hbs')
});

app.listen(3000);