var Router = require('restify-router').Router;;
var router = new Router();
var SalesManager = require('bateeq-module').sales.SalesManager;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");
var ObjectId = require('mongodb').ObjectId;

const apiVersion = '1.0.0';

router.get('/', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
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
        var manager = new SalesManager(db, {
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

router.get('/:storename/:isTransByStoreName', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });

        var storename = request.params.storename;

        var query = request.query;
        query.filter = {
            "store.name": storename.toString()
            
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

//getAllSalesByVoidTrue
router.get('/:allDate/:allCode/:allStore', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });
        // format date : yyyy/MM/dd

        var query = request.query;
        query.filter = {
            isVoid : true
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

//getAllSalesByFilter
router.get('/:storeid/:datefrom/:dateto/:shift', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });
        // format date : yyyy/MM/dd
        var storeid = request.params.storeid;
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var shift = request.params.shift;

        var query = request.query;
        query.filter = {
            storeId: new ObjectId(storeid),
            date: {
                $gte: new Date(datefrom),
                $lte: new Date(dateto)
            },
            shift : shift.toString()
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

//getAllSalesAllStore = 5 parameter
router.get('/:storeid/:datefrom/:dateto/:shift/:typeAllStore', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });
        // format date : yyyy/MM/dd
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var shift = request.params.shift;

        var query = request.query;
        query.filter = {
            date: {
                $gte: new Date(datefrom),
                $lte: new Date(dateto)
            },
            shift : shift.toString()
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

//getAllSalesAllShift = 6 parameter
router.get('/:storename/:datefrom/:dateto/:shift/:typeAllStore/:typeAllShift', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });
        // format date : yyyy/MM/dd
        var storename = request.params.storename;
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;

        var query = request.query;
        query.filter = {
            'store.name': storename.toString(),
            date: {
                $gte: new Date(datefrom),
                $lte: new Date(dateto)
            }
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

//getAllSalesAllStoreAllShift = 7 parameter
router.get('/:storename/:datefrom/:dateto/:shift/:typeAllStore/:typeAllShift/:typeAllStoreAllShift', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });
        // format date : yyyy/MM/dd
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;

        var query = request.query;
        query.filter = {
            date: {
                $gte: new Date(datefrom),
                $lte: new Date(dateto)
            }
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

//getAllSalesWithSpecificFilter = 8 parameter
router.get('/:storename/:datefrom/:dateto/:shift/:typeAllStore/:typeAllShift/:typeAllStoreAllShift/:typeNoStoreNoShift', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });
        // format date : yyyy/MM/dd
        var storename = request.params.storename;
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var shift = request.params.shift;

        var query = request.query;
        query.filter = {
            'store.name': storename.toString(),
            date: {
                $gte: new Date(datefrom),
                $lte: new Date(dateto)
            },
            shift : shift.toString()
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

//getAllSalesByReference = 9 parameter
router.get('/:storename/:datefrom/:dateto/:shift/:typeAllStore/:typeAllShift/:typeAllStoreAllShift/:typeNoStoreNoShift/:refer', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });
        // format date : yyyy/MM/dd
        var refer = request.params.refer;

        var query = request.query;
        query.filter = {
            code : refer
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
router.post('/', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });

        var data = request.body;

        manager.create(data)
            .then(docId => {
                response.header('Location', `sales/docs/sales/${docId.toString()}`);
                var result = resultFormatter.ok(apiVersion, 201);
                response.send(201, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
}); 

router.put('/', (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, {
            username: 'router'
        });

        var id = request.params.id;
        var data = request.body;

        manager._void(data)
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
        var manager = new SalesManager(db, {
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