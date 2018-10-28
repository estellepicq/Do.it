const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

//Get all todos by todolistId
router.get('/all/:id', (req, res, next) => {

  //Connection to todolistapp database
  MongoClient.connect("mongodb://localhost/doit", function(err, db) {
      if (err) {
        res.json({success: false, data: err});
        console.log(err);
      } else {
        //We get all todos in an array
        db.collection("todolist").find({todolistId: req.params.id}).toArray(function (err, results) {
          if (err) {
            res.json({success: false, data: err});
            console.log(err);
          } else {
            res.json({success: true, data: results});
          }
        });
      }
  });
});

//Select distinct todolist ids
router.get('/todolistids', (req, res, next) => {

  //Connection to doit database
  MongoClient.connect("mongodb://localhost/doit", function(err, db) {
      if (err) {
        res.json({success: false, data: err});
        console.log(err);
      } else {
        //We get all todos in an array
        db.collection("todolist").distinct('todolistId', function (err, results) {
          if (err) {
            res.json({success: false, data: err});
            console.log(err);
          } else {
            res.json({success: true, data: results});
          }
        });
      }
  });
});

//Add todo route
router.post('/add', (req, res, next) => {
  MongoClient.connect("mongodb://localhost/doit", function(err, db) {
    if (err) {
      res.json({success: false, data: err});
      console.log(err);
    } else {
      //We insert the new todo into database
      db.collection("todolist").insertOne({item: req.body.newtodo, done: false, todolistId: req.body.todolistId}, null, function(err, results) {
        if (err) {
          res.json({success: false, data: err});
          console.log(err);
        } else {
          res.json({success: true, data: {id: results.insertedId, item: req.body.newtodo}});
          console.log("item inserted into todolist: " + req.body.newtodo);
        }
      });
    }
  });
});

//Add many items route
router.post('/addmany', (req, res, next) => {
  MongoClient.connect("mongodb://localhost/doit", function(err, db) {
    if (err) {
      res.json({success: false, data: err});
      console.log(err);
    } else {
      //We insert the new todos into database
      db.collection("todolist").insertMany(req.body.items, null, function(err, results) {
        if (err) {
          res.json({success: false, data: err});
          console.log(err);
        } else {
          res.json({success: true, data: {items: results.ops, todolistId: results.ops[0].todolistId}});
          console.log(results.result.n + " items inserted into todolist: " + results.ops[0].todolistId);
        }
      });
    }
  });
});

//Update todo route
router.put('/update/:id', (req, res, next) => {
  MongoClient.connect("mongodb://localhost/doit", function(err, db) {
    if (err) {
      res.json({success: false, data: err});
      console.log(err);
    } else {
      //We find the item to remove
      db.collection("todolist").find({_id: ObjectID(req.params.id)}).toArray(function (err, results) {
        if (err) {
          res.json({success: false, data: err});
          console.log(err);
        } else {
          //We update the item
          var invertDone = !(results[0].done);
          db.collection("todolist").update({_id: results[0]._id}, {$set: {done: invertDone}}, null, function(err, results) {
            if (err) {
              res.json({success: false, data: err});
              console.log(err);
            } else {
              res.json({success: true, data: 'item updated'});
              console.log("item updated");
            }
          });
        }
      });
    }
  });
});

//Delete todo route
router.delete('/delete/:id', (req, res, next) => {
  MongoClient.connect("mongodb://localhost/doit", function(err, db) {
    if (err) {
      res.json({success: false, data: err});
      console.log(err);
    } else {
      //We find the item to remove
      db.collection("todolist").find({_id: ObjectID(req.params.id)}).toArray(function (err, results) {
        if (err) {
          res.json({success: false, data: err});
          console.log(err);
        } else {
          //We remove item
          db.collection("todolist").remove({_id: results[0]._id}, null, function(err, results) {
            if (err) {
              res.json({success: false, data: err});
              console.log(err);
            } else {
              res.json({success: true, data: 'item removed from todolist'});
              console.log("item removed from todolist");
            }
          });
        }
      });
    }
  });
});

module.exports = router;
