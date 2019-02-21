# dbInterface
Interface for working with various databases (MySQL, MongoDB, ClickHouse)

Initialization module

const DB = require('../db');

const config = {
        host:"127.0.0.1",
        port:"3306",
        database:"test",
        login:"reptily",
        password:"",
        debug:false
        };
const con = new DB("mysql");
