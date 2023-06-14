const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../../helpers/asyncHandle');
const { AuthFailureError, NotFound } = require('../../core/error.response');
const KeyTokenService = require('../../services/keyToken.service');
const keyTokenModel = require('../../models/keyToken.model');


const HEADER ={
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const createTokenPair = async (payload,publicKey,privateKey)=>{
    try {
        //accessToken
        const accessToken = await jwt.sign(payload, publicKey,{
            expiresIn:'2 days'
        })
        //refreshToken
        const refreshToken = await jwt.sign(payload, privateKey,{
            expiresIn:'7 days'
        })

       await jwt.verify(accessToken,publicKey,(err,decode)=>{
            if(err) {
                console.log(`ERROR:::`,err)
            }else{
                console.log(`Decode:::`,decode)
            }
        })
        return {accessToken, refreshToken}
    } catch (error) {
    }
}

const authentication = asyncHandler(async(req, res, next) =>{
    /*
        1- Check userId missing?
        2- get accessToken
        3- verify token
        4- Check user in dbs?
        5- Chech keyStore with this userId?
        6- OK all => return next()
    */ 
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    const keyStore = await KeyTokenService.findByUserId(userId)
    if(!keyStore) throw new NotFound('Not Found keyStore!')

    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken =req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = jwt.verify(refreshToken,keyStore.privateKey)
            if(userId !== decodeUser.userId ) throw new AuthFailureError('Invalid UserId')
            console.log(decodeUser)
            req.keyStore = keyStore
            req.user= decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    // const accessToken = req.headers[HEADER.AUTHORIZATION]
    // if(!accessToken) throw new AuthFailureError('Invalid Request')
    
    // try {
    //     const decodeUser = jwt.verify(accessToken,keyStore.publicKey)
    //     if(userId !== decodeUser.userId ) throw new AuthFailureError('Invalid UserId')
    //     console.log(decodeUser)
    //     req.keyStore = keyStore
    //     return next()
    // } catch (error) {
    //     throw error
    // }
})

const verifyTokenJWT = async(token,keySecret) =>{
    return await jwt.verify(token,keySecret)
}


module.exports = {
    createTokenPair,
    authentication,
    verifyTokenJWT
}