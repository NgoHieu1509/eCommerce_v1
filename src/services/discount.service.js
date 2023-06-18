
/**
 * 1 - Generator Discount code [Shop|Admin]
 * 2 - Get discount code [user]
 * 3 - Get all discount codes [user|Shop]
 * 4 - Verify discount code [user]
 * 5 - Delete discount code [Shop|Admin]
 * 6 - Cancel discount code [user]
 */

const { BadRequestError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllDiscountCodesUnSelect } = require("../models/respositories/discount.repo")
const { findAllProduct } = require("../models/respositories/product.repo")
const { convertToObjectIdMongoDB } = require("../utils")

class DiscountService {
    static async createDiscountCode(payload){
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to,name,description,
            type,value, max_value, max_uses, uses_count,max_uses_per_user,user_userd
        } = payload

        //Kiem tra
        if(new Date() < Date(start_date) ||new Date() > new Date(end_date)){
            throw new BadRequestError('Discount code has expried')
        }
        if(new Date(start_date) >= new Date(end_date)){
            throw new BadRequestError('Start date must before end date')
        }

        const foundDisount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoDB(shopId)
        })
        if(foundDisount && foundDisount.discount_is_active){
            throw new BadRequestError('Discount exists')
        }
        
        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type:type,
            discount_code:code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses:max_uses,
            discount_uses_count:uses_count,
            discount_users_used:user_userd,
            discount_shopId:shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to:applies_to,
            discount_product_ids: applies_to === 'all'? [] :product_ids
        })

        return newDiscount
    }   

    static async updateDiscount(){

    }

    static async getAllDiscountCodesWithProduct({code,shopId, userId, limit, page}){
        const foundDisount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoDB(shopId)
        })
        if(!foundDisount && !foundDisount.discount_is_active){
            throw new BadRequestError('Discount not exists')
        }

        const {discount_applies_to,discount_product_ids} =foundDisount
        let products
        if(discount_applies_to === 'all'){
            //get all products
            products = await findAllProduct({
                limit: +limit,
                sort:'ctime',
                page: +page,
                filter:{
                    product_shop: convertToObjectIdMongoDB(shopId),
                    isPublished: true
                },
                select: ['product_name']
            })
        }
        if(discount_applies_to === 'specific'){
            //get the product ids
            products = await findAllProduct({
                limit: +limit,
                sort:'ctime',
                page: +page,
                filter:{
                    _id:{$in: discount_product_ids},
                    isPublished: true
                },
                select: ['product_name']
            })
        }

    }

    static async getAllDiscountCodesByShop({limit,page,shopId}){
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter:{
                discount_shopId: convertToObjectIdMongoDB(shopId),
                discount_is_active: true
            },
            unSelect: ['__v','discount_shopId'],
            model: discountModel
        })
        return discounts
    }
}

module.exports = DiscountService