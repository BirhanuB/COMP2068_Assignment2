const mongoose = require('mongoose');

// Create inquiries schema
const InquiriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
});
//Create and instantiate model with schema
const Inquiries = mongoose.model("Inquiries", InquiriesSchema);
module.exports = Inquiries;