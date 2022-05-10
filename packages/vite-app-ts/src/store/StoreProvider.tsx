import { IEthersContext } from 'eth-hooks/models';
import React, { createContext, useReducer } from 'react';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { MultiSigFactory } from '~~/generated/contract-types';
// import Reducer from './Reducer'

interface IStoreState {
  ethersAppContext?: IEthersContext;
  scaffoldAppProviders?: IScaffoldAppProviders;
  ethPrice?: number;
  multiSigFactory?: MultiSigFactory;
}
type dispatch = React.Dispatch<{ payload: any }>;

export type TypeStoreState = [IStoreState, dispatch];

const initialState: IStoreState = {};

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
