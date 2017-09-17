var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Will contain a name and a game code along with a question array.
var GlucoseSchema = new Schema({
  createdAt            : { type: Date, default: Date() },
  updatedAt            : { type: Date, default: Date() },
  _id                  : { type: Number, unique: true, required: true },
  calculated_value     : { type: Number, unique: false, required: true },
  timestamp            : { type: Number, unique: false, required: true }
});

module.exports = mongoose.model('Glucose', GlucoseSchema);
