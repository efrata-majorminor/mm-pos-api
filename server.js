var restify = require('restify');

var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser()); 
server.use(restify.CORS({headers:["location", "id"]}));

var masterStoreRouter = require('./src/routers/v1/master/store-router');
masterStoreRouter.applyRoutes(server, "v1/master/stores");

var masterBankRouter = require('./src/routers/v1/master/bank-router');
masterBankRouter.applyRoutes(server, "v1/master/banks");

var masterCardTypeRouter = require('./src/routers/v1/master/card-type-router');
masterCardTypeRouter.applyRoutes(server, "v1/master/cardtypes/"); 

var masterItemRouter = require('./src/routers/v1/master/item-router');
masterItemRouter.applyRoutes(server, "v1/master/items/"); 

var masterFinishedGoodsRouter = require('./src/routers/v1/master/finished-goods-router');
masterFinishedGoodsRouter.applyRoutes(server, "v1/master/finishedgoods/"); 

var salesModuleRouter = require('./src/routers/v1/sales/sales-module-router');
salesModuleRouter.applyRoutes(server, "v1/sales/docs/sales");  

var salesReturnModuleRouter = require('./src/routers/v1/sales/sales-return-router');
salesReturnModuleRouter.applyRoutes(server, "v1/sales/docs/salesreturns");  

var salesPromoRouter = require('./src/routers/v1/sales/promo-router');
salesPromoRouter.applyRoutes(server, "v1/sales/promos"); 

server.listen(process.env.PORT, process.env.IP);
console.log(`server created at ${process.env.IP}:${process.env.PORT}`)