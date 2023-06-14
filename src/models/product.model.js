const {model,Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

let productSchema = new Schema({
    product_name: {type: String, require:true},
    product_thumb: {type:String, require:true},
    product_description: {type: String},
    product_price: { type:Number, require:true},
    product_quanity: {type: Number,  require:true},
    product_type: {type:String, require:true, enum:['Electronics','Clothing','Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref:'Shop'},
    product_attributes: {type: Schema.Types.Mixed,require:true}
},{
    collection: COLLECTION_NAME,
    timestamps:true
})

//define the product type = clothing
const clothingSchema = new Schema({
    brand: {type: String, require:true},
    size: String,
    material: String
},{
    collection: 'Clothes',
    timestamps:true
})

//define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: {type: String, require:true},
    model : String,
    color: String
},{
    collection: 'Electronics',
    timestamps:true
})



module.exports ={
    product:  model(DOCUMENT_NAME,productSchema),
    clothing: model('Clothing',clothingSchema),
    electronic: model('Electronics',electronicSchema)
}