import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from 'src/app';
import { WalletService } from '../services/wallet.service';
import { WalletActions } from '../actions/wallet.actions';

@Injectable()
export class WalletEffects {
  constructor(
    private actions$: Actions,
    private walletService: WalletService,
    private store$: Store<AppState>,
    private walletActions: WalletActions
  ) {}

  @Effect()
  getAllCards$: Observable<Action> = this.actions$
    .ofType(WalletActions.GET_ALL_CARDS)
    .switchMap(() => {
      return this.walletService.getAllCards()
        .map(data => this.walletActions.getAllCardsFulfilled(data))
        .catch(error => Observable.of(this.walletActions.getAllCardsFailed(error)));
    });
}