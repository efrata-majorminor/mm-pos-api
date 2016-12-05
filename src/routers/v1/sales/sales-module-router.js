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
        var filter = {
            'isVoid' : false,
            'isReturn': false
        } 
        query.filter = {
            '$and': [
                query.filter,
                filterAuth,
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
        var stores = [];
        for(var store of request.user.stores) {
            stores.push(new ObjectId(store._id));
        }
        var filterAuth = {
            "store._id" : { "$in" : stores }
        }
        var filter = {
            storeId: new ObjectId(storeid),
            date: {
                $gte: new Date(datefrom),
                $lte: new Date(dateto)
            },
            shift : shift.toString(),
            'isVoid' : false
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