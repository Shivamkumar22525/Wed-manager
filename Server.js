const mongoose = require('mongoose')

const app = require('./App.js')


const url = "mongodb://localhost:27017"

mongoose.connect(url)
.then(()=>{
    console.log("DataBase COnnected")
}).catch((err)=>console.log(err))

app.listen(3000,()=>console.log("App Started"));