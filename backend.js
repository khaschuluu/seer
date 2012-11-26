var express = require('express'),
    mongoq = require('mongoq')
    fs = require('fs'),
    util = require('util');

var db = mongoq('test-database'); // Initialize database

var app = express.createServer();
app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');
app.use(express.bodyParser()); // Automatically parse JSON in POST requests
app.use(express.static(__dirname + '/public')); // Serve static files from public (e.g http://localhost:8080/index.html)
app.use(express.errorHandler({dumpExceptions: true, showStack: true})); // Dump errors

app.get('/', function(req, res) {
    res.render('index');
});

// Add score
app.post('/api/scores', function(req, res) {
    var score = req.body;
    score.id = Date.now().toString(); // You probably want to swap this for something like https://github.com/dylang/shortid

    db.collection('scores').insert(score, {safe: true}).done(function(score) {
        res.json(score, 201);
    });
});

// List scores (accepts skip and limit query parameters)
app.get('/api/scores', function(req, res) {
    db.collection('scores').find().skip(req.query.skip || 0).limit(req.query.limit || 0).toArray().done(function(scores) {
        res.json(scores);
    });
});

// Read score
app.get('/api/scores/:id', function(req, res) {
    db.collection('scores').findOne({id: req.params.id}).done(function(score) {
        res.json(score);
    });
});

// Update score (supports partial updates, e.g only send one field or all)
app.put('/api/scores/:id', function(req, res) {
    var score = req.body;

    db.collection('scores').update({id: req.params.id}, {$set: score}, {safe: true}).done(function(success) {
        res.json(success ? 200 : 404);
    });
});

// Delete score
app.del('/api/scores/:id', function(req, res) {
    db.collection('scores').remove({id: req.params.id}, {safe: true}).done(function(success) {
        res.json(success ? 200 : 404);
    });
});

app.listen(8080);
