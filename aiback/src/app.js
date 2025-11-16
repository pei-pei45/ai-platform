require('dotenv').config(); 
const path = require('path');
const express =require('express')
const app = express()
const cors =require('cors')

// 添加请求日志中间件（放在最前面，确保所有请求都被记录）
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.path}`);
    console.log('请求头:', JSON.stringify(req.headers, null, 2));
    next();
});

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