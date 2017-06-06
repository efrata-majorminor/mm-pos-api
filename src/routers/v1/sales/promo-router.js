var Router = require('restify-router').Router;;
var router = new Router();
var PromoManager = require('bateeq-module').sales.PromoManager;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");
var ObjectId = require('mongodb').ObjectId;

const apiVersion = '1.0.0';

router.get('/', (request, response, next) => {
    db.get().then(db => {
        var manager = new PromoManager(db, {
            username: 'router'
        });
        
        var query = request.query;

        manager.read(query)
            .then(docs => { 
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
                delete docs.data;
                result.info = docs;
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.get('/:id', (request, response, next) => {
    db.get().then(db => {
        var manager = new PromoManager(db, {
            username: 'router'
        });
        
        var id = request.params.id;

        manager.getSingleById(id)
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

router.get('/:storeId/:datetime/:itemId/:quantity', (request, response, next) => {
    db.get().then(db => {
        var manager = new PromoManager(db, {
            username: 'router'
        });
        
        var storeId = request.params.storeId; 
        //Date Format : yyyy-MM-ddThh:mm:ss
        var datetime = request.params.datetime;
        var itemId = request.params.itemId;  
        var quantity = parseInt(request.params.quantity);
        
        var query = request.query;
        query.filter = {
            'validFrom': {
                '$lte': new Date(datetime)
            },
            'validTo': {
                '$gte': new Date(datetime)
            },
            'stores': {
                '$elemMatch': { 
                    '_id': new ObjectId(storeId)
                }
            },
            '$or': [
                {
                    'criteria.type': 'selected-product',
                    'criteria.criterions': {
                        '$elemMatch' : {
                            'itemId': new ObjectId(itemId),
                            'minimumQuantity': {
                                '$lte': quantity   
                            }
                        }
                    }
                },
                {
                    'criteria.type': 'package',
                    'criteria.criterions': {
                        '$elemMatch' : {
                            'itemId': new ObjectId(itemId)
                        }
                    }
                }
            ]
        };

        manager.read(query)
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
                delete docs.data;
                result.info = docs;
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.get('/all/:datetime/:storeid', (request, response, next) => {
    db.get().then(db => {
        var manager = new PromoManager(db, {
            username: 'router'
        });
        var datetime = new Date(request.params.datetime);
        var storeId = request.params.storeid;
        var query = request.query;

        query.filter = {
            '_active': true,
            '_deleted': false
        };

        manager.read(query)
            .then(docs => {
                var data = [];
                for (var item of docs.data) {
                    var validFrom = new Date(item.validFrom);
                    var validTo = new Date(item.validTo);

                    if (datetime.getTime() >= validFrom.getTime() && datetime.getTime() <= validTo.getTime()) {
                        for (var store of item.stores) {
                            if (storeId === store.code) {
                                data.push(item);
                                break;
                            }
                        }
                    }
                }
                var result = resultFormatter.ok(apiVersion, 200, data);
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })
    });
});

router.post('/', (request, response, next) => {
    db.get().then(db => {
        var manager = new PromoManager(db, {
            username: 'router'
        });
        
        var data = request.body;

        manager.create(data)
            .then(docId => {
                response.header('Location', `sales/docs/promos/${docId.toString()}`);
                var result = resultFormatter.ok(apiVersion, 201);
                response.send(201, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.put('/:id', (request, response, next) => {
    db.get().then(db => {
        var manager = new PromoManager(db, {
            username: 'router'
        });
        
        var id = request.params.id;
        var data = request.body;

        manager.update(data)
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

router.del('/:id', (request, response, next) => {
    db.get().then(db => {
        var manager = new PromoManager(db, {
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


module.exports = router;