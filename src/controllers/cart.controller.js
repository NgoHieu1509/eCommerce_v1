const { OKRequest } = require("../core/success.response")
const CartService = require("../services/cart.service")


class CartController{
    addToCart = async (req, res) => {
        new OKRequest({
            message:'Add to cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateToCart = async (req, res) => {
        new OKRequest({
            message:'Update cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res) => {
        new OKRequest({
            message:'Delete success',
            metadata: await CartService.deleteUserCartItem(req.body)
        }).send(res)
    }

    listToCart = async (req, res) => {
        new OKRequest({
            message:'Get list cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()