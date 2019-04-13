var mongoose = require('mongoose');
var recipeSchema = mongoose.Schema(
	{
		"name": String,
		"ingredients": [{ingredient: String, amount: String}],
		"method": [String],
		"author": String,
		"serves": Number

	}
);
mongoose.model('recipes', recipeSchema);
