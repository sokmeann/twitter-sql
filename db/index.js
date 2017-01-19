var pg = require('pg');
var client = new pg.Client('postgres://localhost/twitterdb');


client.connect();

client.query('SELECT * FROM users', function(err, data){
  if(err) return console.error(err);
  data.rows.forEach(row => console.log(row));
});
