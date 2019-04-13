var mongoose = require('mongoose');
var recipeSchema = mongoose.Schema(
	{
		"title": String,
		"ingredients": [String],
		"method": [String],
		"author": String,
		"serves": Number

	}
);
mongoose.model('recipes', recipeSchema);
