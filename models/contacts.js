var mongoose = require('mongoose');
var contactsSchema = mongoose.Schema(
	{
		"name": String,
        "phone": String,
        "address": String
	}
);
mongoose.model('contacts', contactsSchema);
