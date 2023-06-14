const express = require('express');
const AccessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandle');
const accessRouter = express.Router();
const {authentication } = require('../../utils/auth/authUtils')

////////////////
accessRouter.post('/shop/signup',asyncHandler(AccessController.signUp))
accessRouter.post('/shop/login',asyncHandler(AccessController.login))

//authentication//
accessRouter.use(authentication)

////////////////
accessRouter.post('/shop/logout',asyncHandler(AccessController.logout))
accessRouter.post('/shop/handlerrefreshtoken',asyncHandler(AccessController.handlerRefreshToken))





module.exports = {
    accessRouter
}