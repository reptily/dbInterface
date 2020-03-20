const MongoClient = require("mongodb").MongoClient;

function Controller() {
    this.con = null;
    this.config = {};
    this.db = null;
    this.client = null;

    this.Connect = (config, call) => {
        this.config = config;

        this.con = new MongoClient("mongodb://" + this.config.host + ":" + this.config.port + "/", {useNewUrlParser: true});
        this.con.connect((err, client) => {
            if (err) throw err;
            this.client = client;

            this.db = this.client.db(this.config.database);

            this.db.listCollections().toArray((err, collections) => {
                if (err) throw err;

                collections.forEach((val, i) => {
                    this[val.name] = new Query();
                    this[val.name].con = this.con;
                    this[val.name].collection = val.name;
                    this[val.name].db = this.db;
                });

                call(this, err);
                return;
            });
        });
    };

    this.Create = (table, values, res) => {
        this.db.createCollection(table, (err, result) => {
            if (err) throw err;
            res(result);
        });
    };

    this.Disconnect = () => {
        this.client.close();
    };
}

function Query() {
    this.con = null;
    this.collection = null;
    this.db = null;
    this._where = {};
    this._field = {};
    this._limit = 0;
    this._skip = 0;
    this._sort = {};
    this._set = {};

    this.Insert = (obj, res) => {
        if (!Array.isArray(obj)) {
            this.db.collection(this.collection).insertOne(obj, (err, result) => {
                if (err) throw err;
                this.Clear();
                if (typeof res == "function") {
                    res(result);
                }
                return;
            });
        } else {
            this.db.collection(this.collection).insertMany(obj, (err, result) => {
                if (err) throw err;
                this.Clear();
                if (typeof res == "function") {
                    res(result);
                }
                return;
            });
        }
    };

    this.field = (obj) => {
        this._field.projection = {};
        this._field.projection["_id"] = 0;
        obj.forEach((val, i) => {
            this._field.projection[val] = 1;
        });
        return this;
    };

    this.where = (...mWhere) => {
        mWhere.forEach((where, i) => {
            if (typeof where == "object") {
                this._where = where;
            } else {
                let w = {};
                let mat = where.match(/(.*)(>=|==|<=|!=)(.*)/i);
                if (mat == null) {
                    mat = where.match(/(.*)(>|<)(.*)/i);
                    if (mat != null) {
                        switch (mat[2].trim()) {
                            case ">":
                                w = {$gt: parseInt(mat[3].trim())};
                                break;
                            case "<":
                                w = {$lt: parseInt(mat[3].trim())};
                                break;
                        }
                    }
                } else {
                    switch (mat[2].trim()) {
                        case ">=":
                            w = {$gte: parseInt(mat[3].trim())};
                            break;
                        case "<=":
                            w = {$lte: parseInt(mat[3].trim())};
                            break;
                        case "==":
                            w = {$in: [parseInt(mat[3].trim())]};
                            break;
                        case "!=":
                            w = {$ne: parseInt(mat[3].trim())};
                            break;
                    }
                }
                this._where[mat[1].trim()] = w;
            }
        });
        return this;
    };

    this.limit = (l1, l2) => {
        this._limit = l1;
        if (l2 !== undefined) {
            this._skip = l2 - l1;
        }
        return this;
    };

    this.order = (key, value) => {
        let val = 0;
        if ("asc" == value.toLowerCase().trim()) {
            val = 1;
        } else {
            val = -1;
        }

        this._sort[key] = val;
        return this;
    };

    this.Select = (res) => {
        let __field = this._field;
        this.db.collection(this.collection).find(this._where, __field).limit(this._limit).skip(this._skip).sort(this._sort).toArray((err, result) => {
            if (err) throw err;
            res(result);
        });
        this.Clear();
    };

    this.set = (obj) => {
        this._set = {$set: obj};
        return this;
    };

    this.Update = (res) => {
        this.db.collection(this.collection).updateMany(this._where, this._set, (err, result) => {
            if (err) throw err;
            if (typeof res == "function") {
                res(result);
            }
            return;
        });
        this.Clear();
    };

    this.Truncate = (res) => {
        this.db.dropDatabase((err, result) => {
            if (err) throw err;

            if (typeof res == "function") {
                res(result);
            }
            return;
        });
        this.Clear();
    };

    this.Clear = () => {
        this._field = {};
        this._where = {};
        this._field = {};
        this._limit = 0;
        this._skip = 0;
        this._sort = {};
        this._set = {};
    };

    this.Delete = (res) => {
        this.db.collection(this.collection).remove(this._where, (err, result) => {
            if (err) throw err;
            if (typeof res == "function") {
                res(result);
            }
            return;
        });
    };

    this.inner = (table)=>{
        //todo
        console.log("\x1b[31mNot support now (((\x1b[0m");
        return this;
    };

    this.left = (table)=>{
        //todo
        console.log("\x1b[31mNot support now (((\x1b[0m");
        return this;
    };

    this.on = (t1,t2)=>{
        //todo
        console.log("\x1b[31mNot support now (((\x1b[0m");
        return this;
    };

    this.Drop = (res) => {
        //todo
        console.log("\x1b[31mNot support now (((\x1b[0m");
        return;
    };
}

module.exports = Controller;
