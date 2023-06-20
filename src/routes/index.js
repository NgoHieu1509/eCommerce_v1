const express = require('express');
const { accessRouter } = require('./access');
const { productRouter } = require('./product');
const discountRouter = require('./discount');
const cartRouter = require('./cart');
const rootRouter = express.Router();

rootRouter.use('/v1/api/cart',cartRouter)
rootRouter.use('/v1/api/discount',discountRouter)
rootRouter.use('/v1/api/product',productRouter)
rootRouter.use('/v1/api',accessRouter)

module.exports = {
    rootRouter
}