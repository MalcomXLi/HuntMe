var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var url = process.env.MONGODB_URI + '/team';
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
    if (err) {
        console.log(err);
        res.status(404).send(err);
    } else {   
        //console.log(result);
        res.status(200).send(result);
    }
  });
});

app.post('/create', function(req, res)  {
  db.collection('team').save(req.body, function(err, result) {
    if (err) {
        console.log(err);
        res.status(400).send(err);
    } else {
        console.log('saved to database');
        //console.log(result);
        res.status(201).send(result);
    }
  });
});

app.put('/update', function(req, res)  {
  db.collection('team').findOneAndUpdate({name: req.body.name}, {
    $set: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, function(err, result)  {
    if (err) {
        res.status(400).send(err);
    } else {
        res.status(200).send(result);
    }
  });
});

app.delete('/delete', function(req, res)  {
  db.collection('team').findOneAndDelete({name: req.body.name}, function(err, result)  {
    if (err) {
        res.status(500).send(err);
    } else {
        res.status(200).send('A darth vadar quote got deleted');
    }
  });
});
