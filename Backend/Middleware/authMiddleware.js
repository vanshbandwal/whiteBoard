const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.cookies.token;

    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
