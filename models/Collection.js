const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, required: true },
    image: { type: String, required: false},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Collection", CollectionSchema);