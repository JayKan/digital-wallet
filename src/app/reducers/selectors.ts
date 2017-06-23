import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/withLatestFrom';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { Observable } from 'rxjs/Observable';
import { CurrentWalletState } from './wallet.reducer';
import { CreditCard } from '../models';

//=========================================================
//  Wallet Reducer Selectors
//---------------------------------------------------------
export function getWalletState(state$: Store<AppState>): Observable<CurrentWalletState> {
  return state$.select((state: AppState) => state.wallet);
}

export function getWalletSelectedState(state$: Store<AppState>): Observable<string> {
  return state$.let(getWalletState)
    .map((wallet: CurrentWalletState) => wallet.get('selectedState'))
    .distinctUntilChanged();
}

export function getWalletCreditCards(state$: Store<AppState>): Observable<any> {
  return state$.let(getWalletState)
    .map((wallet: CurrentWalletState) => wallet.get('creditCards'))
    .distinctUntilChanged((previous: any, next: any) => {
      return previous.size === next.size;
    });
}

export function getWalletCreditCardsCount(state$: Store<AppState>): Observable<number> {
  return state$.let(getWalletState)
    .map((wallet: CurrentWalletState) => wallet.get('creditCards').size)
    .distinctUntilChanged();
}

export function getSelectedCreditCard(state$: Store<AppState>): Observable<CreditCard> {
  return state$.let(getWalletState)
    .map((wallet: CurrentWalletState) => wallet.get('selectedCard'))
    .distinctUntilChanged();
}