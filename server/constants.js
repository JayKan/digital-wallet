'use strict';

const CREDIT_CARDS_TYPE = ['MasterCard', 'Visa', 'AmericanExpress', 'Discover'];
const DEMO_CARDS = [
  {
    firstName: 'Jay',
    lastName: 'Kan',
    creditCardID: 5575543313054648,
    expiration: '11/20',
    csc: 111,
    type: CREDIT_CARDS_TYPE[0]
  },
  {
    firstName: 'Jay',
    lastName: 'Kan',
    creditCardID: 4728597124671205,
    expiration: '08/19',
    csc: 222,
    type: CREDIT_CARDS_TYPE[1]
  },
  {
    firstName: 'Jay',
    lastName: 'Kan',
    creditCardID: 378282246310005,
    expiration: '08/21',
    csc: 333,
    type: CREDIT_CARDS_TYPE[2]
  },
  {
    firstName: 'Jay',
    lastName: 'Kan',
    creditCardID: 6011869831245891,
    expiration: '08/21',
    csc: 444,
    type: CREDIT_CARDS_TYPE[3]
  },
];

module.exports = {
  CREDIT_CARDS_TYPE,
  DEMO_CARDS
};
