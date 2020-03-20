const DB = require('../db');
const async = require('async');

const config = {
    drive: "postgre",
    host: "localhost",
    port: "5432",
    database: "message",
    user: "default",
    password: "secret",
    debug: true,
}

/*Test table tags*/
const table = {
    obj_id: {
        type: "integer",
        isNull: false,
        autoIncrement: true,
    },
    tag_type: {},
    tag: {}
};

const tableJoin = {
    id: {
        type: "integer",
        isNull: false,
        autoIncrement: true,
    },
    title: {},
    body: {},
    id_tags:{
        type: "integer",
    },
};

function print2console(text) {
    console.log("\x1b[32m" + text + "\x1b[0m");
}

new DB(config.drive).Connect(config, (model, err) => {
    if (err) throw err;
    console.log("Connect OK");

    //Step by step!!!
    async.series([


        function testCreate(step) {
            model.Create("tags", table, model => {
                print2console("Create table tags");
                step();
            });
        },

        function testInsertOne(step) {
            model.tags.Insert({obj_id: 666, tag_type: "interface", tag: "Тест"}, () => {
                print2console("Test Insert One");
                step();
            });
        },

        function testInsertMany(step) {
            model.tags.Insert([
                {obj_id: 111, tag_type: "interface 111", tag: "Тест 1"},
                {obj_id: 222, tag_type: "interface 222", tag: "Тест 2"},
                {obj_id: 333, tag_type: "interface 333", tag: "Тест 3"},
                {obj_id: 444, tag_type: "interface 444", tag: "Тест 4"},
            ], () => {
                print2console("Test Insert Many");
                step();
            });
        },

        function testSelect(step) {
            model.tags.Select(res => {
                print2console("Test Select table tags");
                //todo
                console.log(res);
                step();
            });
        },

        function testSelectOneField(step) {
            model.tags.field(["obj_id"]).Select(res => {
                print2console("Test Select table tags only obj_id colum");
                //todo
                console.log(res);
                step();
            });
        },

        function testSelectWhere(step) {
            model.tags.where({obj_id: 666}).Select(res => {
                print2console("Test Select table tags and where obj_id = 666");
                //todo
                console.log(res);
                step();
            });
        },

        function testSelectWhere(step) {
            model.tags.where({obj_id: 666, tag_type: "interface"}).Select(res => {
                print2console("Test Select table tags and where obj_id = 666 and tag_type = interface");
                //todo
                console.log(res);
                step();
            });
        },

        function testSelectWhere(step) {
            model.tags.where("obj_id >= 222").Select(res => {
                print2console("Test Select table tags and where obj_id >= 222");
                //todo
                console.log(res);
                step();
            });
        },

        function testlimit(step) {
            model.tags.limit(1).Select((res) => {
                print2console("Test Select table tags and limit 1");
                //todo
                console.log(res);
                step();
            });
        },

        function testLimit(step) {
            model.tags.limit(2, 2).Select((res) => {
                print2console("Test Select table tags and start 2 lines and limit display to 2 rows\"");
                //todo
                console.log(res);
                step();
            });
        },

        function testLimitOrder(step) {
            model.tags.limit(3).order("obj_id", "asc").Select(res => {
                print2console("Test Select table tags and order asc lines and limit display to 3 rows");
                //todo
                console.log(res);
                step();
            });
        },

        function testUpdate(step) {
            model.tags.set({tag_type: 69}).where({obj_id: 666}).Update(res => {
                print2console("Test Update obj_id = 69 set obj_id = 666");
                //todo
                step();
            });
        },

        function testUpdate(step) {
            model.tags.set({tag_type: 'new interface', tag: 'Обновленый Тест'}).where({obj_id: 666}).Update(res => {
                print2console("Test Update obj_id = 69 set obj_id = 666");
                //todo
                step();
            });
        },

        function testCreate(step) {
            model.Create("news", tableJoin, model => {
                print2console("Create table news");
                step();
            });
        },

        function testInsertMany(step) {
            model.news.Insert([
                {id: 1, title: "Новость 1", body: "тело новости 1", id_tags: 111},
                {id: 2, title: "Новость 2", body: "тело новости 2", id_tags: 222},
                {id: 3, title: "Новость 3", body: "тело новости 3", id_tags: 222},
            ], () => {
                print2console("Test Insert Many");
                step();
            });
        },

        function testLeftJoin(step) {
           model.tags.left("news").on("obj_id","id_tags").Select(res => {
               print2console("Test left join");
               //todo
               console.log(res);
               step();
           });
        },

        function testInnerJoin(step) {
            model.tags.inner("news").on("obj_id","id_tags").Select(res => {
                print2console("Test inner join");
                //todo
                console.log(res);
                step();
            });
        },

        function testAddColum(step) {
            model.tags.addColumn("time", {type: "int"}, res => {
                print2console("Test add cloumn");
                //todo
                step();
            });
        },

        function testRemoveColumn(step) {
            model.tags.removeColumn("time", res => {
                print2console("Test remove column");
                //todo
                step();
            });
        },

        function testTruncate(step) {
            model.tags.Truncate(res => {
                print2console("Test Truncate");
                //todo
                step();
            });
        },

        function testDropTags(step) {
            model.tags.Drop(res => {
                print2console("Test Drop");
                //todo
                step();
            });
        },

        function testDropNews(step) {
            model.news.Drop(res => {
                print2console("Test Drop");
                //todo
                step();
            });
        },


        function endTest(step) {
            model.Disconnect();
            step();
        }

    ]);

});