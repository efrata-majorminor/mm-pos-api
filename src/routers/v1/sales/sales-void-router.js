var Router = require('restify-router').Router;;
var router = new Router();
var SalesManager = require('bateeq-module').sales.SalesManager;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");
var ObjectId = require('mongodb').ObjectId;
var passport = require('../../../passports/jwt-passport');

const apiVersion = '1.0.0';

router.get('/', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);

        var query = request.query;
        query.filter = !query.filter ? {} : JSON.parse(query.filter);
        var stores = [];
        for(var store of request.user.stores) {
            stores.push(new ObjectId(store._id));
        }
        var filterAuth = {
            "store._id" : { "$in" : stores }
        }
        var filterCode = {};
        if (query.code) {
            filterCode = {
                code: query.code
            }
        }
        var filter = {
            isVoid: true
        }; 
        query.filter = {
            '$and': [
                query.filter,
                filterAuth,
                filterCode,
                filter
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

router.get('/:id', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);

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

router.get('/:datefrom/:dateto', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);
        // format date : yyyy/MM/dd
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
 
        var query = request.query;
        query.filter = !query.filter ? {} : JSON.parse(query.filter);
        var stores = [];
        for(var store of request.user.stores) {
            stores.push(new ObjectId(store._id));
        }
        var filterAuth = {
            "store._id" : { "$in" : stores }
        }
        var filter = {
            date: {
                $gte: new Date(datefrom),
                $lte: new Date(dateto)
            }
        };
        query.filter = {
            '$and': [
                query.filter,
                filterAuth,
                filter
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


router.get('/:storename/:datefrom/:dateto/:shift', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);
        // format date : yyyy/MM/dd
        var storename;
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var shift;
        var query = request.query;
        query.filter = !query.filter ? {} : JSON.parse(query.filter);
          
        var stores = [];
        for(var store of request.user.stores) {
            stores.push(new ObjectId(store._id));
        }
        var filterAuth = {
            "store._id" : { "$in" : stores }
        }
        
        var filterStore = {};
        var filterShift = {};
        var filterDate = {};
        if (shift != "Semua") {
            shift = request.params.shift;
            filterShift = {
                shift: shift.toString()
            };
        }
        if (storename != "Semua") {
            storename = request.params.storename;
            filterStore = {
                'store.name': storename.toString()
            };
        }

        if (shift == "Semua" && storename == "Semua") {
            query.filter = {
                _updatedDate: {
                    $gte: new Date(datefrom),
                    $lte: new Date(dateto)
                }
            };
        }
        else if (shift != "Semua" && storename != "Semua") {
            query.filter = {
                _updatedDate: {
                    $gte: new Date(datefrom),
                    $lte: new Date(dateto)
                }
            };
            query.filter = {
                '$and': [filterStore, filterShift, filterDate]
            };
        }
        else if (shift != "Semua" && storename == "Semua") {
            query.filter = {
                _updatedDate: {
                    $gte: new Date(datefrom),
                    $lte: new Date(dateto)
                }
            };
            query.filter = {
                '$and': [filterShift, filterDate]
            };
        }
        else if (shift == "Semua" && storename != "Semua") {
            query.filter = {
                _updatedDate: {
                    $gte: new Date(datefrom),
                    $lte: new Date(dateto)
                }
            };
            query.filter = {
                '$and': [filterStore, filterDate]
            };
        }
         
        query.filter = {
            '$and': [query.filter, filterAuth]
        };
        // var filterDate = {
        //     //  _updatedDate: {
        //     //     $gte: new Date(datefrom),
        //     //     $lte: new Date(dateto)
        //     // }
        // };
        // query.filter = {
        //     '$and': [
        //         query.filter,
        //         filterAuth,
        //         filterStore,
        //         filterShift,
        //         filterDate
        //     ]
        // };
        
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

router.post('/', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);

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

router.put('/', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);

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


router.del('/:id', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);

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