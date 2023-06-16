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
    }


    static publishProductByShop = async (req, res) => {
        new CreateRequest({
            message:'Create Product success',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static unPublishProductByShop = async (req, res) => {
        new CreateRequest({
            message:'Create Product success',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
       //QUERY 
       /**
        * @desc 
        * @param {Number} limit 
        * @param {Number} skip 
        * @return {JSON}
        */
    static getAllDraftsForShop = async (req, res) => {
        new OKRequest({
            message:'Get list draft success',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static getAllPublishsForShop = async (req, res) => {
        new OKRequest({
            message:'Get list publish success',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    //END QUERY
}
module.exports = ProductController