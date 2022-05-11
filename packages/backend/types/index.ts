export interface IContractData {
    walletName: string;
    account: string;
    contractAddress: string;
    contractId: number;
    owners: string[];
    signaturesRequired: number;
    contractFundAmt: string;
    proposals: IProposal[];
    createdAt?: string;
}

export interface IProposal {
    proposalId: number;
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
}
