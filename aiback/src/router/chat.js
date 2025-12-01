const express = require('express')
const router = express.Router()
const pool = require('../db/index')
const authmiddleware = require('../middleware/auth')

// 创建新对话
router.post('/conversation', authmiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id; // 与auth中间件保持一致，使用id而非userId

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
    const userId = req.user.id; // 与auth中间件保持一致，使用id而非userId
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

// 删除对话
router.delete('/conversations/:id', authmiddleware, async (req, res) => {
  try {
    const chatId = Number(req.params.id);
    const userId = req.user.id;

    if (!chatId) {
      return res.status(400).json({ message: '无效的对话ID' });
    }

    // 先确认该对话属于当前用户
    const chatResult = await pool.query(
      'SELECT id FROM chat WHERE id = $1 AND user_id = $2',
      [chatId, userId]
    );
    if (chatResult.rowCount === 0) {
      return res.status(404).json({ message: '对话不存在或无权限访问' });
    }

    // 删除对话相关的所有消息
    await pool.query('DELETE FROM chat_messages WHERE session_id = $1', [chatId]);
    
    // 删除对话
    await pool.query('DELETE FROM chat WHERE id = $1', [chatId]);

    res.json({ message: '对话删除成功' });
  } catch (error) {
    console.error('删除对话失败:', error);
    res.status(500).json({ message: error.message });
  }
});

// 更新对话标题
router.put('/conversations/:id', authmiddleware, async (req, res) => {
  try {
    const chatId = Number(req.params.id);
    const userId = req.user.id;
    const { title } = req.body;

    if (!chatId || !title || !title.trim()) {
      return res.status(400).json({ message: '无效的对话ID或标题' });
    }

    // 先确认该对话属于当前用户
    const chatResult = await pool.query(
      'SELECT id FROM chat WHERE id = $1 AND user_id = $2',
      [chatId, userId]
    );
    if (chatResult.rowCount === 0) {
      return res.status(404).json({ message: '对话不存在或无权限访问' });
    }

    // 更新对话标题
    const result = await pool.query(
      'UPDATE chat SET chat_name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [title.trim(), chatId]
    );

    res.json({ conversation: result.rows[0] });
  } catch (error) {
    console.error('更新对话标题失败:', error);
    res.status(500).json({ message: error.message });
  }
});
module.exports=router;