var Router = require('restify-router').Router;;
var router = new Router();
var SalesManager = require('mm-module').sales.SalesManager;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");
var ObjectId = require('mongodb').ObjectId;
var passport = require('../../../passports/jwt-passport');
const moment = require("moment");

const apiVersion = '1.0.0';

router.get('/', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);

        var query = request.query;
        query.filter = !query.filter ? {} : JSON.parse(query.filter);
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
                filterCode,
                filter
            ]
        };  

        query.order = {
            '_updatedDate' : -1
        }
        
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
        var filter = {
            isVoid: true,
            date: {
                $gte: new Date(moment(dateFrom).startOf("day")),
                $lte: new Date(moment(dateTo).endOf("day"))
            }
        };
        query.filter = {
            '$and': [
                query.filter,
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


router.get('/:storeid/:datefrom/:dateto/:shift', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);
        // format date : yyyy/MM/dd
        var storeid = request.params.storeid;
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var shift = parseInt(request.params.shift);
        var query = request.query;
        datefrom = new Date(moment(datefrom).startOf("day"));
        dateto = new Date(moment(dateto).endOf("day"));

        query.filter = !query.filter ? {} : JSON.parse(query.filter);
        
        var filterShift = {};
        var filterDate = {};
        if (shift != 0) {
            filterShift = {
                shift: shift
            };
        } 
        
        var filterStore = {
            'storeId': new ObjectId(storeid)
        };
        var filterDate = {
            isVoid: true,
            _updatedDate: {
                $gte: new Date(moment(datefrom).startOf("day")),
                $lte: new Date(moment(dateto).endOf("day"))
            }
        }
        
        query.filter = {
            '$and': [query.filter, filterStore, filterShift, filterDate]
        };
                
        manager.readAll(query)
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