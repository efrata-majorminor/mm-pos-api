var restify = require('restify');
restify.CORS.ALLOW_HEADERS.push('authorization');

var passport = require('passport');
var server = restify.createServer();
var json2xls = require('json2xls');
server.use(json2xls.middleware);

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS({ headers: ["location", "id", "Content-Disposition"] }));

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

var salesRouter = require('./src/routers/v1/sales/sales-router');
salesRouter.applyRoutes(server, "v1/sales/docs/sales");

var salesReturnRouter = require('./src/routers/v1/sales/sales-return-router');
salesReturnRouter.applyRoutes(server, "v1/sales/docs/salesreturns");

var salesVoidRouter = require('./src/routers/v1/sales/sales-void-router');
salesVoidRouter.applyRoutes(server, "v1/sales/docs/salesvoids");

var salesPromoRouter = require('./src/routers/v1/sales/promo-router');
salesPromoRouter.applyRoutes(server, "v1/sales/promos");

var storeSalesRouter = require('./src/routers/v1/store/sales/sales-router');
storeSalesRouter.applyRoutes(server, "v1/store/:storeid/sales/docs/sales");

var storeSalesReturnRouter = require('./src/routers/v1/store/sales/sales-return-router');
storeSalesReturnRouter.applyRoutes(server, "v1/store/:storeid/sales/docs/salesreturns");

var storeSalesVoidRouter = require('./src/routers/v1/store/sales/sales-void-router');
storeSalesVoidRouter.applyRoutes(server, "v1/store/:storeid/sales/docs/salesvoids");

var reportSales = require('./src/routers/v1/sales/report-sales-router');
reportSales.applyRoutes(server, "v1/sales/docs/sales/reports/daily");

var reportSalesPayment = require('./src/routers/v1/sales/report-sales-payment-router');
reportSalesPayment.applyRoutes(server, "v1/sales/docs/sales/reports/:storeid/:datefrom/:dateto/:shift");

server.listen(process.env.PORT, process.env.IP);
console.log(`server created at ${process.env.IP}:${process.env.PORT}`)