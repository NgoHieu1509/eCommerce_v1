const keyTokenModel = require("../models/keyToken.model");
const {Types: {ObjectId}} =require('mongoose')

class KeyTokenService{
    static createKeyToken = async ({userId ,publicKey,privateKey,refreshToken}) =>{
        try {
            // const filter= {user:userId}, update = {
            //     publicKey,privateKey,refreshTokenUsed:[],refreshToken
            // },options = {upsert:true, new:true}

            // const tokens= await keyTokenModel.findByIdAndUpdate(filter,update,options)
            const tokens = await keyTokenModel.create({
                user:userId,
                publicKey,
                privateKey,
                refreshToken
            })
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async(userId) =>{
        // vì tạo Schema là objectId
        return await keyTokenModel.findOne({user:new ObjectId(userId)})
    }

    static removeKeyById = async(id) =>{
        return await keyTokenModel.deleteOne(new ObjectId(id))
    }

    static findByRefreshTokenUsed =async(refreshToken) =>{
        return await keyTokenModel.findOne({refreshTokenUsed: refreshToken})
    }

    static findByRefreshToken =async(refreshToken) =>{
        return await keyTokenModel.findOne({ refreshToken})
    }

    static deleteKeyById = async(userId) =>{
        return await keyTokenModel.deleteOne({user: userId})
    }
}   
   

module.exports = KeyTokenService;