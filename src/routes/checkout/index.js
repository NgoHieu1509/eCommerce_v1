const CheckoutController = require('../../controllers/checkout.controller')
const { asyncHandler } = require('../../helpers/asyncHandle')

const checkoutRoute = require('express').Router()

checkoutRoute.post('/review',asyncHandler(CheckoutController.checkoutReview))

module.exports = checkoutRoute