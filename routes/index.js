'use strict';
var express = require('express');
var router = express.Router();
var client = require('../db');


module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){

    client.query('SELECT * FROM tweets INNER JOIN users ON tweets.user_id = users.id', function (err, result) {
      if (err) return next(err); // pass errors to Express
      console.log(result);
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  }

  //updated respondWithAllTweets

  //query the database
  // router.get('/', function(req, res, next) {
  //   client.query('SELECT * FROM tweets', function (err, result) {
  //     if (err) return next(err); // pass errors to Express
  //     var tweets = result.rows;
  //     res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
  //   });
  // });

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    client.query('SELECT * FROM tweets INNER JOIN users ON tweets.user_id = users.id WHERE users.name = $1',
      [req.params.username], function(err, result){
        if (err) return next(err);
            res.render('index', {
            title: 'Twitter.js',
            tweets: result.rows,
            showForm: true,
            username: req.params.username
          });
       });

  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    //var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
    client.query('SELECT content FROM tweets WHERE id = $1',
                 [req.params.id], function(err, result){
                   if (err) return next(err);
                   res.render('index', {
                   title: 'Twitter.js',
                   tweets: result.rows // an array of only one element ;-)
                  });

                 });

  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    //var newTweet = tweetBank.add(req.body.name, req.body.text);
    client.query('INSERT INTO tweets (user_id, content) VALUES ((SELECT id FROM users WHERE name = $1), $2) RETURNING *', [req.body.name, req.body.text],
                 function (err, result) {
                  if (err) return next(err);

                  io.sockets.emit('new_tweet', result.rows);
                  res.redirect('/');
                 });

  });


  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
};
