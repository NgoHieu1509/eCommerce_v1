const { CreateRequest, OKRequest } = require("../core/success.response")
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

        //QUERY SET
        getAllDraftsForShop = async (req, res) => {
            new OKRequest({
                message:'Get list success',
                metadata: await ProductService.findAllDraftsForShop({
                    product_shop: req.user.userId
                })
            }).send(res)
    }
        //END QUERY
}
}
module.exports = ProductController