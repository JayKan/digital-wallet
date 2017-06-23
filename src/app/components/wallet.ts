import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'wallet',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:`
    <section>
      <div class="row">
        <section class="wallet-section">
          <h2 class="center">Wallet
            <img closeSidebar class="close-icon" src="assets/icons/close_icon.png" alt="close icon">
          </h2>
          <section class="wallet-actions">
            <p class="add" (click)="navigateTo('add')">
              <i class="fa fa-plus" aria-hidden="true"></i>
              &nbsp;Add
            </p>
            <p class="manage" (click)="navigateTo('manage')">
              Manage&nbsp;
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </p>
          </section>
        </section>
      </div>
      
      
      <div class="row" *ngFor="let card of (wallet.creditCards$ | async)">
        <section class="credit-card-row">
          <div style="display: block; position: relative;">
            <div class="card-type" [ngClass]="{
              'visa-type': card.type === 'Visa',
              'master-type': card.type === 'MasterCard',
              'american-express': card.type === 'AmericanExpress',
              'discover': card.type === 'Discover'
            }"></div>
            &nbsp;<h3>{{ card.type }}</h3>
            <div class="margin-left-1  margin-top-2">
              <h5>x-{{ card.getLastFourDigits }}</h5>
            </div>
          </div>
        </section>
      </div>
    </section>
  `
})
export class WalletComponent {
  constructor(
    public wallet: WalletService,
    public store$: Store<AppState>
  ) {}

  ngOnInit() {
    this.wallet.getAll();
  }

  navigateTo(nextState: string): void {
    this.wallet.changeCurrentSelectedState(nextState);
  }
}