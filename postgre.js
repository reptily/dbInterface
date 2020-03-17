const { Pool, Client } = require('pg');

function Controller(){
    this.con = [];
    this.config = {};

    this.Connect =(config, call)=>{
        this.config = config;
        this.con['pool'] = new Pool(config);
        this.con['client'] = new Client(config);

        this['Create'] = new Query().Create;
        this['Create'].con = this.con;

        this.con['client'].connect(err => {
            if(err){
                console.log("Connect is falid");
                throw err;
            }

            this.con['pool'].query('SELECT * FROM pg_catalog.pg_tables;', (err, res) =>{
                if (err) throw err;

                res.rows.forEach(val => {
                    if (val.schemaname == "public") {
                        let table = val.tablename;
                        this[table] = new Query();
                        this[table].con = this.con;
                        this[table].table = table;
                        this[table].config = config;
                    }
                });

                call(this, err);
                return;
            });
        });


    }

    this.Disconnect =()=>{
        this.con['client'].end();
        this.con['pool'].end();
    };
}

function Query(){
    this.con = null;
    this.config = {};
    this.table = null;
    this._field = [];
    this._where = "";
    this._set = "";
    this._limit = "";
    this._order = "";
    this.joinTable="";
    this.join="";

    this.field = (field) =>{
        this._field =  field;
        return this;
    };

    this.where =(...mWhere)=>{
        let or=false;
        mWhere.forEach((where,i)=>{
            if(typeof where == "object"){
                let i=1;
                for(let key in where){
                    val = where[key];
                    this._where += ""+key+" = '"+val+"' `~`";
                    i++;
                }
            } else {
                if(where.toLowerCase().trim() == "or"){
                    or=true;
                }else{
                    mat = where.match(/(.*)(>=|==|<=|!=)(.*)/i);
                    if(mat == null){
                        mat = where.match(/(.*)(>|<)(.*)/i);
                        if(mat != null){
                            this._where += mat[1].trim()+" "+mat[2].trim()+" '"+mat[3].trim()+"' `~`";
                        }
                    }else{
                        this._where += mat[1].trim()+" "+mat[2].trim()+" '"+mat[3].trim()+"' `~`";
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

    this.inner = (table)=>{
        this.joinTable=table;
        this.join+=" INNER JOIN "+table+" ";
        return this;
    };

    this.left = (table)=>{
        this.joinTable=table;
        this.join+=" LEFT JOIN "+table+" ";
        return this;
    };

    this.on = (t1,t2)=>{
        t1=this.table+"."+t1;
        t2=this.joinTable+"."+t2;

        this.join+=" ON "+t1+" = "+t2+" ";
        return this;
    };

    this.Select = (res)=>{
        let field = "";
        if(this._field.length > 0){
            this._field.forEach((val,i)=>{
                field+=val+",";
            });
            field=field.substring(0,field.length-1);
        }else{
            field="*";
        }
        let sql = "SELECT "+field+" FROM "+this.table

        if(this.join != ""){
            sql+=this.join;
        }

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
        this.con['pool'].query(sql, (err, result, fields) => {
            if (err) throw err;
            res(result.rows);
            return;
        });
    };

    this.Insert=(arr,res)=>{
        let sql = "INSERT INTO "+this.table;
        let _2d = true;
        let keys ="";
        let vals ="";

        if(arr[0] == undefined) _2d=false;

        if(_2d){
            for(val in arr){
                for(let v in arr[val]){
                    vals += "'"+this.es(arr[val][v])+"',";
                    if(val == 0){
                        keys += this.es(v)+",";
                    }
                }
                vals=vals.substring(0,vals.length-1);
                vals += "),(";
            }
        }else{
            for(let val in arr){
                keys += this.es(val)+",";
                vals += "'"+this.es(arr[val])+"',";
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

        this.con['pool'].query(sql, (err, result, fields) => {
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
        for(let val in set){
            vals += val+" = '"+set[val]+"',";
        }
        vals=vals.substring(0,vals.length-1);
        this._set += vals;

        return this;
    };

    this.Update =(res)=>{
        let sql = "UPDATE "+this.table+" "+this._set;

        if(this._where != ""){
            sql += " WHERE "+this._where;
        }

        if(this.debug) this.Debug(sql);

        this.Clear();

        this.con['pool'].query(sql, (err, result, fields) => {
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
            this._limit=parseInt(l1)+" OFFSET "+parseInt(l2);
        }
        return this;
    };

    this.order = (key,value)=>{
        if("asc" == value.toLowerCase().trim()){
            value="ASC";
        }else{
            value="DESC";
        }

        this._order = key+" "+value;
        return this;
    };

    this.Debug = (text)=>{
        console.log("\x1b[33m"+text+"\x1b[0m");
    };

    this.Clear =()=>{
        this._field = [];
        this._where = "";
        this._set = "";
        this._limit = "";
        this._order = "";
        this.joinTable="";
        this.join="";
    };

    this.Delete = (res)=>{
        let sql = "DELETE FROM "+this.table;

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

    this.Drop =(res)=>{
        let sql = "DROP TABLE "+this.table;

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

    this.Create =(table, values, res)=>{
        let sql = "CREATE TABLE IF NOT EXISTS "+table+" (\n";

        let _autoIncrementKey = null;
        for(let val in values){
            sql += val+" ";
            let _type = "text";
            let _count = "";
            let _isNull = " NULL";
            let _default = "";
            let _autoIncrement = "";

            for(let v in values[val]){
                switch(v){
                    case "type":
                        _type=values[val][v];
                        break;
                    case "count":
                        _count="("+parseInt(values[val][v])+")";
                        break;
                    case "isNull":
                        if(!values[val][v]){
                            _isNull = " NOT NULL";
                        }
                        break;
                    case "autoIncrement":
                        _autoIncrement = " GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY";
                        _autoIncrementKey = val;
                        break;
                    case "default":
                        _default = " DEFAULT '"+values[val][v]+"'";
                        break;
                }
            }

            sql += _type+_count+_isNull+_default+_autoIncrement+",\n";
        }

        sql=sql.substring(0,sql.length-2);

        sql += ")";

        if(this.debug) this.Debug(sql);

        this['Create'].con['pool'].query(sql, (err, result, fields) => {
            if (err) throw err;

            if(typeof res == "function"){
                this[table] = new Query();
                this[table].con = this.con;

                res(result);
            }
            return;
        });
    };

    this.Truncate =(res)=>{
        let sql = "TRUNCATE TABLE "+this.table+"";

        if(this.debug) this.Debug(sql);

        this.Clear();

        this.con['pool'].query(sql, (err, result, fields) => {
            if (err) throw err;

            if(typeof res == "function"){
                res(result);
            }
            return;
        });
    };

    this.es = val => {
        val += '';
        return val.replace(/\'/gim,"\\'");
    }

}

module.exports = Controller;