var restify = require('restify');

var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser()); 
server.use(restify.CORS());
   
var originRouter = require('./src/routers/v1/inventory/storage-router');
originRouter.applyRoutes(server, "v1/inventory/storages"); 
    
var storageInventoryRouter = require('./src/routers/v1/inventory/storage-inventory-router');
storageInventoryRouter.applyRoutes(server, "v1/inventory/storages"); 
   
var storageInventoryMovementRouter = require('./src/routers/v1/inventory/storage-inventory-movement-router');
storageInventoryMovementRouter.applyRoutes(server, "v1/inventory/storages"); 

var transferInDocRouter = require('./src/routers/v1/inventory/transfer-in-doc-router');
transferInDocRouter.applyRoutes(server, "v1/inventory/docs/transfer-in"); 

var transferOutDocRouter = require('./src/routers/v1/inventory/transfer-out-doc-router');
transferOutDocRouter.applyRoutes(server, "v1/inventory/docs/transfer-out"); 

var inventoryReceiveModuleRouter = require('./src/routers/v1/inventory/inventory-receive-module-router');
inventoryReceiveModuleRouter.applyRoutes(server, "v1/inventory/docs"); 

var inventoryDocModuleRouter = require('./src/routers/v1/inventory/inventory-doc-module-router');
inventoryDocModuleRouter.applyRoutes(server, "v1/inventory/docs"); 

var merchandiserDocModuleSpecifyRouter = require('./src/routers/v1/merchandiser/merchandiser-doc-module-specify-router');
merchandiserDocModuleSpecifyRouter.applyRoutes(server, "v1/merchandiser/docs");  

var merchandiserDocModuleRouter = require('./src/routers/v1/merchandiser/merchandiser-doc-module-router');
merchandiserDocModuleRouter.applyRoutes(server, "v1/merchandiser/docs");  
 
var masterStoreRouter = require('./src/routers/v1/master/store-router');
masterStoreRouter.applyRoutes(server, "v1/master/stores");

var masterBankRouter = require('./src/routers/v1/master/bank-router');
masterBankRouter.applyRoutes(server, "v1/master/banks");

var masterCardTypeRouter = require('./src/routers/v1/master/card-type-router');
masterCardTypeRouter.applyRoutes(server, "v1/master/cardtypes/"); 

var salesModuleRouter = require('./src/routers/v1/sales/sales-module-router');
salesModuleRouter.applyRoutes(server, "v1/sales/docs/sales");  

var salesRewardTypeRouter = require('./src/routers/v1/sales/reward-type-router');
salesRewardTypeRouter.applyRoutes(server, "v1/sales/rewardtypes");

var salesPromoRouter = require('./src/routers/v1/sales/promo-router');
salesPromoRouter.applyRoutes(server, "v1/sales/docs/promos"); 

server.listen(process.env.PORT, process.env.IP);
console.log(`server created at ${process.env.IP}:${process.env.PORT}`)