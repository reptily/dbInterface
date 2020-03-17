const mysql = require('./mysql');
const mongodb = require('./mongodb');
const postgre = require('./postgre');

function DB(type){
  this.type=type;
  this.con=null;
  this.interface=[];
  this.interface['mysql']=mysql;
  this.interface['mongodb']=mongodb;
  this.interface['postgre']=postgre;
  this.controller=null;

  this.Connect =(config,call)=> {
  this.controller = new this.interface[this.type];
    this.controller.Connect(config,(c,e)=>{
      call(c,e);
      return;
    });
  };

  this.Disconnect =()=>{
    this.controller.Disconnect();
  };
}

module.exports = DB;
