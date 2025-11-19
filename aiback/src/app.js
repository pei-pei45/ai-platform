require('dotenv').config(); 
const path = require('path');
const express =require('express')
const app = express()
const cors =require('cors')
const axios =require('axios')
const OpenAI=require ('openai')

//跨域处理
app.use(cors({origin:' http://localhost:5173'}))
app.use(express.json());


// 添加请求日志中间件
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.path}`);
    console.log('请求头:', JSON.stringify(req.headers, null, 2));
    next();
});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//chat 侧边栏历史记录 id user_id chat_name created_at updated_at
const userchat=require('./router/chat')
app.use('/aiplatform',userchat)


const users=require('./router/users')
app.use('/aiplatform',users)

//chat history 历史记录 对应id session——id role content
// const chathistory=require('./router/chat_history')
// app.use('/aiplatform',chathistory)

const openai =new OpenAI({
   baseURL: 'https://api.deepseek.com',
    apiKey:process.env.DEEPSEEK_API_KEY,
});

app.post('/aiplatform/chat',async(req,res)=>{
  try{
    const {message} = req.body;
    if(!message || typeof message !== 'string' || message.trim().length===0){
      return res.status(400).json({error:'message不能为空'})
    }

    //调用deep seek
    const  completion = await openai.chat.completions.create({
      model:'deepseek-chat',
      messages:[
       { role:'user',
        content:message.trim()
       }

      ],
      temperature:0.7,
      max_tokens: 2000,
    })

  const airesponse=completion.choices[0]?.message?.content ||'sorry';

  res.json({
    success:true,
    content:airesponse
  })
  } catch (error){
    console.log('error',error.message)
    res.status(500).json({error:'AI服务暂时不可用',details:error.message})
  }
})

app.listen(3001, () => {
  console.log('Server is running on http://127.0.0.1:3001')
})