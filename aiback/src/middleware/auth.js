const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../confij');

const authmiddleware = (req, res, next) => {
    try {
        // 检查Authorization头是否存在
        if (!req.headers.authorization) {
            return res.status(401).json({ message: '未提供token' });
        }
        
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: '未提供token' });
        }

        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token验证失败:', error.message);
        return res.status(401).json({ message: 'token无效' });
    }
};

module.exports = authmiddleware;