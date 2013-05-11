var sqlite3 = require('sqlite3')
var usersDB = new sqlite3.Database("test3.db");
 
  usersDB.serialize(function() {
  usersDB.run("CREATE TABLE lorem (info TEXT)");
 
  var stmt = usersDB.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();
 
  usersDB.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});
 
usersDB.close();