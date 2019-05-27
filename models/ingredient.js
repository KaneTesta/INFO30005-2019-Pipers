var mongoose = require('mongoose');

function capitalizeFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}


var ingredientSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'An ingredient needs a name'],
    trim: true,
    lowercase: true,
    minlength: 1,
    get: capitalizeFirstLetter
  },
  tip: String,
  fridge: String,
  pantry: String
});

mongoose.model('ingredient', ingredientSchema, 'ingredients');


