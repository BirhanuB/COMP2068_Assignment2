const mongoose = require('mongoose');

// Create ItemSchema
const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },    
    price: {
        type: Number,
        required: true,
        trim: true
    }
});

// Create and instantiate model with schema
const Items = mongoose.model("Items", ItemSchema);
module.exports = Items;