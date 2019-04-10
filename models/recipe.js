var mongoose = require('mongoose');
var recipeSchema = mongoose.Schema(
	{
		"name": String,
		"ingredients": [{ingredient: String, amount: String}],
		"method": [String],
		"author": String

	}
);
mongoose.model('recipes', recipeSchema);
