// Valid testing credit card from http://www.getcreditcardnumbers.com/
export const cardCardNumberRegex: RegExp = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
export const expirationRegex: RegExp  = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
export const stringRegex: RegExp = /^[a-zA-Z-\' ]+$/;
export const numberRegex: RegExp = /^\d+$/;

export function getCreditCardType(creditCardID: string): string {
  const types = require('creditcards-types').types;
  const visa = types.visa;
  const discover = types.discover;
  const master = types.masterCard;
  const americanExpress = types.americanExpress;

  const isVisa: boolean = visa.test(creditCardID);
  if (isVisa) return 'Visa';

  const isDiscover: boolean = discover.test(creditCardID);
  if (isDiscover) return 'Discover';

  const isMaster: boolean = master.test(creditCardID);
  if (isMaster) return 'MasterCard';

  const isAmericanExpress = americanExpress.test(creditCardID);
  if (isAmericanExpress) return 'AmericanExpress';

  return null;
}