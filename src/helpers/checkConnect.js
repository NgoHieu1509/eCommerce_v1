const mongoose = require('mongoose');
const process= require('process');
const _SECONDS =5000


//count connection
const countConnect =() =>{
    const numConnection = mongoose.connection.length
    console.log(`Number of connections: ${numConnection}`)
}

//check overload
// const checkOverload = () =>{
//     setInterval(()=>{
//         const numConnection = mongoose.connection.length
//         const numCores = os.cpus().length
//         const memoryUsage =process.memoryUsage()
//     },_SECONDS);// Monitor every 5 seconds
// }

module.exports ={
    countConnect
}