import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { WalletService } from '../services/wallet.service';
import { Subscription } from 'rxjs/Subscription';
import { CreditCard, ICreditCard } from '../models';

@Component({
  selector: 'wallet-manage',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:`    
    <div class="row">
      <header class="manage-wallet">
        <h2 class="center">
          <i class="fa fa-angle-left manage-icon" aria-hidden="true" (click)="navigateTo('wallet')"></i>
          Manage Wallet
        </h2>  
      </header>
    </div>

    <div class="row" *ngFor="let card of (wallet.creditCards$ | async)">
      <section class="credit-card-row">
        <div style="display: block; position: relative;">
          <h3>
            <i class="fa float-left margin-top-4 margin-right-8" [ngClass]="{
            'fa-cc-amex': card.type === 'AmericanExpress',
            'fa-cc-mastercard': card.type === 'MasterCard',
            'fa-cc-discover': card.type === 'Discover',
            'fa-cc-visa': card.type === 'Visa'
            }" aria-hidden="true"></i>
            {{ card.type }}
            <section class="float-right">
              <a class="link" (click)="update(card.creditCardID)">Update</a> | 
              <a class="link" (click)="remove(card.id)">Delete</a>
            </section>
          </h3>
          <div class="margin-left-33 margin-top-2">
            <h5>x-{{ card.getLastFourDigits }}</h5>
           </div>
        </div>
      </section>
    </div>
  `
})
export class WalletManageComponent implements OnInit, OnDestroy {

  @Output() success: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeSuccess: EventEmitter<any> = new EventEmitter<any>();
  private getSub: Subscription;
  private deleteSub: Subscription;

  constructor(
    public wallet: WalletService,
    public store$: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.wallet.getAll();
  }

  ngOnDestroy(): void {
    if (this.getSub) {
      this.getSub.unsubscribe();
    }
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

  update(id: number): void {
    // retrieve a credit card detail and then navigate to update view
    this.getSub = this.wallet.getCard(id).subscribe(card => {
      this.success.emit(card);
    });
  }

  remove(id: number): void {
    // remove a credit card from a wallet
    this.deleteSub = this.wallet.deleteCard(id).subscribe(
      card => {
        this.removeSuccess.emit({ card, success: true });
      },
      error => {
        this.removeSuccess.emit({ card: null, success: false, error });
      }
    );
  }

  navigateTo(nextState: string): void {
    this.wallet.changeCurrentSelectedState(nextState);
  }
}