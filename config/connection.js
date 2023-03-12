const mongoose = require('mongoose');    //mongoose package require
const {DB_HOST,DB_PORT,DB_NAME} =require('./bootstrap'); 

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex: true,
}, (err) => {
  if (err) {
    console.log('mongodb connection fail', err);
  } else {
    console.log("mongodb connection successfull");
  }

}); //connect mongodb


mongoose.connection.on('connect',()=>{
  console.log('mondb connection succes'); //mongodb connection emit
})
mongoose.connection.on('error',(err)=>{
  console.log('mongodb error',err);  //mongodb error emit
})
mongoose.connection.on('disconnected',()=>{
  console.log('mongodb disconnected...trying to reconnect...please wait...'); //mongodb disconnected retry connection
  mongoose.createConnection();
})