import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SidebarModule } from 'ng-sidebar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared';

import { AppComponent } from './app';
import { AppContainerComponent } from './containers/app-container';
import { WalletComponent } from  './components/wallet';
import { WalletAddComponent } from  './components/wallet-add';
import { WalletUpdateComponent } from './components/wallet-update';
import { WalletManageComponent } from  './components/wallet-manage';

import { WalletActions } from './actions/wallet.actions';
import { WalletService } from './services/wallet.service';
import { WalletEffects } from './effects/wallet.effects';
import { walletReducer } from './reducers/wallet.reducer';

import { ROUTES } from './app.routes';

export { AppState } from './interfaces';

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    AppContainerComponent,
    WalletComponent,
    WalletAddComponent,
    WalletUpdateComponent,
    WalletManageComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    EffectsModule.run(WalletEffects),
    StoreModule.provideStore({
      wallet: walletReducer
    }),
    SharedModule,
    SidebarModule.forRoot(),
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    WalletActions,
    WalletService,
  ]
})
export class AppModule {}