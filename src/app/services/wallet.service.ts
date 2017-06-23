import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { WalletActions } from '../actions/wallet.actions';
import { CreditCard, ICreditCard, CreditCardSummary } from '../models';
import {
  getWalletSelectedState,
  getWalletCreditCards,
  getWalletCreditCardsCount,
  getSelectedCreditCard,
} from '../reducers/selectors';

const USERID = '123456';
@Injectable()
export class WalletService {
  count$: Observable<number>;
  creditCards$: Observable<CreditCardSummary>;
  selectedCreditCard$: Observable<CreditCard>;
  selectedState$: Observable<string>;
  private cached: Map<any, any> = new Map();

  constructor(
    private http: Http,
    private store$: Store<AppState>,
    private actions: WalletActions
  ) {
    this.count$ = getWalletCreditCardsCount(store$);
    this.creditCards$ = getWalletCreditCards(store$);
    this.selectedCreditCard$ = getSelectedCreditCard(store$);
    this.selectedState$ = getWalletSelectedState(store$);

    this.cached.set(USERID, []);
  }

  getCard(id: number): Observable<CreditCard> {
    return this.http.post('/api/wallet/get', { id })
      .map((response: Response) => response.json())
      .map(record => new CreditCard(record))
      .catch(error => Observable.throw(`Failed <getCard> for credit card ${id}`));
  }

  setSelectedCreditCard(card: CreditCard): void {
    this.store$.dispatch(
      this.actions.updateSelectedCreditCard(card)
    );
  }

  getAll(): void {
    this.store$.dispatch(
      this.actions.getAllCards()
    );
  }

  getAllCards(): Observable<CreditCardSummary> {
    const hasCachedData = this.cached.get(USERID).length !== 0;
    if (hasCachedData) {
      return Observable.of(this.cached.get(USERID));
    }
    return this.http.post('/api/wallet/getAll', {})
      .map((response: Response) => response.json())
      .map(records => records.map((record: any) => new CreditCardSummary(record)))
      .map((records: Array<CreditCardSummary>) => ({ collections: records }))
      .do(data => {
        !hasCachedData && this.cached.set(USERID, data);
        return data;
      })
      .catch(error => Observable.throw('Failed <getAll> credit cards data'));
  }

  createCard(params: ICreditCard): Observable<CreditCardSummary> {
    return this.http.post('/api/wallet/create', { params })
      .map((response: Response) => response.json())
      .map(record => new CreditCardSummary(record))
      .do(card => {
        const cachedList = this.cached.get(USERID).collections;
        cachedList.push(card);
        return { card };
      })
      .catch(error => Observable.throw('Failed <create> a new credit card to the wallet'));
  }

  addCreateCard(creditCard: CreditCardSummary): void {
    this.store$.dispatch(
      this.actions.createCardFulfilled(creditCard)
    );
  }

  updateCard(params: ICreditCard): Observable<CreditCardSummary> {
    return this.http.post('/api/wallet/update', { params })
      .map((response: Response) => response.json())
      .map(record => new CreditCardSummary(record))
      .do((card: CreditCardSummary) => {
        // find our cached records
        const records = this.cached.get(USERID).collections;

        for (let i = 0, len = records.length; i < len; i++) {
          if (records[i].id === card.id) {
            records[i] = card; // Stop it, we've found the replacement
            break;
          }
        }
        return card;
      })
      .catch(error => Observable.throw(`Failed <updateCard> with credit card #: ${params.creditCardID}`));
  }

  updateExistingCard(card: CreditCardSummary): void {
    this.store$.dispatch(
      this.actions.updateCardFulfilled(card)
    );
  }

  updateExistingCardFailed(error: string): void {
    this.store$.dispatch(
      this.actions.updateCardFailed(error)
    );
  }

  deleteCard(id: number): Observable<any> {
    return this.http.post('/api/wallet/delete', { id })
      .map((response: Response) => response.json())
      .do(card => {
        const records = this.cached.get(USERID).collections;
        // remove successful deleted record from our local cache
        for (let i = 0, len = records.length; i < len; i++) {
          if (records[i].id === card.id) {
            records.splice(i, 1);
            break;
          }
        }
        return card;
      })
      .catch(error => Observable.throw(`Failed <deletedCard> with credit ID: ${id}`));
  }

  updateRemovedCardFulfilled(card: { id: number }): void {
    this.store$.dispatch(
      this.actions.deleteCardFulfilled(card)
    );
  }

  updateRemovedCardFailed(error: string): void {
    this.store$.dispatch(
      this.actions.deleteCardFailed(error)
    );
  }

  changeCurrentSelectedState(selectedState: string): void {
    this.store$.dispatch(
      this.actions.updateSelectedState(selectedState)
    );
  }
}