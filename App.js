const express = require('express')
const cors = require('cors')


const usersRouter = require('./routes/UsersRoutes');

const app = express();


app.use(cors({
    origin: '*',
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders:['Content-Type','Authorization']
}))

app.use(express.json());
app.use('/users',usersRouter);

module.exports = app;