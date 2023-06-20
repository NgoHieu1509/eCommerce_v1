const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandle');
const discountRouter = express.Router();
const {authentication } = require('../../utils/auth/authUtils');
const DiscountController = require('../../controllers/discount.controller');

discountRouter.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
discountRouter.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProducts))

discountRouter.use(authentication)

discountRouter.post('/',asyncHandler(DiscountController.createDiscountCode))
discountRouter.get('/', asyncHandler(DiscountController.getAllDiscountCodesByShop))


module.exports = discountRouter;