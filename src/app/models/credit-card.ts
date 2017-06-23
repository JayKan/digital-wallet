export interface ICreditCard {
  id: number;
  firstName: string;
  lastName: string;
  creditCardID: number;
  expiration: string;
  csc: number;
  type: string;
}

export class CreditCard {
  id: number;
  firstName: string;
  lastName: string;
  creditCardID: number;
  expiration: string;
  csc: number;
  type: string;

  constructor(
    { id, firstName, lastName, creditCardID, expiration, csc, type }: ICreditCard
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.creditCardID = creditCardID;
    this.expiration = expiration;
    this.csc = csc;
    this.type = type;
  }
}