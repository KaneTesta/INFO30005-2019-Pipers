const mongoose = require('mongoose');

const contactsSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
});
mongoose.model('contacts', contactsSchema, 'contacts');
