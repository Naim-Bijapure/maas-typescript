export interface IContractData {
  walletName: string;
  account: string;
  contractAddress: string;
  contractId: number;
  owners: string[];
  signaturesRequired: number;
  contractFundAmt: string;
  createdAt?: string;
  proposals?: any[];
}
