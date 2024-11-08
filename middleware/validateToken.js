const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send("Não Autorizado");
    }

    try {
        jwt.verify(token, "UNIVESP");
        next();
    } catch (error) {
        res.status(500).send("Token não válido");
    }
}

module.exports = validateToken;
