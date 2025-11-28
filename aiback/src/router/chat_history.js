const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const authmiddleware = require('../middleware/auth');

// 获取某个对话的全部消息
router.get('/conversations/:id/messages', authmiddleware, async (req, res) => {
  try {
    const chatId = Number(req.params.id);
    const userId = req.user.id;

    if (!chatId) {
      return res.status(400).json({ message: '无效的对话 ID' });
    }

    // 先确认该对话属于当前用户
    const chatResult = await pool.query(
      'SELECT id FROM chat WHERE id = $1 AND user_id = $2',
      [chatId, userId]
    );
    if (chatResult.rowCount === 0) {
      return res.status(404).json({ message: '对话不存在或无权限访问' });
    }

    const msgResult = await pool.query(
      'SELECT id, role, content, created_at FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [chatId]
    );

    res.json({ messages: msgResult.rows });
  } catch (error) {
    console.error('获取对话消息失败:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;