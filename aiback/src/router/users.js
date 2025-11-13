const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/reguser',async (req,res)=>{
    try {
        const {username,password,email}=req.body;
        if(!username||!password||!email){
            return res.status(400).json({error:'此为必填项'});
        }
        const usercheck=await pool.query('SELECT * FROM users WHERE username=$1 OR email=$2',[username,email]);
        if(usercheck.rows.length>0){
            return res.status(400).json({error:'用户名或邮箱已被注册'});
        }
       const passwordHash=await bcrypt.hash(password,10);
       const result =await pool.query('INSERT INTO users (username,password,email) VALUES ($1,$2,$3) RETURNING *',[username,passwordHash,email]);
       res.status(201).json({message:'注册成功',user:result.rows[0]});

    } catch(error){
        console.error(error.message);
        res.status(500).json({error:error.message});
    }
})

router.post('/login',async (req,res)=>{
    try{
        const {username,password}=req.body;
        if(!username||!password){
            return res.status(400).json({error:'用户名和密码为必填项'});
        }
        const result=await pool.query(
            'select *from users where username =$1', [username]
        )
        if(result.rows.length==0) return res.status(401).json({error:'用户名错误'})
        const userinfo =result.rows[0];

        const compareResult=bcrypt.compareSync(password,userinfo.password);  
    // 若密码是明文（如 123456）或用其他方式加密（如 MD5），bcrypt.compareSync 会比对失败。
        if(!compareResult){
        res.status(401).json({ message: '密码错误' });
         }

        // 生成JWT令牌
        const token = jwt.sign(
            { userId: userinfo.id, username: userinfo.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '登录成功',
            token,
            user: {
                id: userinfo.id,
                username: userinfo.username,
                email: userinfo.email
            }
        });
     
        } catch(error){
        console.error(error.message);
        res.status(500).json({error:error.message});
    }
})

module.exports=router