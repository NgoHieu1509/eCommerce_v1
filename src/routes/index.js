const express = require('express');
const { accessRouter } = require('./access');
const { productRouter } = require('./product');
const rootRouter = express.Router();


rootRouter.use('/v1/api/product',productRouter)
rootRouter.use('/v1/api',accessRouter)

module.exports = {
    rootRouter
}