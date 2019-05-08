var mongoose = require('mongoose');
var Contact = mongoose.model('contact');

// Insert one contact
var insertContact = (req, res) => {
  var contact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    description: req.body.description,
    url: req.body.url
  });
  contact.save((err, newContact) => {
    if (!err) {
      res.send(newContact.name + ' added!');
    } else {
      res.status(500).send({ error: err });
    }
  });
};

// Find contacts by name
var findContact = (req, res) => {
  Contact.find(req.query, (err, info) => {
    if (!err) {
      res.send(info);
    } else {
      res.sendStatus(404);
    }
  });
};

// Return contacts
var allContacts = (callback) => {
  Contact.find({}, (err, info) => {
    callback({
      error: err,
      result: info
    })
  });
};

//Delete one contact by id
var deleteContact = (req, res) => {
  Contact.deleteOne({ _id: req.params.id }, (err) => {
    if (!err) {
      res.send('deleted');
    } else {
      res.status(500).send({ error: err });
    }
  });
}

// Insert one contact
var insertContact = (req, res) => {
  var contact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    description: req.body.description,
    url: req.body.url
  });
  contact.save((err, newContact) => {
    if (!err) {
      res.send(newContact.name + ' added!');
    } else {
      res.status(500).send({ error: err });
    }
  });
};


// Exporting callbacks
module.exports = {
  findContact,
  insertContact,
  deleteContact,
  allContacts
};
