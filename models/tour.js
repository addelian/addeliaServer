const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const tourSchema = new Schema({
    day: {
        type: String,
        required: true,
        unique: true,
    },
    venue: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;