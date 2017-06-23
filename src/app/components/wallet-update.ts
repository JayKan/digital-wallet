import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from  '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { WalletService } from '../services/wallet.service';
import { getCreditCardType, stringRegex, cardCardNumberRegex, expirationRegex, numberRegex } from '../utils';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'wallet-update',
  encapsulation: ViewEncapsulation.None,
  template:`
    <section class="row">
      <header class="update-wallet">
        <h2 class="center">
          <i class="fa fa-angle-left add-icon" aria-hidden="true" (click)="navigateTo('manage')"></i>
          Update your {{ type }} card
        </h2>
      </header>
    </section>
    
    <form novalidate (submit)="update()" [formGroup]="form" class="update-form">
      <div class="input-row">
        <div class="half padding-right-10">
          <div class="form-group">
            <input type="text" placeholder="First name" class="form-control" [formControlName]="'firstName'">
          </div>
        </div>

        <div class="half">
          <div class="form-group 50">
            <input type="text" placeholder="Last name" class="form-control" [formControlName]="'lastName'">
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="form-group">
          <div class="vertical">
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="form-group">
          <input type="text"
                 placeholder="xxxx xxxx xxxx xxxx"
                 class="form-control"
                 [formControlName]="'creditCardID'">
          <div class="credit-card-type" [ngClass]="{
            'visa-type': isVisa,
            'master-type': isMaster,
            'american-express': isAmericanExpress,
            'discover': isDiscover
          }"></div>
        </div>
      </div>

      <div class="input-row">
        <div class="half padding-right-10">
          <div class="form-group">
            <label for="expirationDate">Expires</label>
            <input type="text" id="expirationDate" class="form-control" placeholder="MM/YY" [formControlName]="'expiration'">
          </div>
        </div>

        <div class="half">
          <div class="form-group">
            <label for="csc">CSC</label>
            <input type="text" id="csc" placeholder="3 digits" class="form-control" [formControlName]="'csc'">
          </div>
        </div>
      </div>

      <footer>
        <button type="submit" [disabled]="!form.valid">Update</button>
      </footer>
    </form>
    
  `
})
export class WalletUpdateComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public firstName: string;
  public lastName: string;
  public creditCardID: number;
  public expiration: string;
  public csc: number;
  public type: string;
  public isVisa: boolean = false;
  public isMaster: boolean = false;
  public isAmericanExpress: boolean = false;
  public isDiscover: boolean = false;

  @Output() success: EventEmitter<any> = new EventEmitter<any>();

  private id: number;
  private sub: Subscription;

  constructor(
    public wallet: WalletService,
    public store$: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    this.sub = wallet.selectedCreditCard$.subscribe(card => {
      this.id = card.id;
      this.firstName = card.firstName;
      this.lastName = card.lastName;
      this.creditCardID = card.creditCardID;
      this.expiration = card.expiration;
      this.csc = card.csc;
      this.type = card.type;
    });

    if (this.type === 'Visa') {
      this.isVisa = true;
    } else if (this.type === 'MasterCard') {
      this.isMaster = true;
    } else if (this.type === 'AmericanExpress') {
      this.isAmericanExpress = true;
    } else if (this.type === 'Discover') {
      this.isDiscover = true;
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.id],
      firstName: [this.firstName, [
        Validators.required,
        Validators.pattern(stringRegex),
        Validators.maxLength(24),
      ]],
      lastName: [this.lastName, [
        Validators.required,
        Validators.pattern(stringRegex),
        Validators.maxLength(24),
      ]],
      creditCardID: [this.creditCardID, [
        Validators.required,
        Validators.pattern(cardCardNumberRegex)
      ]],
      expiration: [this.expiration, [
        Validators.required,
        Validators.pattern(expirationRegex),
      ]],
      csc: [this.csc, [
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern(numberRegex),
      ]],
      type: ['']
    });

    this.form.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!value.creditCardID) return;
        const type = getCreditCardType(value.creditCardID);
        if (type === 'Visa') {
          this.isVisa = true;
          this.isAmericanExpress = false;
          this.isMaster = false;
          this.isDiscover = false;
        } else if (type === 'Discover') {
          this.isDiscover = true;
          this.isVisa = false;
          this.isMaster = false;
          this.isAmericanExpress = false;
        } else if (type === 'MasterCard') {
          this.isMaster = true;
          this.isDiscover = false;
          this.isVisa = false;
          this.isAmericanExpress = false;
        } else if (type === 'AmericanExpress') {
          this.isAmericanExpress = true;
          this.isVisa = false;
          this.isDiscover = false;
          this.isMaster = false;
        } else {
          this.isVisa = false;
          this.isDiscover = false;
          this.isMaster = false;
          this.isAmericanExpress = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  navigateTo(nextState: string): void {
    this.wallet.changeCurrentSelectedState(nextState);
  }

  update(): void {
    const type = getCreditCardType(this.form.value.creditCardID);
    this.form.patchValue({ type });

    this.wallet.updateCard(this.form.value).subscribe(
      card => {
        this.success.emit({ card, success: true });
      },
      error => {
        this.success.emit({ card: null, success: false, error });
      }
    );
  }
}