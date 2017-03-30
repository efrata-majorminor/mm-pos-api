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
        var filter = {
            'isVoid': false,
            'isReturn': false
        }
        query.filter = {
            '$and': [
                query.filter,
                filter
            ]
        };

        query.order = {
            '_updatedDate': -1
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

//getAllSalesByFilter
router.get('/:storeid/:datefrom/:dateto/:shift', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);
        // format date : yyyy/MM/dd
        var storeid = request.params.storeid;
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var shift = request.params.shift;

        var query = request.query;
        query.filter = !query.filter ? {} : JSON.parse(query.filter);
        var filter = {
            storeId: new ObjectId(storeid),
            date: {
                $gte: new Date(datefrom),
                $lte: new Date(dateto)
            },
            'isVoid': false
        };



        var filterShift = {};
        if (shift != 0) {
            filterShift = {
                shift: parseInt(shift)
            };
        }

        query.filter = {
            '$and': [
                query.filter,
                filter,
                filterShift
            ]
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

router.get('/products/:datefrom/:dateto', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);
        // format date : yyyy/MM/dd
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var page = request.query.page || 0;
        var size = request.query.size || 15;
        var groupby = request.params.groupby || "";

        var result = {};
        var query = {};

        var skip = (page - 1) * size;

        result = manager.productsReport(datefrom, dateto, skip, size).toArray();
        query = manager.productsReportQuery(datefrom, dateto).toArray();

        Promise.all([result, query]).then((docs) => {
            var query = {};
            if(docs[1][0]){
                var count  = docs[1][0].total;
                query = {
                    size : size,
                    page :page,
                    totalPage :  Math.ceil(count/size)
                }
            }
            var returnValue = {
                query : query,
                data : docs[0]
            }
            var result = resultFormatter.ok(apiVersion, 200, returnValue);
            result.info = returnValue;
            response.send(200, result);
        }).catch(e => {
            var error = resultFormatter.fail(apiVersion, 400, e);
            response.send(400, error);
        })
    })
});


router.get('/:datefrom/:dateto/:groupby', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);
        // format date : yyyy/MM/dd
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var groupby = request.params.groupby || "";

        var result = {};
        if (groupby.toLowerCase() == "pos")
            result = manager.omsetReportPos(datefrom, dateto);
        else if (groupby.toLowerCase() == "store")
            result = manager.omsetReportStore(datefrom, dateto);

        result.toArray().then((docs) => {
            var result = resultFormatter.ok(apiVersion, 200, docs);
            result.info = docs;
            response.send(200, result);
        }).catch(e => {
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
                response.header('Id', `${docId.toString()}`);
                var result = resultFormatter.ok(apiVersion, 201);
                response.send(201, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.put('/:id', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);

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