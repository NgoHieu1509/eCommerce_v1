const { CreateRequest } = require("../core/success.response")
const ProductService = require("../services/product.service")


class ProductController {
    static createProduct = async (req, res) => {
        new CreateRequest({
            message:'Create Product success',
            metadata: await ProductService.createProduct(req.body.product_type,{
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = ProductController