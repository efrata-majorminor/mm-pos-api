var Router = require('restify-router').Router;;
var router = new Router();
var SalesManager = require('bateeq-module').sales.SalesManager;
var SalesReturnManager = require('bateeq-module').sales.SalesReturnManager;
var db = require('../../../../db');
var resultFormatter = require("../../../../result-formatter");
var ObjectId = require('mongodb').ObjectId;
var passport = require('../../../../passports/jwt-passport');

const apiVersion = '1.0.0';

router.get('/', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesReturnManager(db, request.user);
  
        var storeid = request.params.storeid;
        
        var query = request.query;
        query.filter = !query.filter ? {} : JSON.parse(query.filter);
        var filterStore = {
            "salesDocReturn.storeId" : new ObjectId(storeid)
        }
        var filter = {
            'isVoid' : false
        }
        query.filter = {
            '$and': [
                query.filter,
                filterStore,
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
  
router.get('/returnables', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesManager(db, request.user);

        var storeid = request.params.storeid;
        
        var query = request.query;
        query.filter = !query.filter ? {} : JSON.parse(query.filter);
        var filterStore = {
            'storeId' : new ObjectId(storeid)
        } 
        var filter = {
            'isVoid' : false
        } 
        query.filter = {
            '$and': [
                query.filter,
                // filterStore,
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

module.exports = router;