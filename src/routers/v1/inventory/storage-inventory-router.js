var Router = require('restify-router').Router;;
var router = new Router();
var StorageManager = require('bateeq-module').inventory.StorageManager;
var InventoryManager = require('bateeq-module').inventory.InventoryManager;
var InventoryMovementManager = require('bateeq-module').inventory.InventoryMovementManager;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");

const apiVersion = '1.0.0';

router.get('/:storageId/inventories', (request, response, next) => {
    db.get().then(db => {
        var manager = new InventoryManager(db, {
            username: 'router'
        });
        
        var storageId = request.params.storageId;
        var query = request.query;

        manager.readByStorageId(storageId,query)
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

router.get('/:storageId/inventories/:articleVariantId', (request, response, next) => {
    db.get().then(db => {
        var manager = new InventoryManager(db, {
            username: 'router'
        });
        
        var storageId = request.params.storageId;
        var articleVariantId = request.params.articleVariantId;

        manager.getByStorageIdAndArticleVarianId(storageId, articleVariantId)
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


module.exports = router;