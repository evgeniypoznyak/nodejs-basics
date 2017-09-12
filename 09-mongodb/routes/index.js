const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
const url = 'mongodb://localhost:27017/test'

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/get-data', function (req, res, next) {
    let resultArray = [];
    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        let cursor = db.collection('userdata').find();
        cursor.forEach((doc, err) => {
            assert.equal(err, null);
            resultArray.push(doc);
        }, () => {
            db.close();
            res.render('index', {items: resultArray});
        })
    })
});

router.post('/insert', function (req, res, next) {
    let item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    }

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('userdata').insertOne(item, function (err, result) {
            assert.equal(null, err);
            console.log('Item inserted');
            db.close();
        });
    });

    res.redirect('/');
});
router.post('/update', function (req, res, next) {

    let item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    }
    let id = req.body.id;

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('userdata').updateOne({"_id": objectId(id)}, {$set: item}, function (err, result) {
            assert.equal(null, err);
            console.log('Item updated');
            db.close();
        });
    });
    res.redirect('/');
});
router.post('/delete', function (req, res, next) {
    let id = req.body.id;

    mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection('userdata').deleteOne({"_id": objectId(id)}, function (err, result) {
            assert.equal(null, err);
            console.log('Item deleted');
            db.close();
        });
    });
    res.redirect('/');
});

module.exports = router;
