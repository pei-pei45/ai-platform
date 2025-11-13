require('dotenv').config(); 
const express =require('express')
const app = express()
const cors =require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// const userchat=require('./router/chat')
// app.use('/aiplatform',userchat)
const users=require('./router/users')
app.use('/aiplatform',users)
// const chathistory=require('./router/chat_history')
// app.use('/aiplatform',chathistory)


app.listen(3001, () => {
  console.log('Server is running on http://127.0.0.1:3001')
})