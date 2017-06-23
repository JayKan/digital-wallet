import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { WalletService } from '../services/wallet.service';
import { CreditCardSummary, CreditCard } from '../models';

@Component({
  selector: 'app-container',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngSwitch]="wallet.selectedState$ | async">
      <div *ngSwitchCase="'wallet'">
        <wallet></wallet>
      </div>

      <section *ngSwitchCase="'add'">
        <wallet-add (success)="createSuccess($event)">
        </wallet-add>
      </section>

      <section *ngSwitchCase="'update'">
        <wallet-update (success)="updateSuccess($event)"></wallet-update>
      </section>

      <section *ngSwitchCase="'manage'">
        <wallet-manage 
          (success)="getSuccess($event)"
          (removeSuccess)="deleteSuccess($event)">
        </wallet-manage>
      </section>
    </div>
  `
})
export class AppContainerComponent {

  private count: number;
  constructor(
    public wallet: WalletService,
    public store$: Store<AppState>
  ) {
    wallet.count$.subscribe(num => {
      this.count = num;
    });
  }

  createSuccess(card: CreditCardSummary): void {
    this.wallet.addCreateCard(card);
    this.wallet.changeCurrentSelectedState('wallet');
  }

  getSuccess(card: CreditCard): void {
    // update selected credit card
    this.wallet.setSelectedCreditCard(card);
    // then navigate to `update` view
    this.wallet.changeCurrentSelectedState('update');
  }

  updateSuccess({ card, success, error }: { card: CreditCardSummary, success: boolean, error?: string }): void {
    if (card === null && !success && error) {
      // dispatch update failed action
      this.wallet.updateExistingCardFailed(error);
    } else {
      // update card with our data store
      this.wallet.updateExistingCard(card);
      // then navigate to `manage` view
      this.wallet.changeCurrentSelectedState('manage');
    }
  }

  deleteSuccess({ card, success, error }: { card: { id: number }, success: boolean, error?: string }): void {
    if (card === null && !success && error) {
      // dispatch delete failed action
      this.wallet.updateRemovedCardFailed(error);
    } else {
      // update deleted credit card with our data store
      console.log('Yay successfully delete my card: ', card);
      console.log('Count: ', this.count);
      this.wallet.updateRemovedCardFulfilled(card);
      if (this.count === 0) {
        // no more credit cards now, let's redirect our users to add
        // a wallet view
        this.wallet.changeCurrentSelectedState('add');
      }
    }
  }
}