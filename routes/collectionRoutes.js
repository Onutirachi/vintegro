const express = require("express");
const Collection = require("../models/Collection");
const Item = require("../models/Item");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.post("/getcollection", validateToken, async (req, res) => {
    try {
        const collection = await Collection.find({ userId: req.body.userId });
        res.status(200).send(collection);
    } catch (error) {
        res.status(500).send("Erro ao carregar coleções");
    }
});

router.post("/createcollection", validateToken, async (req, res) => {
    var { name, description, image, userId } = req.body;
    if (!image) {
        image = "C:/fakepath/defaultcollection.svg";
    }
    try {
        const newCollection = new Collection({ name, description, image, userId });
        await newCollection.save();
        res.status(201).send("Coleção criada com sucesso");
    } catch (error) {
        res.status(500).send(error.errmsg);
    }
});

router.put("/updatecollection", validateToken, async (req, res) => {
    var { _id, name, description, image } = req.body;
    if (!image) {
        image = "C:/fakepath/defaultcollection.svg";
    }
    try {
        const updatedCollection = await Collection.findByIdAndUpdate(_id, { name, description, image }, { new: true });
        res.status(200).send(updatedCollection);
    } catch (error) {
        res.status(500).send(error.errmsg);
    }
});

router.get("/getcollectionname", validateToken, async (req, res) => {
    const { id } = req.query;
    console.log(req.query);
    try {
        const collection = await Collection.findById(id);
        res.status(200).send(collection);
    } catch (error) {
        res.status(500).send("Erro ao carregar nome da coleção");
    }
});

router.delete("/deletecollection", validateToken, async (req, res) => {
    const { _id } = req.body;
    try {
        await Item.deleteMany({ collectionId: _id });  // Exclui todos os itens da coleção antes de excluir a coleção
        await Collection.findByIdAndDelete(_id);
        
        res.status(200).send("Coleção excluída com sucesso");
    } catch (error) {
        res.status(500).send(error.errmsg);
    }
});
// Adicione outras rotas de coleção aqui

module.exports = router;
