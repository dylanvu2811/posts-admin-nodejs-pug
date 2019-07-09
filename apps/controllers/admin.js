const express = require('express');
const router = express.Router();
const user_md = require('../models/user');
const post_md = require('../models/post');
const helper = require('../helpers/helper');
const slugify = require('slugify');
router.get('/', (req, res) => {

    if (req.session.user){
        const data = post_md.getAllPost();
        data.then((posts) => {
            const data = {
                posts: posts,
                error: false
            };
            res.render('admin/dashboard', {data: data});
        }).catch((err) => {
            res.render('admin/dashboard', {data: {error: "get post data is false"}});
        });
    }else {
        res.redirect('/admin/signin');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup', {data: {}});
});

router.get('/signin', (req, res) => {
    res.render('signin', {data: {}});
});

router.post('/signup', (req, res) => {

    let user = req.body;

    if(user.email.trim().length == 0 ){
        res.render('signup', {data: {error: 'Email is required'}});
    }

    if(user.passwd != user.repasswd && user.passwd.trim().length != 0 ){
        res.render('signup', {data: {error: 'password is not match'}});
    }


    // insert to database
    const password = helper.hash_password(user.passwd);
    user = {
        email: user.email,
        password: password,
        first_name: user.firstname,
        last_name: user.lastname
    };
    
    const result = user_md.addUser(user);

    result.then((data) => {
        res.redirect("/admin/signin");
    }).catch((err) => {
        res.render('signup', {data: {error: 'insert false'}});
    });
 

});

router.post('/signin', (req, res) => {

    let params = req.body;

    if(params.email.trim().length == 0 ){
        res.render('signin', {data: {error: 'pls enter an email'}});
    } else {
        const data = user_md.getUserByEmail(params.email);
        if (data) {
            data.then((users) => {
                const user = users[0];
                const  stt = helper.compare_password(params.password, user.password);

                if(!stt) {
                    res.render("signin", {data: {error:"passs wrong"}});
                }else {
                    req.session.user = user;
                    res.redirect("/admin/");
                }
            });
        }else {
            res.render("signin", {data: {error:"user not exists"}});
        }
    }
});

router.get('/post/index', (req, res) => {

    if (req.session.user){
        const data = post_md.getAllPost();
        data.then((posts) => {
            const data = {
                posts: posts,
                error: false
            };
            res.render('admin/post/index', {data: data});
        }).catch((err) => {
            res.render('admin/post/index', {data: {error: "get post data is false"}});
        });
    }else {
        res.redirect('/admin/signin');
    }
});
router.get('/post/add', (req, res) => {
    if (req.session.user){
        res.render('admin/post/add', {data: {error: false}});
    }else {
        res.redirect('/admin/signin');
    }
});
router.post('/post/add', (req, res) => {

    if (req.session.user){
        const params = req.body;

        if(params.title.trim().length == 0) {
            const data = {
                error: "pls enter title"
            };
            res.render('admin/post/add', {data: data});
        } else {
            const now = new Date();
            params.created_at = now;
            params.updated_at = now;
            params.slug = '/' + slugify(params.title);
            const data = post_md.addPost(params);
            data.then((result) => {
                res.redirect('/admin/post/index');
            }).catch((err) => {
                const data = {
                    error: 'insert false'
                };
                res.render('admin/post/add', {data: data});
            });
        }
    }else {
        res.redirect('/admin/signin');
    }

});

router.get('/post/edit/:id', (req, res) => {
    if (req.session.user){
        const params = req.params;
        const id = params.id;
    
        const data = post_md.getPostById(id);
        if(data) {
            data.then((posts) => {
                const post = posts[0];
                const data = {
                    post: post,
                    error: false
                };
                res.render('admin/post/edit', {data: data});
            }).catch((err) => {
                const data = {
                    error: "could not get post by id"
                };
                res.render('admin/post/edit', {data: data});
            });
        } else {
            const data = {
                error: "could not get post by id"
            };
            res.render('admin/post/edit', {data: data})
        }
    }else {
        res.redirect('/admin/signin');
    }

});

router.put('/post/edit', (req, res) => {
    const params = req.body;
    const data = post_md.updatePost(params);
    if (!data) {
        res.json({status_code: 500});
    } else {
        data.then((result) => {
            res.json({status_code: 200});
        }).catch((err) => {
            res.json({status_code: 500});
        })
    }
});

router.delete('/post/delete', (req, res) => {
    const post_id = req.body.id;
    const data = post_md.deletePost(post_id);
    if (!data) {
        res.json({status_code: 500});
    } else {
        data.then((result) => {
            res.json({status_code: 200});
        }).catch((err) => {
            res.json({status_code: 500});
        })
    }
});

router.get('/user', (req, res) => {


    if (req.session.user){
        const data = user_md.getAllUsers();

        if(data) {
            data.then((users) => {
                const data = {
                    users: users,
                    error: false
                };
                res.render('admin/user', {data: data});
            }).catch((err) => {
                const data = {
                    error: "could not get users"
                };
                res.render('admin/user', {data: data});
            });
        }
    }else {
        res.redirect('/admin/signin');
    }
});


module.exports = router;