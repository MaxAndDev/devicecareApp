const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    model: { type: String, required: true },
    producer: { type: String, required: true },
    owner: { type: String, required: true },
    status: { type: String, required: true },
    accessories: { type: Array, required: true },
    timestamp: { type: String, required: true },
    count: { type: Number, default: 1 },
    history: {
        loaner: { type: String },
        missing: {
            headphones: { type: Boolean },
            cable: { type: Boolean },
            adapter: { type: Boolean }
        },
        scratches: { type: Boolean }
    }
});

module.exports = mongoose.model('Device', deviceSchema);