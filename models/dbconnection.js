"use strict"

const {promisify} = require('util');
const  mysql      = require('mysql');

//mysql connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pillsbee',
});

/* Promisify Mysql Connection */
pool.query   = promisify(pool.query);

(async() =>{
    try{
      await pool.query('SELECT NOW() AS "theTime"');
      console.log("Mysql Connected");
    }catch(err){
      console.log(err);
    }
  })();

module.exports.Pool= pool;