var mongoose = require('mongoose');
var storageSchema = mongoose.Schema({
  ingredient: String,
  tip: String,
  fridge: String,
  pantry: String
});
// Needed to the collection for the model, the last param
mongoose.model('storage', storageSchema, 'storage');
