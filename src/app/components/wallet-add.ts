import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { Component, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from  '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState} from 'src/app';
import { WalletService } from '../services/wallet.service';
import { getCreditCardType, stringRegex, cardCardNumberRegex, expirationRegex, numberRegex } from '../utils';

@Component({
  selector: 'wallet-add',
  encapsulation: ViewEncapsulation.None,
  template:`
    <section class="row">
      <header class="add-wallet">
        <h2 class="center">
          <i class="fa fa-angle-left add-icon" aria-hidden="true" (click)="navigateTo('wallet')"></i>
          Add debit or credit card
        </h2>  
      </header>
    </section>
    
    <form novalidate (submit)="submit()" [formGroup]="form" class="add-form">
      
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
        <button type="submit" [disabled]="!form.valid">Add</button>
      </footer>
    </form>
  `
})
export class WalletAddComponent implements OnInit {

  public form: FormGroup;
  public isVisa: boolean = false;
  public isMaster: boolean = false;
  public isAmericanExpress: boolean = false;
  public isDiscover: boolean = false;

  @Output() success: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    public wallet: WalletService,
    public store$: Store<AppState>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['',[
        Validators.required,
        Validators.pattern(stringRegex),
        Validators.maxLength(24),
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern(stringRegex),
        Validators.maxLength(24),
      ]],
      creditCardID: ['', [
        Validators.required,
        Validators.pattern(cardCardNumberRegex)
      ]],
      expiration: ['', [
        Validators.required,
        Validators.pattern(expirationRegex),
      ]],
      csc: ['', [
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

  navigateTo(nextState: string): void {
    this.wallet.changeCurrentSelectedState(nextState);
  }

  submit(): void {
    const type = getCreditCardType(this.form.value.creditCardID);
    this.form.patchValue({ type });

    this.wallet.createCard(this.form.value).subscribe(card => {
      this.success.emit(card);
    });
  }
}
