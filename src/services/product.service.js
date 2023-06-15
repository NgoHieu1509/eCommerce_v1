const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");


class ProductService{
    static async createProduct(type ,payload){
        switch (type){
            case 'Electronics': 
                return new Electronics(payload).createProduct()
            case 'Clothing': 
                return new Clothing(payload).createProduct()
            default: 
                throw new BadRequestError(`Invalid type:::${type}`);
        }          
    }
}

//define base product class
class Product{
    constructor({
        product_name,product_thumb,product_description,product_price,
        product_quanity,product_type,product_shop,product_attributes
    }){
            this.product_name = product_name;
            this.product_thumb = product_thumb;
            this.product_description = product_description;
            this.product_price = product_price;
            this.product_quanity = product_quanity;
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
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError(`create clothing product error`)

        const newProduct = await super.createProduct()
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



module.exports = ProductService