const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

var scoreSchema = new Schema({
    userId: String,
    score: {
        type: Number,
        min: 0
    }
});

scoreSchema.path("userId").validate((value) => {
    return value.length <= 5;
}, "The maximum length is 5.");

var scoreModel = mongoose.model('Score', scoreSchema);
module.exports = scoreModel;