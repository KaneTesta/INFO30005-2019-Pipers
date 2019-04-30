var mongoose = require('mongoose');
var contactSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  url: String
});
mongoose.model('contact', contactSchema, 'contacts');
