const express=require('express')
const router=express.Router()
const pool=require('../db/index')
const authmiddleware=require('../middleware/auth')
const axios=require('axios')
//创建新对话
router.post('/conversation',async(req,res)=>{
    try {
        const{title} =req.body;
        const userId =req.user.user_id
        const result =await pool.query('insert into chat (chat_name,user_id) values ($1,$2) returning *',[title,userId]);
        res.status(201).json({conversation:result.rows[0]})

    } catch(error){
        res.status(500).json({message:error.message})
    }
})
//获取对话
router.get('/conversations',async(req,res)=>{
    try {
        const userId =req.user.userId;
    }catch(error){
        res.status(500).json({message:error.message})
    }
})
module.exports=router;