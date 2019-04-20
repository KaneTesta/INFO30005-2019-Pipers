var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ingredientSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'An ingredient needs a name'],
    trim: true,
    lowercase: true,
    minlength: 1,
    unique: true,
    get: capitalizeFirstLetter
  },
  extra: {
    type: Map,
    of: String
  }
});

function capitalizeFirstLetter(v) {
  // Convert 'bob' -> 'Bob'
  return v.charAt(0).toUpperCase() + v.substr(1);
}

ingredientSchema.plugin(uniqueValidator);
mongoose.model('ingredient', ingredientSchema, 'ingredients');
