const mysql = require('mysql');

function Controller(){
        this.con = null;
        this.config = {};
        this.table = null;
        this._field = [];
        this._where = "";
        this._set = "";
        this._limit = "";
        this._order = "";
        
        this.Connect =(config, call)=>{
        this.config = config;          
              this.con = mysql.createConnection(config);
              this.con.connect((err)=>{
                 if(err){
                        console.log("Connect is falid");
                        throw err;
                }
                
                this.con.query("SHOW TABLES", (err, result, fields) => {
                        if (err) throw err;
                        for(res in result){
                                this.table=result[res]['Tables_in_'+this.config.database];
                                this[result[res]['Tables_in_'+this.config.database]]=this;
                        }
                        call(this,err);
                        return;
                });
              });              
        };
        
        this.field = (field) =>{
              this._field =  field;
              return this;
        };        
        
        this.where =(...mWhere)=>{
                let or=false;
                mWhere.forEach((where,i)=>{
                        if(typeof where == "object"){
                                for(w in where){
                                        key = w;
                                        val = where[w];
                                        this._where += "`"+key+"` = '"+val+"' `~`";
                                }
                        }else{
                               if(where.toLowerCase().trim() == "or"){
                                        or=true;
                               }else{
                                        mat = where.match(/(.*)(>=|==|<=)(.*)/i);
                                        if(mat == null){
                                                mat = where.match(/(.*)(>|<)(.*)/i);
                                                if(mat != null){
                                                        this._where += "`"+mat[1].trim()+"` "+mat[2].trim()+" '"+mat[3].trim()+"' `~`";
                                                }
                                        }else{
                                                this._where += "`"+mat[1].trim()+"` "+mat[2].trim()+" '"+mat[3].trim()+"' `~`";
                                        }
                               }
                        }
                });
                
                this._where = this._where.substring(0,this._where.length-4);
                if(or){
                        this._where = this._where.replace(/\`\~\`/g,"OR ");   
                }else{
                        this._where = this._where.replace(/\`\~\`/g,"AND "); 
                }
                
                return this;
        };
        
        this.Select =(res)=>{
                let field = "";
                if(this._field.length > 0){
                        this._field.forEach((val,i)=>{
                                field+="`"+val+"`,";
                        });
                        field=field.substring(0,field.length-1);
                }else{
                    field="*";    
                }
                let sql = "SELECT "+field+" FROM `"+this.table+"`";
               
                if(this._where != ""){
                        sql+=" WHERE "+this._where;
                }
                
                if(this._order != ""){
                        sql+=" ORDER BY "+this._order;
                }
                
                if(this._limit != ""){
                        sql+=" LIMIT "+this._limit;
                }

                this.Clear();
                
                if(this.config.debug) this.Debug(sql);
                this.con.query(sql, (err, result, fields) => {
                      if (err) throw err;                      
                      res(result);
                      return;
                });
        };       
                
        this.Insert=(arr,res)=>{
                let sql = "INSERT INTO `"+this.table+"`";
                let _2d = true;
                let keys ="";
                let vals ="";
                
                if(arr[0] == undefined) _2d=false;
                
                if(_2d){
                        for(val in arr){                      
                                for(v in arr[val]){
                                        vals += "'"+arr[val][v]+"',";
                                        if(val == 0){
                                                keys += "`"+v+"`,";
                                        }
                                }
                                vals=vals.substring(0,vals.length-1);
                                vals += "),(";
                        }
                }else{
                        for(val in arr){
                                keys += "`"+val+"`,";
                                vals += "'"+arr[val]+"',";
                        }
                }
                
                keys=keys.substring(0,keys.length-1);
                if(_2d){
                        vals=vals.substring(0,vals.length-3);
                }else{
                        vals=vals.substring(0,vals.length-1);
                }
                sql = sql+"("+keys+") VALUES("+vals+")";
                
                if(this.debug) this.Debug(sql);
                
                this.Clear();
                
                this.con.query(sql, (err, result, fields) => {
                      if (err) throw err;
                      
                      if(typeof res == "function"){
                        res(result);
                      }
                      return;
                });
        };
        
        this.set =(set)=>{
                this._set = "SET ";
                let vals = "";
                for(val in set){
                        vals += "`"+val+"` = '"+set[val]+"',";
                }
                vals=vals.substring(0,vals.length-1);
                this._set += vals;
                
                return this;
        };
        
        this.Update =(res)=>{
                let sql = "UPDATE `"+this.table+"` "+this._set;
                
                if(this._where != ""){
                        sql += " WHERE "+this._where;
                }
                
                if(this.debug) this.Debug(sql);
                
                this.Clear();
                
                this.con.query(sql, (err, result, fields) => {
                      if (err) throw err;
                      
                      if(typeof res == "function"){
                        res(result);
                      }
                      return;
                });
        };
        
        this.limit = (l1,l2)=>{
                if(l2 === undefined){
                        this._limit=parseInt(l1);
                }else{
                        this._limit=parseInt(l1)+","+parseInt(l2);
                }
                return this;
        };
        
        this.order = (key,value)=>{
                if("asc" == value.toLowerCase().trim()){
                        value="ASC";
                }else{
                        value="DESC";
                }
                
                this._order = "`"+key+"` "+value;
                return this;
        };
        
        this.Debug =(text)=>{
                console.log("\x1b[33m"+text+"\x1b[0m");
        };
        
        this.Clear =()=>{
                this._field = [];
                this._where = "";
                this._set = "";
                this._limit = "";
                this._order = "";
        };
        
}

module.exports = Controller;