
/**
 * 1 - Generator Discount code [Shop|Admin]
 * 2 - Get discount code [user]
 * 3 - Get all discount codes [user|Shop]
 * 4 - Verify discount code [user]
 * 5 - Delete discount code [Shop|Admin]
 * 6 - Cancel discount code [user]
 */

const { BadRequestError, NotFound } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { product } = require("../models/product.model")
const { findAllDiscountCodesUnSelect, checkDiscountExists } = require("../models/respositories/discount.repo")
const { findAllProduct } = require("../models/respositories/product.repo")
const { convertToObjectIdMongoDB, updateNestedObjectParse, removeUndefineData } = require("../utils")

class DiscountService {
    static async createDiscountCode(payload){
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to,name,description,
            type,value, max_value, max_uses, uses_count,max_uses_per_user,user_used
        } = payload

        //Kiem tra
     
        if(new Date(start_date) >= new Date(end_date)){
            throw new BadRequestError('Start date must before end date')
        }

        const foundDisount = await checkDiscountExists({
            model: discountModel,
            filter:{
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId)
            }
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
            discount_users_used:user_used,
            discount_shopId:shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to:applies_to,
            discount_product_ids: applies_to === 'all'? [] :product_ids
        })

        return newDiscount
    }   

    static async updateDiscount(discount_shopId){
        const foundDisount = await checkDiscountExists({
            model: discountModel,
            filter:{
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId)
            }
        })
        if(!foundDisount && !foundDisount.discount_is_active){
            throw new BadRequestError('Discount not exists')
        }
        const objectParams = removeUndefineData(this)
        if(objectParams.discount_code){
            await discountModel.findByIdAndUpdate(discount_shopId,payload,{new: true})
        }
        return updatedDiscount   

    }

    static async getAllDiscountCodesWithProduct({code,shopId, userId, limit, page}){
        const foundDisount = await checkDiscountExists({
            model: discountModel,
            filter:{
                discount_code: code,
                discount_shopId: convertToObjectIdMongoDB(shopId)
            }
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
        const discounts = await findAllDiscountCodesSelect({
            limit: +limit,
            page: +page,
            filter:{
                discount_shopId: convertToObjectIdMongoDB(shopId),
                discount_is_active: true
            },
            select: ['discount_code','discount_name'],
            model: discountModel
        })
        return discounts
    }

    static async getDiscountAmount({codeId,userId,shopId,products}){
        const foundDisount = await checkDiscountExists({
            model: discountModel,
            filter:{
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongoDB(shopId)
            }
        })
        if(!foundDisount) throw new BadRequestError('Discount not exists')
        
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_type,
            discount_value,
            discount_users_used
        } =foundDisount

        if(!discount_is_active) throw new NotFound('Discount expired')
        if(!discount_max_uses) throw new NotFound('Discount are out')

        //check gia tri toi thieu
        let totalOrder = 0
        if(discount_min_order_value > 0){
            //get total
            totalOrder = products.reduce((acc,product) =>{
                return acc + (product.quantity * product.price)
            },0)

            if(totalOrder <discount_min_order_value) throw new NotFound(`Discount requires a minium order value of ${discount_min_order_value}`)
        }

        if(discount_max_uses_per_user >0){
            const userUseDiscount = discount_users_used.find( user => user.userId)
            if(userUseDiscount) throw new NotFound('The user has used the discount ')
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder *(discount_value /100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    } 

    static async deleteDiscount({shopId,codeId}){
        const deleted = await discountModel.findByIdAndDelete({
            discount_code: codeId,
            discount_shopId: shopId,
        })
        return deleted
    }

    //user cancel discount
    static async cancelDiscountCode({codeId,shopId,userId}){
        const foundDisount = await checkDiscountExists({
            model: discountModel,
            filter:{
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongoDB(shopId)
            }
        })
        if(!foundDisount) throw new BadRequestError('Discount not exists')

        const result = await discountModel.findByIdAndUpdate(foundDisount._id,{
            $pull:{
                discount_users_used: userId
            },
            $inc:{
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }

}

module.exports = DiscountService