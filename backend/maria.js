const configenv = require('./config');
const maria = require('mysql');
const conn = maria.createConnection({
    host:'localhost',
    port:3306,
    user: configenv.mariaDB.user,
    password: configenv.mariaDB.password,
    database: configenv.mariaDB.database
});
module.exports = conn;
