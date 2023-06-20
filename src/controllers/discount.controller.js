const { CreateRequest, OKRequest } = require("../core/success.response")
const DiscountService = require("../services/discount.service")


class DiscountController {
    static createDiscountCode = async (req, res) => {
        new CreateRequest({
            message:'Create discount code success',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    static getAllDiscountCodesByShop = async (req, res) => {
        new OKRequest({
            message:'Get discount code success',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    static getAllDiscountCodesWithProducts = async (req, res) => {
        new OKRequest({
            message:'Get discount code success',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }

    static getDiscountAmount = async (req, res) => {
        new OKRequest({
            message:'Get discount amount success',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
}

module.exports = DiscountController


// {
//     "name": "name fixed amount",
//     "description": "description",
//     "type": "percentage",
//     "value": 3000,
//     "max_value":3000,
//     "code":"SHOP-1222",
//     "start_date": "2023-04-15 09:00:00",
//     "end_date":"2023-04-20 09:00:00",
//     "max_uses": 100,
//     "uses_count":0,
//     "user_used":[],
//     "max_uses_per_user":1,
//     "min_order_value": 200000,
//     "created_by":{},
//     "is_active":true,
//     "applies_to":"specific",
//     "product_ids":["648ab40300cea153177c19f2","648ac3d3da3d5f292d95bfc7"]
// }