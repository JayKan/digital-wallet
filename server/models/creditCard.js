'use strict';

let _id = 0;
class CreditCard {
  constructor({ id = ++_id, firstName, lastName, creditCardID, expiration, csc, type }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.creditCardID = creditCardID;
    this.expiration = expiration;
    this.csc = csc;
    this.type = type;
  }
}

module.exports = CreditCard;