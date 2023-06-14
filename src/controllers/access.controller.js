const { CreateRequest, OKRequest } = require("../core/success.response")
const AccessService = require("../services/access.service")


class AccessController {
   static signUp = async(req,res) =>{    
            new CreateRequest({
                message:'Registered OK',
                metadata: await AccessService.signUp(req.body)
            }).send(res);
        
    }

    static login = async(req,res) =>{    
        new OKRequest({
            metadata: await AccessService.login(req.body)
        }).send(res);  
}

    static logout = async(req,res) =>{    
        new OKRequest({
            message:'Logout success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);  
    }

    static handlerRefreshToken = async(req,res) =>{
        new OKRequest({
            message:"Get token success",
            metadata :await AccessService.handlerRefreshToken({
               refreshToken: req.refreshToken,
               user: req.user,
               keyStore: req.keyStore
            })
        }).send(res); 
    }
}

module.exports =  AccessController