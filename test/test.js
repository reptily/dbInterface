const DB = require('../db');

const config = {
        host:"127.0.0.1",
        port:"3306",
        database:"test",
        login:"reptily",
        password:"",
        debug:false
        };
        
function print2console(text){
        console.log("\x1b[32m"+text+"\x1b[0m");  
}

new DB("mysql").Connect(config,(model,err)=>{       
        if (err) throw err;
        console.log("Connect OK");
        
        /*Test Create table tags*/
        let table = {
                obj_id:{
                        type:"int",
                        count:11,
                        isNull:false,
                        autoIncrement:true
                        },
                tag_type:{},
                tag:{}
                };
        
        model.Create("tags",table,()=>{
                print2console("Create table tags");        
        
                /*Test Insert*/
                model.tags.Insert({obj_id:99,tag_type:"interface",tag:"Тест"},()=>{
                        print2console("Test Insert");
                });
                
                /*Test Select table tags*/
                model.tags.Select((res)=>{
                        print2console("Test Select table tags");
                        console.log(res);
                });
                
                /*Test Select table tags only obj_id colum*/
                model.tags.field(["obj_id"]).Select((res)=>{
                        print2console("Test Select table tags only obj_id colum");
                        console.log(res);
                });
                
                /*Test Select table tags and where obj_id = 1*/
                model.tags.where({obj_id:1}).Select((res)=>{
                        print2console("Test Select table tags and where obj_id = 1");
                        console.log(res);
                });
                
                /*Test Select table tags and where obj_id = 1 and tag_type = news*/
                model.tags.where({obj_id:1,tag_type:"news"}).Select((res)=>{
                        print2console("Test Select table tags and where obj_id = 1 and tag_type = news");
                        console.log(res);
                });
                
                /*Test Select table tags and where obj_id >= 10*/
                model.tags.where("obj_id >= 10").Select((res)=>{
                        print2console("Test Select table tags and where obj_id >= 10");
                        console.log(res);
                });
                
                /*Test Select table tags and limit 1*/
                model.tags.limit(1).Select((res)=>{
                        print2console("Test Select table tags and limit 1");
                        console.log(res);
                });
                
                /*Test Select table tags and start 3 lines and limit display to 3 rows*/
                model.tags.limit(3,6).Select((res)=>{
                        print2console("Test Select table tags and start 3 lines and limit display to 3 rows");
                        console.log(res);
                });
                
                /*Test Select table tags and order asc lines and limit display to 10 rows*/   
                model.tags.limit(10).order("tag","asc").Select((res)=>{
                        print2console("Test Select table tags and order asc lines and limit display to 10 rows");
                        console.log(res);
                });  
                
                /*Test Update obj_id = 99 set obj_id = 69*/      
                model.tags.set({obj_id:69}).where({obj_id:99}).Update(()=>{
                        print2console("Test Update obj_id = 99 set obj_id = 69");
                });
                
                /*Test Truncate*/
                model.tags.Truncate(()=>{
                        print2console("Test Truncate");
                });
                
                /*Test Drop*/
                model.tags.Drop(()=>{
                        print2console("Test Drop");
                });
        
        });
});
