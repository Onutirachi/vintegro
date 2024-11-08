const express = require("express");
const Item = require("../models/Item");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.post("/getitems", validateToken, async (req, res) => {
    try {
        const item = await Item.find({ collectionId: req.body.urlCollectionId });
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send("Erro ao carregar Items");
    }
});

router.post("/createitem", validateToken, async (req, res) => {
    var { name, description, image } = req.body;
    var collectionId = req.body.urlCollectionId;
    if (!image) {
        image = "C:/fakepath/defaultitem.svg";
    }
    try {
        const newItem = new Item({ name, description, image, collectionId });
        await newItem.save();
        res.status(201).send("Item criado com sucesso");
    } catch (error) {
        res.status(500).send(error.errmsg);
        console.log(error);
    }
});

router.put("/updateitem", validateToken, async (req, res) => {
    var { _id, name, description, image } = req.body;
    var collectionId = req.body.urlCollectionId;
    if (!image) {
        image = "C:/fakepath/defaultitem.svg";
    }
    try {
        const updatedItem = await Item.findByIdAndUpdate(_id, { name, description, image, collectionId }, { new: true });
        res.status(200).send("Item atualizado com sucesso");
    } catch (error) {
        res.status(500).send("Erro ao atualizar Item");
    }
});

router.delete("/deleteitem", validateToken, async (req, res) => {
    var { _id } = req.body;
    try {
        await Item.findByIdAndDelete(_id);
        res.status(200).send("Item excluído com sucesso");
    } catch (error) {
        res.status(500).send("Erro ao excluir Item");
    }
});

// Adicione outras rotas de itens aqui

module.exports = router;
