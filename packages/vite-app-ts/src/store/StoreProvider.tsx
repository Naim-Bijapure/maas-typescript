import React, { createContext, useReducer } from 'react';

import { dispatch, IStoreState } from '~~/models/Types';
// import Reducer from './Reducer'

export type TypeStoreState = [IStoreState, dispatch];

const initialState: IStoreState = { contracts: [], ethPrice: 0 };

const state = [initialState, (): void => undefined];

export const StoreContext = createContext([...state] as TypeStoreState);

// global reducer state that can override the properties with payload
const Reducer = (state: IStoreState, action: { payload: any }): any => {
  return { ...state, ...action.payload };
};

const StoreProvider: React.FC<any> = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
