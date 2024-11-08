const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send("Usuário registrado com sucesso");
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send("Usuário não encontrado");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Senha incorreta");
        }
        const token = jwt.sign({ id: user._id }, "UNIVESP", {
            expiresIn: "1h",
        });
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).send("Erro ao fazer login");
    }
});

module.exports = router;
