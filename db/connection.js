const mysql= require ("mysql2")
const db = mysql.createConnection(
    {
      host: "localhost",
      // MySQL username
      user: "root",
      //MySQL password
      password: "",
      //Database being connected to
      database: "tracker_db",
    },
    console.log(`Connected to the employee tracker database.`)
  );
  
  db.connect( (err)=> {
    if (err) throw err;
  });
  module.exports= db;