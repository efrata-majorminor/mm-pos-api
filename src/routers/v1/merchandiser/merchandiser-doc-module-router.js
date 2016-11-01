var Router = require('restify-router').Router;;
var router = new Router();
var map = require('bateeq-module').merchandiser.map;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");

const apiVersion = '1.0.0';
router.get('/:module/draft/:id', (request, response, next) => {
    db.get().then(db => {
        
        var module = request.params.module;
        var Manager = map.get(module);
        var manager = new Manager(db, {
            username: 'router'
        });
        
        var id = request.params.id;

        manager.getById(id)
            .then(doc => {
                var result = resultFormatter.ok(apiVersion, 200, doc);
                response.send(200, result); 
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.get('/:module/submitted/:id', (request, response, next) => {
    db.get().then(db => {
        
        var module = request.params.module;
        var Manager = map.get(module);
        var manager = new Manager(db, {
            username: 'router'
        });
        
        var id = request.params.id;

        manager.getById(id)
            .then(doc => {
                var result = resultFormatter.ok(apiVersion, 200, doc);
                response.send(200, result); 
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.post('/:module/draft', (request, response, next) => {
    db.get().then(db => {
        
        var module = request.params.module;
        var Manager = map.get(module);
        var manager = new Manager(db, {
            username: 'router'
        });
        
        var data = request.body;

        manager.createDraft(data)
            .then(docId => {
                response.header('Location', `merchandisers/docs/${module}/draft/${docId.toString()}`);
                var result = resultFormatter.ok(apiVersion, 201);
                response.send(201, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
}); 

router.del('/:module/draft/:id', (request, response, next) => {
    db.get().then(db => {
        
        var module = request.params.module;
        var Manager = map.get(module);
        var manager = new Manager(db, {
            username: 'router'
        });
         
        var id = request.params.id;
        var data = request.body;

        manager.delete(data)
            .then(docId => {
                var result = resultFormatter.ok(apiVersion, 204);
                response.send(204, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })
    })
});

router.get('/:module', (request, response, next) => {
    db.get().then(db => {
        
        var module = request.params.module;
        var Manager = map.get(module);
        var manager = new Manager(db, {
            username: 'router'
        });
        
        var query = request.query;

        manager.read(query)
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

router.post('/:module/submitted', (request, response, next) => {
    db.get().then(db => {
        
        var module = request.params.module;
        var Manager = map.get(module);
        var manager = new Manager(db, {
            username: 'router'
        });
        
        var data = request.body;

        manager.create(data)
            .then(docId => {
                response.header('Location', `merchandisers/docs/${module}/${docId.toString()}`);
                var result = resultFormatter.ok(apiVersion, 201);
                response.send(201, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.put('/:module/submitted/:id', (request, response, next) => {
    db.get().then(db => {
        
        var module = request.params.module;
        var Manager = map.get(module);
        var manager = new Manager(db, {
            username: 'router'
        }); 
        
        var id = request.params.id;
        var data = request.body;

        manager.updateNotDraft(data)
            .then(docId => {
                var result = resultFormatter.ok(apiVersion, 204);
                response.send(204, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.put('/:module/draft/:id', (request, response, next) => {
    db.get().then(db => {
        
        var module = request.params.module;
        var Manager = map.get(module);
        var manager = new Manager(db, {
            username: 'router'
        }); 
        
        var id = request.params.id;
        var data = request.body;

        manager.updateDraft(data)
            .then(docId => {
                var result = resultFormatter.ok(apiVersion, 204);
                response.send(204, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});


 




 
module.exports = router;