const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, '9eee75143d722178353079853a6daf32b016546b5e0744576c6f202d2126a4d6');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
