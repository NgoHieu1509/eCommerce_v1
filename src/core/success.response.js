const { StatusCodes, ReasonPhrases } = require("../utils/httpCode/httpStatusCode");


class SuccessResponse{
    constructor({message, statusCode= StatusCodes.OK,reasonCode=ReasonPhrases.OK,metadata= {}}){
        this.message = !message ? reasonCode: message
        this.statusCode = statusCode
        this.metadata = metadata
    }
    send(res, headers ={}){
        return res.status(this.statusCode) .json(this)
    }
}

class OKRequest extends SuccessResponse{
    constructor({message, metadata}){
        super({message,metadata})
    } 
}

class CreateRequest extends SuccessResponse{
    constructor({message, statusCode= StatusCodes.CREATED,reasonCode=ReasonPhrases.CREATED,metadata}){
        super({message, statusCode,metadata})
    } 
}

module.exports ={
    OKRequest,
    CreateRequest
}