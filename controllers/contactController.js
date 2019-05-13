const mongoose = require('mongoose');

const Contact = mongoose.model('contact');

// Find contacts by name
const findContact = (req, res) => {
  Contact.find(req.query, (err, info) => {
    if (!err) {
      res.send(info);
    } else {
      res.sendStatus(404);
    }
  });
};

// Return contacts
const allContacts = (callback) => {
  Contact.find({}, (err, info) => {
    callback({
      error: err,
      result: info,
    });
  });
};

// Delete one contact by id
const deleteContact = (req, res) => {
  Contact.deleteOne({ _id: req.params.id }, (err) => {
    if (!err) {
      res.send('deleted');
    } else {
      res.status(500).send({ error: err });
    }
  });
};

// Insert one contact
const insertContact = (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    description: req.body.description,
    url: req.body.url,
  });
  contact.save((err, newContact) => {
    if (!err) {
      res.send(`${newContact.name} added!`);
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
  allContacts,
};
