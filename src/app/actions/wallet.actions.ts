import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { CreditCard, CreditCardSummary } from '../models';

@Injectable()
export class WalletActions {
  static GET_CARD: string                 = 'GET_CARD';
  static GET_CARD_FULFILLED: string       = 'GET_CARD_FULFILLED';
  static GET_CARD_FAILED: string          = 'GET_CARD_FAILED';

  static GET_ALL_CARDS: string            = 'GET_ALL_CARDS';
  static GET_ALL_CARDS_FULFILLED: string  = 'GET_ALL_CARDS_FULFILLED';
  static GET_ALL_CARDS_FAILED: string     = 'GET_ALL_CARDS_FAILED';

  static CREATE_CARD: string              = 'CREATE_CARD';
  static CREATE_CARD_FULFILLED: string    = 'CREATE_CARD_FULFILLED';
  static CREATE_CARD_FAILED: string       = 'CREATE_CARD_FAILED';

  static UPDATE_CARD: string              = 'UPDATE_CARD';
  static UPDATE_CARD_FULFILLED: string    = 'UPDATE_CARD_FULFILLED';
  static UPDATE_CARD_FAILED: string       = 'UPDATE_CARD_FAILED';

  static DELETE_CARD: string              = 'DELETE_CARD';
  static DELETE_CARD_FULFILLED: string    = 'DELETE_CARD_FULFILLED';
  static DELETE_CARD_FAILED: string       = 'DELETE_CARD_FAILED';

  static UPDATED_SELECTED_STATE: string   = 'UPDATED_SELECTED_STATE';
  static UPDATED_SELECTED_CREDIT_CARD: string   = 'UPDATED_SELECTED_CREDIT_CARD';

  updateSelectedCreditCard(card: CreditCard): Action {
    return {
      type: WalletActions.UPDATED_SELECTED_CREDIT_CARD,
      payload: Object.assign({}, { selectedCard: card })
    };
  }

  getCardFailed(error: any): Action {
    return {
      type: WalletActions.GET_CARD_FAILED,
      payload: { error }
    };
  }

  getAllCards(): Action {
    return {
      type: WalletActions.GET_ALL_CARDS,
      payload: {}
    };
  }

  getAllCardsFulfilled(data: any): Action {
    return {
      type: WalletActions.GET_ALL_CARDS_FULFILLED,
      payload: Object.assign({}, data)
    };
  }

  getAllCardsFailed(error: any): Action {
    return {
      type: WalletActions.GET_ALL_CARDS_FAILED,
      payload: { error }
    };
  }

  updateSelectedState(selectedState: string): Action {
    return {
      type: WalletActions.UPDATED_SELECTED_STATE,
      payload: { selectedState }
    };
  }

  createCard(params: any): Action {
    return {
      type: WalletActions.CREATE_CARD,
      payload: Object.assign({} , params)
    };
  }

  createCardFulfilled(card: CreditCardSummary): Action {
    return {
      type: WalletActions.CREATE_CARD_FULFILLED,
      payload: Object.assign({}, { card: card })
    };
  }

  createCardFailed(error: any): Action {
    return {
      type: WalletActions.CREATE_CARD_FAILED,
      payload: { error }
    };
  }

  updateCardFulfilled(card: CreditCardSummary): Action {
    return {
      type: WalletActions.UPDATE_CARD_FULFILLED,
      payload: Object.assign({}, { card })
    };
  }

  updateCardFailed(error: any): Action {
    return {
      type: WalletActions.UPDATE_CARD_FAILED,
      payload: { error }
    };
  }

  deleteCardFulfilled(card: { id: number }): Action {
    return {
      type: WalletActions.DELETE_CARD_FULFILLED,
      payload: Object.assign({}, { card })
    };
  }

  deleteCardFailed(error: any): Action {
    return {
      type: WalletActions.DELETE_CARD_FAILED,
      payload: { error }
    };
  }
}