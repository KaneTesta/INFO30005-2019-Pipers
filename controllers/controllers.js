var mongoose = require('mongoose');
var Recipe = mongoose.model('recipes');
var Contact = mongoose.model('contacts');
var Storage = mongoose.model('storage');

var findRecipeByIngredient = function (req, res) {
    Recipe.find({}, function(err, recipe){
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
    var ingredientName = new RegExp('^' + req.params.ingredient, 'i');

    Storage.find({ingredient: {$regex: ingredientName}}, function(err, info){
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

    Contact.find(req.query, function(err, info){
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

module.exports = {
    findRecipeByIngredient,
    findStorageInfo,
    showContactInfo,
    createContact
};
