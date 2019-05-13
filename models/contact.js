const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  description: String,
  url: String,
});
mongoose.model('contact', contactSchema, 'contacts');
