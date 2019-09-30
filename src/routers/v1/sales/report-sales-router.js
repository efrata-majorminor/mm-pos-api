var Router = require('restify-router').Router;;
var router = new Router();
var SalesReportManager = require('mm-module').sales.SalesReportManager;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");
var ObjectId = require('mongodb').ObjectId;
var passport = require('../../../passports/jwt-passport');

const apiVersion = '1.0.0';

router.get('/', passport, (request, response, next) => {

});

router.get('/stores-product/:datefrom/:dateto', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesReportManager(db, request.user);
        // format date : yyyy/MM/dd
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var page = request.query.page || 1;
        var size = request.query.size || 15;
        var groupby = request.params.groupby || "";

        var result = {};
        var query = {};

        var skip = (page - 1) * size;

        result = manager.dailyStoreSales(datefrom, dateto, skip, size).toArray();
        query = manager.dailyStoreSalesQuery(datefrom, dateto).toArray();

        Promise.all([result, query]).then((docs) => {
            var query = {};
            if (docs[1][0]) {
                var count = docs[1][0].total;
                query = {
                    size: size,
                    page: page,
                    total: count,
                    totalPage: Math.ceil(count / size)
                }
            }
            var returnValue = {
                query: query,
                data: docs[0]
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

router.get('/stores-product/:datefrom/:dateto/:productId', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesReportManager(db, request.user);
        // format date : yyyy/MM/dd
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var productId = request.params.productId;

        var result = {};

        manager.productsReportByProductID(datefrom, dateto, productId).toArray().then((docs) => {
            var result = resultFormatter.ok(apiVersion, 200, docs);
            result.info = docs;
            response.send(200, result);
        }).catch(e => {
            var error = resultFormatter.fail(apiVersion, 400, e);
            response.send(400, error);
        });
    })
});

router.get('/products/:datefrom/:dateto', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new SalesReportManager(db, request.user);
        // format date : yyyy/MM/dd
        var datefrom = request.params.datefrom;
        var dateto = request.params.dateto;
        var page = request.query.page || 1;
        var size = request.query.size || 15;
        var groupby = request.params.groupby || "";

        var result = {};
        var query = {};

        var skip = (page - 1) * size;

        result = manager.productsReport(datefrom, dateto, skip, size).toArray();
        query = manager.productsReportQuery(datefrom, dateto).toArray();

        Promise.all([result, query]).then((docs) => {
            var query = {};
            if (docs[1][0]) {
                var count = docs[1][0].total;
                query = {
                    size: size,
                    page: page,
                    total: count,
                    totalPage: Math.ceil(count / size)
                }
            }
            var returnValue = {
                query: query,
                data: docs[0]
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

module.exports = router;