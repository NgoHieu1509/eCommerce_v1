
const {product,electronic,clothing,furniture} = require('../../models/product.model')
const {Types} = require('mongoose')
const { getSelectData, unSelectData } = require('../../utils')

const queryProduct =async ({query,limit,skip}) =>{
    return await product.find(query).
    populate('product_shop','name email')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}


const findAllDraftsForShop = async({query,limit,skip}) =>{
    return await queryProduct({query,limit,skip})
}

const findAllPublishForShop = async({query,limit,skip}) =>{
    return await queryProduct({query,limit,skip})
}

const searchProductByUser = async({keySearch}) =>{
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublished:true,
        $text: { $search: regexSearch }
        },{score: {$meta:'textScore'} } )
        .sort({score: {$meta:'textScore'} })
        .lean()

        return results
}

const findAllProduct = async({limit, sort , page,filter,select}) =>{
    const skip = (page -1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id :1}
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select)) //cu phap cua select la Object
    .lean()

    return products
}

const findProduct = async({product_id,unSelect}) =>{
        return await product.findById(product_id).select(unSelectData(unSelect))
}

const updateProductById = async({product_id,payload,model,isNew=true})=>{
    return await model.findByIdAndUpdate(product_id,payload,{new: isNew})
}
const publishProductByShop = async({product_shop, product_id}) =>{
    const foundShop =  await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) return null

    foundShop.isDrafts = false
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const unPublishProductByShop = async({product_shop, product_id}) =>{
    const foundShop =  await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) return null

    foundShop.isDrafts = true
    foundShop.isPublished = false
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}



module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct,
    updateProductById
}