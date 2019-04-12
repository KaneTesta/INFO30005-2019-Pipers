var mongoose = require('mongoose');
var contactsSchema = mongoose.Schema(
	{
		"id" : String,
		"name": String,
        "phone": String,
        "address": String
	}
);
mongoose.model('contacts', contactsSchema, 'contacts');
