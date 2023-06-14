const mongoose = require('mongoose');
const { db:{ host, port, name }} = require('../configs/mongodb.config')
const connectString= `mongodb://${host}:${port}/${name}`

console.log('Connect string:', connectString)

class Database {
    constructor(){
        this.connect()
    }
    //connect
    connect(type = 'mongodb'){
        if(1 ===1 ){
            mongoose.set('debug', true);
            mongoose.set('debug',{color:true});
        }

        mongoose.connect(connectString)
        .then(_ => console.log(`Connected MongoDB Successfully`))
        .catch(err => console.log(`Error Connect MongoDB ${err}`))
    }

    //singleton
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance()

module.exports = {
    instanceMongoDB
}