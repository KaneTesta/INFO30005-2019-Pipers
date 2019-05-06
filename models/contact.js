var mongoose = require('mongoose');
var contactSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  description: String,
  url: String
});
mongoose.model('contact', contactSchema, 'contacts');
