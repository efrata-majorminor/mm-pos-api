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

        var shiftTemp;
        if (shift == 0) {
            shiftTemp = "Semua";
        } else {
            shiftTemp = shift;
        }

        var storeName = "";
        for (var store of request.user.stores) {
            if (store._id == storeid) {
                storeName = store.name;
                break;
            }
        }



        manager.readAll(query)
            .then(docs => {
                var data = [];
                var totalCashAmount = 0;
                var totalCardAmount = 0;
                var totalVoucher = 0;
                var sumTotalOmsetBruto = 0;
                var sumTotalDiskonPenjual = 0;
                var totalOmsetPenjual = 0;
                var sumTotalMargin = 0;
                var sumTotalOmsetNetto = 0;
                var dateFormat = "DD MMM YYYY";
                var locale = 'id-ID';
                var moment = require('moment');
                moment.locale(locale);

                for (var salesPerDay of docs.data) {
                    var totalMargin = 0;
                    var totalOmsetBruto = 0;
                    var totalOmsetNetto = 0;
                    var result = {};
                    result["Toko"] = storeName;
                    result["Shift"] = shiftTemp;
                    result["Tanggal"] = moment(salesPerDay.date).format(dateFormat);
                    result["No Pembayaran"] = salesPerDay.code;
                    result["Tipe Pembayaran"] = salesPerDay.salesDetail.paymentType;
                    result["Kartu"] = salesPerDay.salesDetail.card ? salesPerDay.salesDetail.card : "";
                    result["Jenis Kartu"] = salesPerDay.salesDetail.cardType.name ? salesPerDay.salesDetail.cardType.name : "";
                    result["Bank (EDC)"] = salesPerDay.salesDetail.bank.name ? salesPerDay.salesDetail.bank.name : "";
                    result["Bank (Kartu)"] = salesPerDay.salesDetail.bankCard.name ? salesPerDay.salesDetail.bankCard.name : "";
                    for (var item of salesPerDay.items) {
                        var detail = {};
                        detail.harga = item.price;
                        detail.quantity = parseInt(item.quantity);
                        detail.omsetBrutto = parseInt(detail.harga) * parseInt(detail.quantity);
                        totalOmsetBruto += parseInt(detail.omsetBrutto);
                        detail.discount1Percentage = item.discount1;
                        detail.discount1Nominal = parseInt(detail.omsetBrutto) * parseInt(detail.discount1Percentage) / 100;
                        detail.discount1Netto = parseInt(detail.omsetBrutto) - parseInt(detail.discount1Nominal);
                        detail.discount2Percentage = item.discount2;
                        detail.discount2Nominal = parseInt(detail.discount1Netto) * parseInt(detail.discount2Percentage) / 100;
                        detail.discount2Netto = parseInt(detail.discount1Netto) - parseInt(detail.discount2Nominal);
                        detail.discountNominal = item.discountNominal;
                        detail.discountNominalNetto = parseInt(detail.discount2Netto) - parseInt(detail.discountNominal);
                        detail.discountSpecialPercentage = item.specialDiscount;
                        detail.discountSpecialNominal = parseInt(detail.discountNominalNetto) * parseInt(detail.discountSpecialPercentage) / 100;
                        detail.discountSpecialNetto = parseInt(detail.discountNominalNetto) - parseInt(detail.discountSpecialNominal);
                        detail.discountMarginPercentage = item.margin;
                        detail.discountMarginNominal = parseInt(detail.discountSpecialNetto) * parseInt(detail.discountMarginPercentage) / 100;
                        detail.discountMarginNetto = parseInt(detail.discountSpecialNetto) - parseInt(detail.discountMarginNominal);
                        detail.total = parseInt(detail.discountMarginNetto);
                        totalMargin += parseInt(detail.discountMarginNominal);
                        totalOmsetNetto += parseInt(detail.discountMarginNetto);
                    }
                    totalOmsetPenjual = parseInt(salesPerDay.subTotal) * parseInt(salesPerDay.discount) / 100;
                    result["Cash Amount"] = parseInt(salesPerDay.salesDetail.cashAmount);
                    result["Card Amount"] = parseInt(salesPerDay.salesDetail.cardAmount);
                    result["Voucher"] = parseInt(salesPerDay.salesDetail.voucher.value);
                    result["Total Omset Bruto"] = totalOmsetBruto;
                    result["Total Diskon Penjualan"] = totalOmsetPenjual;
                    result["Total Margin"] = totalMargin;
                    result["Total Omset Netto"] = totalOmsetNetto;
                    totalCashAmount += parseInt(result["Cash Amount"]);
                    totalCardAmount += parseInt(result["Card Amount"]);
                    totalVoucher += parseInt(result["Voucher"]);
                    sumTotalOmsetBruto += parseInt(result["Total Omset Bruto"]);
                    sumTotalDiskonPenjual += parseInt(result["Total Diskon Penjualan"]);
                    sumTotalMargin += parseInt(result["Total Margin"]);
                    sumTotalOmsetNetto += parseInt(result["Total Omset Netto"]);
                    data.push(result);
                }

                if (data.length > 0) {
                    for (var i = 0; i < 3; i++) {
                        var halfResult = {};
                        if (i == 0 || i == 1) {
                            halfResult["Toko"] = "";
                            halfResult["Shift"] = "";
                            halfResult["Tanggal"] = "";
                            halfResult["No Pembayaran"] = "";
                            halfResult["Tipe Pembayaran"] = "";
                            halfResult["Kartu"] = "";
                            halfResult["Jenis Kartu"] = "";
                            halfResult["Bank (EDC)"] = "";
                            halfResult["Bank (Kartu)"] = "";
                            halfResult["Cash Amount"] = "";
                            halfResult["Card Amount"] = "";
                            halfResult["Voucher"] = "";
                            halfResult["Total Omset Bruto"] = "";
                            halfResult["Total Diskon Penjualan"] = "";
                            halfResult["Total Margin"] = "";
                            halfResult["Total Omset Netto"] = "";
                        } else {
                            halfResult["Toko"] = "";
                            halfResult["Shift"] = "";
                            halfResult["Tanggal"] = "";
                            halfResult["No Pembayaran"] = "";
                            halfResult["Tipe Pembayaran"] = "";
                            halfResult["Kartu"] = "";
                            halfResult["Jenis Kartu"] = "";
                            halfResult["Bank (EDC)"] = "";
                            halfResult["Bank (Kartu)"] = "";
                            halfResult["Cash Amount"] = totalCashAmount;
                            halfResult["Card Amount"] = totalCardAmount;
                            halfResult["Voucher"] = totalVoucher;
                            halfResult["Total Omset Bruto"] = sumTotalOmsetBruto;
                            halfResult["Total Diskon Penjualan"] = sumTotalDiskonPenjual;
                            halfResult["Total Margin"] = sumTotalMargin;
                            halfResult["Total Omset Netto"] = sumTotalOmsetNetto;
                        }
                        data.push(halfResult);
                    }
                }

                if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
                    var result = resultFormatter.ok(apiVersion, 200, data);
                    response.send(200, result);
                } else {
                    var options = {
                        "Toko": "string",
                        "Shift": "string",
                        "Tanggal": "string",
                        "No Pembayaran": "string",
                        "Tipe Pembayaran": "string",
                        "Kartu": "string",
                        "Jenis Kartu": "string",
                        "Bank (EDC)": "string",
                        "Bank (Kartu)": "string",
                        "Cash Amount": "number",
                        "Card Amount": "number",
                        "Voucher": "number",
                        "Total Omset Bruto": "number",
                        "Total Diskon Penjualan": "number",
                        "Total Margin": "number",
                        "Total Omset Netto": "number"
                    };
                    response.xls(`Laporan Penjualan - Accounting - ${moment(new Date()).format(dateFormat)}.xlsx`, data, options);

                }
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })
    })
});

module.exports = router;
