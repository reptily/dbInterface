const mysql= require('./mysql');
function DB(type){
        this.type=type;
        this.con=null;
        this.interface=[];
        this.interface['mysql']=mysql;
        
        this.Connect =(config,call)=> {
             let controller = new this.interface[this.type];
             controller.Connect(config,(c,e)=>{
                call(c,e);
                return;
             });
        }        
}

module.exports = DB;