const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false},
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
});

module.exports = mongoose.model("Item", ItemSchema);