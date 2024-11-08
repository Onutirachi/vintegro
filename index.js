const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

mongoose
    .connect("mongodb://localhost:27017/vintegro")
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

// Usar as rotas
app.use(authRoutes);
app.use(collectionRoutes);
app.use(itemRoutes);

// Rota principal que serve o `index.html`
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
