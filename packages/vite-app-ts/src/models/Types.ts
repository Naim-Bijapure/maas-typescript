import { IEthersContext } from 'eth-hooks/models';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { MultiSigFactory, MultiSigWallet } from '~~/generated/contract-types';

export interface IStoreState {
  ethersAppContext?: IEthersContext;
  scaffoldAppProviders?: IScaffoldAppProviders;
  ethPrice?: number;
  multiSigFactory?: MultiSigFactory;
  contracts?: IContractData[];
  multiSigWallet?: MultiSigWallet;
  isUserLoggedIn?: boolean;
  // multiSigWalletLoaded?: MultiSigWallet;
}
export type dispatch = React.Dispatch<{ payload: any }>;

export interface IContractData {
  walletName: string;
  chainIds: number[];
  account: string;
  contractAddress: string;
  contractId: number;
  owners: string[];
  signaturesRequired: number;
  contractFundAmt: string;
  createdAt?: string;
  proposals?: any[];
}

export interface IProposal {
  proposalId: number;
  chainId: number;
  nonce: number;
  eventName: string;
  contractAddress?: string;
  from?: string;
  to?: string;
  callData: string;
  value?: string;
  newSignatureCount: number;
  hash?: string;
  discardHash?: string;
  signatureRequired?: number;
  signatures: { owner: string; sign: string }[];
  discardSignatures: { owner: string; sign: string }[];
  owners?: string[];
  isExecuted: boolean;
  isDiscarded: boolean;
  createdAt?: string;
  updatedOwnerList: string[];
}

export type ProposalEventType = 'addSigner' | 'removeSigner' | 'transferFunds' | 'customCall';
