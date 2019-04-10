var mongoose = require('mongoose');
var storageSchema = mongoose.Schema(
	{
		"name": String,
        "tip" : String,
        "fridge" : String,
        "pantry" : String
	}
);
mongoose.model('storage', storageSchema);
