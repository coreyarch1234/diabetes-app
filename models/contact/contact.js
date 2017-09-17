var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Will contain a name and a game code along with a question array.
var ContactSchema = new Schema({
  createdAt            : { type: Date, default: Date() },
  updatedAt            : { type: Date, default: Date() },
  name                 : { type: String, unique: false, required: true },
  number               : { type: String, unique: false, required: true }
});

module.exports = mongoose.model('Contact', ContactSchema);
