var restify = require('restify');

var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser()); 
server.use(restify.CORS());

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