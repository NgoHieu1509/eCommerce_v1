const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyTokenJWT } = require("../utils/auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const {findByEmail} = require('./shop.service')
const keyTokenModel = require("../models/keyToken.model")
const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static signUp = async ({name,email,password})=>{          
            //check email exists
            const holderShop  = await shopModel.findOne({email}).lean()
            if(holderShop){
                throw new BadRequestError('Error: shop already')
            }
            const passwordHash = await  bcrypt.hash(password,10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash,roles: [roleShop.SHOP]
            })
            if (newShop){
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
               //create token pair
               const tokens= await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log(`Create token success::`, tokens)
                return {
                    code:'201',
                    metadata:{
                        shop: getInfoData({fileds:['_id','name','email'], object: newShop}),
                        tokens
                    }
                }
            }
            const keyStores= await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            })
            if (!keyStores){
                 throw new BadRequestError()
                
            }
            return {
                code:'200',
                metadata: null,
            }
    }


    static login = async ({email, password}) => {
        /*
            1- check email in dbs
            2- match password
            3- create AT and RT anh save
            4- generate tokens
            5- get data return login
        */

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Shop not registered')

        const match = bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Wrong password')

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const {_id: userId} = foundShop
        const tokens= await createTokenPair({userId, email}, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
                userId,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
        })
        return {
            metadata:{
                shop: getInfoData({fileds:['_id','name','email'], object: foundShop}),
                tokens
            }
        }
    }

    static logout = async(keyStores) =>{
        const delKey =await KeyTokenService.removeKeyById(keyStores._id)
        console.log({delKey})
        return delKey

    }

    static handlerRefreshToken = async({refreshToken,user,keyStore}) =>{
        const {userId, email} = user

        if(keyStore.refreshTokenUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened!! Relogin')
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registered')

        const tokens= await createTokenPair({userId,email}, keyStore.publicKey, keyStore.privateKey)
        //update token
        await keyTokenModel.updateOne(
            {
              $set: {
                refreshToken: tokens.refreshToken
              },
              $addToSet: {
                refreshTokenUsed: refreshToken
              }
            }
          );
          

        return {
            user,
            tokens
        }     
    }
    
}

module.exports = AccessService