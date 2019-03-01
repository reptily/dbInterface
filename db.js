const mysql= require('./mysql');
const mongodb= require('./mongodb');

function DB(type){
        this.type=type;
        this.con=null;
        this.interface=[];
        this.interface['mysql']=mysql;
        this.interface['mongodb']=mongodb;
        
        this.Connect =(config,call)=> {
             let controller = new this.interface[this.type];
             controller.Connect(config,(c,e)=>{
                call(c,e);
                return;
             });
        }        
}

module.exports = DB;
