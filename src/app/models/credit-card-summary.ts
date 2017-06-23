export interface ICreditCardSummary {
  id: number;
  creditCardID: number;
  type: string;
}

export class CreditCardSummary {
  id: number;
  creditCardID: number;
  type: string;

  constructor({ id, creditCardID, type }: ICreditCardSummary) {
    this.id = id;
    this.creditCardID = creditCardID;
    this.type = type;
  }

  get getLastFourDigits(): string {
    const c = this.creditCardID.toString().split('').map(Number);
    const end: number = c.length - 1;
    const start: number = end - 3;
    return c.slice(start, end + 1).join('');
  }
}