const express=require('express')
const router=express.Router()
const pool=require('../db/index')
const authmiddleware=require('../middleware/auth')
const axios=require('axios')
// 创建新对话
router.post('/conversation', authmiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId; // JWT里是 userId

    if (!title || !title.trim()) {
      return res.status(400).json({ message: '标题不能为空' });
    }

    const result = await pool.query(
      'INSERT INTO chat (chat_name, user_id) VALUES ($1, $2) RETURNING *',
      [title.trim(), userId]
    );

    res.status(201).json({ conversation: result.rows[0] });
  } catch (error) {
    console.error('创建对话失败:', error);
    res.status(500).json({ message: error.message });
  }
});

// 获取当前用户的所有对话列表（用于侧边栏历史记录）
router.get('/conversations', authmiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT id, chat_name, created_at, updated_at FROM chat WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    res.json({ conversations: result.rows });
  } catch (error) {
    console.error('获取对话列表失败:', error);
    res.status(500).json({ message: error.message });
  }
});
module.exports=router;