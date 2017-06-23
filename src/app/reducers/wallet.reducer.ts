import { Action } from '@ngrx/store';
import { Map, List } from 'immutable';
import { WalletActions } from '../actions/wallet.actions';

export type CurrentWalletState = Map<any, any>;
const initialState: CurrentWalletState = Map({
  hasError: false,
  error: null,
  selectedState: 'wallet',
  isOpen: true,
  creditCards: List(),
  selectedCard: null
});

export function walletReducer(state: CurrentWalletState = initialState, { type, payload }: Action): CurrentWalletState {
  switch (type) {
    // successfully get a list of credit cards
    case WalletActions.GET_ALL_CARDS_FULFILLED:
      return state.withMutations((state: CurrentWalletState) => {
        const { collections } = payload;
        state.merge({ creditCards: collections, hasError: false });
      });

    // failed get a credit card detail
    case WalletActions.GET_CARD_FAILED:
      return state.withMutations((state: CurrentWalletState) => {
        const { error } = payload;
        state.merge({ hasError: true, error: error });
      });

    // successfully create a credit card
    case WalletActions.CREATE_CARD_FULFILLED:
      return state.withMutations((state: CurrentWalletState) => {
        const { card } = payload;
        state.get('creditCards').set(card.id, card.creditCardID);
        state.merge({ hasError: false });
      });

    // create a credit card
    case WalletActions.CREATE_CARD_FAILED:
      return state.withMutations((state: CurrentWalletState) => {
        const { error } = payload;
        state.merge({ hasError: true, error: error });
      });

    // maintain the current selected state from `wallet`, `add`, `manage`, and `update`
    case WalletActions.UPDATED_SELECTED_STATE:
      return state.withMutations((state: CurrentWalletState) => {
        const { selectedState }  = payload;
        state.merge({ selectedState });
      });

    // get a credit full detail and store it our `store` as the selected credit card
    case WalletActions.UPDATED_SELECTED_CREDIT_CARD:
      return state.withMutations((state: CurrentWalletState) => {
        const { selectedCard } = payload;
        state.merge({ selectedCard });
      });

    // successfully update an existing credit card
    case WalletActions.UPDATE_CARD_FULFILLED:
      return state.withMutations((state: CurrentWalletState) => {
        const { card } = payload;
        let collections = state.get('creditCards').toJS();
        for (let i = 0, len = collections.length; i < len; i++) {
          if (collections[i].id === card.id) {
            collections[i] = card;
          }
        }
        state.merge({ creditCards: collections });
      });

    // fail updating a credit card
    case WalletActions.UPDATE_CARD_FAILED:
      return state.withMutations((state: CurrentWalletState) => {
        const { error } = payload;
        state.merge({ error });
      });

    // successfully remove a credit card
    case WalletActions.DELETE_CARD_FULFILLED:
      return state.withMutations((state: CurrentWalletState) => {
        const { card } = payload;
        let collections = state.get('creditCards').toJS();
        for (let i = 0, len = collections.length; i < len; i++) {
          if (collections[i].id === card.id) {
            collections.splice(i, 1);
            break;
          }
        }
        state.merge({ creditCards: collections });
      });

    // failed remove a credit card
    case WalletActions.DELETE_CARD_FAILED:
      return state.withMutations((state: CurrentWalletState) => {
        const { error } = payload;
        state.merge({ error });
      });

    default:
      return state;
  }
}