const express = require('express');
const ProductController =require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');
const productRouter = express.Router();
const {authentication } = require('../../utils/auth/authUtils')

//authentication//
productRouter.use(authentication)

//////////////////
productRouter.post('/',asyncHandler(ProductController.createProduct))
productRouter.post('/published/:id',asyncHandler(ProductController.publishProductByShop))
productRouter.post('/unpublished/:id',asyncHandler(ProductController.unPublishProductByShop))


//Query
productRouter.get('/drafts/all',asyncHandler(ProductController.getAllDraftsForShop))
productRouter.get('/published/all',asyncHandler(ProductController.getAllPublishsForShop))




module.exports = {
    productRouter
}