'use strict';

const express = require('express');
const wallet = express.Router();
const CreditCard = require('../models/creditCard');
const { DEMO_CARDS } = require('../constants');
const {
  checkDuplicatedCreditCardBy,
  checkCreditCardIDExist,
  findCard
} = require('../utils');

// store our credit cards by id and actual credit card id
let CACHE_IDs = new Map([]);
// our in-memory credit cards
let creditCards = [];
for (let i = 0, len = DEMO_CARDS.length; i < len; i++) {
  const card = new CreditCard(DEMO_CARDS[i]);
  creditCards.push(card);
  CACHE_IDs.set(card.id, card.creditCardID);
}

module.exports = app => {

  // create a new credit card for wallet
  wallet.post('/create', (req, res) => {
    const params = req.body.params;
    const id= params.creditCardID;

    // check if there's any duplicated credit card id
    if (!checkDuplicatedCreditCardBy(id, CACHE_IDs)) {
      return res.status(400).json({ error: 'Cannot <create> a new credit card record and add it to you your wallet' });
    }

    // create our new credit card
    const card = new CreditCard(params);

    // update local in-memory credit cards
    creditCards.push(card);

    // update local CACHE creditCardIDs
    CACHE_IDs.set(card.id, card.creditCardID);
    return res.json(card);
  });

  // retrieve a credit card
  wallet.post('/get', (req, res) => {
    const id = req.body.id;

    // ensure if the current credit card # exists first otherwise throw error
    const card = findCard(id, creditCards);

    return card.length === 1
      ? res.json(card[0])
      : res.status(400).json({ error: `Cannot <get> your credit card given by id: ${id}`})
  });

  // retrieve all credit cards
  wallet.post('/getAll', (req, res) => {
    return res.json(creditCards);
  });

  // update a credit card
  wallet.post('/update', (req, res) => {
    const params = req.body.params;
    const id = params.id;

    // ensure we can find it the existing credit card first
    if (!checkCreditCardIDExist(id, CACHE_IDs) || !id) {
      return res.status(400).json({ message: `Cannot <update> your credit card given by id: ${id}`});
    }

    // create our new updated version credit card (id should remain the same)
    const updated = new CreditCard(params);

    // update our local CACHE_IDs
    // key is our actual id (credit card) and value is (credit card #)
    for (let [key, value] of CACHE_IDs) {
      if (key === updated.id) {
        CACHE_IDs.set(updated.id, updated);
        break;
      }
    }

    // then we can updated our local in-memory credit cards
    for (let i = 0, len = creditCards.length; i < len; i++) {
      if (creditCards[i].id === updated.id) {
        creditCards[i] = updated;
        break;
      }
    }

    return res.json(updated);
  });

  // delete a credit card
  wallet.post('/delete', (req, res) => {
    const id = req.body.id;

    // ensure if the creditCard exists first otherwise throw error
    if (!checkCreditCardIDExist(id, CACHE_IDs)) {
      return res.status(400).json({ message: `Cannot <delete> your credit card given by id: ${id}`});
    }

    // delete our local CACHE_IDs
    for (let [key, value] of CACHE_IDs) {
      if (key === id) {
        CACHE_IDs.delete(key);
        break;
      }
    }

    // then delete our local in-memory credit cards
    for (let i = 0, len = creditCards.length; i< len; i++) {
      if (creditCards[i].id === id) {
        creditCards.splice(i, 1);
        break;
      }
    }
    return res.json({ id });
  });

  app.use('/api/wallet/', wallet);
};
