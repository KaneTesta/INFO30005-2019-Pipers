var mongoose = require('mongoose');
var ingredientSchema = mongoose.Schema({
  name: {
      type: String,
      require: [true, 'An ingredient needs a name'],
      trim: true,
      lowercase: true,
      minlength: 1,
      unique: true
  },
  tip: String,
  fridge: String,
  pantry: String
});
mongoose.model('ingredient', ingredientSchema, 'ingredients');
