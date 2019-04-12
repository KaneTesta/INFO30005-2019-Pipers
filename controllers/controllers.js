var mongoose = require('mongoose');
var Recipe = mongoose.model('recipes');
var Contact = mongoose.model('contacts');
var Storage = mongoose.model('storage');

var findRecipeByIngredient = function (req, res) {
    var ingredientName = req.params.ingredient;
    Recipe.find({ingredient: ingredientName}, function(err, recipe){
        if(!err){
            res.json(recipe)
        }
        else{
            res.sendStatus(404);
        }
    })
};

//This one works
var findStorageInfo = function (req, res) {
    var ingredientName = req.params.ingredient;
    Storage.find({ingredient: ingredientName}, function(err, info){
        if(!err){
            res.json(info);
        }
        else{
            res.sendStatus(404);
        }
    })
};
// Working. Try with id = 01 or 02
var showContactInfo = function (req, res) {
    var contactID = req.params.id;
    Contact.find({id: contactID}, function(err, info){
        if(!err){
            res.send(info);
        }
        else{
            res.sendStatus(404);
        }
    })
};

var createContact = function (req, res) {
    var contact = new Contact({
        "id" : req.body.id,
        "name": req.body.name,
        "phone": req.body.phone,
        "address": req.body.address
    });
    contact.save(function (err, newContact) {
        if(!err){
            res.send(newContact);
        }
        else{
            res.send(err);
            res.sendStatus(400);
        }
    });

};




module.exports.findRecipeByIngredient = findRecipeByIngredient;
module.exports.findStorageInfo = findStorageInfo;
module.exports.showContactInfo = showContactInfo;
module.exports.createContact = createContact;
