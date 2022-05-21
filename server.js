const express = require('express');
const sqlite3 = require('sqlite3');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const hbs = require('hbs');
const path = require('path')
const multer = require('multer')
var bodyParser = require('body-parser')

let app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './static/images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        let imagename = file.originalname
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './static/profileimages')
    },
    filename: (req, file, cb) => {
        console.log(file);
        let imagename = file.originalname
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })
const upload2 = multer({ storage: storage2 })

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'hbs');
app.set('views', './templates');
app.use(cookieParser());

app.use(express.static(__dirname + '/static'));
app.use('/static/images', express.static('/static/images'));
hbs.registerPartials(__dirname + '/templates/partials')

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "karkarmysecret123321loltopdota2uzhas",
    saveUninitialized: true,
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
        main: "SELECT * FROM general JOIN categories ON general.category = categories.id_category JOIN users ON general.user = users.id_user",
        life_category: "SELECT * FROM general JOIN categories ON general.category = categories.id_category WHERE category = ?",
        popular_category: "SELECT * FROM general JOIN categories ON general.category = categories.id_category WHERE category = ?",
        travel_category: "SELECT * FROM general JOIN categories ON general.category = categories.id_category WHERE category = ?",
        technology_category: "SELECT * FROM general JOIN categories ON general.category = categories.id_category WHERE category = ?",
        education_category: "SELECT * FROM general JOIN categories ON general.category = categories.id_category WHERE category = ?",
        covid_category: "SELECT * FROM general JOIN categories ON general.category = categories.id_category WHERE category = ?",
        create: "INSERT INTO users (username, email, password, img_user) VALUES (?, ?, ?, ?)",
        loging: "SELECT id_user FROM users WHERE email = ? AND password = ?",
        newpost: "INSERT INTO general (title, text, category, img, user) VALUES (?, ?, ?, ?, ?)",
        life_post: "SELECT * FROM general JOIN users ON general.user = users.id_user WHERE id = ? AND category = ?",
        popular_post: "SELECT * FROM general JOIN users ON general.user = users.id_user WHERE id = ? AND category = ?",
        travel_post: "SELECT * FROM general JOIN users ON general.user = users.id_user WHERE id = ? AND category = ?",
        covid_post: "SELECT * FROM general JOIN users ON general.user = users.id_user WHERE id = ? AND category = ?",
        education_post: "SELECT * FROM general JOIN users ON general.user = users.id_user WHERE id = ? AND category = ?",
        technology_post: "SELECT * FROM general JOIN users ON general.user = users.id_user WHERE id = ? AND category = ?",
        admin: "SELECT * FROM general JOIN categories ON general.category = categories.id_category JOIN users ON general.user = users.id_user",
        delete: "DELETE FROM general WHERE id = ?",
        edit: "SELECT * FROM general JOIN categories ON general.category = categories.id_category WHERE id = ?",
        editpost: "UPDATE general SET title = ?, text = ?, category = ?, img = ? WHERE id = ?",
        profileinfo: "SELECT * FROM general JOIN categories ON general.category = categories.id_category JOIN users ON general.user = users.id_user WHERE id_user = ?",
        profile: "SELECT * FROM users WHERE id_user = ?",
        profileedit: "UPDATE users SET username = ?, email = ?, password = ?, img_user = ? WHERE id_user = ?"
        
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

app.use((req, res, next) => {
    if (!req.session.visit) {
        req.session.visit = 1
        req.session.islogin = 0
        req.session.admin = 0
    }
    next();
})

app.get('/', (req, res) => {
    if (req.session.islogin != 1) {
        data('main', []).then((data) => {
            data_template = {
                querys: data.slice(4),
                most_recent: data[0],
                featured1: data[1],
                featured2: data[2],
                featured3: data[3]
            };
            console.log(data_template);
            res.render('index.hbs', data_template)
        });
    } else {
        data('main', []).then((data) => {
            data_template = {
                querys: data.slice(4),
                most_recent: data[0],
                featured1: data[1],
                featured2: data[2],
                featured3: data[3]
            };
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            console.log(data_template);
            console.log(req.session);
            if (req.session.userid == 1){
                data_template["admin"] = 1
                res.render('index.hbs', data_template)
            } else {
                res.render('index.hbs', data_template)
            }
        });
    }
});

app.get('/life', (req, res) => {
    if (req.session.islogin != 1) {
        data('life_category', [6]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            console.log(data_template);
            res.render('categories.hbs', data_template)
        });
    } else {
        data('life_category', [6]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            if (req.session.userid == 1){
                data_template["admin"] = 1
                res.render('categories.hbs', data_template)
            } else {
                res.render('categories.hbs', data_template)
            }
        });
    }
});

app.get('/popular', (req, res) => {
    if (req.session.islogin != 1) {
        data('popular_category', [1]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            console.log(data_template);
            res.render('categories.hbs', data_template)
        });
    } else {
        data('popular_category', [1]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            if (req.session.userid == 1){
                data_template["admin"] = 1
                res.render('categories.hbs', data_template)
            } else {
                res.render('categories.hbs', data_template)
            }
        });
    }
});

app.get('/travel', (req, res) => {
    if (req.session.islogin != 1) {
        data('travel_category', [2]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            res.render('categories.hbs', data_template)
        });
    } else {
        data('travel_category', [2]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            if (req.session.userid == 1){
                data_template["admin"] = 1
                res.render('categories.hbs', data_template)
            } else {
                res.render('categories.hbs', data_template)
            }
        });
    }
});

app.get('/technology', (req, res) => {
    if (req.session.islogin != 1) {
        data('technology_category', [4]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            res.render('categories.hbs', data_template)
        });
    } else {
        data('technology_category', [4]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            if (req.session.userid == 1){
                data_template["admin"] = 1
                res.render('categories.hbs', data_template)
            } else {
                res.render('categories.hbs', data_template)
            }
        });
    }
});

app.get('/education', (req, res) => {
    if (req.session.islogin != 1) {
        data('education_category', [5]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            res.render('categories.hbs', data_template)
        });
    } else {
        data('education_category', [5]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            if (req.session.userid == 1){
                data_template["admin"] = 1
                res.render('categories.hbs', data_template)
            } else {
                res.render('categories.hbs', data_template)
            }
        });
    }
});

app.get('/covid', (req, res) => {
    if (req.session.islogin != 1) {
        data('covid_category', [3]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            res.render('categories.hbs', data_template)
        });
    } else {
        data('covid_category', [3]).then((data) => {
            data_template = {
                querys: data.slice(2),
                most_recent: data.slice(0, 2),
                header: data.slice(0, 1)
            };
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            if (req.session.userid == 1){
                data_template["admin"] = 1
                res.render('categories.hbs', data_template)
            } else {
                res.render('categories.hbs', data_template)
            }
        });
    }
});

app.get('/life/:id', (req, res) => {
    if (req.session.islogin != 1) {
        data('life_post', [req.params.id, 6]).then((data) => {
            data_template = {
                querys: data
            };
            if (data_template['querys'].length > 0){
                console.log(data_template);
                res.render('inner.hbs', data_template)
            } else {
                res.redirect('/life')
            }
        });
    } else {
        data('life_post', [req.params.id, 6]).then((data) => {
            data_template = {
                querys: data
            };
            if (data_template['querys'].length > 0){
                console.log(data_template);
                data_template["islogin"] = 1
                data_template["userid"] = req.session.userid
                if (req.session.userid == 1){
                    data_template["admin"] = 1
                    res.render('inner.hbs', data_template)
                } else {
                    res.render('inner.hbs', data_template)
                }
            } else {
                res.redirect('/life')
            }
        });
    }
});

app.get('/popular/:id', (req, res) => {
    if (req.session.islogin != 1) {
        data('popular_post', [req.params.id, 1]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                res.render('inner.hbs', data_template)
            } else {
                res.redirect('/popular')
            }
        });
    } else {
        data('popular_post', [req.params.id, 1]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                data_template["islogin"] = 1
                data_template["userid"] = req.session.userid
                if (req.session.userid == 1){
                    data_template["admin"] = 1
                    res.render('inner.hbs', data_template)
                } else {
                    res.render('inner.hbs', data_template)
                }
            } else {
                res.redirect('/popular')
            }
        });
    }
});

app.get('/travel/:id', (req, res) => {
    if (req.session.islogin != 1) {
        data('travel_post', [req.params.id, 2]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                res.render('inner.hbs', data_template)
            } else {
                res.redirect('/travel')
            }
        });
    } else {
        data('travel_post', [req.params.id, 2]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                data_template["islogin"] = 1
                data_template["userid"] = req.session.userid
                if (req.session.userid == 1){
                    data_template["admin"] = 1
                    res.render('inner.hbs', data_template)
                } else {
                    res.render('inner.hbs', data_template)
                }
            } else {
                res.redirect('/travel')
            }
        });
    }
});

app.get('/covid/:id', (req, res) => {
    if (req.session.islogin != 1) {
        data('covid_post', [req.params.id, 3]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                res.render('inner.hbs', data_template)
            } else {
                res.redirect('/covid')
            }
        });
    } else {
        data('covid_post', [req.params.id, 3]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                data_template["islogin"] = 1
                data_template["userid"] = req.session.userid
                if (req.session.userid == 1){
                    data_template["admin"] = 1
                    res.render('inner.hbs', data_template)
                } else {
                    res.render('inner.hbs', data_template)
                }
            } else {
                res.redirect('/covid')
            }
        });
    }
});

app.get('/education/:id', (req, res) => {
    if (req.session.islogin != 1) {
        data('education_post', [req.params.id, 5]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                res.render('inner.hbs', data_template)
            } else {
                res.redirect('/education')
            }
        });
    } else {
        data('education_post', [req.params.id, 5]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                data_template["islogin"] = 1
                data_template["userid"] = req.session.userid
                if (req.session.userid == 1){
                    data_template["admin"] = 1
                    res.render('inner.hbs', data_template)
                } else {
                    res.render('inner.hbs', data_template)
                }
            } else {
                res.redirect('/education')
            }
        });
    }
});

app.get('/technology/:id', (req, res) => {
    if (req.session.islogin != 1) {
        data('technology_post', [req.params.id, 4]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                res.render('inner.hbs', data_template)
            } else {
                res.redirect('/technology')
            }
        });
    } else {
        data('technology_post', [req.params.id, 4]).then((data) => {
            data_template = {
                querys: data
            };
            console.log(data_template['querys']);
            if (data_template['querys'].length > 0){
                console.log(data_template);
                data_template["islogin"] = 1
                data_template["userid"] = req.session.userid
                if (req.session.userid == 1){
                    data_template["admin"] = 1
                    res.render('inner.hbs', data_template)
                } else {
                    res.render('inner.hbs', data_template)
                }
            } else {
                res.redirect('/technology ')
            }
        });
    }
});


app.get('/register', (req, res) => {
    if (req.session.islogin != 1) {
        res.render('createacc.hbs')
    } else {
        res.redirect('/')
    }
    
})

app.post('/create', urlencodedParser, upload2.single('imageprofile'), (req, res) => {
    data('create', [req.body.username, req.body.email, req.body.password, req.file.filename]).then((data) => {
        res.redirect('/login')
    })
})

app.get('/login', (req, res) => {
    if (req.session.islogin != 1) {
        res.render('login.hbs')
    } else {
        res.redirect('/')
    }
})

app.post('/loging', urlencodedParser, (req, res) => {
    data('loging', [req.body.email, req.body.password]).then((data) => {
        if (data.length > 0) {
            session = req.session;
            session.userid = data[0]['id_user'];
            console.log(session);
            req.session.islogin = 1
            if (session.userid == 1){
                req.session.admin = 1
            }
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    })
})

app.get('/newpost', (req, res) => {
    if (req.session.islogin != 1) {
        res.redirect('/login');
    } else {
        data_template["islogin"] = 1
        data_template["userid"] = req.session.userid
        res.render('createpost.hbs', data_template)
    }
    
})

app.post('/createpost', urlencodedParser, upload.single('image'), (req, res) => {
    console.log(req.file.filename);
    data('newpost', [req.body.title, req.body.text, req.body.select, req.file.filename, req.session.userid]).then((data) => {
        res.redirect('/');
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/admin', (req, res) => {
    if (req.session.admin == 1) {
        data('admin', []).then((data) => {
            data_template = {
                headers: Object.keys(data[0]),
                querys: data
            };
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            data_template["admin"] = 1
            res.render('admin.hbs', data_template)
        })
    } else {
        res.redirect('/')
    }
})

app.get('/delete/:id', (req, res) => {
    data('delete', [req.params.id]).then((data) => {
        res.redirect('/admin')
    })
})

app.get('/edit/:id', (req, res) => {
    data('edit', [req.params.id]).then((data) => {
        data_template = {
            querys: data
        };
        data_template["islogin"] = 1
        data_template["userid"] = req.session.userid
        data_template["admin"] = 1
        res.render('edit.hbs', data_template)
    })
})

app.post('/editpost', urlencodedParser, upload.single('image'), (req, res) => {
    console.log(req.body);
    let idata = req.body;
    if (!req.file.filename){
        data('editpost', [idata.title, idata.text, idata.select, '', idata.id]).then((data) => {
            res.redirect('/admin')
        })
    } else {
        data('editpost', [idata.title, idata.text, idata.select, req.file.filename, idata.id]).then((data) => {
            res.redirect('/admin')
        })
    }
})

app.get('/profile/:id', (req, res) => {
    if (req.params.id == req.session.userid) {
        data('profileinfo', [req.params.id]).then((data) => {
            if (data.length > 0) {
                data_template = {
                    headers: Object.keys(data[0]),
                    querys: data,
                    profilename: data.slice(0, 1)
                };
                console.log(data_template);
                data_template["islogin"] = 1;
                data_template["userid"] = req.session.userid;
                if (req.session.userid == 1) {
                    data_template["admin"] = 1;
                    res.render('profile.hbs', data_template);
                } else {
                    res.render('profile.hbs', data_template);
                }
            } else {
                res.send('Такой страницы ещё нет (напишите свой первый пост) <a href="/">На главную</a>')
            }
            
        })
    } else {
        res.redirect('/')
    }
});

app.get('/editprofile/:id', (req, res) => {
    if (req.params.id == req.session.userid) {
        data('profile', [req.params.id]).then((data) => {
            data_template = { data: data }
            data_template["islogin"] = 1
            data_template["userid"] = req.session.userid
            if (req.session.userid == 1) {
                data_template["admin"] = 1
                res.render('profileedit.hbs', data_template)
            } else {
                res.render('profileedit.hbs', data_template)
            }
        })
    } else {
        res.redirect('/')
    }
});

app.post('/editprof', urlencodedParser, upload2.single('image'), (req, res) => {
    console.log(req.body);
    if (req.body.password1 == req.body.password2 && req.body.password1 != '') {
        data('profileedit', [req.body.username, req.body.email, req.body.password1, req.file.filename, req.body.id]).then((data) => {
            res.redirect('/profile/' + req.body.id)
        })
    } else if (req.body.password1 == ''){
        data('profileedit', [req.body.username, req.body.email, req.body.password, req.file.filename, req.body.id]).then((data) => {
            res.redirect('/profile/' + req.body.id)
        })
    } else {
        res.redirect('/editprofile/' + req.body.id)
    }
})
app.listen(3000);