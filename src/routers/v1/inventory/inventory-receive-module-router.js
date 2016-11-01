var Router = require('restify-router').Router;;
var router = new Router();
var map = require('bateeq-module').inventory.map;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");

const apiVersion = '1.0.0';

router.get('/efr-tb-bbt/pending', (request, response, next) => {
    db.get().then(db => {
       var Manager = map.get("efr-tb-bbt");
        var manager = new Manager(db, {
            username: 'router'
        });
        
        var query = request.query;

        manager.readPendingSPK(query)
            .then(docs => { 
                var result = resultFormatter.ok(apiVersion, 200, docs);
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.get('/efr-tb-bat/pending', (request, response, next) => {
    db.get().then(db => {
       var Manager = map.get("efr-tb-bat");
        var manager = new Manager(db, {
            username: 'router'
        });
        var query = request.query;

        manager.readPendingSPK(query)
            .then(docs => { 
                var result = resultFormatter.ok(apiVersion, 200, docs);
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});



router.get('/efr-tb-bbt/pending/:id', (request, response, next) => {
    db.get().then(db => {
       var Manager = map.get("efr-tb-bbt");
        var manager = new Manager(db, {
            username: 'router'
        });
        var id = request.params.id;

        manager.getPendingSPKById(id)
            .then(docs => { 
                var result = resultFormatter.ok(apiVersion, 200, docs);
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.get('/efr-tb-bat/pending/:id', (request, response, next) => {
    db.get().then(db => {
       var Manager = map.get("efr-tb-bat");
        var manager = new Manager(db, {
            username: 'router'
        });
        var id = request.params.id;

        manager.getPendingSPKById(id)
            .then(docs => { 
                var result = resultFormatter.ok(apiVersion, 200, docs);
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});


module.exports = router;