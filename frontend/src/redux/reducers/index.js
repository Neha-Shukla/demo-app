import {
  ACCOUNT_UPDATE,
  WEB3_LOADED,
  ACCOUNT_UPDATE_ON_DISCONNECT,
} from "../constants/action-types";

const initialState = {
  account: null,
  web3: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_UPDATE:
      return Object.assign({}, state, {
        account: action.payload,
      });
    case WEB3_LOADED:
      return Object.assign({}, state, {
        web3: action.payload,
      });
    case ACCOUNT_UPDATE_ON_DISCONNECT:
      return Object.assign({}, state, {
        account: null,
      });
    default: {
      return state;
    }
  }
}

export default rootReducer;
