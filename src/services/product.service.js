const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic, furniture } = require("../models/product.model");
const { findAllDraftsForShop, findAllPublishForShop, publishProductByShop, unPublishProductByShop } = require("../models/respositories/product.repo");


class ProductService{
    static async createProduct(type ,payload){
        switch (type){
            case 'Electronics': 
                return new Electronics(payload).createProduct()
            case 'Clothing': 
                return new Clothing(payload).createProduct()
            case 'Furniture': 
                return new Furnitures(payload).createProduct()
            default: 
                throw new BadRequestError(`Invalid type:::${type}`);
        }          
    }


    static async publishProductByShop({product_shop,product_id}){
        return await publishProductByShop({product_shop,product_id})
   }

    static async unPublishProductByShop({product_shop,product_id}){
        return await unPublishProductByShop({product_shop,product_id})
   }


    static async findAllDraftsForShop({product_shop, limit=50,skip=0}){
        const query = {product_shop, isDrafts: true}
        return await findAllDraftsForShop({query,limit,skip})
    }

    static async findAllPublishForShop({product_shop, limit=50,skip=0}){
        const query = {product_shop, isPublished: true}
        return await findAllPublishForShop({query,limit,skip})
    }
}

//define base product class
class Product{
    constructor({
        product_name,product_thumb,product_description,product_price,
        product_quantity,product_type,product_shop,product_attributes
    }){
            this.product_name = product_name;
            this.product_thumb = product_thumb;
            this.product_description = product_description;
            this.product_price = product_price;
            this.product_quantity = product_quantity;
            this.product_type = product_type
            this.product_shop = product_shop
            this.product_attributes = product_attributes
        }

        async createProduct(product_id){
            return await product.create({...this,_id: product_id})
        }
}

//define clothing class
class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create({...this.product_attributes, product_shop:this.product_shop})
        if(!newClothing) throw new BadRequestError(`create clothing product error`)

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError(`create new product error`)

        return newProduct
    }
}

//define electronics class
class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError(`create Electronic product error`)

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError(`create new product error`)

        return newProduct
    }
}

class Furnitures extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestError(`create Furnitures product error`)

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError(`create new product error`)

        return newProduct
    }
}


module.exports = ProductService