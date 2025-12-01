const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../confij');

// 注册接口
router.post('/reguser', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: '用户名、密码和邮箱为必填项' });
    }

    // 检查用户名或邮箱是否已注册
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: '用户名或邮箱已被注册' });
    }

    // 加密密码并注册
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, passwordHash, email]
    );

    // 过滤密码后返回
    const newUser = result.rows[0];
    delete newUser.password;
    res.status(201).json({ message: '注册成功', user: newUser });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码为必填项' });
    }

    // 查询用户（支持用户名或邮箱登录）
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: '用户名或邮箱不存在' });
    }
    const userinfo = result.rows[0];

    // 异步比对密码
    const compareResult = await bcrypt.compare(password, userinfo.password);
    if (!compareResult) {
      return res.status(401).json({ message: '密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { userId: userinfo.id, username: userinfo.username },
      jwtSecretKey, // 使用与验证中间件相同的密钥
      { expiresIn: '7d' }
    );

    // 返回用户信息（过滤密码）
    delete userinfo.password;
    res.json({
      message: '登录成功',
      token,
      user: userinfo
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;