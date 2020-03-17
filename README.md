# dbInterface
Interface for working with various databases (MySQL, MongoDB, PostgreSQL)

install for npm
```
npm install reptily-dbinterface
```

## Initialization module
```js
//if custom install
const DB = require('./dbInterface/db');
//if install for npm
const DB = require('reptily-dbinterface');

const config = {
  host:"127.0.0.1",
  port:"3306",
  database:"test",
  user:"reptily",
  password:"",
  debug:false
};
const con = new DB("mysql");
```
### Connect
```js
new DB("mysql").Connect(config,(model,err)=>{       
  if (err) throw err;
  console.log("Connect OK");
});
```
### Select
Select table tags
```js
model.tags.Select((res)=>{
  console.log(res);
});
```

Select table tags only obj_id colum
```js
model.tags.field(["obj_id"]).Select((res)=>{
  console.log(res);
});
```

Select table tags and where obj_id = 1
```js
 model.tags.where({obj_id:1}).Select((res)=>{
  console.log(res);
});
```

Select table tags and where obj_id = 1 and obj_id = 3
```js
 model.tags.where({obj_id:1},{obj_id:3}).Select((res)=>{
  console.log(res);
});
```

Select table tags and where obj_id = 1 and tag_type = news
```js
model.tags.where({obj_id:1,tag_type:"news"}).Select((res)=>{
  console.log(res);
});
```

Select table tags and where obj_id >= 10
```js
model.tags.where("obj_id >= 10").Select((res)=>{
  console.log(res);
});
```

Select table tags and limit 1
```js
model.tags.limit(1).Select((res)=>{
  console.log(res);
});
```

Select table tags and start 3 lines and limit display to 3 rows
```js
model.tags.limit(3,6).Select((res)=>{
  console.log(res);
});
```

Select table tags and order asc lines and limit display to 10 rows
```js
model.tags.limit(10).order("tag","asc").Select((res)=>{
  console.log(res);
});
```
### Insert
```js
model.tags.Insert({obj_id:99,tag_type:"interface",tag:"Тест"},(res)=>{
  console.log(res)
});
```

### Update
Update obj_id = 99 set obj_id = 69
```js
model.tags.set({obj_id:69}).where({obj_id:99}).Update((res)=>{
  console.log(res)
});
```

### Create
Create table tags
```js
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

model.Create("tags",table,(res)=>{
  console.log(res)   
});
```

### Drop
```js
model.tags.Drop((res)=>{
  console.log(res)   
});
```

### Truncate
```js
 model.tags.Truncate((res)=>{
  console.log(res)
});
```
