import { AbstractControl } from '@angular/forms';
const types = require('creditcards-types').types;
const visa = types.visa;
const discover = types.discover;
const master = types.masterCard;
const amex = types.americanExpress;

export function isCreditCard(control: AbstractControl): boolean {
  const value = control.value;

  const isVisa = visa.test(value);
  const isDiscover = discover.test(value);
  const isMaster = master.test(value);
  const isAmex = amex.test(value);

  return isVisa || isDiscover || isMaster || isAmex;

}
