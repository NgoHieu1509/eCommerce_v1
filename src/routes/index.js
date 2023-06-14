const express = require('express');
const { accessRouter } = require('./access');
const { productRouter } = require('./product');
const rootRouter = express.Router();



rootRouter.use('/v1/api',accessRouter)
rootRouter.use('/v1/api',productRouter)

module.exports = {
    rootRouter
}