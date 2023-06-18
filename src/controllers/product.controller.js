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

    static updateProduct = async (req, res) => {
        new OKRequest({
            message:' updateProduct success',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.product_id,{
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static publishProductByShop = async (req, res) => {
        new CreateRequest({
            message:'publishProduct success',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static unPublishProductByShop = async (req, res) => {
        new CreateRequest({
            message:'unPublishProduct success',
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

    static getListSearchProduct = async (req, res) => {
        new OKRequest({
            message:'Get getListSearchProduct success',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res)
    }

    static findAllProduct =  async (req, res) => {
        new OKRequest({
            message:' findAllProduct success',
            metadata: await ProductService.findAllProduct(req.query)
        }).send(res)
    }

    static findProduct =  async (req, res) => {
        new OKRequest({
            message:' findProduct success',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
    //END QUERY
}
module.exports = ProductController