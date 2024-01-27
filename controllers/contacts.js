const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection('contacts').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection('contacts')
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

//POST
const createContact = async (req, res, next) => {
//send a json body
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb.getDb().db().collection('contacts').insertOne(contact);
  if (response.acknowledged) {
    res.status(204).json(response);
  }else{
    res.status(500).json(response.error || 'Error while creating contact.');
  }
};

//PUT
const updateContact = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('contacts')
    .replaceOne({ _id: userId }, contact);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
};

//DELETE
const deleteContact = async (req, res, next) => {
  const userID = new ObjectId(req.params.id);
  //.remove did not work, instead used .deleteOne, but there is also .deleteMany to delete more than 1
  const response = await mongodb.getDb().db().collection('contacts').deleteOne({ _id: userID }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  }else{
    res.status(500).json(response.error || 'Error during deleting contact.');
  }
};

module.exports = { 
  getAll, 
  getSingle,
  createContact,
  updateContact,
  deleteContact
};