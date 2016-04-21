var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var url = process.env.MONGOLAB_URI + '/team';
var db;

MongoClient.connect(url, function(err, database) {
  if (err) return console.log(err);
  db = database;
  app.listen(process.env.PORT || 3000, function() {
    console.log('listening on 3000');
  });
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res)  {
  db.collection('team').find().toArray( function(err, result) {
    if (err) return console.log(err);
    console.log(result);
    res.send(result);
  });
});

app.post('/create', function(req, res)  {
  db.collection('team').save(req.body, function(err, result) {
    if (err) return console.log(err);
    console.log('saved to database');
  });
});

app.put('/update', function(req, res)  {
  db.collection('team').findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, function(err, result)  {
    if (err) return res.send(err);
    res.send(result);
  });
});

app.delete('/remove', function(req, res)  {
  db.collection('quotes').findOneAndDelete({name: req.body.name}, function(err, result)  {
    if (err) return res.send(500, err);
    res.send('A darth vadar quote got deleted');
  });
});
