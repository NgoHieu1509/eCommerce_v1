const express = require('express');
const ProductController =require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');
const productRouter = express.Router();
const {authentication } = require('../../utils/auth/authUtils')

//authentication//
productRouter.use(authentication)

////////////////
productRouter.post('/product',asyncHandler(ProductController.createProduct))





module.exports = {
    productRouter
}