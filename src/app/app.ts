import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template:`
   <div (window:resize)="onResize(sidebar)">
    <ng-sidebar-container>
      <ng-sidebar
        #sidebar
        [(opened)]="opened"
        [mode]="'push'"
        [autoCollapseWidth]="500"
        [animate]="true"
        [autoFocus]="true"
        [sidebarClass]="sideBarClass"
        [ariaLabel]="'My sidebar'">
        <router-outlet></router-outlet>
      </ng-sidebar>
      
      <section class="demo-contents">
        <header>
          <button *ngIf="!opened" (click)="toggleOpened()" class="header-toggle">Toggle sidebar</button>
          <p class="logo"></p>
          <div class="checkout-price">$26.99 USD</div>
        </header>
      </section>
        
      <section class="demo-contents no-border">
        <p>Hi, Michael! <a class="link bold-400">Not you?</a></p>
      </section>

      <section class="demo-contents no-border padding-top-15 no-padding-bottom">
        <div class="header-section">
          <h2>Pay with</h2>
          <a class="link">Change&nbsp;></a>
        </div>
      </section>
      
      <section class="demo-contents no-border no-padding-top">
        <h3 class="overflow">
          <i class="fa fa-home fa-fw float-left margin-top-2 text-align-left" aria-hidden="true"></i>
          &nbsp;&nbsp;CITIBANK FSB x-1234
          
          <div class="checkout-price">$26.99</div>
        </h3>
        <div class="float-right currency">USD</div>
      </section> 
    </ng-sidebar-container>
   </div>
  `
})
export class AppComponent {

  public opened: boolean = true;
  public closeOnClickOutside: boolean = false;
  public sideBarClass: string = 'demo-sidebar';

  @ViewChild('sidebar') sideBar: any;
  winWidth: number = window.innerWidth;

  constructor(
    public wallet: WalletService,
    public store$: Store<AppState>
  ) {}

  ngOnInit(): void {
    if (this.winWidth > 1000 && this.winWidth < 1600) {
      setTimeout(() => {
        this.sideBar.close();
        this.sideBarClass = 'demo-sidebar extra-bigger';
        this.sideBar.open();
      });
    } else if (this.winWidth < 520) {
      this.sideBar.close();
      this.closeOnClickOutside = true;
    }
  }

  onResize(sidebar: any): void {
    this.winWidth = window.innerWidth;
    if (this.winWidth > 1200 && this.winWidth < 1600) {
      setTimeout(() => {
        this.sideBar.close();
        this.sideBarClass = 'demo-sidebar extra-bigger';
        this.sideBar.open();
      });

    } else if (this.winWidth > 1000 && this.winWidth < 1200) {
      setTimeout(() => {
        this.sideBar.close();
        this.sideBarClass = 'demo-sidebar bigger';
        this.sideBar.open();
      });
    } else if (this.winWidth < 1000 && this.winWidth > 700) {
      setTimeout(() => {
        this.sideBar.close();
        this.sideBarClass = 'demo-sidebar smaller';
        this.sideBar.open();
      });
    } else if (this.winWidth < 700 && this.winWidth > 450) {
      setTimeout(() => {
        this.sideBar.close();
        this.sideBarClass = 'demo-sidebar default';
        this.sideBar.open();
      });
    }
  }

  toggleOpened(): void {
    this.opened = true;
  }
}