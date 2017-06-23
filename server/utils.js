'use strict';

/**
 * @description This helper method is intended to be used when you're trying to add a
 * new credit card to the database
 * @param creditID Actual 16/15 credit card digits
 * @param data Local cached data that stores { id: creditCardID }
 * @return {boolean}
 */
function checkDuplicatedCreditCardBy(creditID, data) {
  // key is the actual id (credit card) and value is the actual credit card #
  for (let [key, value] of data) {
    if (value === creditID) return false;
  }
  return true;
}

/**
 * @param id The ID (not the credit card id) when you add a credit card
 * @param data Local cached data that stores { id: creditCardID }
 * @return {boolean}
 */
function checkCreditCardIDExist(id, data) {
  // key is the actual id at the time when credit card is being added
  for (let [key, value] of data) {
    if (key === id) return true;
  }
  return false;
}

/**
 * @param creditCardID The actual credit card # (16 or 15 digits)
 * * @param creditCards
 * @return {CreditCard[]}
 */
function findCard(creditCardID, creditCards) {
  return creditCards.filter(card => card.creditCardID === creditCardID);
}

module.exports = {
  checkDuplicatedCreditCardBy,
  checkCreditCardIDExist,
  findCard
};