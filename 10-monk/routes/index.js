var express = require('express');
var router = express.Router();
var db = require('monk')('localhost:27017/test');
var userData  = db.get('userdata');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/get-data', function(req, res, next) {
    //Promise
    userData.find({}).then((docs) => {
        res.render('index', {items: docs});
    })

});

router.post('/insert', function(req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    userData.insert(item);

    res.redirect('/');
});

router.post('/update', function(req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };
    var id = req.body.id;
    userData.update(id, item);
    res.redirect('/');
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    userData.remove(id)
    res.redirect('/');
});

module.exports = router;