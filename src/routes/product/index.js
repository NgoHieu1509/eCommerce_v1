const express = require('express');
const ProductController =require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');
const productRouter = express.Router();
const {authentication } = require('../../utils/auth/authUtils')

productRouter.get('/search/:keySearch',asyncHandler(ProductController.getListSearchProduct))
productRouter.get('/',asyncHandler(ProductController.findAllProduct))
productRouter.get('/:product_id',asyncHandler(ProductController.findProduct))



//authentication//
productRouter.use(authentication)

//////////////////
productRouter.patch('/:product_id',asyncHandler(ProductController.updateProduct))
productRouter.post('/',asyncHandler(ProductController.createProduct))
productRouter.post('/published/:id',asyncHandler(ProductController.publishProductByShop))
productRouter.post('/unpublished/:id',asyncHandler(ProductController.unPublishProductByShop))

//Query
productRouter.get('/drafts/all',asyncHandler(ProductController.getAllDraftsForShop))
productRouter.get('/published/all',asyncHandler(ProductController.getAllPublishsForShop))




module.exports = {
    productRouter
}